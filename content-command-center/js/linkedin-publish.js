// linkedin-publish.js — Publish to LinkedIn Modal (2-screen flow)
// Design: Antigravity — Weightless glass cards, staggered entrances, smooth depth
import { DataStore } from './data.js';
import { renderLinkedInPreview, attachLinkedInPreviewEvents } from './linkedin-preview.js';
import { Icons } from './icons.js';
import { showToast } from './toast.js';
import { openModal, closeModal } from './modal.js';
import { escapeHtml, truncate, copyToClipboard } from './utils.js';
import { renderLibrary } from './render.js';
import { supabase } from './supabase.js';
import { CONFIG } from './config.js';

const SUPABASE_FUNCTIONS_URL = `${CONFIG.SUPABASE_URL}/functions/v1`;

// ─── CALENDAR HELPERS ───
const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];
const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}

export function padZero(n) {
  return n < 10 ? '0' + n : '' + n;
}

export function formatDateBR(date) {
  return `${padZero(date.getDate())}/${padZero(date.getMonth() + 1)}/${date.getFullYear()}`;
}

export function formatTimeBR(hours, minutes) {
  return `${padZero(hours)}:${padZero(minutes)}`;
}

function isToday(year, month, day) {
  const now = new Date();
  return now.getFullYear() === year && now.getMonth() === month && now.getDate() === day;
}

function isPast(year, month, day) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const check = new Date(year, month, day);
  return check < now;
}

// ─── CALENDAR RENDERER ───
export function renderCalendar(year, month, selectedDate) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const now = new Date();

  const dayHeaders = DAY_NAMES.map(d => `<span class="cal-day-name">${d}</span>`).join('');

  let daysHtml = '';
  // Empty slots before first day
  for (let i = 0; i < firstDay; i++) {
    daysHtml += '<span class="cal-day cal-day--empty"></span>';
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const past = isPast(year, month, d);
    const today = isToday(year, month, d);
    const selected = selectedDate &&
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === d;

    const classes = [
      'cal-day',
      past ? 'cal-day--past' : 'cal-day--active',
      today ? 'cal-day--today' : '',
      selected ? 'cal-day--selected' : '',
    ].filter(Boolean).join(' ');

    daysHtml += `<button class="${classes}" ${past ? 'disabled' : ''} data-day="${d}" type="button">${d}</button>`;
  }

  return `
    <div class="cal-header">
      <button class="cal-nav" id="cal-prev" type="button" aria-label="Mês anterior">
        <svg viewBox="0 0 24 24" width="16" height="16"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <span class="cal-month-year">${MONTH_NAMES[month]} ${year}</span>
      <button class="cal-nav" id="cal-next" type="button" aria-label="Próximo mês">
        <svg viewBox="0 0 24 24" width="16" height="16"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>
    <div class="cal-days-header">${dayHeaders}</div>
    <div class="cal-grid">${daysHtml}</div>
  `;
}

// ─── TIME PICKER (Custom Scroll Wheel) ───
export function renderTimePicker(hours, minutes) {
  const hourItems = Array.from({ length: 24 }, (_, i) =>
    `<div class="time-scroll-item ${i === hours ? 'time-scroll-item--selected' : ''}" data-value="${i}">${padZero(i)}</div>`
  ).join('');

  const minuteValues = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  const minuteItems = minuteValues.map(m =>
    `<div class="time-scroll-item ${m === minutes ? 'time-scroll-item--selected' : ''}" data-value="${m}">${padZero(m)}</div>`
  ).join('');

  return `
    <div class="time-picker">
      <div class="time-picker-icon">
        <svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      </div>
      <div class="time-scroll-col" id="time-scroll-hour">
        <div class="time-scroll-highlight"></div>
        <div class="time-scroll-list" data-type="hour">
          ${hourItems}
        </div>
      </div>
      <span class="time-separator">:</span>
      <div class="time-scroll-col" id="time-scroll-minute">
        <div class="time-scroll-highlight"></div>
        <div class="time-scroll-list" data-type="minute">
          ${minuteItems}
        </div>
      </div>
      <span class="time-zone-label">Brasília<br>GMT-3</span>
    </div>
  `;
}

// ─── SCHEDULE PICKER PANEL ───
export function renderSchedulePicker(selectedDate, hours, minutes) {
  const now = new Date();
  const calYear = selectedDate ? selectedDate.getFullYear() : now.getFullYear();
  const calMonth = selectedDate ? selectedDate.getMonth() : now.getMonth();

  return `
    <div class="schedule-picker" id="schedule-picker">
      <div class="schedule-picker-calendar" id="schedule-calendar-mount">
        ${renderCalendar(calYear, calMonth, selectedDate)}
      </div>
      <div class="schedule-picker-time">
        <label class="schedule-time-label">
          <svg viewBox="0 0 24 24" width="14" height="14"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          Horário
        </label>
        ${renderTimePicker(hours, minutes)}
        ${selectedDate ? `
          <div class="schedule-summary" id="schedule-summary">
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>
            <span>${formatDateBR(selectedDate)} às ${formatTimeBR(hours, minutes)}</span>
          </div>
        ` : `
          <div class="schedule-summary schedule-summary--empty" id="schedule-summary">
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>
            <span>Selecione uma data no calendário</span>
          </div>
        `}
      </div>
    </div>
  `;
}

// ─── SCROLL WHEEL (module-level, shared with schedule-management) ───
export function updateSelection(list, items, selectedVal) {
  items.forEach(item => {
    const val = parseInt(item.dataset.value, 10);
    if (val === selectedVal) {
      item.classList.add('time-scroll-item--selected');
    } else {
      item.classList.remove('time-scroll-item--selected');
    }
  });
}

export function initScrollWheel(colId, initialValue, onChange) {
  const col = document.getElementById(colId);
  if (!col) return;
  const list = col.querySelector('.time-scroll-list');
  if (!list) return;

  const items = list.querySelectorAll('.time-scroll-item');
  const itemHeight = 36;

  const selectedIdx = Array.from(items).findIndex(el => parseInt(el.dataset.value, 10) === initialValue);
  if (selectedIdx >= 0) {
    requestAnimationFrame(() => { list.scrollTop = selectedIdx * itemHeight; });
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
      const val = parseInt(item.dataset.value, 10);
      const idx = Array.from(items).indexOf(item);
      list.scrollTo({ top: idx * itemHeight, behavior: 'smooth' });
      updateSelection(list, items, val);
      onChange(val);
    });
  });

  let scrollTimeout;
  list.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollTop = list.scrollTop;
      const nearestIdx = Math.round(scrollTop / itemHeight);
      const clampedIdx = Math.max(0, Math.min(nearestIdx, items.length - 1));
      list.scrollTo({ top: clampedIdx * itemHeight, behavior: 'smooth' });
      const val = parseInt(items[clampedIdx].dataset.value, 10);
      updateSelection(list, items, val);
      onChange(val);
    }, 80);
  });
}

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
  const hasCarousel = !!post.derivations?.carousel;

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

      <div class="publish-option-card" id="option-card-schedule">
        <div class="publish-option-info">
          <div class="publish-option-icon">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>
          </div>
          <div>
            <p class="publish-option-title">Agendar publicação</p>
            <p class="publish-option-desc">Escolha data e horário</p>
          </div>
        </div>
        <div class="publish-radio" id="publish-radio-schedule"></div>
      </div>

      <div class="schedule-picker-wrapper" id="schedule-picker-wrapper">
        <!-- Calendar injected here when schedule is selected -->
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
              <div class="publish-summary-icon publish-summary-icon--accent" id="review-when-icon">
                <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/></svg>
              </div>
              <div>
                <p class="publish-summary-label">Quando</p>
                <p class="publish-summary-value publish-summary-accent" id="review-when-text">⚡ Publicar imediatamente</p>
              </div>
            </div>
          </div>

          <div class="publish-confirm-notice" id="publish-confirm-notice">
            <div class="publish-confirm-icon">
              <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
            </div>
            <p id="publish-confirm-text">Ao clicar em <strong>"Publicar Agora"</strong>, seu post será publicado imediatamente no LinkedIn e o status será atualizado para <strong>publicado</strong>.</p>
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
      <div class="publish-success" id="publish-success-content">
        <div class="publish-success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3 class="publish-success-title" id="success-title">Publicado com sucesso!</h3>
        <p class="publish-success-desc" id="success-desc">Seu post foi publicado no LinkedIn com sucesso!</p>
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
  let publishMode = 'now'; // 'now' | 'schedule'
  let selectedDate = null;
  let selectedHour = 9;
  let selectedMinute = 0;
  let calViewYear = new Date().getFullYear();
  let calViewMonth = new Date().getMonth();

  // ── Option card selection ──
  function selectOption(mode) {
    publishMode = mode;
    const cardNow = document.getElementById('option-card-now');
    const cardSchedule = document.getElementById('option-card-schedule');
    const radioNow = document.getElementById('publish-radio-now');
    const radioSchedule = document.getElementById('publish-radio-schedule');
    const pickerWrapper = document.getElementById('schedule-picker-wrapper');
    const iconNow = cardNow?.querySelector('.publish-option-icon');
    const iconSchedule = cardSchedule?.querySelector('.publish-option-icon');

    if (mode === 'now') {
      cardNow?.classList.add('publish-option-card--selected');
      cardSchedule?.classList.remove('publish-option-card--selected');
      radioNow?.classList.add('publish-radio--on');
      radioSchedule?.classList.remove('publish-radio--on');
      iconNow?.classList.add('publish-option-icon--active');
      iconSchedule?.classList.remove('publish-option-icon--active');
      if (pickerWrapper) pickerWrapper.innerHTML = '';
    } else {
      cardSchedule?.classList.add('publish-option-card--selected');
      cardNow?.classList.remove('publish-option-card--selected');
      radioSchedule?.classList.add('publish-radio--on');
      radioNow?.classList.remove('publish-radio--on');
      iconSchedule?.classList.add('publish-option-icon--active');
      iconNow?.classList.remove('publish-option-icon--active');
      showSchedulePicker();
    }

    updateNextButton();
  }

  function updateNextButton() {
    const btn = document.getElementById('publish-btn-next');
    if (!btn) return;
    if (publishMode === 'schedule' && !selectedDate) {
      btn.disabled = true;
      btn.classList.add('btn-disabled');
    } else {
      btn.disabled = false;
      btn.classList.remove('btn-disabled');
    }
  }

  // ── Schedule picker ──
  function showSchedulePicker() {
    const wrapper = document.getElementById('schedule-picker-wrapper');
    if (!wrapper) return;
    wrapper.innerHTML = renderSchedulePicker(selectedDate, selectedHour, selectedMinute);
    attachCalendarEvents();
    attachTimeEvents();
  }

  function attachCalendarEvents() {
    // Nav buttons
    document.getElementById('cal-prev')?.addEventListener('click', () => {
      calViewMonth--;
      if (calViewMonth < 0) { calViewMonth = 11; calViewYear--; }
      refreshCalendar();
    });

    document.getElementById('cal-next')?.addEventListener('click', () => {
      calViewMonth++;
      if (calViewMonth > 11) { calViewMonth = 0; calViewYear++; }
      refreshCalendar();
    });

    // Day buttons
    document.querySelectorAll('.cal-day--active').forEach(btn => {
      btn.addEventListener('click', () => {
        const day = parseInt(btn.dataset.day, 10);
        selectedDate = new Date(calViewYear, calViewMonth, day);
        refreshCalendar();
        updateScheduleSummary();
        updateNextButton();
      });
    });
  }

  function attachTimeEvents() {
    // Initialize scroll wheels
    initScrollWheel('time-scroll-hour', selectedHour, (val) => {
      selectedHour = val;
      updateScheduleSummary();
    });
    initScrollWheel('time-scroll-minute', selectedMinute, (val) => {
      selectedMinute = val;
      updateScheduleSummary();
    });
  }

  function refreshCalendar() {
    const mount = document.getElementById('schedule-calendar-mount');
    if (!mount) return;
    mount.innerHTML = renderCalendar(calViewYear, calViewMonth, selectedDate);
    attachCalendarEvents();
  }

  function updateScheduleSummary() {
    const summary = document.getElementById('schedule-summary');
    if (!summary || !selectedDate) return;
    summary.className = 'schedule-summary';
    summary.innerHTML = `
      <svg viewBox="0 0 24 24" width="14" height="14"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>
      <span>${formatDateBR(selectedDate)} às ${formatTimeBR(selectedHour, selectedMinute)}</span>
    `;
  }

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
      updateNextButton();
    } else if (n === 2) {
      // Update review screen with schedule info
      const whenText = document.getElementById('review-when-text');
      const confirmText = document.getElementById('publish-confirm-text');
      const whenIcon = document.getElementById('review-when-icon');

      if (publishMode === 'schedule' && selectedDate) {
        const dateStr = `${formatDateBR(selectedDate)} às ${formatTimeBR(selectedHour, selectedMinute)}`;
        if (whenText) whenText.innerHTML = `📅 Agendado para ${dateStr}`;
        if (whenIcon) whenIcon.innerHTML = `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>`;
        if (confirmText) confirmText.innerHTML = `Ao clicar em <strong>"Agendar"</strong>, seu post será salvo na fila de publicação e será publicado automaticamente em <strong>${dateStr}</strong>.`;
      } else {
        if (whenText) whenText.innerHTML = '⚡ Publicar imediatamente';
        if (confirmText) confirmText.innerHTML = `Ao clicar em <strong>"Publicar Agora"</strong>, seu post será publicado imediatamente no LinkedIn e o status será atualizado para <strong>publicado</strong>.`;
      }

      footer.style.display = '';
      const isSchedule = publishMode === 'schedule' && selectedDate;
      footer.innerHTML = `
        <button class="btn-ghost btn-sm" id="publish-btn-back">${Icons.arrowLeft} Voltar</button>
        <button class="${isSchedule ? 'btn-primary' : 'btn-linkedin'} btn-sm" id="publish-btn-confirm">
          ${isSchedule ? '📅 Agendar' : `${Icons.send} Publicar Agora`}
        </button>
      `;
      document.getElementById('publish-btn-back')?.addEventListener('click', () => showScreen(1));
      document.getElementById('publish-btn-confirm')?.addEventListener('click', () => {
        if (isSchedule) {
          handleSchedule(post);
        } else {
          handlePublish(post);
        }
      });
      attachLinkedInPreviewEvents();
    } else {
      footer.style.display = 'none';
    }
  }

  // ── Publish action (immediate) — calls Edge Function ──
  async function handlePublish(post) {
    const btn = document.getElementById('publish-btn-confirm');
    if (!btn) return;

    btn.disabled = true;
    btn.innerHTML = `
      <svg class="publish-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="15"/>
      </svg>
      Verificando conexão...
    `;

    try {
      // 1. Verify LinkedIn is connected
      const statusRes = await fetch(`${SUPABASE_FUNCTIONS_URL}/linkedin-status`);
      const linkedInStatus = statusRes.ok ? await statusRes.json() : null;

      if (!linkedInStatus?.connected) {
        throw new Error('LinkedIn não conectado. Vá em Configurações → Perfil LinkedIn para conectar sua conta.');
      }

      // 2. Update spinner text
      btn.innerHTML = `
        <svg class="publish-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="15"/>
        </svg>
        Publicando no LinkedIn...
      `;

      // 3. Build FormData with text + media
      const formData = new FormData();
      formData.append('commentary', fullText);

      const hasCoverMedia = !!(post.covers?.image_url || post.derivations?.cover?.coverPath);
      const hasCarouselMedia = !!post.derivations?.carousel?.pdfPath;

      if (hasCarouselMedia) {
        formData.append('post_type', 'carousel');
        const pdfUrl = post.derivations?.carousel?.pdfPath;
        if (pdfUrl) {
          const mediaRes = await fetch(pdfUrl);
          if (mediaRes.ok) {
            const mediaBlob = await mediaRes.blob();
            formData.append('media', mediaBlob, 'carousel.pdf');
            formData.append('media_title', post.title || 'Carousel');
          }
        }
      } else if (hasCoverMedia) {
        formData.append('post_type', 'image');
        const imageUrl = post.covers?.image_url || post.derivations?.cover?.coverPath;
        if (imageUrl) {
          const mediaRes = await fetch(imageUrl);
          if (mediaRes.ok) {
            const mediaBlob = await mediaRes.blob();
            formData.append('media', mediaBlob, 'cover.png');
            formData.append('media_title', post.title || 'Cover');
          }
        }
      } else {
        formData.append('post_type', 'text');
      }

      // 4. Call Edge Function
      const publishRes = await fetch(`${SUPABASE_FUNCTIONS_URL}/linkedin-publish`, {
        method: 'POST',
        body: formData,
      });

      if (!publishRes.ok) {
        const errData = await publishRes.json().catch(() => ({ error: 'Falha na publicação' }));
        throw new Error(errData.error || errData.details || `Erro HTTP ${publishRes.status}`);
      }

      // 5. Capture post_urn from response for future analytics
      const publishData = await publishRes.json().catch(() => ({}));
      const postUrn = publishData.post_urn || publishData.id || null;

      // 6. Update local status + post_urn
      await DataStore.updatePost(post.id, {
        status: 'publicado',
        publishedAt: new Date().toISOString(),
        ...(postUrn ? { postUrn } : {}),
      });

      showScreen(3);

      setTimeout(() => {
        closeModal();
        showToast('Post publicado no LinkedIn! 🚀', 'success');
        renderLibrary();
      }, 2000);
    } catch (err) {
      console.error('[Publish] Error:', err);
      showToast('Erro ao publicar: ' + err.message, 'error');
      btn.disabled = false;
      btn.innerHTML = `${Icons.send} Publicar Agora`;
    }
  }

  // ── Schedule action ──
  async function handleSchedule(post) {
    const btn = document.getElementById('publish-btn-confirm');
    if (!btn || !selectedDate) return;

    btn.disabled = true;
    btn.innerHTML = `
      <svg class="publish-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="15"/>
      </svg>
      Agendando...
    `;

    try {
      // Build scheduled datetime (Brazil timezone UTC-3)
      const scheduledAt = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        selectedHour,
        selectedMinute,
        0
      );

      // Determine post type and media
      const hasCoverMedia = !!(post.covers?.image_url || post.derivations?.cover?.coverPath);
      const hasCarouselMedia = !!post.derivations?.carousel?.pdfPath;
      let postType = 'text';
      let mediaUrl = null;
      let mediaFilename = null;
      if (hasCarouselMedia) {
        postType = 'carousel';
        mediaUrl = post.derivations?.carousel?.pdfPath;
        mediaFilename = 'carousel.pdf';
      } else if (hasCoverMedia) {
        postType = 'image';
        mediaUrl = post.covers?.image_url || post.derivations?.cover?.coverPath || null;
        mediaFilename = 'cover.png';
      }

      // Insert into scheduled_posts table
      const { error } = await supabase
        .from('scheduled_posts')
        .insert({
          post_content: fullText,
          post_type: postType,
          media_url: mediaUrl,
          media_filename: mediaFilename,
          scheduled_at: scheduledAt.toISOString(),
          status: 'pending',
        });

      if (error) throw error;

      // Update post status locally
      await DataStore.updatePost(post.id, {
        status: 'agendado',
        scheduledAt: scheduledAt.toISOString(),
      });

      // Show success
      const successTitle = document.getElementById('success-title');
      const successDesc = document.getElementById('success-desc');
      if (successTitle) successTitle.textContent = 'Agendado com sucesso!';
      if (successDesc) successDesc.textContent = `Seu post será publicado em ${formatDateBR(selectedDate)} às ${formatTimeBR(selectedHour, selectedMinute)}.`;

      showScreen(3);

      setTimeout(() => {
        closeModal();
        showToast(`Post agendado para ${formatDateBR(selectedDate)} às ${formatTimeBR(selectedHour, selectedMinute)} 📅`, 'success');
        renderLibrary();
      }, 2200);
    } catch (err) {
      console.error('[Schedule] Error:', err);
      showToast('Erro ao agendar: ' + err.message, 'error');
      btn.disabled = false;
      btn.innerHTML = '📅 Agendar';
    }
  }

  // ── Init ──
  document.querySelector('.modal-close')?.addEventListener('click', closeModal);
  document.getElementById('publish-btn-next')?.addEventListener('click', () => showScreen(2));

  // Option card click handlers
  document.getElementById('option-card-now')?.addEventListener('click', () => selectOption('now'));
  document.getElementById('option-card-schedule')?.addEventListener('click', () => selectOption('schedule'));
}
