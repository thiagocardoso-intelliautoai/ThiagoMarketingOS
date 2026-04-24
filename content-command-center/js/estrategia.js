// estrategia.js — Sessão Estratégia: 18 átomos editáveis (Etapa 3)
import { DataStore } from './data.js';
import { Icons } from './icons.js';
import { showToast } from './toast.js';
import { openModal, closeModal } from './modal.js';
import { escapeHtml } from './utils.js';

const ATOM_GROUPS = [
  { key: 'fundacao', icon: '🏗️', label: 'Fundação', atoms: ['brand_lens', 'flag_anchor', 'flag_sub', 'icp_hypothesis', 'content_sources'] },
  { key: 'conteudo', icon: '📝', label: 'Conteúdo', atoms: ['content_rules', 'audience_levels', 'signature_visual'] },
  { key: 'alcance', icon: '📡', label: 'Alcance', atoms: ['reach_mechanic', 'reach_quality_rule'] },
  { key: 'distribuicao', icon: '🤝', label: 'Distribuição', atoms: ['distribution_mechanic', 'distribution_gate', 'distribution_subject_profile', 'distribution_exclusions', 'distribution_initial_list'] },
  { key: 'posicionamento', icon: '🎯', label: 'Posicionamento', atoms: ['positioning_gap', 'positioning_voice_patterns', 'positioning_not_gap'] },
];

export async function renderEstrategia() {
  const main = document.getElementById('main-content');
  const atomos = await DataStore.getAtomos();
  const atomMap = {};
  atomos.forEach(a => { atomMap[a.chave] = a; });

  main.innerHTML = `
    <section class="estrategia-section">
      <div class="estrategia-header">
        <h2 class="section-title">Estratégia</h2>
        <p class="section-subtitle">18 átomos estratégicos — fonte única de verdade</p>
      </div>
      <div class="estrategia-groups">
        ${ATOM_GROUPS.map(group => `
          <div class="atom-group">
            <h3 class="atom-group-title">${group.icon} ${group.label}</h3>
            <div class="atom-grid">
              ${group.atoms.map(key => renderAtomCard(key, atomMap[key])).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;

  // Bind edit — whole card is clickable
  main.querySelectorAll('.atom-card[data-chave]').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const chave = card.dataset.chave;
      const atom = atomMap[chave];
      if (atom) openAtomEditor(chave, atom);
    });
  });
}

function renderAtomCard(key, atom) {
  const prettyName = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  if (!atom) {
    return `
      <div class="atom-card atom-card-empty">
        <h4 class="atom-card-title">${prettyName}</h4>
        <p class="atom-card-preview">Átomo não encontrado no banco</p>
      </div>
    `;
  }

  const valor = atom.valor || {};
  const preview = getAtomPreview(key, valor);
  const updatedAgo = atom.updated_at
    ? `há ${Math.floor((Date.now() - new Date(atom.updated_at).getTime()) / 86400000)}d`
    : '';

  return `
    <div class="atom-card" data-chave="${key}">
      <div class="atom-card-header">
        <h4 class="atom-card-title">${valor.name || prettyName}</h4>
        <button class="btn-icon-sm" data-action="edit-atom" data-chave="${key}" title="Editar" aria-label="Editar ${prettyName}">
                    <svg viewBox="0 0 24 24" width="14" height="14"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
        </button>
      </div>
      ${valor.subtitle ? `<p class="atom-card-subtitle">${escapeHtml(valor.subtitle)}</p>` : ''}
      <p class="atom-card-preview">${escapeHtml(preview)}</p>
      ${updatedAgo ? `<span class="atom-card-updated">${updatedAgo}</span>` : ''}
    </div>
  `;
}

function getAtomPreview(key, valor) {
  // Show a meaningful short preview per atom type
  if (valor.definition) return truncateStr(valor.definition, 120);
  if (valor.definicao) return truncateStr(valor.definicao, 120);
  if (valor.regra) return truncateStr(valor.regra, 120);
  if (valor.regua) return truncateStr(valor.regua, 120);
  if (valor.pergunta_que_resolve) return truncateStr(valor.pergunta_que_resolve, 120);
  if (valor.lacuna_encontrada) return truncateStr(valor.lacuna_encontrada, 120);
  if (valor.formato) return truncateStr(valor.formato, 120);
  if (valor.decisao) return truncateStr(valor.decisao, 120);
  if (valor.nota) return truncateStr(valor.nota, 120);
  if (valor.nota_adaptacao) return truncateStr(valor.nota_adaptacao, 120);
  if (valor.nota_operacional) return truncateStr(valor.nota_operacional, 120);
  if (valor.principio) return truncateStr(valor.principio, 120);
  if (valor.principio_de_design) return truncateStr(valor.principio_de_design, 120);
  // Fallback: stringify first 120 chars
  const str = JSON.stringify(valor);
  return truncateStr(str, 120);
}

function truncateStr(s, max) {
  if (!s) return '';
  return s.length > max ? s.slice(0, max) + '…' : s;
}

function openAtomEditor(chave, atom) {
  const prettyName = chave.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const jsonStr = JSON.stringify(atom.valor, null, 2);

  openModal(`
    <div class="modal-header">
      <h2><svg viewBox="0 0 24 24" width="14" height="14"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg> Editar: ${prettyName}</h2>
      <button class="btn-icon modal-close" aria-label="Fechar">${Icons.x}</button>
    </div>
    <div class="modal-body">
      <p class="modal-subtitle">Chave: <code>${chave}</code></p>
      <textarea id="atom-editor-textarea" class="input-field textarea-field atom-editor-field" rows="18"></textarea>
      <p class="atom-editor-hint">Edite o JSON acima. A estrutura precisa ser JSON válido.</p>
    </div>
    <div class="modal-footer">
      <button class="btn-ghost btn-sm modal-close">Cancelar</button>
      <button class="btn-primary btn-sm" id="atom-save-btn">${Icons.check} Salvar Átomo</button>
    </div>
  `);

  // Set value via JS to avoid HTML entity escaping issues
  document.getElementById('atom-editor-textarea').value = jsonStr;

  document.querySelectorAll('.modal-close').forEach(b => b.addEventListener('click', closeModal));

  document.getElementById('atom-save-btn')?.addEventListener('click', async () => {
    const textarea = document.getElementById('atom-editor-textarea');
    try {
      const parsed = JSON.parse(textarea.value);
      const result = await DataStore.updateAtomo(chave, parsed);
      if (result) {
        closeModal();
        showToast('Átomo salvo!', 'success');
        renderEstrategia();
      } else {
        showToast('Erro ao salvar. Verifique a conexão.', 'warning');
      }
    } catch (e) {
      console.error('[Estrategia] Save error:', e);
      // Extract line/position info from error message
      const match = e.message.match(/line (\d+)/i);
      const lineInfo = match ? ` (erro na linha ${match[1]})` : '';
      showToast(`JSON inválido${lineInfo}. Corrija e tente novamente.`, 'warning');
    }
  });
}
