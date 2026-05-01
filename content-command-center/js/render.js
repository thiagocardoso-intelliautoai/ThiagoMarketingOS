// render.js — DOM Rendering Engine v2.0 (Lucide Icons Edition)
import { DataStore } from './data.js';
import { MODE_LABELS, FONTE_TESE_CONFIG, STATUS_LABELS, URGENCY_LABELS } from './state.js';
import { Prompts, CarouselStyles, CoverStyles } from './prompts.js';
import { renderLinkedInPreview, attachLinkedInPreviewEvents } from './linkedin-preview.js';
import { Icons } from './icons.js';
import { showToast } from './toast.js';
import { openModal, closeModal } from './modal.js';
import { copyToClipboard, downloadFile, escapeHtml, truncate, formatDate } from './utils.js';
import { openPublishModal } from './linkedin-publish.js';

// ─── RENDER DASHBOARD ───
export function renderDashboard() {
  const main = document.getElementById('main-content');
  const postsCount = DataStore.getPosts().length;

  main.innerHTML = `
    <section class="hero-section">
      <h2 class="section-title">Criar Conteúdo</h2>
      <p class="section-subtitle">Escolha como quer operar hoje</p>
    </section>

    <section class="mode-grid">
      ${[3, 4].map(m => renderModeCard(m)).join('')}
    </section>

    <div id="mode-expand-panel" class="mode-expand-panel"></div>
  `;

  main.querySelectorAll('.mode-card').forEach(card => {
    card.addEventListener('click', () => {
      expandModePanel(parseInt(card.dataset.mode));
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        expandModePanel(parseInt(card.dataset.mode));
      }
    });
  });

  const badge = document.getElementById('library-badge');
  if (badge) badge.textContent = postsCount;
}

function renderModeCard(mode) {
  const info = MODE_LABELS[mode];
  const featuredClass = info.featured ? ' mode-card-featured' : '';
  const badgeHtml = info.badge ? `<span class="mode-card-badge">${info.badge}</span>` : '';
  return `
    <div class="mode-card${featuredClass}" data-mode="${mode}" tabindex="0" role="button" aria-label="${info.name}">
      ${badgeHtml}
      <div class="mode-card-icon">${info.icon}</div>
      <h3 class="mode-card-title">${info.name}</h3>
      <p class="mode-card-desc">${info.desc}</p>
      <span class="mode-card-action">Selecionar ${Icons.arrowRight}</span>
    </div>
  `;
}

function expandModePanel(mode) {
  const panel = document.getElementById('mode-expand-panel');
  const info = MODE_LABELS[mode];

  document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('mode-card-selected'));
  const selectedCard = document.querySelector(`.mode-card[data-mode="${mode}"]`);
  if (selectedCard) selectedCard.classList.add('mode-card-selected');

  let extraInput = '';
  if (mode === 3) {
    extraInput = `
      <div class="expand-field">
        <label for="briefing-theme">${Icons.clipboard} Tema do briefing</label>
        <input type="text" id="briefing-theme" class="input-field" placeholder='Ex: "Como IA está mudando o outbound sales em 2025"' />
      </div>
    `;
  }
  if (mode === 4) {
    extraInput = `
      <div class="expand-field">
        <label for="direct-idea">${Icons.lightbulb} Sua ideia (opcional)</label>
        <textarea id="direct-idea" class="input-field textarea-field" rows="3" placeholder="Descreva a ideia do post ou deixe vazio para escolher do Armazém"></textarea>
      </div>
    `;
  }


  panel.innerHTML = `
    <div class="expand-content">
      <div class="expand-header">
        <h3>${info.icon} ${info.name}</h3>
        <button class="btn-icon" id="close-expand" aria-label="Fechar">${Icons.x}</button>
      </div>
      <p class="expand-desc">${info.desc}</p>
      ${extraInput}
      <div class="expand-prompt">
        <label>${Icons.terminal} Prompt gerado</label>
        <pre class="prompt-block" id="prompt-output">${generatePromptForMode(mode)}</pre>
        <button class="btn-primary" id="copy-prompt-btn">
          ${Icons.copy} Copiar Prompt
        </button>
      </div>
    </div>
  `;

  panel.classList.add('panel-open');

  document.getElementById('close-expand').addEventListener('click', () => {
    panel.classList.remove('panel-open');
    document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('mode-card-selected'));
  });

  document.getElementById('copy-prompt-btn').addEventListener('click', () => {
    copyToClipboard(document.getElementById('prompt-output').textContent);
  });

  if (mode === 3) {
    document.getElementById('briefing-theme').addEventListener('input', (e) => {
      document.getElementById('prompt-output').textContent = Prompts.briefing(e.target.value);
    });
  }
  if (mode === 4) {
    document.getElementById('direct-idea').addEventListener('input', (e) => {
      document.getElementById('prompt-output').textContent = Prompts.postDireto(e.target.value);
    });
  }


  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function generatePromptForMode(mode) {
  switch (mode) {
    case 3: return Prompts.briefing('');
    case 4: return Prompts.postDireto('');
    default: return '';
  }
}

// ─── RENDER LIBRARY ───
export function renderLibrary() {
  const main = document.getElementById('main-content');
  const posts = DataStore.getPosts();

  main.innerHTML = `
    <section class="library-section">
      <div class="library-header">
        <h2 class="section-title">Conteúdos</h2>
      </div>

      <div class="library-filters">
        <div class="filter-group">
          <select id="filter-status" class="filter-select" aria-label="Filtrar por status">
            <option value="">Todos os Status</option>
            <option value="rascunho">Rascunho</option>
            <option value="agendado">Agendado</option>
            <option value="publicado">Publicado</option>
          </select>
          <select id="filter-urgency" class="filter-select" aria-label="Filtrar por urgência">
            <option value="">Todas as Urgências</option>
            <option value="urgente">Urgente</option>
            <option value="relevante">Relevante</option>
            <option value="pode_esperar">Pode esperar</option>
          </select>
          <select id="filter-content-type" class="filter-select" aria-label="Filtrar por tipo de conteúdo">
            <option value="">Todos os Tipos</option>
            <option value="carousel">🎠 Carrossel</option>
            <option value="cover">🖼️ Capa</option>
          </select>
          <select id="filter-pauta-central" class="filter-select" aria-label="Filtrar por pauta central">
            <option value="">Todas as Pautas</option>
          </select>
        </div>
        <div class="search-group">
          <input type="text" id="search-posts" class="input-field search-input" placeholder="Buscar por título ou tema..." aria-label="Buscar posts" />
        </div>
      </div>

      <div id="posts-list" class="posts-list">
        ${posts.length > 0 ? posts.map(p => renderPostCard(p)).join('') : renderEmptyState()}
      </div>
    </section>

    <button class="fab" id="add-post-fab" title="Adicionar post" aria-label="Adicionar novo post">${Icons.plus}</button>
  `;

  bindLibraryEvents();
}

function renderPostCard(post) {
  // Status-based card variant
  const statusClass = post.status === 'publicado' ? 'post-card--publicado'
    : post.status === 'agendado' ? 'post-card--agendado'
    : 'post-card--rascunho';

  // Media badges
  const hasCoverUrl = !!(post.covers?.image_url);
  const hasCarouselUrl = !!post.derivations?.carousel?.pdfPath;
  const hasCoverDeriv = !!(post.contentType === 'cover' || post.derivations?.cover);
  const hasCarouselDeriv = !!(post.contentType === 'carousel' || post.derivations?.carousel);

  let carouselBadge = '';
  if (hasCarouselUrl) {
    carouselBadge = `<span class="badge badge-carousel badge-media-ready badge-clickable" data-action="carousel" data-id="${post.id}">${Icons.layers} Carrossel</span>`;
  } else if (hasCarouselDeriv) {
    carouselBadge = `<span class="badge badge-carousel badge-media-pending badge-clickable" data-action="carousel" data-id="${post.id}">${Icons.layers} Carrossel</span>`;
  }

  let coverBadge = '';
  if (hasCoverUrl) {
    coverBadge = `<span class="badge badge-cover badge-media-ready badge-clickable" data-action="cover" data-id="${post.id}">${Icons.image} Capa</span>`;
  } else if (hasCoverDeriv) {
    coverBadge = `<span class="badge badge-cover badge-media-pending badge-clickable" data-action="cover" data-id="${post.id}">${Icons.image} Capa</span>`;
  }

  // Thumbnail
  const thumbUrl = post.covers?.image_url || post.derivations?.cover?.coverPath || null;
  const thumbHtml = thumbUrl
    ? `<img src="${thumbUrl}" alt="" class="post-card-thumb" loading="lazy" onerror="this.remove()" />`
    : '';

  // Status badge with color
  const statusBadgeClass = post.status === 'publicado' ? 'badge-publicado'
    : post.status === 'agendado' ? 'badge-agendado'
    : 'badge-rascunho';

  // Scheduled date badge for agendado
  const scheduledBadge = post.status === 'agendado' && post.scheduledAt
    ? `<span class="scheduled-badge">⏰ ${new Date(post.scheduledAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} às ${new Date(post.scheduledAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>`
    : '';

  // Metrics bar for published posts
  const analytics = post.analytics || {};
  const metricsHtml = post.status === 'publicado' ? `
    <div class="post-card-metrics">
      <span class="metrics-item" title="Impressões">
        <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        ${formatMetric(analytics.impressions || 0)}
      </span>
      <span class="metrics-item" title="Reações">
        <svg viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
        ${formatMetric(analytics.reactions || 0)}
      </span>
      <span class="metrics-item" title="Comentários">
        <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        ${formatMetric(analytics.comments || 0)}
      </span>
      <span class="metrics-item" title="Compartilhamentos">
        <svg viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
        ${formatMetric(analytics.reshares || 0)}
      </span>
    </div>
  ` : '';

  const footerHtml = `
    <div class="post-card-footer">
      <div class="post-card-assets">
        ${carouselBadge}
        ${coverBadge}
      </div>
      <div class="post-card-secondary">
        <button class="btn-icon-sm" data-action="delete" data-id="${post.id}" title="Excluir" aria-label="Excluir post">${Icons.trash}</button>
      </div>
    </div>
  `;

  return `
    <div class="post-card ${statusClass}" data-id="${post.id}">
      ${thumbHtml}
      <div class="post-card-header">
        <h3 class="post-card-title">${escapeHtml(post.title)}</h3>
        <span class="badge ${statusBadgeClass}">${STATUS_LABELS[post.status] || post.status}</span>
      </div>
      ${post.status !== 'publicado' ? `
        <div class="post-card-hook">
          <p>${truncate(post.hookText, 120)}</p>
        </div>
      ` : ''}
      ${metricsHtml}
      <div class="post-card-info">
        <span class="meta-item">${Icons.calendar} ${formatDate(post.createdAt)}</span>
        ${post.reviewScore ? `<span class="meta-item">${Icons.barChart} ${post.reviewScore}%</span>` : ''}
        <span class="badge badge-status">${URGENCY_LABELS[post.urgency] || post.urgency}</span>
        ${scheduledBadge}
      </div>
      ${footerHtml}
    </div>
  `;
}

function formatMetric(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
}

function renderEmptyState() {
  return `
    <div class="empty-state">
      <div class="empty-icon">${Icons.inbox}</div>
      <h3>Nenhum post salvo ainda</h3>
      <p>Comece criando seu primeiro post no dashboard ou importe do Armazém de Ideias</p>
      <div class="empty-actions">
        <a href="#dashboard" class="btn-primary btn-sm">${Icons.arrowLeft} Ir para Dashboard</a>
      </div>
    </div>
  `;
}

function bindLibraryEvents() {
  ['filter-status', 'filter-urgency', 'filter-content-type', 'filter-pauta-central'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', applyFilters);
  });
  document.getElementById('search-posts')?.addEventListener('input', applyFilters);

  // Populate pauta central dropdown async
  (async () => {
    const pautas = await DataStore.getPautas();
    const sel = document.getElementById('filter-pauta-central');
    if (sel && pautas.length > 0) {
      pautas.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id; opt.textContent = p.nome;
        sel.appendChild(opt);
      });
    }
  })();

  document.getElementById('posts-list')?.addEventListener('click', (e) => {
    // Check for specific action buttons/badges first
    const actionEl = e.target.closest('[data-action]');
    if (actionEl) {
      e.stopPropagation();
      const action = actionEl.dataset.action;
      const id = actionEl.dataset.id;
      if (action === 'carousel') openCarouselModal(id);
      if (action === 'cover') openCoverModal(id);
      if (action === 'delete') openDeleteModal(id);
      return;
    }
    // Card body click = Ver Post
    const card = e.target.closest('.post-card');
    if (card) openViewPostModal(card.dataset.id);
  });

  document.getElementById('add-post-fab')?.addEventListener('click', openAddPostModal);
}

function applyFilters() {
  const status = document.getElementById('filter-status')?.value || '';
  const urgency = document.getElementById('filter-urgency')?.value || '';
  const contentType = document.getElementById('filter-content-type')?.value || '';
  const pautaCentralId = document.getElementById('filter-pauta-central')?.value || '';
  const search = document.getElementById('search-posts')?.value || '';
  const posts = DataStore.filterPosts({ status, urgency, contentType, search, pautaCentralId });
  const list = document.getElementById('posts-list');
  list.innerHTML = posts.length > 0 ? posts.map(p => renderPostCard(p)).join('') : renderEmptyState();
}

// ─── MODALS ───

function openViewPostModal(postId) {
  const post = DataStore.getPostById(postId);
  if (!post) return;
  const isPublished = post.status === 'publicado';

  // Generate LinkedIn preview HTML
  const linkedinPreviewHtml = renderLinkedInPreview(post);

  // Performance tab for published posts
  const analytics = post.analytics || {};
  const performanceTabHtml = isPublished ? `
    <div class="performance-grid">
      <div class="performance-card" style="--stagger: 0">
        <div class="performance-card-icon performance-icon--impressions">
          <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </div>
        <div class="performance-card-value">${formatMetric(analytics.impressions || 0)}</div>
        <div class="performance-card-label">Impressões</div>
      </div>
      <div class="performance-card" style="--stagger: 1">
        <div class="performance-card-icon performance-icon--reactions">
          <svg viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
        </div>
        <div class="performance-card-value">${formatMetric(analytics.reactions || 0)}</div>
        <div class="performance-card-label">Reações</div>
      </div>
      <div class="performance-card" style="--stagger: 2">
        <div class="performance-card-icon performance-icon--comments">
          <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div class="performance-card-value">${formatMetric(analytics.comments || 0)}</div>
        <div class="performance-card-label">Comentários</div>
      </div>
      <div class="performance-card" style="--stagger: 3">
        <div class="performance-card-icon performance-icon--reshares">
          <svg viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
        </div>
        <div class="performance-card-value">${formatMetric(analytics.reshares || 0)}</div>
        <div class="performance-card-label">Compartilhamentos</div>
      </div>
      ${analytics.members_reached ? `
        <div class="performance-card" style="--stagger: 4">
          <div class="performance-card-icon performance-icon--reach">
            <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div class="performance-card-value">${formatMetric(analytics.members_reached)}</div>
          <div class="performance-card-label">Alcance</div>
        </div>
      ` : ''}
    </div>
    ${post.publishedAt ? `<p class="performance-published-at">${Icons.calendar} Publicado em ${formatDate(post.publishedAt)}</p>` : ''}
  ` : '';

  // Modal header: tabs only for published
  const headerHtml = isPublished ? `
    <div class="modal-header">
      <h2>${Icons.eye} Ver Post</h2>
      <div class="preview-tabs">
        <button class="preview-tab preview-tab-active" data-tab="linkedin" id="tab-btn-linkedin">Preview LinkedIn</button>
        <button class="preview-tab" data-tab="performance" id="tab-btn-performance">${Icons.barChart} Performance</button>
      </div>
      <div class="modal-header-actions">
        <button class="btn-icon" id="modal-edit-post" title="Editar conteúdo">${Icons.edit}</button>
        <button class="btn-icon modal-close" aria-label="Fechar">${Icons.x}</button>
      </div>
    </div>
  ` : `
    <div class="modal-header">
      <h2>${Icons.eye} Preview LinkedIn</h2>
      <div class="modal-header-actions">
        <button class="btn-icon" id="modal-edit-post" title="Editar conteúdo">${Icons.edit}</button>
        <button class="btn-icon modal-close" aria-label="Fechar">${Icons.x}</button>
      </div>
    </div>
  `;

  // Modal body: tabs for published, direct preview for drafts/scheduled
  const bodyHtml = isPublished ? `
    <div class="modal-body">
      <div class="preview-tab-content" id="tab-linkedin">
        ${linkedinPreviewHtml}
      </div>
      <div class="preview-tab-content" id="tab-performance" style="display:none">
        ${performanceTabHtml}
      </div>
    </div>
  ` : `
    <div class="modal-body">
      ${linkedinPreviewHtml}
    </div>
  `;

  openModal(`
    ${headerHtml}
    ${bodyHtml}
    <div class="modal-footer">
      <div class="modal-footer-left">
        <button class="btn-outline-primary btn-sm" id="modal-copy-post">${Icons.copy} Copiar Post</button>
      </div>
      <div class="modal-footer-right">
        ${post.covers?.image_url
          ? `<button class="btn-download btn-sm" id="modal-download-cover" data-url="${post.covers.image_url}" data-filename="capa-${(post.title || 'post').replace(/[^a-zA-Z0-9]/g, '-').slice(0, 40)}.png">${Icons.download} Baixar Capa</button>`
          : `<button class="btn-ghost btn-sm" id="modal-gen-cover">${Icons.image} Gerar Capa</button>`
        }
        ${post.derivations?.carousel?.pdfPath
          ? `<button class="btn-download btn-sm" id="modal-download-pdf" data-url="${post.derivations.carousel.pdfPath}" data-filename="carrossel-${(post.title || 'post').replace(/[^a-zA-Z0-9]/g, '-').slice(0, 40)}.pdf">${Icons.download} Baixar PDF</button>`
          : `<button class="btn-primary btn-sm" id="modal-gen-carousel" data-id="${post.id}">${Icons.layers} Gerar Carrossel</button>`
        }
        ${!isPublished ? `<button class="btn-linkedin btn-sm" id="modal-publish-btn" data-id="${post.id}">${Icons.send} Publicar</button>` : ''}
      </div>
    </div>
  `);

  // Tab switching for published posts
  if (isPublished) {
    const switchTab = (showId, hideId, activeBtn, inactiveBtn) => {
      const showEl = document.getElementById(showId);
      const hideEl = document.getElementById(hideId);
      hideEl.style.display = 'none';
      showEl.style.display = '';
      showEl.style.animation = 'none';
      showEl.offsetHeight;
      showEl.style.animation = '';
      activeBtn.classList.add('preview-tab-active');
      inactiveBtn.classList.remove('preview-tab-active');
    };

    const tabLi = document.getElementById('tab-btn-linkedin');
    const tabPerf = document.getElementById('tab-btn-performance');
    tabLi?.addEventListener('click', () => switchTab('tab-linkedin', 'tab-performance', tabLi, tabPerf));
    tabPerf?.addEventListener('click', () => switchTab('tab-performance', 'tab-linkedin', tabPerf, tabLi));
  }

  // LinkedIn preview events (expand/collapse text)
  attachLinkedInPreviewEvents();

  // Edit/Save logic
  let isEditing = false;
  const editBtn = document.getElementById('modal-edit-post');
  
  editBtn?.addEventListener('click', async () => {
    const textContainer = document.getElementById('li-text-content');
    if (!textContainer) return;

    if (!isEditing) {
      // Switch to Edit Mode
      isEditing = true;
      editBtn.innerHTML = Icons.check;
      editBtn.title = "Salvar alterações";
      editBtn.classList.add('btn-edit-active');

      const hookText = post.hookText || '';
      const bodyText = post.body || '';
      const ctaText = post.cta || '';
      
      textContainer.innerHTML = `
        <div class="edit-fields-container">
          <label class="edit-label">Hook (Gancho)</label>
          <textarea id="edit-post-hook" class="edit-mode-textarea-sm" placeholder="Hook do post...">${hookText}</textarea>
          
          <label class="edit-label">Corpo do Post</label>
          <textarea id="edit-post-body" class="edit-mode-textarea" placeholder="Texto principal...">${bodyText}</textarea>
          
          <label class="edit-label">CTA (Chamada para ação)</label>
          <textarea id="edit-post-cta" class="edit-mode-textarea-sm" placeholder="CTA final...">${ctaText}</textarea>
        </div>
      `;
      
      // Auto-focus on body
      document.getElementById('edit-post-body').focus();
    } else {
      // Save and Switch to View Mode
      const newHook = document.getElementById('edit-post-hook').value;
      const newBody = document.getElementById('edit-post-body').value;
      const newCta = document.getElementById('edit-post-cta').value;
      
      try {
        editBtn.innerHTML = '<span class="spinner-sm"></span>';
        editBtn.disabled = true;

        await DataStore.updatePost(post.id, { 
          hookText: newHook,
          body: newBody,
          cta: newCta
        });
        
        showToast('Post atualizado!', 'success');
        
        // Update local object
        post.hookText = newHook;
        post.body = newBody;
        post.cta = newCta;
        
        // Re-render
        closeModal();
        openViewPostModal(post.id);
        renderLibrary();
      } catch (err) {
        console.error('Erro ao salvar post:', err);
        showToast('Erro ao salvar', 'error');
        editBtn.innerHTML = Icons.check;
        editBtn.disabled = false;
      }
    }
  });

  // Original modal events (unchanged)
  document.querySelector('.modal-close')?.addEventListener('click', closeModal);
  document.getElementById('modal-copy-post')?.addEventListener('click', () => {
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
    copyToClipboard(parts.filter(Boolean).join('\n'));
  });
  document.getElementById('modal-gen-carousel')?.addEventListener('click', () => {
    closeModal();
    openCarouselModal(post.id);
  });
  document.getElementById('modal-gen-cover')?.addEventListener('click', () => {
    closeModal();
    openCoverModal(post.id);
  });
  // SUPABASE-005: Download button handlers
  document.getElementById('modal-download-cover')?.addEventListener('click', (e) => {
    const url = e.currentTarget.dataset.url;
    const filename = e.currentTarget.dataset.filename;
    downloadFile(url, filename);
  });
  document.getElementById('modal-download-pdf')?.addEventListener('click', (e) => {
    const url = e.currentTarget.dataset.url;
    const filename = e.currentTarget.dataset.filename;
    downloadFile(url, filename);
  });
  // Publish button handler
  document.getElementById('modal-publish-btn')?.addEventListener('click', (e) => {
    const postId = e.currentTarget.dataset.id;
    closeModal();
    setTimeout(() => openPublishModal(postId), 200);
  });
}

// VISUAL-001: Renderiza cards de estilo a partir da metadata de prompts.js
// (label + vence_quando + perde_quando) — single source of truth.
function renderStyleCards(stylesMap, icons, defaultStyleNum) {
  return Object.entries(stylesMap).map(([num, meta]) => {
    const n = parseInt(num);
    const icon = icons[n - 1] || '✨';
    const selectedClass = n === defaultStyleNum ? ' style-card-selected' : '';
    return `
      <div class="style-card${selectedClass}" data-style="${n}" tabindex="0" role="button"
           data-vence="${escapeHtml(meta.vence_quando)}"
           data-perde="${escapeHtml(meta.perde_quando)}">
        <div class="style-card-icon">${icon}</div>
        <h4>${escapeHtml(meta.label.split('(')[0].trim())}</h4>
        <p>${escapeHtml(meta.short)}</p>
        <div class="style-card__hint">
          <span class="hint-vence">✅ ${escapeHtml(meta.vence_quando)}</span>
          <span class="hint-perde">❌ ${escapeHtml(meta.perde_quando)}</span>
        </div>
      </div>`;
  }).join('');
}

function openCarouselModal(postId) {
  const post = DataStore.getPostById(postId);
  if (!post) return;
  let selectedStyle = 1;

  openModal(`
    <div class="modal-header">
      <h2>${Icons.layers} Gerar Carrossel</h2>
      <button class="btn-icon modal-close" aria-label="Fechar">${Icons.x}</button>
    </div>
    <div class="modal-body">
      <p class="modal-subtitle">Post selecionado:</p>
      <p class="modal-highlight">${escapeHtml(post.title)}</p>

      <p class="modal-subtitle" style="margin-top:var(--space-lg)">Escolha o estilo visual:</p>
      <div class="style-selector style-selector-carousel">
        ${renderStyleCards(CarouselStyles, ['🖤', '✨', '📊', '📓'], 1)}
      </div>

      <div class="expand-prompt" style="margin-top:var(--space-lg)">
        <label>${Icons.terminal} Prompt gerado</label>
        <pre class="prompt-block" id="carousel-prompt">${escapeHtml(Prompts.carrossel(post, 1))}</pre>
        <button class="btn-primary" id="copy-carousel-prompt">
          ${Icons.copy} Copiar Prompt
        </button>
      </div>
    </div>
  `);

  document.querySelector('.modal-close')?.addEventListener('click', closeModal);

  document.querySelectorAll('.style-selector-carousel .style-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.style-selector-carousel .style-card').forEach(c => c.classList.remove('style-card-selected'));
      card.classList.add('style-card-selected');
      selectedStyle = parseInt(card.dataset.style);
      document.getElementById('carousel-prompt').textContent = Prompts.carrossel(post, selectedStyle);
    });
  });

  document.getElementById('copy-carousel-prompt')?.addEventListener('click', () => {
    copyToClipboard(document.getElementById('carousel-prompt').textContent);
  });
}

function openCoverModal(postId) {
  const post = DataStore.getPostById(postId);
  if (!post) return;
  let selectedStyle = 1;

  openModal(`
    <div class="modal-header">
      <h2>${Icons.image} Gerar Capa</h2>
      <button class="btn-icon modal-close" aria-label="Fechar">${Icons.x}</button>
    </div>
    <div class="modal-body">
      <p class="modal-subtitle">Post selecionado:</p>
      <p class="modal-highlight">${escapeHtml(post.title)}</p>

      <p class="modal-subtitle" style="margin-top:var(--space-lg)">Escolha o estilo visual:</p>
      <div class="style-selector style-selector-cover">
        ${renderStyleCards(CoverStyles, ['✏️', '👤', '📊', '🖼️', '⚡'], 1)}
      </div>

      <div class="expand-prompt" style="margin-top:var(--space-lg)">
        <label>${Icons.terminal} Prompt gerado</label>
        <pre class="prompt-block" id="cover-prompt">${escapeHtml(Prompts.capa(post, 1))}</pre>
        <button class="btn-primary" id="copy-cover-prompt">
          ${Icons.copy} Copiar Prompt
        </button>
      </div>
    </div>
  `);

  document.querySelector('.modal-close')?.addEventListener('click', closeModal);

  document.querySelectorAll('.style-selector-cover .style-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.style-selector-cover .style-card').forEach(c => c.classList.remove('style-card-selected'));
      card.classList.add('style-card-selected');
      selectedStyle = parseInt(card.dataset.style);
      document.getElementById('cover-prompt').textContent = Prompts.capa(post, selectedStyle);
    });
  });

  document.getElementById('copy-cover-prompt')?.addEventListener('click', () => {
    copyToClipboard(document.getElementById('cover-prompt').textContent);
  });
}

function openDeleteModal(postId) {
  const post = DataStore.getPostById(postId);
  if (!post) return;
  openModal(`
    <div class="modal-header">
      <h2>${Icons.alertCircle} Excluir Post</h2>
      <button class="btn-icon modal-close" aria-label="Fechar">${Icons.x}</button>
    </div>
    <div class="modal-body">
      <p>Tem certeza que deseja excluir?</p>
      <p class="modal-highlight">${escapeHtml(post.title)}</p>
      <p class="modal-warning">${Icons.alertTriangle} Essa ação não pode ser desfeita.</p>
    </div>
    <div class="modal-footer">
      <button class="btn-ghost btn-sm modal-close">Cancelar</button>
      <button class="btn-danger btn-sm" id="confirm-delete">${Icons.trash} Excluir</button>
    </div>
  `);
  document.querySelectorAll('.modal-close').forEach(b => b.addEventListener('click', closeModal));
  document.getElementById('confirm-delete')?.addEventListener('click', async () => {
    await DataStore.deletePost(postId);
    closeModal();
    showToast('Post excluído', 'warning');
    renderLibrary();
  });
}

function openAddPostModal() {
  openModal(`
    <div class="modal-header">
      <h2>${Icons.plus} Novo Post</h2>
      <button class="btn-icon modal-close" aria-label="Fechar">${Icons.x}</button>
    </div>
    <div class="modal-body">
      <form id="add-post-form" class="form-grid">
        <div class="form-group">
          <label for="post-title">Título *</label>
          <input type="text" id="post-title" class="input-field" required placeholder="Título do post" />
        </div>
        <div class="form-group">
          <label for="post-theme">Tema *</label>
          <input type="text" id="post-theme" class="input-field" required placeholder="Tema central" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="post-fonte-tese">Fonte de Tese</label>
            <select id="post-fonte-tese" class="filter-select">
              <option value="">Nenhuma</option>
              <option value="skills_producao">Skills em Produção</option>
              <option value="benchmark_real">Benchmark Real</option>
              <option value="process_diagnostic">Process Diagnostic</option>
              <option value="falha_documentada">Falha Documentada</option>
            </select>
          </div>
          <div class="form-group">
            <label for="post-status">Status</label>
            <select id="post-status" class="filter-select">
              <option value="rascunho">Rascunho</option>
              <option value="agendado">Agendado</option>
              <option value="publicado">Publicado</option>
            </select>
          </div>
          <div class="form-group">
            <label for="post-urgency">Urgência</label>
            <select id="post-urgency" class="filter-select">
              <option value="relevante">Relevante</option>
              <option value="urgente">Urgente</option>
              <option value="pode_esperar">Pode esperar</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label for="post-hook">Hook *</label>
          <textarea id="post-hook" class="input-field textarea-field" rows="2" required placeholder="Máximo 210 caracteres"></textarea>
        </div>
        <div class="form-group">
          <label for="post-body">Corpo do Post *</label>
          <textarea id="post-body" class="input-field textarea-field" rows="6" required placeholder="Texto completo do post"></textarea>
        </div>
        <div class="form-group">
          <label for="post-cta">CTA</label>
          <input type="text" id="post-cta" class="input-field" placeholder="Call to action" />
        </div>
        <div class="form-group">
          <label for="post-hashtags">Hashtags (separar por vírgula)</label>
          <input type="text" id="post-hashtags" class="input-field" placeholder="#VendasB2B, #IA" />
        </div>
        <div class="form-group">
          <label for="post-score">Score de Revisão (0-100)</label>
          <input type="number" id="post-score" class="input-field" min="0" max="100" placeholder="87" />
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button class="btn-ghost btn-sm modal-close">Cancelar</button>
      <button class="btn-primary btn-sm" id="save-post-btn">${Icons.check} Salvar Post</button>
    </div>
  `);

  document.querySelectorAll('.modal-close').forEach(b => b.addEventListener('click', closeModal));

  document.getElementById('save-post-btn')?.addEventListener('click', async () => {
    const title = document.getElementById('post-title').value.trim();
    const theme = document.getElementById('post-theme').value.trim();
    const hookText = document.getElementById('post-hook').value.trim();
    const body = document.getElementById('post-body').value.trim();

    if (!title || !theme || !hookText || !body) {
      showToast('Preencha os campos obrigatórios', 'warning');
      return;
    }

    const hashtags = (document.getElementById('post-hashtags').value || '')
      .split(',').map(h => h.trim()).filter(Boolean);

    await DataStore.addPost({
      title,
      theme,
      fonteTese: document.getElementById('post-fonte-tese').value || null,
      hookText,
      body,
      cta: document.getElementById('post-cta').value.trim(),
      hashtags,
      reviewScore: parseInt(document.getElementById('post-score').value) || null,
      status: document.getElementById('post-status').value,
      urgency: document.getElementById('post-urgency').value,
    });

    closeModal();
    showToast('Post salvo!', 'success');
    renderLibrary();
  });
}

