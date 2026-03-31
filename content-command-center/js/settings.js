// settings.js — Full-Width Settings Page Module
import { renderAssets } from './assets.js';

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
    enabled: false,
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

// ─── CLEANUP (when leaving settings) ───
export function cleanupSettings() {
  const trigger = document.querySelector('.settings-trigger');
  if (trigger) trigger.classList.remove('nav-active');
}
