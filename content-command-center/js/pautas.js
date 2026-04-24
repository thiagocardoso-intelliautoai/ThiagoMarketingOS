// pautas.js — Tab Pautas: Distribuição + Pautas Centrais (Etapa 3)
import { DataStore } from './data.js';
import { Prompts } from './prompts.js';
import { Icons } from './icons.js';
import { showToast } from './toast.js';
import { copyToClipboard, escapeHtml, formatDate } from './utils.js';

let activeSubtab = 'distribuicao';

export async function renderPautas() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <section class="pautas-section">
      <div class="pautas-header">
        <h2 class="section-title">Pautas</h2>
        <p class="section-subtitle">Distribuição e Pautas Centrais</p>
      </div>
      <div class="pautas-tabs">
        <button class="pautas-tab ${activeSubtab === 'distribuicao' ? 'pautas-tab-active' : ''}" data-subtab="distribuicao">
          ${Icons.send} Distribuição
        </button>
        <button class="pautas-tab ${activeSubtab === 'pautas' ? 'pautas-tab-active' : ''}" data-subtab="pautas">
          ${Icons.layers} Pautas Centrais
        </button>
      </div>
      <div id="pautas-content" class="pautas-content"></div>
    </section>
  `;

  main.querySelectorAll('.pautas-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      activeSubtab = tab.dataset.subtab;
      main.querySelectorAll('.pautas-tab').forEach(t => t.classList.remove('pautas-tab-active'));
      tab.classList.add('pautas-tab-active');
      if (activeSubtab === 'distribuicao') renderDistribuicao();
      else renderPautasCentrais();
    });
  });

  if (activeSubtab === 'distribuicao') await renderDistribuicao();
  else await renderPautasCentrais();
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

// ─── DISTRIBUIÇÃO ───
async function renderDistribuicao() {
  const container = document.getElementById('pautas-content');
  const pessoas = await DataStore.getDistribuicao();
  const exclusoes = await DataStore.getExclusoes();

  container.innerHTML = `
    <div class="dist-actions">
      <button class="btn-primary btn-sm" id="dist-gerar-btn">
        ${Icons.plus} Gerar mais sugestões
      </button>
    </div>

    <div id="dist-prompt-area"></div>

    <div class="dist-list">
      ${pessoas.length > 0 ? pessoas.map(p => `
        <div class="dist-card" data-id="${p.id}">
          <div class="dist-card-header">
            <h4 class="dist-card-nome" data-action="briefing" data-id="${p.id}">${escapeHtml(p.nome)}</h4>
            ${p.expande_bolha ? '<span class="badge badge-bolha">🌐 Expande bolha</span>' : ''}
            <span class="badge badge-status-dist badge-${p.status}">${p.status}</span>
          </div>
          <p class="dist-card-funcao">${escapeHtml(p.funcao || '')}</p>
          ${p.titulo_com_lente ? `<p class="dist-card-titulo">"${escapeHtml(p.titulo_com_lente)}"</p>` : '<p class="dist-card-titulo dist-card-titulo-empty">Sem título pela lente ainda</p>'}
          ${p.expectativa ? `<p class="dist-card-expectativa">${escapeHtml(p.expectativa)}</p>` : ''}
        </div>
      `).join('') : '<div class="empty-state"><p>Nenhuma pessoa na lista ainda. Gere sugestões com o squad.</p></div>'}
    </div>
  `;

  // Gerar sugestões → mostrar prompt block
  document.getElementById('dist-gerar-btn')?.addEventListener('click', () => {
    const allNomes = pessoas.map(p => p.nome);
    const allExcl = exclusoes.map(e => e.nome_ou_arquetipo);
    const blacklist = [...allNomes, ...allExcl];
    const prompt = Prompts.seedDistribuicao(blacklist);
    document.getElementById('dist-prompt-area').innerHTML = renderPromptBlock(prompt);
    bindPromptCopy();
    document.getElementById('pautas-prompt-block')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // Clicar no nome → mostrar prompt briefing matéria-colab
  container.querySelectorAll('[data-action="briefing"]').forEach(el => {
    el.addEventListener('click', () => {
      const pessoa = pessoas.find(p => p.id === el.dataset.id);
      if (!pessoa) return;
      const prompt = Prompts.briefingMateria(pessoa.nome, pessoa.titulo_com_lente);
      document.getElementById('dist-prompt-area').innerHTML = renderPromptBlock(prompt);
      bindPromptCopy();
      document.getElementById('pautas-prompt-block')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
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
                  <span class="badge badge-sub-${s.status}">${s.status}</span>
                </div>
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
