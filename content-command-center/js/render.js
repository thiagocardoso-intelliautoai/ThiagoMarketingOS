// render.js — DOM Rendering Engine v2.0 (Lucide Icons Edition)
import { DataStore } from './data.js';
import { MODE_LABELS } from './state.js';
import { Prompts } from './prompts.js';
import { renderLinkedInPreview, attachLinkedInPreviewEvents } from './linkedin-preview.js';

// ─── SVG ICON LIBRARY (Lucide-style) ───
const Icons = {
  // Navigation & Actions
  copy: '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  check: '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>',
  x: '<svg viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  arrowLeft: '<svg viewBox="0 0 24 24"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>',

  // Content
  eye: '<svg viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
  layers: '<svg viewBox="0 0 24 24"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',
  image: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
  trash: '<svg viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>',
  download: '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  upload: '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
  inbox: '<svg viewBox="0 0 24 24"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',

  // Status & Meta
  calendar: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  barChart: '<svg viewBox="0 0 24 24"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
  alertCircle: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  construction: '<svg viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/><path d="M10 14 2.3 6.3"/><path d="m14 6 7.7 7.7"/><path d="m8 6 8 8"/></svg>',

  // Toasts
  checkCircle: '<svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  alertTriangle: '<svg viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  xCircle: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',

  // Prompt
  terminal: '<svg viewBox="0 0 24 24"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
  clipboard: '<svg viewBox="0 0 24 24"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>',
  lightbulb: '<svg viewBox="0 0 24 24"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>',
};

// ─── PILLAR CONFIG ───
const PILLAR_CONFIG = {
  A: { label: 'Alcance', cssClass: 'badge-autoridade' },
  C: { label: 'Credibilidade', cssClass: 'badge-conexao' },
  R: { label: 'Retorno', cssClass: 'badge-resultado' },
  E: { label: 'Engajamento', cssClass: 'badge-engajamento' },
};

const STATUS_LABELS = {
  armazem: 'Armazém',
  em_producao: 'Em produção',
  aprovado: 'Aprovado',
  publicado: 'Publicado',
};

const URGENCY_LABELS = {
  urgente: 'Urgente',
  relevante: 'Relevante',
  pode_esperar: 'Pode esperar',
};

// ─── TOAST SYSTEM ───
export function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icons = {
    success: Icons.checkCircle,
    warning: Icons.alertTriangle,
    error: Icons.xCircle,
  };
  toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.success}</span><span>${message}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('toast-show'));
  setTimeout(() => {
    toast.classList.remove('toast-show');
    toast.classList.add('toast-hide');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ─── COPY TO CLIPBOARD ───
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Prompt copiado!', 'success');
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Prompt copiado!', 'success');
  }
}

// ─── CROSS-ORIGIN DOWNLOAD (SUPABASE-005, Task 5.4) ───
async function downloadFile(url, filename) {
  try {
    showToast('Preparando download...', 'success');
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
    showToast(`"${filename}" baixado!`, 'success');
  } catch (err) {
    console.error('Download failed:', err);
    showToast('Erro ao baixar arquivo', 'error');
  }
}

// ─── MODAL SYSTEM ───
function openModal(contentHtml) {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');
  content.innerHTML = contentHtml;
  overlay.classList.add('modal-open');
  document.body.style.overflow = 'hidden';
  const focusable = content.querySelectorAll('button, input, textarea, select, [tabindex]');
  if (focusable.length) focusable[0].focus();
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('modal-open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

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

// ─── HELPERS ───
function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function truncate(str, len) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '…' : str;
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
