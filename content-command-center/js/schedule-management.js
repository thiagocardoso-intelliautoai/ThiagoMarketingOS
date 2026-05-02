// schedule-management.js — Reagendar e Cancelar posts agendados no modal de visualização
// Depende de: linkedin-publish.js (exports de picker), supabase.js, data.js, toast.js, modal.js

import { supabase } from './supabase.js';
import { DataStore } from './data.js';
import { showToast } from './toast.js';
import { closeModal } from './modal.js';
import { renderLibrary } from './render.js';
import {
  renderSchedulePicker,
  renderCalendar,
  initScrollWheel,
  padZero,
  formatDateBR,
  formatTimeBR,
} from './linkedin-publish.js';

const DAY_NAMES_ABBR = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// ─── RENDER BANNER ───────────────────────────────────────────────────────────
// Retorna HTML string do banner de gestão de agendamento.
// Só renderiza algo se post.status === 'agendado'.
export function renderScheduleBanner(post) {
  if (post.status !== 'agendado' || !post.scheduledAt) return '';

  const scheduledDate = new Date(post.scheduledAt);
  const dayName = DAY_NAMES_ABBR[scheduledDate.getDay()];
  const dateStr = scheduledDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  const timeStr = scheduledDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return `
    <div class="schedule-management-banner" id="schedule-mgmt-banner"
         role="region" aria-label="Gestão de agendamento" aria-live="polite">

      <!-- Estado: Default -->
      <div class="schedule-mgmt-state" id="schedule-mgmt-state-default">
        <div class="schedule-mgmt-info">
          <span class="schedule-mgmt-icon" aria-hidden="true">⏰</span>
          <span class="schedule-mgmt-date">
            Agendado para <strong>${dayName}, ${dateStr}</strong> às <strong>${timeStr}</strong>
          </span>
        </div>
        <div class="schedule-mgmt-actions">
          <button class="btn-outline-warning btn-sm" id="btn-reschedule"
                  aria-expanded="false" aria-controls="schedule-mgmt-state-picker">
            📅 Reagendar
          </button>
          <button class="btn-ghost-danger btn-sm" id="btn-cancel-schedule"
                  aria-describedby="cancel-confirm-hint">
            ✕ Cancelar agendamento
          </button>
          <span id="cancel-confirm-hint" class="sr-only">
            Isso reverterá o post para status Rascunho
          </span>
        </div>
      </div>

      <!-- Estado: Picker expandido -->
      <div class="schedule-mgmt-state" id="schedule-mgmt-state-picker" style="display:none">
        <div class="schedule-mgmt-picker-header">
          <span>📅 Escolha nova data e horário</span>
          <button class="btn-icon" id="btn-reschedule-close" aria-label="Fechar seletor de data">✕</button>
        </div>
        <div id="reschedule-picker-mount"></div>
        <div class="schedule-mgmt-picker-footer">
          <button class="btn-ghost btn-sm" id="btn-reschedule-abort">Cancelar</button>
          <button class="btn-primary btn-sm" id="btn-reschedule-confirm" disabled
                  title="Selecione uma data para continuar">
            ✓ Confirmar Reagendamento
          </button>
        </div>
      </div>

      <!-- Estado: Confirmação de cancelamento inline -->
      <div class="schedule-mgmt-state" id="schedule-mgmt-state-confirm" style="display:none">
        <div class="schedule-mgmt-confirm-inline">
          <span class="schedule-mgmt-confirm-text">
            ⚠️ O post voltará para <strong>Rascunho</strong>. Confirma?
          </span>
          <div class="schedule-mgmt-confirm-actions">
            <button class="btn-danger btn-sm" id="btn-cancel-confirm">Sim, cancelar</button>
            <button class="btn-ghost btn-sm" id="btn-cancel-abort">Não</button>
          </div>
        </div>
      </div>

    </div>
  `;
}

// ─── BIND EVENTS ─────────────────────────────────────────────────────────────
// Vincula todos os eventos de interação no banner.
// Deve ser chamado após openModal() injetar o HTML no DOM.
export function attachScheduleManagementEvents(post) {
  if (post.status !== 'agendado') return;

  // ── Utilitário: alterna entre os 3 estados do banner ──
  function showState(id) {
    ['default', 'picker', 'confirm'].forEach(s => {
      const el = document.getElementById(`schedule-mgmt-state-${s}`);
      if (el) el.style.display = s === id ? '' : 'none';
    });
    const banner = document.getElementById('schedule-mgmt-banner');
    if (banner) banner.classList.toggle('schedule-mgmt--expanded', id === 'picker');
  }

  // ── Estado local do picker ──
  let selectedDate = null;
  let selectedHour = 9;
  let selectedMinute = 0;
  let calViewYear = new Date().getFullYear();
  let calViewMonth = new Date().getMonth();

  // ── Monta o picker no DOM e vincula todos os eventos internos ──
  function mountPicker() {
    const mount = document.getElementById('reschedule-picker-mount');
    if (!mount) return;
    mount.innerHTML = renderSchedulePicker(selectedDate, selectedHour, selectedMinute);
    bindPickerInternalEvents();
  }

  function bindPickerInternalEvents() {
    // Navegação de meses
    document.getElementById('cal-prev')?.addEventListener('click', () => {
      calViewMonth--;
      if (calViewMonth < 0) { calViewMonth = 11; calViewYear--; }
      remountCalendar();
    });
    document.getElementById('cal-next')?.addEventListener('click', () => {
      calViewMonth++;
      if (calViewMonth > 11) { calViewMonth = 0; calViewYear++; }
      remountCalendar();
    });

    // Seleção de dia
    document.querySelectorAll('.cal-day--active').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedDate = new Date(calViewYear, calViewMonth, parseInt(btn.dataset.day, 10));
        remountCalendar();
        updateConfirmButton();
      });
    });

    // Scroll wheels de hora e minuto
    initScrollWheel('time-scroll-hour', selectedHour, val => { selectedHour = val; });
    initScrollWheel('time-scroll-minute', selectedMinute, val => { selectedMinute = val; });
  }

  // Re-renderiza apenas o calendário (preserva scroll wheels)
  function remountCalendar() {
    const calMount = document.getElementById('schedule-calendar-mount');
    if (!calMount) return;
    calMount.innerHTML = renderCalendar(calViewYear, calViewMonth, selectedDate);
    // Re-bind navegação e cliques de dia
    document.getElementById('cal-prev')?.addEventListener('click', () => {
      calViewMonth--;
      if (calViewMonth < 0) { calViewMonth = 11; calViewYear--; }
      remountCalendar();
    });
    document.getElementById('cal-next')?.addEventListener('click', () => {
      calViewMonth++;
      if (calViewMonth > 11) { calViewMonth = 0; calViewYear++; }
      remountCalendar();
    });
    document.querySelectorAll('.cal-day--active').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedDate = new Date(calViewYear, calViewMonth, parseInt(btn.dataset.day, 10));
        remountCalendar();
        updateConfirmButton();
      });
    });
  }

  function updateConfirmButton() {
    const btn = document.getElementById('btn-reschedule-confirm');
    if (!btn) return;
    btn.disabled = !selectedDate;
    btn.title = selectedDate ? '' : 'Selecione uma data para continuar';
  }

  // ── Vinculação dos botões principais ──

  // Abrir picker
  document.getElementById('btn-reschedule')?.addEventListener('click', () => {
    document.getElementById('btn-reschedule')?.setAttribute('aria-expanded', 'true');
    showState('picker');
    mountPicker();
  });

  // Fechar picker (X e Cancelar)
  const closePicker = () => {
    document.getElementById('btn-reschedule')?.setAttribute('aria-expanded', 'false');
    showState('default');
  };
  document.getElementById('btn-reschedule-close')?.addEventListener('click', closePicker);
  document.getElementById('btn-reschedule-abort')?.addEventListener('click', closePicker);

  // Confirmar reagendamento
  document.getElementById('btn-reschedule-confirm')?.addEventListener('click', () => {
    if (!selectedDate) return;
    handleReschedule(post, selectedDate, selectedHour, selectedMinute);
  });

  // Abrir confirmação de cancelamento
  document.getElementById('btn-cancel-schedule')?.addEventListener('click', () => {
    showState('confirm');
  });

  // Abortar cancelamento
  document.getElementById('btn-cancel-abort')?.addEventListener('click', () => {
    showState('default');
  });

  // Confirmar cancelamento
  document.getElementById('btn-cancel-confirm')?.addEventListener('click', () => {
    handleCancelSchedule(post);
  });

  // Escape fecha o picker
  const escHandler = (e) => {
    if (e.key !== 'Escape') return;
    const banner = document.getElementById('schedule-mgmt-banner');
    if (!banner) { document.removeEventListener('keydown', escHandler); return; }
    const pickerState = document.getElementById('schedule-mgmt-state-picker');
    const confirmState = document.getElementById('schedule-mgmt-state-confirm');
    if (pickerState?.style.display !== 'none') showState('default');
    else if (confirmState?.style.display !== 'none') showState('default');
  };
  document.addEventListener('keydown', escHandler);
}

// ─── BUSINESS LOGIC: REAGENDAR ────────────────────────────────────────────────
async function handleReschedule(post, selectedDate, selectedHour, selectedMinute) {
  const confirmBtn = document.getElementById('btn-reschedule-confirm');
  const abortBtn  = document.getElementById('btn-reschedule-abort');

  // Loading state
  if (confirmBtn) {
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = `<svg class="publish-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="15"/></svg> Reagendando...`;
  }
  if (abortBtn) abortBtn.disabled = true;

  try {
    const newScheduledAt = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedHour,
      selectedMinute,
      0
    );

    // 1. UPDATE scheduled_posts: usa scheduled_at + status como chave composta
    //    (débito técnico: tabela não tem post_id — ver nota arquitetural)
    const { error: schedError } = await supabase
      .from('scheduled_posts')
      .update({ scheduled_at: newScheduledAt.toISOString() })
      .eq('scheduled_at', post.scheduledAt)
      .eq('status', 'pending');

    if (schedError) throw schedError;

    // 2. UPDATE posts via DataStore (atualiza cache + Supabase)
    await DataStore.updatePost(post.id, {
      scheduledAt: newScheduledAt.toISOString(),
    });

    // 3. Feedback e fechamento
    const h = padZero(selectedHour);
    const m = padZero(selectedMinute);
    const d = padZero(selectedDate.getDate());
    const mo = padZero(selectedDate.getMonth() + 1);
    closeModal();
    showToast(`Post reagendado para ${d}/${mo} às ${h}:${m} 📅`, 'success');
    renderLibrary();

  } catch (err) {
    console.error('[Reschedule] Error:', err);
    showToast('Erro ao reagendar: ' + err.message, 'error');
    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.innerHTML = '✓ Confirmar Reagendamento';
    }
    if (abortBtn) abortBtn.disabled = false;
  }
}

// ─── BUSINESS LOGIC: CANCELAR ────────────────────────────────────────────────
async function handleCancelSchedule(post) {
  const confirmBtn = document.getElementById('btn-cancel-confirm');
  const abortBtn  = document.getElementById('btn-cancel-abort');

  // Loading state
  if (confirmBtn) {
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = `<svg class="publish-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="15"/></svg> Cancelando...`;
  }
  if (abortBtn) abortBtn.disabled = true;

  try {
    // 1. DELETE da fila (chave composta: scheduled_at + status)
    const { error: deleteError } = await supabase
      .from('scheduled_posts')
      .delete()
      .eq('scheduled_at', post.scheduledAt)
      .eq('status', 'pending');

    if (deleteError) throw deleteError;

    // 2. UPDATE posts: status → rascunho, limpar scheduledAt
    await DataStore.updatePost(post.id, {
      status: 'rascunho',
      scheduledAt: null,
    });

    // 3. Feedback e fechamento
    closeModal();
    showToast('Agendamento cancelado. Post voltou para Rascunho.', 'success');
    renderLibrary();

  } catch (err) {
    console.error('[CancelSchedule] Error:', err);
    showToast('Erro ao cancelar: ' + err.message, 'error');
    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.innerHTML = 'Sim, cancelar';
    }
    if (abortBtn) abortBtn.disabled = false;
  }
}
