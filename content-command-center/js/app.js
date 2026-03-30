// app.js — Entry Point & Hash Router
import { DataStore } from './data.js';
import { renderDashboard, renderLibrary } from './render.js';

// ─── ROUTER ───
async function route() {
  const hash = window.location.hash || '#dashboard';
  
  // Fallback: old #ativos bookmark → redirect to dashboard + open settings
  if (hash === '#ativos') {
    window.location.hash = '#dashboard';
    setTimeout(() => openSettings(), 300);
    return;
  }

  // Update nav active state
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('nav-active', l.getAttribute('href') === hash);
  });

  switch (hash) {
    case '#conteudos':
      renderLibrary();
      break;
    case '#dashboard':
    default:
      renderDashboard();
      break;
  }
}

// ─── SETTINGS DRAWER CONTROLLER ───
const settingsTrigger = document.getElementById('settings-trigger');
const settingsDrawer = document.getElementById('settings-drawer');
const settingsOverlay = document.getElementById('settings-overlay');
const settingsClose = document.getElementById('settings-close');

function openSettings() {
  settingsDrawer.classList.add('settings-open');
  settingsOverlay.classList.add('settings-overlay-visible');
  document.body.style.overflow = 'hidden';
  // Lazy-load settings menu + assets module on first open
  if (!settingsDrawer.dataset.loaded) {
    loadSettingsMenu();
    settingsDrawer.dataset.loaded = 'true';
  }
}

function closeSettings() {
  settingsDrawer.classList.remove('settings-open');
  settingsOverlay.classList.remove('settings-overlay-visible');
  document.body.style.overflow = '';
}

async function loadSettingsMenu() {
  const menu = document.getElementById('settings-menu');

  const sections = [
    { id: 'photos', icon: '📸', label: 'Banco de Imagens', active: true },
    { id: 'profile', icon: '👤', label: 'Perfil LinkedIn', active: false },
    { id: 'cover-styles', icon: '🎨', label: 'Estilos de Capa', active: false },
    { id: 'carousel-styles', icon: '🎠', label: 'Estilos de Carrossel', active: false },
    { id: 'connection', icon: '🔗', label: 'Conexão Supabase', active: false },
    { id: 'prompts', icon: '📝', label: 'Templates de Prompt', active: false },
  ];

  menu.innerHTML = sections.map(s => `
    <button class="settings-menu-item ${s.active ? 'settings-menu-active' : ''} ${!s.active ? 'settings-menu-disabled' : ''}"
            data-section="${s.id}" ${!s.active ? 'disabled' : ''}>
      <span class="settings-menu-icon">${s.icon}</span>
      <span class="settings-menu-label">${s.label}</span>
      ${!s.active ? '<span class="settings-menu-badge">Em breve</span>' : ''}
    </button>
  `).join('');

  // Load Banco de Imagens (active section)
  try {
    const { renderAssets } = await import('./assets.js');
    renderAssets();
  } catch (err) {
    console.error('[Settings] Failed to load assets module:', err);
    const content = document.getElementById('settings-drawer-content');
    if (content) content.innerHTML = `<div class="gallery-empty"><p>Erro ao carregar</p><span>${err.message}</span></div>`;
  }
}

settingsTrigger?.addEventListener('click', openSettings);
settingsOverlay?.addEventListener('click', closeSettings);
settingsClose?.addEventListener('click', closeSettings);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && settingsDrawer?.classList.contains('settings-open')) {
    closeSettings();
  }
});

// ─── INIT ───
async function init() {
  await DataStore.init();

  // Update badge
  const badge = document.getElementById('library-badge');
  if (badge) badge.textContent = DataStore.getPosts().length;

  // Modal backdrop click
  document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') {
      document.getElementById('modal-overlay').classList.remove('modal-open');
      document.body.style.overflow = '';
    }
  });

  // Route
  window.addEventListener('hashchange', route);
  route();
}

// Start
init();
