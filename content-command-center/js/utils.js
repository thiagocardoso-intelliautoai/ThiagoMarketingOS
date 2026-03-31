// utils.js — UI Utilities
// Extracted from render.js [HARDENING-002]
import { showToast } from './toast.js';

// ─── COPY TO CLIPBOARD ───
export async function copyToClipboard(text) {
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
export async function downloadFile(url, filename) {
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

// ─── TEXT HELPERS ───
export function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function truncate(str, len) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '…' : str;
}

export function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
