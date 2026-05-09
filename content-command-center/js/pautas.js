// pautas.js — Tab Pautas: Pautas Centrais
import { DataStore } from './data.js';
import { Prompts } from './prompts.js';
import { Icons } from './icons.js';
import { showToast } from './toast.js';
import { copyToClipboard, escapeHtml, formatDate } from './utils.js';

export async function renderPautas() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <section class="pautas-section">
      <div class="pautas-header">
        <h2 class="section-title">Pautas</h2>
        <p class="section-subtitle">Pautas Centrais</p>
      </div>
      <div id="pautas-content" class="pautas-content"></div>
    </section>
  `;

  await renderPautasCentrais();
}

// ─── Prompt output block (same pattern as Create) ───
function renderPromptBlock(prompt) {
  return `
    <div class="pautas-prompt-block" id="pautas-prompt-block">
      <div class="prompt-header">
        <span>${Icons.terminal} Prompt gerado</span>
        <button class="btn-primary btn-sm" id="pautas-copy-prompt">${Icons.copy} Copiar</button>
      </div>
      <pre class="prompt-output" id="pautas-prompt-output">${escapeHtml(prompt)}</pre>
    </div>
  `;
}

function bindPromptCopy() {
  document.getElementById('pautas-copy-prompt')?.addEventListener('click', async () => {
    const text = document.getElementById('pautas-prompt-output')?.textContent || '';
    await copyToClipboard(text);
    showToast('Prompt copiado!', 'success');
  });
}

// ─── PAUTAS CENTRAIS ───
async function renderPautasCentrais() {
  const container = document.getElementById('pautas-content');
  const pautas = await DataStore.getPautas();
  const allPosts = DataStore.getPosts();

  const pautasWithSubs = await Promise.all(pautas.map(async (p) => {
    const subs = await DataStore.getSubpautas(p.id);
    const postsCount = allPosts.filter(post => post.pautaCentralId === p.id).length;
    const lastPost = allPosts.find(post => post.pautaCentralId === p.id);
    const daysSince = lastPost?.createdAt
      ? Math.floor((Date.now() - new Date(lastPost.createdAt).getTime()) / 86400000)
      : null;
    return { ...p, subpautas: subs, postsCount, daysSince };
  }));

  container.innerHTML = `
    <div class="pautas-actions">
      <button class="btn-primary btn-sm" id="pautas-gerar-btn">
        ${Icons.plus} Gerar novas pautas
      </button>
    </div>

    <div id="pautas-prompt-area"></div>

    <div class="pautas-list">
      ${pautasWithSubs.length > 0 ? pautasWithSubs.map(p => `
        <details class="pauta-accordion" data-pauta-id="${p.id}">
          <summary class="pauta-summary">
            <div class="pauta-info">
              <h4>${escapeHtml(p.nome)}</h4>
              <span class="badge badge-fonte-${p.fonte_tese}">${fontTeseLabel(p.fonte_tese)}</span>
            </div>
            <div class="pauta-meta">
              <span class="meta-item">${Icons.barChart} ${p.postsCount} posts</span>
              ${p.daysSince !== null ? `<span class="meta-item">há ${p.daysSince}d</span>` : '<span class="meta-item meta-item-muted">sem posts</span>'}
            </div>
          </summary>
          <div class="pauta-subs">
            ${p.descricao ? `<p class="pauta-descricao">${escapeHtml(p.descricao)}</p>` : ''}
            ${p.subpautas.length > 0 ? p.subpautas.map(s => `
              <div class="sub-card ${s.status === 'usada' ? 'sub-card-usada' : ''}" data-sub-id="${s.id}" data-pauta-id="${p.id}">
                <div class="sub-card-header">
                  <span class="sub-card-titulo" data-action="post-from-sub">${escapeHtml(s.titulo)}</span>
                  <div class="sub-card-badges">
                    <span class="badge badge-sub-${s.status}">${s.status}</span>
                    ${s.is_lead_magnet ? `<button class="badge badge-lm" data-action="lm-checklist" data-sub-id="${s.id}">🎯 Lead Magnet</button>` : ''}
                  </div>
                </div>
                ${s.is_lead_magnet && s.lead_magnet_checklist?.length > 0 ? `
                  <div class="lm-checklist" id="lm-checklist-${s.id}" style="display:none">
                    <ul class="lm-checklist-list">
                      ${s.lead_magnet_checklist.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
                ${s.angulo ? `<p class="sub-card-angulo">${escapeHtml(s.angulo)}</p>` : ''}
                ${s.hook_embrionario ? `<p class="sub-card-hook">"${escapeHtml(s.hook_embrionario)}"</p>` : ''}
              </div>
            `).join('') : '<p class="empty-subs">Nenhuma subpauta ainda. Gere com o squad.</p>'}
          </div>
        </details>
      `).join('') : '<div class="empty-state"><p>Nenhuma pauta central ainda. Gere com o squad seed-pautas-centrais.</p></div>'}
    </div>
  `;

  // Gerar novas pautas → mostrar prompt block
  document.getElementById('pautas-gerar-btn')?.addEventListener('click', () => {
    const prompt = Prompts.seedPautas();
    document.getElementById('pautas-prompt-area').innerHTML = renderPromptBlock(prompt);
    bindPromptCopy();
    document.getElementById('pautas-prompt-block')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // Toggle checklist do Lead Magnet
  container.querySelectorAll('[data-action="lm-checklist"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const subId = btn.dataset.subId;
      const checklist = document.getElementById(`lm-checklist-${subId}`);
      if (checklist) {
        const visible = checklist.style.display !== 'none';
        checklist.style.display = visible ? 'none' : 'block';
        btn.classList.toggle('badge-lm-open', !visible);
      }
    });
  });

  // Clicar em subpauta → mostrar prompt Post Direto
  container.querySelectorAll('[data-action="post-from-sub"]').forEach(el => {
    el.addEventListener('click', () => {
      const subCard = el.closest('.sub-card');
      const sub = {
        titulo: el.textContent,
        angulo: subCard.querySelector('.sub-card-angulo')?.textContent || '',
        hook_embrionario: subCard.querySelector('.sub-card-hook')?.textContent?.replace(/^"|"$/g, '') || '',
        pauta_central_id: subCard.dataset.pautaId,
      };
      const prompt = Prompts.postDiretoFromSubpauta(sub);
      document.getElementById('pautas-prompt-area').innerHTML = renderPromptBlock(prompt);
      bindPromptCopy();
      document.getElementById('pautas-prompt-block')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
}

function fontTeseLabel(key) {
  const map = {
    skills_producao: 'Skills em Produção',
    benchmark_real: 'Benchmark Real',
    process_diagnostic: 'Process Diagnostic',
    falha_documentada: 'Falha Documentada',
  };
  return map[key] || key || '—';
}
