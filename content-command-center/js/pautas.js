// pautas.js — Tab Pautas: Distribuição (1:N Ângulos) + Pautas Centrais
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

// ─── Helpers ───
const ARQUETIPO_EMOJI = {
  contra_o_consenso: '🔥',
  tradutor_de_bastidor: '🔬',
  pioneiro_silencioso: '🌱',
  benchmark_vivo: '📊',
  misto: '🔀',
  outro: '💡',
};

const ARQUETIPO_LABEL = {
  contra_o_consenso: 'Contra o Consenso',
  tradutor_de_bastidor: 'Tradutor de Bastidor',
  pioneiro_silencioso: 'Pioneiro Silencioso',
  benchmark_vivo: 'Benchmark Vivo',
  misto: 'Misto',
  outro: 'Outro',
};

const STATUS_ANGULO_LABEL = {
  novo: 'Novo',
  briefing_gerado: 'Briefing Gerado',
  materia_em_producao: 'Em Produção',
  publicada: 'Publicada',
  descartado: 'Descartado',
};

const ORIGEM_LABEL = {
  pesquisa_inicial: 'Pesquisa Inicial',
  aprofundamento_com_input: 'Aprofundamento c/ Input',
  aprofundamento_por_movimento_recente: 'Movimento Recente',
  manual: 'Manual',
};

const EXPECTATIVA_LABEL = {
  provavel: 'Provável',
  possivel: 'Possível',
  incerto: 'Incerto',
};

// ─── DISTRIBUIÇÃO (1:N Ângulos) ───
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
      ${pessoas.length > 0 ? pessoas.map(p => renderPessoaCard(p)).join('') : '<div class="empty-state"><p>Nenhuma pessoa na lista ainda. Gere sugestões com o squad.</p></div>'}
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

  // Bind all interactive elements
  bindDistribuicaoEvents(container, pessoas);
}

function renderPessoaCard(p) {
  const angulos = p.angulos_distribuicao || [];
  const anguloCount = angulos.filter(a => a.status !== 'descartado').length;
  const badgeText = anguloCount > 0 ? `${anguloCount} ângulo${anguloCount > 1 ? 's' : ''}` : 'Sem ângulos';
  const badgeClass = anguloCount > 0 ? 'angulo-badge-count' : 'angulo-badge-zero';

  return `
    <details class="dist-card" data-pessoa-id="${p.id}">
      <summary class="dist-card-summary">
        <div class="dist-card-info">
          <h4 class="dist-card-nome">${escapeHtml(p.nome)}</h4>
          <span class="dist-card-funcao-badge">${escapeHtml(p.funcao || '—')}</span>
          ${p.expande_bolha ? '<span class="badge badge-bolha">🌐 Expande bolha</span>' : ''}
        </div>
        <div class="dist-card-meta">
          ${p.status_relacao ? `<span class="dist-relacao-tag">${escapeHtml(p.status_relacao)}</span>` : ''}
          <span class="badge ${badgeClass}">${badgeText}</span>
          ${anguloCount === 0 ? `<button class="dist-btn-gerar-angulos" data-action="gerar-angulos" data-pessoa-id="${p.id}">Gerar ângulos →</button>` : ''}
        </div>
      </summary>
      <div class="dist-card-expanded">
        <!-- Campos editáveis da pessoa -->
        <div class="dist-pessoa-fields">
          <div class="dist-inline-group">
            <label>Nome</label>
            <input type="text" class="dist-inline-edit" data-field="nome" data-pessoa-id="${p.id}" value="${escapeHtml(p.nome)}" />
          </div>
          <div class="dist-inline-group">
            <label>Função</label>
            <input type="text" class="dist-inline-edit" data-field="funcao" data-pessoa-id="${p.id}" value="${escapeHtml(p.funcao || '')}" placeholder="Ex: Head de Marketing" />
          </div>
          <div class="dist-inline-group">
            <label>Rede relevante</label>
            <input type="text" class="dist-inline-edit" data-field="rede_relevante" data-pessoa-id="${p.id}" value="${escapeHtml(p.rede_relevante || '')}" placeholder="Pra quem a rede dela alcança" />
          </div>
          <div class="dist-inline-group">
            <label>Observação</label>
            <input type="text" class="dist-inline-edit" data-field="observacao" data-pessoa-id="${p.id}" value="${escapeHtml(p.observacao || '')}" placeholder="Notas, contexto, interações passadas" />
          </div>
          <div class="dist-inline-group">
            <label>Relação</label>
            <input type="text" class="dist-inline-edit" data-field="status_relacao" data-pessoa-id="${p.id}" value="${escapeHtml(p.status_relacao || '')}" placeholder="Ex: contato direto, rede distante" />
          </div>
          <div class="dist-inline-group">
            <label>Expande bolha</label>
            <select class="dist-inline-select" data-field="expande_bolha" data-pessoa-id="${p.id}">
              <option value="true" ${p.expande_bolha ? 'selected' : ''}>Sim 🌐</option>
              <option value="false" ${!p.expande_bolha ? 'selected' : ''}>Não</option>
            </select>
          </div>
        </div>

        <!-- Ângulos -->
        <div class="dist-angulos-section">
          <div class="dist-angulos-header">
            <span class="dist-angulos-title">Ângulos</span>
            <button class="dist-btn-add-angulo" data-action="add-angulo" data-pessoa-id="${p.id}" data-pessoa-nome="${escapeHtml(p.nome)}">
              ${Icons.plus} Adicionar ângulo
            </button>
          </div>
          <div class="dist-angulos-list">
            ${angulos.length > 0 ? angulos.map(a => renderAnguloRow(a, p)).join('') : `
              <div class="dist-zero-state">
                <p>Sem ângulos — nenhuma matéria possível ainda.</p>
                <button class="dist-btn-gerar-inline" data-action="gerar-angulos" data-pessoa-id="${p.id}">
                  Gerar ângulos com squad →
                </button>
              </div>
            `}
          </div>
        </div>

        <!-- Ações da pessoa -->
        <div class="dist-pessoa-actions">
          <button class="btn-danger btn-sm" data-action="delete-pessoa" data-pessoa-id="${p.id}" data-pessoa-nome="${escapeHtml(p.nome)}">
            ${Icons.trash} Remover pessoa
          </button>
        </div>
      </div>
    </details>
  `;
}

function renderAnguloRow(a, pessoa) {
  const emoji = ARQUETIPO_EMOJI[a.arquetipo] || '💡';
  const statusLabel = STATUS_ANGULO_LABEL[a.status] || a.status;
  const statusClass = `angulo-status-${a.status}`;
  const evidenciasArr = Array.isArray(a.evidencias) ? a.evidencias : [];

  return `
    <div class="angulo-row ${a.status === 'descartado' ? 'angulo-row-descartado' : ''}" data-angulo-id="${a.id}">
      <div class="angulo-row-header">
        <div class="angulo-row-left">
          <span class="angulo-arquetipo-badge">${emoji} ${ARQUETIPO_LABEL[a.arquetipo] || a.arquetipo}</span>
          <span class="badge angulo-status-badge ${statusClass}">${statusLabel}</span>
        </div>
        <div class="angulo-row-actions">
          <button class="btn-ghost btn-sm" data-action="copy-materia" data-angulo-id="${a.id}" data-pessoa-id="${pessoa.id}" title="Copiar prompt de matéria">
            ${Icons.copy} Matéria
          </button>
          <button class="btn-icon-sm angulo-delete-btn" data-action="delete-angulo" data-angulo-id="${a.id}" title="Remover ângulo">
            ${Icons.trash}
          </button>
        </div>
      </div>
      <div class="angulo-row-body">
        <div class="angulo-titulo-lente">
          <input type="text" class="angulo-inline-edit angulo-titulo-input" data-angulo-field="titulo_pela_lente" data-angulo-id="${a.id}" value="${escapeHtml(a.titulo_pela_lente)}" placeholder="Título pela lente..." />
        </div>
        ${evidenciasArr.length > 0 ? `
          <div class="angulo-evidencias">
            ${evidenciasArr.map((ev, i) => `<span class="angulo-evidencia-tag">${escapeHtml(String(ev))}</span>`).join('')}
          </div>
        ` : ''}
        ${a.risco ? `<p class="angulo-risco">⚠️ ${escapeHtml(a.risco)}</p>` : ''}
        <div class="angulo-meta-row">
          <div class="angulo-meta-item">
            <label>Arquétipo</label>
            <select class="angulo-inline-select" data-angulo-field="arquetipo" data-angulo-id="${a.id}">
              ${Object.entries(ARQUETIPO_LABEL).map(([k, v]) =>
                `<option value="${k}" ${a.arquetipo === k ? 'selected' : ''}>${v}</option>`
              ).join('')}
            </select>
          </div>
          <div class="angulo-meta-item">
            <label>Status</label>
            <select class="angulo-inline-select" data-angulo-field="status" data-angulo-id="${a.id}">
              ${Object.entries(STATUS_ANGULO_LABEL).map(([k, v]) =>
                `<option value="${k}" ${a.status === k ? 'selected' : ''}>${v}</option>`
              ).join('')}
            </select>
          </div>
          <div class="angulo-meta-item">
            <label>Origem</label>
            <select class="angulo-inline-select" data-angulo-field="origem" data-angulo-id="${a.id}">
              ${Object.entries(ORIGEM_LABEL).map(([k, v]) =>
                `<option value="${k}" ${a.origem === k ? 'selected' : ''}>${v}</option>`
              ).join('')}
            </select>
          </div>
          <div class="angulo-meta-item">
            <label>💬 Comentário</label>
            <select class="angulo-inline-select" data-angulo-field="expectativa_comentario" data-angulo-id="${a.id}">
              <option value="" ${!a.expectativa_comentario ? 'selected' : ''}>—</option>
              ${Object.entries(EXPECTATIVA_LABEL).map(([k, v]) =>
                `<option value="${k}" ${a.expectativa_comentario === k ? 'selected' : ''}>${v}</option>`
              ).join('')}
            </select>
          </div>
          <div class="angulo-meta-item">
            <label>🔄 Repost</label>
            <select class="angulo-inline-select" data-angulo-field="expectativa_repost" data-angulo-id="${a.id}">
              <option value="" ${!a.expectativa_repost ? 'selected' : ''}>—</option>
              ${Object.entries(EXPECTATIVA_LABEL).map(([k, v]) =>
                `<option value="${k}" ${a.expectativa_repost === k ? 'selected' : ''}>${v}</option>`
              ).join('')}
            </select>
          </div>
        </div>
      </div>
    </div>
  `;
}

function bindDistribuicaoEvents(container, pessoas) {
  // Inline edit pessoa fields (blur → save)
  container.querySelectorAll('.dist-inline-edit').forEach(input => {
    input.addEventListener('blur', async () => {
      const pessoaId = input.dataset.pessoaId;
      const field = input.dataset.field;
      const value = input.value.trim();
      await DataStore.updateDistribuicao(pessoaId, { [field]: value });
      showToast('Salvo', 'success');
    });
  });

  // Inline select pessoa fields
  container.querySelectorAll('.dist-inline-select').forEach(select => {
    select.addEventListener('change', async () => {
      const pessoaId = select.dataset.pessoaId;
      const field = select.dataset.field;
      let value = select.value;
      if (field === 'expande_bolha') value = value === 'true';
      await DataStore.updateDistribuicao(pessoaId, { [field]: value });
      showToast('Salvo', 'success');
    });
  });

  // Inline edit ângulo fields (blur → save)
  container.querySelectorAll('.angulo-inline-edit').forEach(input => {
    input.addEventListener('blur', async () => {
      const anguloId = input.dataset.anguloId;
      const field = input.dataset.anguloField;
      const value = input.value.trim();
      await DataStore.updateAngulo(anguloId, { [field]: value });
      showToast('Salvo', 'success');
    });
  });

  // Inline select ângulo fields
  container.querySelectorAll('.angulo-inline-select').forEach(select => {
    select.addEventListener('change', async () => {
      const anguloId = select.dataset.anguloId;
      const field = select.dataset.anguloField;
      const value = select.value || null;
      await DataStore.updateAngulo(anguloId, { [field]: value });
      showToast('Salvo', 'success');
    });
  });

  // Gerar ângulos → prompt
  container.querySelectorAll('[data-action="gerar-angulos"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Don't toggle <details>
      const pessoaId = btn.dataset.pessoaId;
      const pessoa = pessoas.find(p => p.id === pessoaId);
      if (!pessoa) return;
      const angulos = pessoa.angulos_distribuicao || [];
      const prompt = Prompts.aprofundarPessoa(pessoa.nome, angulos);
      document.getElementById('dist-prompt-area').innerHTML = renderPromptBlock(prompt);
      bindPromptCopy();
      document.getElementById('pautas-prompt-block')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

  // Adicionar ângulo → prompt com input opcional
  container.querySelectorAll('[data-action="add-angulo"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pessoaId = btn.dataset.pessoaId;
      const pessoaNome = btn.dataset.pessoaNome;
      const pessoa = pessoas.find(p => p.id === pessoaId);
      if (!pessoa) return;
      const angulos = pessoa.angulos_distribuicao || [];

      // Show inline input for optional direction
      const angulosSection = btn.closest('.dist-angulos-section');
      let inputArea = angulosSection.querySelector('.dist-input-direcao');
      if (inputArea) { inputArea.remove(); return; } // toggle

      const div = document.createElement('div');
      div.className = 'dist-input-direcao';
      div.innerHTML = `
        <input type="text" class="dist-inline-edit" placeholder="Direção livre (opcional) — ex: foco em processo comercial" id="direcao-${pessoaId}" />
        <button class="btn-primary btn-sm" id="direcao-go-${pessoaId}">${Icons.arrowRight} Gerar prompt</button>
      `;
      angulosSection.insertBefore(div, angulosSection.querySelector('.dist-angulos-list'));

      document.getElementById(`direcao-go-${pessoaId}`)?.addEventListener('click', () => {
        const inputLivre = document.getElementById(`direcao-${pessoaId}`)?.value || '';
        const prompt = Prompts.aprofundarPessoa(pessoaNome, angulos, inputLivre);
        document.getElementById('dist-prompt-area').innerHTML = renderPromptBlock(prompt);
        bindPromptCopy();
        div.remove();
        document.getElementById('pautas-prompt-block')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });
  });

  // Copiar prompt matéria
  container.querySelectorAll('[data-action="copy-materia"]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const anguloId = btn.dataset.anguloId;
      const pessoaId = btn.dataset.pessoaId;
      const pessoa = pessoas.find(p => p.id === pessoaId);
      if (!pessoa) return;
      const angulo = (pessoa.angulos_distribuicao || []).find(a => a.id === anguloId);
      if (!angulo) return;
      const prompt = Prompts.criarMateriaColab(angulo, pessoa);
      document.getElementById('dist-prompt-area').innerHTML = renderPromptBlock(prompt);
      bindPromptCopy();
      document.getElementById('pautas-prompt-block')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

  // Delete ângulo
  container.querySelectorAll('[data-action="delete-angulo"]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Remover este ângulo?')) return;
      const anguloId = btn.dataset.anguloId;
      const ok = await DataStore.deleteAngulo(anguloId);
      if (ok) {
        showToast('Ângulo removido', 'success');
        await renderDistribuicao();
      }
    });
  });

  // Delete pessoa
  container.querySelectorAll('[data-action="delete-pessoa"]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const nome = btn.dataset.pessoaNome;
      if (!confirm(`Remover "${nome}" e todos os seus ângulos?`)) return;
      const pessoaId = btn.dataset.pessoaId;
      const ok = await DataStore.deleteDistribuicao(pessoaId);
      if (ok) {
        showToast(`"${nome}" removido`, 'success');
        await renderDistribuicao();
      }
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
