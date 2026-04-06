// linkedin-publish.js — Publish to LinkedIn Modal (2-screen flow)
// Design: Antigravity — Weightless glass cards, staggered entrances, smooth depth
import { DataStore } from './data.js';
import { renderLinkedInPreview, attachLinkedInPreviewEvents } from './linkedin-preview.js';
import { Icons } from './icons.js';
import { showToast } from './toast.js';
import { openModal, closeModal } from './modal.js';
import { escapeHtml, truncate, copyToClipboard } from './utils.js';
import { renderLibrary } from './render.js';

// ─── PUBLISH MODAL (2-screen flow) ───
export function openPublishModal(postId) {
  const post = DataStore.getPostById(postId);
  if (!post) return;

  // Compose full text for preview
  const normalize = (s) => s.replace(/\s+/g, ' ').trim();
  const hook = (post.hookText || '').trim();
  const body = post.body || '';
  const cta = (post.cta || '').trim();
  const hookDup = hook && normalize(body).startsWith(normalize(hook));
  const ctaDup = cta && normalize(body).endsWith(normalize(cta));
  const parts = [];
  if (!hookDup && hook) parts.push(hook, '');
  parts.push(body);
  if (!ctaDup && cta) parts.push('', cta);
  const hashtagStr = (post.hashtags || []).join(' ');
  if (hashtagStr) parts.push('', hashtagStr);
  const fullText = parts.filter(s => s !== undefined && s !== null).join('\n').trim();
  const charCount = fullText.length;
  const hasCover = !!(post.covers?.image_url || post.derivations?.cover?.coverPath);
  const hasCarousel = !!(post.carousels?.pdf_url || post.derivations?.carousel);

  // Media label
  let mediaLabel = 'Nenhuma';
  let mediaIcon = `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/></svg>`;
  if (hasCover && hasCarousel) mediaLabel = 'Capa + Carrossel';
  else if (hasCover) mediaLabel = '1 imagem (capa)';
  else if (hasCarousel) mediaLabel = `Carrossel (${post.derivations?.carousel?.slidesCount || '—'} slides)`;

  // LinkedIn Preview HTML
  const linkedinPreviewHtml = renderLinkedInPreview(post);

  // Step indicator HTML (reused in both screens)
  const stepIndicator = (active) => `
    <div class="publish-steps">
      <div class="publish-step ${active === 1 ? 'publish-step--active' : 'publish-step--done'}">
        <span class="publish-step-dot">${active > 1 ? '✓' : '1'}</span>
        <span class="publish-step-label">Opções</span>
      </div>
      <div class="publish-step-line ${active > 1 ? 'publish-step-line--filled' : ''}"></div>
      <div class="publish-step ${active === 2 ? 'publish-step--active' : ''}">
        <span class="publish-step-dot">2</span>
        <span class="publish-step-label">Revisão</span>
      </div>
    </div>
  `;

  // ── Screen 1: Options ──
  const screen1Html = `
    <div class="publish-screen publish-screen--enter-right" id="publish-screen-1">
      ${stepIndicator(1)}

      <div class="publish-option-card publish-option-card--selected" id="option-card-now">
        <div class="publish-option-info">
          <div class="publish-option-icon publish-option-icon--active">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/></svg>
          </div>
          <div>
            <p class="publish-option-title">Publicar agora</p>
            <p class="publish-option-desc">Enviar imediatamente para o LinkedIn</p>
          </div>
        </div>
        <div class="publish-radio publish-radio--on" id="publish-radio-now"></div>
      </div>

      <div class="publish-option-card publish-option-card--locked" id="option-card-schedule">
        <div class="publish-option-info">
          <div class="publish-option-icon">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>
          </div>
          <div>
            <p class="publish-option-title">Agendar publicação</p>
            <p class="publish-option-desc">Escolha data e horário</p>
          </div>
        </div>
        <span class="publish-badge-soon">Em breve</span>
      </div>


    </div>
  `;

  // ── Screen 2: Review ──
  const screen2Html = `
    <div class="publish-screen" id="publish-screen-2" style="display:none">
      ${stepIndicator(2)}

      <div class="publish-review-grid">
        <div class="publish-review-left">
          <h3 class="publish-section-title">Resumo da Publicação</h3>
          <div class="publish-summary-card">
            <div class="publish-summary-row" style="--stagger: 0">
              <div class="publish-summary-icon">
                <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"/></svg>
              </div>
              <div>
                <p class="publish-summary-label">Conteúdo</p>
                <p class="publish-summary-value">${escapeHtml(fullText.slice(0, 80).trimEnd())}${fullText.length > 80 ? '…' : ''}</p>
                <p class="publish-summary-meta">${charCount} caracteres</p>
              </div>
            </div>

            <div class="publish-summary-divider"></div>

            <div class="publish-summary-row" style="--stagger: 1">
              <div class="publish-summary-icon">
                ${mediaIcon}
              </div>
              <div>
                <p class="publish-summary-label">Mídia</p>
                <p class="publish-summary-value">${mediaLabel}</p>
              </div>
            </div>

            <div class="publish-summary-divider"></div>

            <div class="publish-summary-row" style="--stagger: 2">
              <div class="publish-summary-icon publish-summary-icon--accent">
                <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/></svg>
              </div>
              <div>
                <p class="publish-summary-label">Quando</p>
                <p class="publish-summary-value publish-summary-accent">⚡ Publicar imediatamente</p>
              </div>
            </div>
          </div>

          <div class="publish-confirm-notice">
            <div class="publish-confirm-icon">
              <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
            </div>
            <p>Ao clicar em <strong>"Publicar Agora"</strong>, seu post será publicado imediatamente no LinkedIn e o status será atualizado para <strong>publicado</strong>.</p>
          </div>
        </div>

        <div class="publish-review-right">
          <h3 class="publish-section-title">Preview no LinkedIn</h3>
          <div class="publish-preview-frame">
            ${linkedinPreviewHtml}
          </div>
        </div>
      </div>
    </div>
  `;

  // ── Success Screen ──
  const successHtml = `
    <div class="publish-screen" id="publish-screen-success" style="display:none">
      <div class="publish-success">
        <div class="publish-success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3 class="publish-success-title">Publicado com sucesso!</h3>
        <p class="publish-success-desc">Seu post foi marcado como publicado e está pronto para o LinkedIn.</p>
      </div>
    </div>
  `;

  openModal(`
    <div class="modal-header">
      <h2 id="publish-modal-title">${Icons.send} Publicação</h2>
      <button class="btn-icon modal-close" aria-label="Fechar">${Icons.x}</button>
    </div>
    <div class="modal-body publish-modal-body">
      ${screen1Html}
      ${screen2Html}
      ${successHtml}
    </div>
    <div class="modal-footer" id="publish-modal-footer">
      <div></div>
      <button class="btn-primary btn-sm" id="publish-btn-next">${Icons.arrowRight} Próximo</button>
    </div>
  `);

  // Expand modal for review screen
  const container = document.querySelector('.modal-container');
  if (container) container.classList.add('publish-modal-container');

  // ── State ──
  let currentScreen = 1;

  // ── Screen switching with directional animation ──
  function showScreen(n) {
    const goingForward = n > currentScreen;
    currentScreen = n;

    const screen1El = document.getElementById('publish-screen-1');
    const screen2El = document.getElementById('publish-screen-2');
    const successEl = document.getElementById('publish-screen-success');

    [screen1El, screen2El, successEl].forEach(el => {
      if (el) { el.style.display = 'none'; el.className = 'publish-screen'; }
    });

    const target = n === 1 ? screen1El : n === 2 ? screen2El : successEl;
    if (!target) return;

    target.style.display = '';
    target.classList.add(goingForward ? 'publish-screen--enter-right' : 'publish-screen--enter-left');

    const title = document.getElementById('publish-modal-title');
    const titles = { 1: 'Publicação', 2: 'Revisão', 3: 'Concluído' };
    if (title) title.innerHTML = `${Icons.send} ${titles[n]}`;

    const footer = document.getElementById('publish-modal-footer');

    if (n === 1) {
      footer.style.display = '';
      footer.innerHTML = `
        <div></div>
        <button class="btn-primary btn-sm" id="publish-btn-next">${Icons.arrowRight} Próximo</button>
      `;
      document.getElementById('publish-btn-next')?.addEventListener('click', () => showScreen(2));
    } else if (n === 2) {
      footer.style.display = '';
      footer.innerHTML = `
        <button class="btn-ghost btn-sm" id="publish-btn-back">${Icons.arrowLeft} Voltar</button>
        <button class="btn-linkedin btn-sm" id="publish-btn-confirm">
          ${Icons.send} Publicar Agora
        </button>
      `;
      document.getElementById('publish-btn-back')?.addEventListener('click', () => showScreen(1));
      document.getElementById('publish-btn-confirm')?.addEventListener('click', () => handlePublish(post));
      attachLinkedInPreviewEvents();
    } else {
      footer.style.display = 'none';
    }
  }

  // ── Publish action ──
  async function handlePublish(post) {
    const btn = document.getElementById('publish-btn-confirm');
    if (!btn) return;

    btn.disabled = true;
    btn.innerHTML = `
      <svg class="publish-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="15"/>
      </svg>
      Publicando...
    `;

    try {
      await DataStore.updatePost(post.id, {
        status: 'publicado',
        publishedAt: new Date().toISOString(),
      });

      showScreen(3);

      setTimeout(() => {
        closeModal();
        showToast('Post publicado com sucesso! 🚀', 'success');
        renderLibrary();
      }, 2000);
    } catch (err) {
      console.error('[Publish] Error:', err);
      showToast('Erro ao publicar: ' + err.message, 'error');
      btn.disabled = false;
      btn.innerHTML = `${Icons.send} Publicar Agora`;
    }
  }

  // ── Init ──
  document.querySelector('.modal-close')?.addEventListener('click', closeModal);
  document.getElementById('publish-btn-next')?.addEventListener('click', () => showScreen(2));
}
