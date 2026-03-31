// render.js — DOM Rendering Engine v2.0 (Lucide Icons Edition)
import { DataStore } from './data.js';
import { MODE_LABELS, PILLAR_CONFIG, STATUS_LABELS, URGENCY_LABELS } from './state.js';
import { Prompts } from './prompts.js';
import { renderLinkedInPreview, attachLinkedInPreviewEvents } from './linkedin-preview.js';
import { Icons } from './icons.js';
import { showToast } from './toast.js';
import { openModal, closeModal } from './modal.js';
import { copyToClipboard, downloadFile, escapeHtml, truncate, formatDate } from './utils.js';

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
      ${[1, 2, 3, 4, 5].map(m => renderModeCard(m)).join('')}
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
  if (mode === 5) {
    extraInput = `
      <div class="expand-field">
        <label for="plan-direction">${Icons.calendar} Direção temática do mês</label>
        <textarea id="plan-direction" class="input-field textarea-field" rows="3" placeholder='Ex: "Foco em automação de prospecção com IA" ou "Mês de autoridade em gestão de pipeline"'></textarea>
      </div>
      <div class="expand-info">
        <span class="expand-info-badge">${Icons.layers} 12 posts</span>
        <span class="expand-info-badge">${Icons.calendar} 4 semanas</span>
        <span class="expand-info-badge">${Icons.barChart} DTC + ACRE</span>
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
  if (mode === 5) {
    document.getElementById('plan-direction').addEventListener('input', (e) => {
      document.getElementById('prompt-output').textContent = Prompts.planejamentoMensal(e.target.value);
    });
  }

  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function generatePromptForMode(mode) {
  switch (mode) {
    case 1: return Prompts.pesquisaSemanal();
    case 2: return Prompts.benchmark();
    case 3: return Prompts.briefing('');
    case 4: return Prompts.postDireto('');
    case 5: return Prompts.planejamentoMensal('');
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
          <select id="filter-pillar" class="filter-select" aria-label="Filtrar por pilar">
            <option value="">Todos os Pilares</option>
            <option value="A">Alcance (A)</option>
            <option value="C">Credibilidade (C)</option>
            <option value="R">Retorno (R)</option>
            <option value="E">Engajamento (E)</option>
          </select>
          <select id="filter-status" class="filter-select" aria-label="Filtrar por status">
            <option value="">Todos os Status</option>
            <option value="armazem">Armazém</option>
            <option value="em_producao">Em produção</option>
            <option value="aprovado">Aprovado</option>
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
  const pillarInfo = PILLAR_CONFIG[post.pillar] || PILLAR_CONFIG.A;

  // SUPABASE-005, Task 5.5: Colored media badges based on real data
  const hasCoverUrl = !!(post.covers?.image_url);
  const hasCarouselUrl = !!(post.carousels?.pdf_url);
  const hasCoverDeriv = !!(post.contentType === 'cover' || post.derivations?.cover);
  const hasCarouselDeriv = !!(post.contentType === 'carousel' || post.derivations?.carousel);

  // Clickable asset badges — only render if asset exists
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

  // Thumbnail from Supabase cover image
  const thumbUrl = post.covers?.image_url || post.derivations?.cover?.coverPath || null;
  const thumbHtml = thumbUrl
    ? `<img src="${thumbUrl}" alt="" class="post-card-thumb" loading="lazy" onerror="this.remove()" />`
    : '';

  // Asset footer — only render if at least one asset exists
  const hasAnyAsset = carouselBadge || coverBadge;
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
    <div class="post-card" data-id="${post.id}">
      ${thumbHtml}
      <div class="post-card-header">
        <h3 class="post-card-title">${escapeHtml(post.title)}</h3>
      </div>
      <div class="post-card-meta">
        <span class="badge ${pillarInfo.cssClass}">
          ${pillarInfo.label}
        </span>
        ${post.reviewScore ? `<span class="meta-item">${Icons.barChart} ${post.reviewScore}%</span>` : ''}
        <span class="badge badge-status">${URGENCY_LABELS[post.urgency] || post.urgency}</span>
      </div>
      <div class="post-card-info">
        <span class="meta-item">${Icons.calendar} ${formatDate(post.createdAt)}</span>
        <span class="meta-item">${STATUS_LABELS[post.status] || post.status}</span>
      </div>
      <div class="post-card-hook">
        <p>${truncate(post.hookText, 120)}</p>
      </div>
      ${footerHtml}
    </div>
  `;
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
  ['filter-pillar', 'filter-status', 'filter-urgency', 'filter-content-type'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', applyFilters);
  });
  document.getElementById('search-posts')?.addEventListener('input', applyFilters);

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
  const pillar = document.getElementById('filter-pillar')?.value || '';
  const status = document.getElementById('filter-status')?.value || '';
  const urgency = document.getElementById('filter-urgency')?.value || '';
  const contentType = document.getElementById('filter-content-type')?.value || '';
  const search = document.getElementById('search-posts')?.value || '';
  const posts = DataStore.filterPosts({ pillar, status, urgency, contentType, search });
  const list = document.getElementById('posts-list');
  list.innerHTML = posts.length > 0 ? posts.map(p => renderPostCard(p)).join('') : renderEmptyState();
}

// ─── MODALS ───

function openViewPostModal(postId) {
  const post = DataStore.getPostById(postId);
  if (!post) return;
  const pillarInfo = PILLAR_CONFIG[post.pillar] || PILLAR_CONFIG.A;
  const hasCarouselData = post.contentType === 'carousel' || post.derivations?.carousel;

  // Generate LinkedIn preview HTML
  const linkedinPreviewHtml = renderLinkedInPreview(post);

  // Generate "Dados do Post" tab content (original view)
  const carouselInfo = hasCarouselData
    ? `<div class="view-post-carousel-info">
        <h4>${Icons.layers} Carrossel Gerado</h4>
        <div class="carousel-info-grid">
          <span class="meta-item">Estilo: <strong>${post.visualStyle || post.derivations?.carousel?.style || 'twitter-style'}</strong></span>
          <span class="meta-item">Slides: <strong>${post.slideCount || post.derivations?.carousel?.slidesCount || '—'}</strong></span>
          <span class="meta-item">PDF: <strong>${post.pdfPath || post.derivations?.carousel?.pdfPath || 'N/A'}</strong></span>
        </div>
      </div>`
    : '';

  const dataTabHtml = `
    <div class="view-post-meta-grid">
      <div class="meta-grid-item">
        <span class="badge ${pillarInfo.cssClass}">${pillarInfo.label}</span>
      </div>
      <div class="meta-grid-item">
        ${Icons.calendar} <strong>${formatDate(post.createdAt)}</strong>
      </div>
      ${post.framework ? `<div class="meta-grid-item">${Icons.clipboard} Framework: <strong>${post.framework}</strong></div>` : '<div class="meta-grid-item"></div>'}
      ${post.hookStructure ? `<div class="meta-grid-item">${Icons.lightbulb} Hook: <strong>${post.hookStructure}</strong></div>` : '<div class="meta-grid-item"></div>'}
      ${post.reviewScore ? `
        <div class="score-bar-container">
          <div class="score-bar-track">
            <div class="score-bar-fill" style="width: ${post.reviewScore}%"></div>
          </div>
          <span class="score-bar-label">${post.reviewScore}%</span>
        </div>
      ` : ''}
    </div>
    ${carouselInfo}
    <div class="view-post-content">
      <pre class="post-text">${escapeHtml(post.body || post.hookText)}</pre>
    </div>
    ${post.cta ? `<div class="view-post-cta"><strong>CTA:</strong> ${escapeHtml(post.cta)}</div>` : ''}
    ${post.hashtags?.length ? `<div class="view-post-hashtags">${post.hashtags.join(' ')}</div>` : ''}
  `;

  openModal(`
    <div class="modal-header">
      <h2>${Icons.eye} Ver Post</h2>
      <div class="preview-tabs">
        <button class="preview-tab preview-tab-active" data-tab="linkedin" id="tab-btn-linkedin">Preview LinkedIn</button>
        <button class="preview-tab" data-tab="data" id="tab-btn-data">Dados do Post</button>
      </div>
      <button class="btn-icon modal-close" aria-label="Fechar">${Icons.x}</button>
    </div>
    <div class="modal-body">
      <div class="preview-tab-content" id="tab-linkedin">
        ${linkedinPreviewHtml}
      </div>
      <div class="preview-tab-content" id="tab-data" style="display:none">
        ${dataTabHtml}
      </div>
    </div>
    <div class="modal-footer">
      <div class="modal-footer-left">
        <button class="btn-outline-primary btn-sm" id="modal-copy-post">${Icons.copy} Copiar Post</button>
      </div>
      <div class="modal-footer-right">
        ${post.covers?.image_url
          ? `<button class="btn-download btn-sm" id="modal-download-cover" data-url="${post.covers.image_url}" data-filename="capa-${(post.title || 'post').replace(/[^a-zA-Z0-9]/g, '-').slice(0, 40)}.png">${Icons.download} Baixar Capa</button>`
          : `<button class="btn-ghost btn-sm" id="modal-gen-cover">${Icons.image} Gerar Capa</button>`
        }
        ${post.carousels?.pdf_url
          ? `<button class="btn-download btn-sm" id="modal-download-pdf" data-url="${post.carousels.pdf_url}" data-filename="carrossel-${(post.title || 'post').replace(/[^a-zA-Z0-9]/g, '-').slice(0, 40)}.pdf">${Icons.download} Baixar PDF</button>`
          : `<button class="btn-primary btn-sm" id="modal-gen-carousel" data-id="${post.id}">${Icons.layers} Gerar Carrossel</button>`
        }
      </div>
    </div>
  `);

  // Tab switching with micro-fade animation (Design Expert enhancement)
  const switchTab = (showId, hideId, activeBtn, inactiveBtn) => {
    const showEl = document.getElementById(showId);
    const hideEl = document.getElementById(hideId);
    hideEl.style.display = 'none';
    showEl.style.display = '';
    // Re-trigger animation by removing and re-adding
    showEl.style.animation = 'none';
    showEl.offsetHeight; // force reflow
    showEl.style.animation = '';
    activeBtn.classList.add('preview-tab-active');
    inactiveBtn.classList.remove('preview-tab-active');
  };

  const tabLi = document.getElementById('tab-btn-linkedin');
  const tabData = document.getElementById('tab-btn-data');
  tabLi?.addEventListener('click', () => switchTab('tab-linkedin', 'tab-data', tabLi, tabData));
  tabData?.addEventListener('click', () => switchTab('tab-data', 'tab-linkedin', tabData, tabLi));

  // LinkedIn preview events (expand/collapse text)
  attachLinkedInPreviewEvents();

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
        <div class="style-card style-card-selected" data-style="1" tabindex="0" role="button">
          <div class="style-card-icon">🖤</div>
          <h4>Twitter Style</h4>
          <p>Fundo preto, print de autoridade</p>
        </div>
        <div class="style-card" data-style="2" tabindex="0" role="button">
          <div class="style-card-icon">✨</div>
          <h4>Editorial Clean</h4>
          <p>Fundo claro, tipografia bold, premium</p>
        </div>
        <div class="style-card" data-style="3" tabindex="0" role="button">
          <div class="style-card-icon">📊</div>
          <h4>Data-Driven</h4>
          <p>Fundo navy, números gigantes, dados</p>
        </div>
        <div class="style-card" data-style="4" tabindex="0" role="button">
          <div class="style-card-icon">📓</div>
          <h4>Notebook Raw</h4>
          <p>Papel craft, escrita manual, anti-AI</p>
        </div>
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
        <div class="style-card style-card-selected" data-style="1" tabindex="0" role="button">
          <div class="style-card-icon">✏️</div>
          <h4>Rascunho no Papel</h4>
          <p>Infográfico à lápis sobre foto real de caderno</p>
        </div>
        <div class="style-card" data-style="2" tabindex="0" role="button">
          <div class="style-card-icon">👤</div>
          <h4>Pessoa + Texto</h4>
          <p>Foto real com overlay de texto protegido</p>
        </div>
        <div class="style-card" data-style="3" tabindex="0" role="button">
          <div class="style-card-icon">📊</div>
          <h4>Micro-Infográfico</h4>
          <p>Um dado/métrica hero visualizado</p>
        </div>
        <div class="style-card" data-style="4" tabindex="0" role="button">
          <div class="style-card-icon">🖼️</div>
          <h4>Print de Autoridade</h4>
          <p>Screenshot + opinião do Thiago</p>
        </div>
        <div class="style-card" data-style="5" tabindex="0" role="button">
          <div class="style-card-icon">⚡</div>
          <h4>Quote Card</h4>
          <p>Citação editorial premium</p>
        </div>
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
            <label for="post-pillar">Pilar ACRE *</label>
            <select id="post-pillar" class="filter-select" required>
              <option value="A">Alcance (A)</option>
              <option value="C">Credibilidade (C)</option>
              <option value="R">Retorno (R)</option>
              <option value="E">Engajamento (E)</option>
            </select>
          </div>
          <div class="form-group">
            <label for="post-status">Status</label>
            <select id="post-status" class="filter-select">
              <option value="armazem">Armazém</option>
              <option value="em_producao">Em produção</option>
              <option value="aprovado">Aprovado</option>
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
      pillar: document.getElementById('post-pillar').value,
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

