// settings.js — Full-Width Settings Page Module
import { renderAssets } from './assets.js';
import { CONFIG } from './config.js';

// ─── STATE ───
let activeSection = 'photos';
let previousRoute = '#dashboard';

// ─── SECTIONS CONFIG ───
const SECTIONS = [
  {
    id: 'photos',
    icon: '📸',
    label: 'Banco de Imagens',
    enabled: true,
    title: 'Banco de Imagens',
    desc: 'Gerencie fotos de referência para composição visual das capas e carrosséis'
  },
  {
    id: 'profile',
    icon: '👤',
    label: 'Perfil LinkedIn',
    enabled: true,
    title: 'Perfil LinkedIn',
    desc: 'Configure seu perfil e preferências de conteúdo no LinkedIn',
    features: [
      { icon: '🎯', text: 'Tom de voz e pilares de conteúdo' },
      { icon: '📊', text: 'Metas de publicação semanal' },
      { icon: '🏷️', text: 'Hashtags e palavras-chave favoritas' },
      { icon: '👥', text: 'Público-alvo e persona' }
    ]
  },
  {
    id: 'cover-styles',
    icon: '🎨',
    label: 'Estilos de Capa',
    enabled: false,
    title: 'Estilos de Capa',
    desc: 'Personalize os templates visuais para capas de posts',
    features: [
      { icon: '🖼️', text: 'Paletas de cores por pilar' },
      { icon: '✏️', text: 'Tipografia e tamanhos' },
      { icon: '📐', text: 'Layouts e composições' },
      { icon: '🌓', text: 'Variantes light / dark' }
    ]
  },
  {
    id: 'carousel-styles',
    icon: '🎠',
    label: 'Estilos de Carrossel',
    enabled: false,
    title: 'Estilos de Carrossel',
    desc: 'Defina padrões visuais para carrosséis do LinkedIn',
    features: [
      { icon: '📄', text: 'Templates de slide por tipo' },
      { icon: '🎨', text: 'Cores e gradientes padrão' },
      { icon: '🔢', text: 'Numeração e indicadores' },
      { icon: '📏', text: 'Margens e espaçamentos' }
    ]
  },
  {
    id: 'connection',
    icon: '🔗',
    label: 'Conexão Supabase',
    enabled: false,
    title: 'Conexão Supabase',
    desc: 'Configure a conexão com o banco de dados e storage',
    features: [
      { icon: '🔑', text: 'URL e chave anônima' },
      { icon: '🗄️', text: 'Status das tabelas' },
      { icon: '📦', text: 'Uso do Storage' },
      { icon: '🔒', text: 'Políticas de segurança (RLS)' }
    ]
  },
  {
    id: 'prompts',
    icon: '📝',
    label: 'Templates de Prompt',
    enabled: false,
    title: 'Templates de Prompt',
    desc: 'Gerencie os prompts usados pelos agentes de IA na criação de conteúdo',
    features: [
      { icon: '🤖', text: 'Prompt do Redator' },
      { icon: '🎨', text: 'Prompt do Designer de Capas' },
      { icon: '📊', text: 'Prompt do Analista' },
      { icon: '✍️', text: 'Prompt do Revisor' }
    ]
  }
];

// ─── SET PREVIOUS ROUTE ───
export function setPreviousRoute(route) {
  if (route !== '#settings') {
    previousRoute = route;
  }
}

// ─── MAIN RENDER ───
export function renderSettings() {
  const main = document.getElementById('main-content');
  if (!main) return;

  main.innerHTML = `
    <div class="settings-page">
      <aside class="settings-sidebar">
        <button class="settings-back" id="settings-back">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          Voltar
        </button>
        <h2 class="settings-sidebar-title">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          Configurações
        </h2>
        <nav class="settings-menu" id="settings-menu">
          ${SECTIONS.map(s => `
            <button class="settings-menu-item ${s.id === activeSection ? 'settings-menu-active' : ''} ${!s.enabled ? 'settings-menu-disabled' : ''}"
                    data-section="${s.id}" ${!s.enabled && s.id !== activeSection ? '' : ''}>
              <span class="settings-menu-icon">${s.icon}</span>
              <span class="settings-menu-label">${s.label}</span>
              ${!s.enabled ? '<span class="settings-menu-badge">Em breve</span>' : ''}
            </button>
          `).join('')}
        </nav>
        <div class="settings-sidebar-footer">
          <p>Thiago Marketing OS v1.0</p>
        </div>
      </aside>
      <div class="settings-content" id="settings-content-area">
        <!-- Section content loaded here -->
      </div>
    </div>
  `;

  // ─── BACK BUTTON ───
  document.getElementById('settings-back')?.addEventListener('click', () => {
    window.location.hash = previousRoute;
  });

  // ─── MENU CLICK HANDLERS ───
  document.querySelectorAll('#settings-menu .settings-menu-item').forEach(item => {
    item.addEventListener('click', () => {
      const sectionId = item.dataset.section;
      const section = SECTIONS.find(s => s.id === sectionId);
      if (!section) return;

      // Update active state
      activeSection = sectionId;
      document.querySelectorAll('#settings-menu .settings-menu-item').forEach(i => {
        i.classList.remove('settings-menu-active');
      });
      item.classList.add('settings-menu-active');

      // Load section content
      loadSection(section);
    });
  });

  // ─── LOAD INITIAL SECTION ───
  const initialSection = SECTIONS.find(s => s.id === activeSection);
  if (initialSection) loadSection(initialSection);

  // Update settings trigger active state
  const trigger = document.querySelector('.settings-trigger');
  if (trigger) trigger.classList.add('nav-active');
}

// ─── LOAD SECTION CONTENT ───
async function loadSection(section) {
  const contentArea = document.getElementById('settings-content-area');
  if (!contentArea) return;

  if (section.enabled) {
    // Load real module
    switch (section.id) {
      case 'photos':
        contentArea.innerHTML = `
          <div class="settings-section-enter">
            <div class="settings-section-header">
              <h1 class="settings-section-title">${section.title}</h1>
              <p class="settings-section-desc">${section.desc}</p>
            </div>
            <div id="assets-mount-point"></div>
          </div>
        `;
        try {
          await renderAssets();
        } catch (err) {
          console.error('[Settings] Failed to load assets:', err);
          document.getElementById('assets-mount-point').innerHTML =
            `<div class="gallery-empty"><p>Erro ao carregar</p><span>${err.message}</span></div>`;
        }
        break;
      case 'profile':
        renderLinkedInProfile(contentArea, section);
        break;
      default:
        renderPlaceholder(contentArea, section);
    }
  } else {
    renderPlaceholder(contentArea, section);
  }
}

// ─── RENDER PLACEHOLDER ───
function renderPlaceholder(container, section) {
  const featuresHTML = section.features ? `
    <div class="settings-placeholder-features">
      ${section.features.map(f => `
        <div class="settings-placeholder-feature">
          <span class="settings-placeholder-feature-icon">${f.icon}</span>
          <span>${f.text}</span>
        </div>
      `).join('')}
    </div>
  ` : '';

  container.innerHTML = `
    <div class="settings-placeholder">
      <div class="settings-placeholder-icon">${section.icon}</div>
      <h3>${section.title}</h3>
      <p>${section.desc}</p>
      <span class="settings-placeholder-badge">
        🚧 Em desenvolvimento
      </span>
      ${featuresHTML}
    </div>
  `;
}

// ─── LINKEDIN PROFILE SECTION ───
const SUPABASE_FUNCTIONS_URL = `${CONFIG.SUPABASE_URL}/functions/v1`;

async function getLinkedInStatus() {
  try {
    const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/linkedin-status`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function renderLinkedInProfile(container, section) {
  container.innerHTML = `
    <div class="settings-section-enter">
      <div class="settings-section-header">
        <h1 class="settings-section-title">${section.title}</h1>
        <p class="settings-section-desc">${section.desc}</p>
      </div>
      <div id="linkedin-profile-mount">
        <div class="linkedin-profile-loading">
          <div class="gallery-spinner"></div>
          <span>Verificando conexão...</span>
        </div>
      </div>
    </div>
  `;

  const mount = document.getElementById('linkedin-profile-mount');
  const status = await getLinkedInStatus();

  if (status && status.connected) {
    renderConnectedState(mount, status);
  } else {
    renderDisconnectedState(mount);
  }
}

function renderDisconnectedState(mount) {
  mount.innerHTML = `
    <div class="linkedin-connect-card">
      <div class="linkedin-connect-icon">
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <rect x="2" y="9" width="4" height="12" rx="0.5" stroke="currentColor" stroke-width="1.5"/>
          <circle cx="4" cy="4" r="2" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      </div>
      <h3>Conectar ao LinkedIn</h3>
      <p>Vincule sua conta para publicar posts, agendar conteúdo e acompanhar métricas diretamente do Thiago Marketing OS.</p>
      <button class="linkedin-connect-btn" id="btn-linkedin-connect">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/>
          <rect x="2" y="9" width="4" height="12" rx="0.5"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
        Conectar com LinkedIn
      </button>
      <span class="linkedin-connect-hint">Você será redirecionado ao LinkedIn para autorizar o acesso</span>
    </div>

    <div class="settings-placeholder-features" style="margin-top: var(--space-2xl);">
      ${[
        { icon: '🎯', text: 'Tom de voz e pilares de conteúdo' },
        { icon: '📊', text: 'Metas de publicação semanal' },
        { icon: '🏷️', text: 'Hashtags e palavras-chave favoritas' },
        { icon: '👥', text: 'Público-alvo e persona' }
      ].map(f => `
        <div class="settings-placeholder-feature">
          <span class="settings-placeholder-feature-icon">${f.icon}</span>
          <span>${f.text}</span>
        </div>
      `).join('')}
    </div>
  `;

  document.getElementById('btn-linkedin-connect')?.addEventListener('click', () => {
    window.location.href = `${SUPABASE_FUNCTIONS_URL}/linkedin-auth`;
  });
}

function renderConnectedState(mount, status) {
  const expiresAt = new Date(status.expires_at);
  const now = new Date();
  const daysLeft = Math.max(0, Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24)));
  const isExpiring = daysLeft <= 7;

  mount.innerHTML = `
    <div class="linkedin-profile-card">
      <div class="linkedin-profile-header">
        <img class="linkedin-profile-avatar"
             src="${status.profile_picture_url || ''}"
             alt="${status.display_name || 'LinkedIn'}"
             onerror="this.style.display='none'" />
        <div class="linkedin-profile-info">
          <h3>${status.display_name || 'Perfil LinkedIn'}</h3>
          <span class="linkedin-profile-status linkedin-profile-status--connected">
            <span class="linkedin-status-dot"></span>
            Conectado
          </span>
        </div>
        <button class="btn-sm btn-outline-danger" id="btn-linkedin-disconnect" title="Desconectar">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
          Desconectar
        </button>
      </div>

      <div class="linkedin-profile-meta">
        <div class="linkedin-meta-item">
          <span class="linkedin-meta-label">Token expira em</span>
          <span class="linkedin-meta-value ${isExpiring ? 'linkedin-meta-warning' : ''}">
            ${daysLeft} dia${daysLeft !== 1 ? 's' : ''}
            ${isExpiring ? '⚠️' : '✅'}
          </span>
        </div>
        <div class="linkedin-meta-item">
          <span class="linkedin-meta-label">Person URN</span>
          <span class="linkedin-meta-value linkedin-meta-urn">${status.person_urn || '—'}</span>
        </div>
      </div>
    </div>

    <div class="settings-placeholder-features" style="margin-top: var(--space-2xl);">
      ${[
        { icon: '🎯', text: 'Tom de voz e pilares de conteúdo' },
        { icon: '📊', text: 'Metas de publicação semanal' },
        { icon: '🏷️', text: 'Hashtags e palavras-chave favoritas' },
        { icon: '👥', text: 'Público-alvo e persona' }
      ].map(f => `
        <div class="settings-placeholder-feature">
          <span class="settings-placeholder-feature-icon">${f.icon}</span>
          <span>${f.text}</span>
        </div>
      `).join('')}
    </div>
  `;

  document.getElementById('btn-linkedin-disconnect')?.addEventListener('click', async () => {
    if (!confirm('Tem certeza que deseja desconectar sua conta LinkedIn?')) return;
    try {
      await fetch(`${SUPABASE_FUNCTIONS_URL}/linkedin-disconnect`, { method: 'POST' });
      renderDisconnectedState(mount);
    } catch (err) {
      console.error('[Settings] Disconnect failed:', err);
    }
  });
}

// ─── CLEANUP (when leaving settings) ───
export function cleanupSettings() {
  const trigger = document.querySelector('.settings-trigger');
  if (trigger) trigger.classList.remove('nav-active');
}
