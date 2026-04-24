// app.js — Entry Point & Hash Router (Etapa 3: +pautas, +estrategia)
import { DataStore } from './data.js';
import { renderDashboard, renderLibrary } from './render.js';
import { renderSettings, setPreviousRoute, cleanupSettings } from './settings.js';
import { renderPautas } from './pautas.js';
import { renderEstrategia } from './estrategia.js';

// ─── ROUTE HISTORY ───
let lastNonSettingsRoute = '#dashboard';

// ─── ROUTER ───
async function route() {
  const hash = window.location.hash || '#dashboard';
  
  // Fallback: old #ativos bookmark → redirect to settings
  if (hash === '#ativos') {
    window.location.hash = '#settings';
    return;
  }

  // Track previous route for back button
  if (hash !== '#settings') {
    lastNonSettingsRoute = hash;
    setPreviousRoute(hash);
  }

  // Cleanup settings state when leaving
  if (hash !== '#settings') {
    cleanupSettings();
  }

  // Update nav active state (nav links only, not settings trigger)
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('nav-active', l.getAttribute('href') === hash);
  });

  // Update settings trigger active state
  const settingsTrigger = document.getElementById('settings-trigger');
  if (settingsTrigger) {
    settingsTrigger.classList.toggle('nav-active', hash === '#settings');
  }

  switch (hash) {
    case '#settings':
      renderSettings();
      break;
    case '#pautas':
      renderPautas();
      break;
    case '#estrategia':
      renderEstrategia();
      break;
    case '#conteudos':
      renderLibrary();
      break;
    case '#dashboard':
    default:
      renderDashboard();
      break;
  }
}

// ─── SETTINGS TRIGGER ───
const settingsTrigger = document.getElementById('settings-trigger');
settingsTrigger?.addEventListener('click', (e) => {
  e.preventDefault();
  window.location.hash = '#settings';
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
