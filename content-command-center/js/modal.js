// modal.js — Modal System
// Extracted from render.js [HARDENING-002]

export function openModal(contentHtml) {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');
  content.innerHTML = contentHtml;
  overlay.classList.add('modal-open');
  document.body.style.overflow = 'hidden';
  const focusable = content.querySelectorAll('button, input, textarea, select, [tabindex]');
  if (focusable.length) focusable[0].focus();
}

export function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('modal-open');
  document.body.style.overflow = '';
}

// ESC handler
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
