// assets.js — Gallery Module for Source Photo Management
// Story ASSETS-005: Galeria de Gestão de Ativos no CCC
import {
  getSourcePhotos,
  insertSourcePhoto,
  uploadSourceImage,
  deleteSourcePhoto,
  deleteSourceImage,
  getPublicUrl
} from './supabase.js';
import { showToast } from './toast.js';
import { closeModal } from './modal.js';

// ─── STATE ───
let currentCategory = null;
let allPhotos = [];

// ─── MAIN RENDER ───
export async function renderAssets() {
  const target = document.getElementById('assets-mount-point') 
                || document.getElementById('settings-content-area')
                || document.getElementById('main-content');
  target.innerHTML = buildPageHTML();

  // Attach tab listeners
  target.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = tab.dataset.category || null;
      currentCategory = cat;
      target.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      loadPhotos(cat);
    });
  });

  // Upload button
  target.querySelector('#btn-upload-photo')?.addEventListener('click', openUploadModal);

  // Load initial data
  await loadPhotos(null);
}

function buildPageHTML() {
  return `
    <section class="assets-page">
      <div class="assets-header">
        <span class="assets-header-label">Fotos de referência para composição visual</span>
        <button class="btn-primary btn-sm" id="btn-upload-photo">
          <svg viewBox="0 0 24 24" width="14" height="14"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Upload
        </button>
      </div>

      <div class="category-tabs">
        <button class="category-tab active" data-category="">
          <svg viewBox="0 0 24 24" width="14" height="14"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
          Todos
        </button>
        <button class="category-tab" data-category="papers">
          <svg viewBox="0 0 24 24" width="14" height="14"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          Papéis
        </button>
        <button class="category-tab" data-category="photos">
          <svg viewBox="0 0 24 24" width="14" height="14"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
          Fotos
        </button>
        <button class="category-tab" data-category="profile">
          <svg viewBox="0 0 24 24" width="14" height="14"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Perfil
        </button>
      </div>

      <div class="gallery-grid" id="gallery-grid">
        <div class="gallery-loading">
          <div class="gallery-spinner"></div>
          <span>Carregando imagens…</span>
        </div>
      </div>
    </section>
  `;
}

// ─── LOAD PHOTOS ───
async function loadPhotos(category) {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  grid.innerHTML = `<div class="gallery-loading"><div class="gallery-spinner"></div><span>Carregando…</span></div>`;

  try {
    const { data, error } = await getSourcePhotos(category || null);
    if (error) throw error;
    allPhotos = data || [];
    renderGalleryGrid(allPhotos);
    updateBadge(allPhotos.length);
  } catch (err) {
    console.error('[Assets] Error loading photos:', err);
    grid.innerHTML = `<div class="gallery-empty">
      <svg viewBox="0 0 24 24" width="48" height="48"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <p>Erro ao carregar imagens</p>
      <span>${err.message}</span>
    </div>`;
  }
}

// ─── RENDER GALLERY GRID ───
function renderGalleryGrid(photos) {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  if (photos.length === 0) {
    grid.innerHTML = `
      <div class="gallery-empty">
        <svg viewBox="0 0 24 24" width="48" height="48"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
        <p>Nenhuma imagem encontrada</p>
        <span>Use o botão "Upload" para adicionar fotos</span>
      </div>`;
    return;
  }

  grid.innerHTML = photos.map((photo, i) => `
    <div class="asset-card" data-id="${photo.id}" style="animation-delay: ${i * 0.06}s">
      <div class="asset-card__thumbnail-wrap" data-action="lightbox">
        <img class="asset-card__thumbnail"
             src="${photo.public_url}"
             alt="${photo.description || photo.filename}"
             loading="lazy" />
        <div class="asset-card__thumbnail-overlay">
          <svg viewBox="0 0 24 24" width="20" height="20"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="m21 3-7 7"/><path d="m3 21 7-7"/></svg>
        </div>
      </div>
      <div class="asset-card__info">
        <span class="asset-card__filename" title="${photo.filename}">${photo.filename}</span>
        ${photo.description ? `<span class="asset-card__desc">${photo.description}</span>` : ''}
        <div class="asset-card__pills">
          <span class="asset-card__pill asset-card__pill--category">${categoryLabel(photo.category)}</span>
          ${photo.orientation ? `<span class="asset-card__pill">${orientationLabel(photo.orientation)}</span>` : ''}
        </div>
      </div>
      <div class="asset-card__actions">
        <button class="btn-icon-asset" data-action="copy" title="Copiar URL">
          <svg viewBox="0 0 24 24" width="15" height="15"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        </button>
        <button class="btn-icon-asset btn-icon-asset--danger" data-action="delete" title="Excluir">
          <svg viewBox="0 0 24 24" width="15" height="15"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    </div>
  `).join('');

  // Attach card events
  grid.querySelectorAll('.asset-card').forEach(card => {
    const id = card.dataset.id;
    const photo = photos.find(p => p.id === id);
    if (!photo) return;

    card.querySelector('[data-action="lightbox"]')?.addEventListener('click', () => openLightbox(photo));
    card.querySelector('[data-action="copy"]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      copyUrl(photo.public_url);
    });
    card.querySelector('[data-action="delete"]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      confirmDelete(photo);
    });
  });
}

// ─── UPLOAD MODAL ───
function openUploadModal() {
  const overlay = document.getElementById('modal-overlay');
  const container = document.getElementById('modal-content');

  container.innerHTML = `
    <div class="upload-modal">
      <div class="modal-header">
        <h2 class="modal-title">
          <svg viewBox="0 0 24 24" width="20" height="20"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
          Upload de Imagem
        </h2>
        <button class="btn-icon modal-close" id="upload-close">
          <svg viewBox="0 0 24 24" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div class="upload-dropzone" id="upload-dropzone">
        <svg viewBox="0 0 24 24" width="40" height="40"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        <p>Arraste uma imagem aqui</p>
        <span>ou clique para selecionar</span>
        <input type="file" id="upload-file-input" accept="image/jpeg,image/png,image/webp" style="display:none" />
      </div>

      <div class="upload-preview-container" id="upload-preview-container" style="display:none">
        <img id="upload-preview-img" class="upload-preview-img" alt="Preview" />
        <button class="btn-ghost btn-sm" id="upload-change-file">Trocar imagem</button>
      </div>

      <div class="upload-fields">
        <div class="expand-field">
          <label>
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            Categoria
          </label>
          <select class="filter-select" id="upload-category" style="width:100%">
            <option value="papers">📓 Papéis</option>
            <option value="photos">📷 Fotos</option>
            <option value="profile">👤 Perfil</option>
          </select>
        </div>
        <div class="expand-field">
          <label>
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M4 12h16"/><path d="M4 18h7"/><path d="M4 6h16"/></svg>
            Descrição
          </label>
          <input class="input-field" id="upload-desc" placeholder="Descreva a imagem…" />
        </div>
        <div class="expand-field">
          <label>
            <svg viewBox="0 0 24 24" width="14" height="14"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Melhor para (estilos)
          </label>
          <input class="input-field" id="upload-bestfor" placeholder="ex: rascunho-papel, minimal-tech" />
        </div>
        <div class="expand-field">
          <label>
            <svg viewBox="0 0 24 24" width="14" height="14"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
            Orientação
          </label>
          <div class="radio-group" id="upload-orientation">
            <label class="radio-label"><input type="radio" name="orientation" value="portrait" checked /> Retrato</label>
            <label class="radio-label"><input type="radio" name="orientation" value="landscape" /> Paisagem</label>
            <label class="radio-label"><input type="radio" name="orientation" value="square" /> Quadrado</label>
          </div>
        </div>
      </div>

      <div class="upload-progress" id="upload-progress" style="display:none">
        <div class="upload-progress-track">
          <div class="upload-progress-fill" id="upload-progress-fill"></div>
        </div>
        <span class="upload-progress-label" id="upload-progress-label">Enviando…</span>
      </div>

      <div class="modal-footer">
        <button class="btn-ghost" id="upload-cancel">Cancelar</button>
        <button class="btn-primary" id="upload-submit" disabled>
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Enviar
        </button>
      </div>
    </div>
  `;

  overlay.classList.add('modal-open');
  document.body.style.overflow = 'hidden';

  let selectedFile = null;

  const dropzone = document.getElementById('upload-dropzone');
  const fileInput = document.getElementById('upload-file-input');
  const previewContainer = document.getElementById('upload-preview-container');
  const previewImg = document.getElementById('upload-preview-img');
  const submitBtn = document.getElementById('upload-submit');

  // Close handlers
  document.getElementById('upload-close').addEventListener('click', closeModal);
  document.getElementById('upload-cancel').addEventListener('click', closeModal);

  // Dropzone click → file input
  dropzone.addEventListener('click', () => fileInput.click());

  // Drag & drop
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dropzone-active');
  });
  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dropzone-active');
  });
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dropzone-active');
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  // File input change
  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) handleFile(fileInput.files[0]);
  });

  // Change file button
  document.getElementById('upload-change-file').addEventListener('click', () => {
    fileInput.click();
  });

  function handleFile(file) {
    // Hard block: invalid type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showToast('❌ Formato inválido. Use JPG, PNG ou WebP.', 'error');
      return;
    }
    // Hard block: > 10MB
    if (file.size > 10 * 1024 * 1024) {
      showToast('❌ Arquivo muito grande. Máximo 10MB.', 'error');
      return;
    }

    selectedFile = file;
    submitBtn.disabled = false;

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      previewContainer.style.display = 'flex';
      dropzone.style.display = 'none';

      // Soft warning: dimension < 1080px
      const img = new Image();
      img.onload = () => {
        if (img.width < 1080 && img.height < 1080) {
          showToast('⚠️ Imagem com menos de 1080px. A qualidade pode ser baixa.', 'warning');
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Submit upload
  submitBtn.addEventListener('click', async () => {
    if (!selectedFile) return;

    const category = document.getElementById('upload-category').value;
    const description = document.getElementById('upload-desc').value.trim();
    const bestFor = document.getElementById('upload-bestfor').value.trim();
    const orientation = document.querySelector('#upload-orientation input[name="orientation"]:checked')?.value || 'portrait';

    // Sanitize filename
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    const safeName = selectedFile.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9._-]/g, '-')
      .replace(/-+/g, '-');
    const storagePath = `source-photos/${category}/${safeName}`;

    // Show progress
    submitBtn.disabled = true;
    const progress = document.getElementById('upload-progress');
    const progressFill = document.getElementById('upload-progress-fill');
    const progressLabel = document.getElementById('upload-progress-label');
    progress.style.display = 'flex';
    progressFill.style.width = '30%';
    progressLabel.textContent = 'Enviando para o Storage…';

    try {
      // 1. Upload to Storage
      const { data: uploadData, error: uploadError } = await uploadSourceImage(selectedFile, storagePath);
      if (uploadError) throw uploadError;
      progressFill.style.width = '60%';
      progressLabel.textContent = 'Salvando metadados…';

      // 2. Get public URL
      const publicUrl = getPublicUrl(storagePath);

      // 3. Insert into table
      const { data: insertData, error: insertError } = await insertSourcePhoto({
        category,
        filename: safeName,
        description: description || null,
        best_for: bestFor || null,
        orientation,
        storage_path: storagePath,
        public_url: publicUrl,
        file_size: selectedFile.size,
        mime_type: selectedFile.type
      });
      if (insertError) throw insertError;

      progressFill.style.width = '100%';
      progressLabel.textContent = 'Concluído!';

      showToast('✅ Imagem enviada com sucesso!', 'success');
      closeModal();
      await loadPhotos(currentCategory);

    } catch (err) {
      console.error('[Upload] Error:', err);
      showToast(`❌ Erro no upload: ${err.message}`, 'error');
      submitBtn.disabled = false;
      progress.style.display = 'none';
    }
  });
}

// ─── LIGHTBOX ───
function openLightbox(photo) {
  const overlay = document.getElementById('modal-overlay');
  const container = document.getElementById('modal-content');

  const formattedSize = photo.file_size ? `${(photo.file_size / 1024).toFixed(0)} KB` : '—';
  const formattedDate = photo.created_at ? new Date(photo.created_at).toLocaleDateString('pt-BR') : '—';

  container.innerHTML = `
    <div class="lightbox-modal">
      <button class="btn-icon modal-close lightbox-close" id="lightbox-close">
        <svg viewBox="0 0 24 24" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="lightbox-image-wrap">
        <img class="lightbox-image" src="${photo.public_url}" alt="${photo.description || photo.filename}" />
      </div>
      <div class="lightbox-meta">
        <div class="lightbox-meta-grid">
          <div class="meta-grid-item">
            <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <strong>${photo.filename}</strong>
          </div>
          <div class="meta-grid-item">
            <svg viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            ${categoryLabel(photo.category)}
          </div>
          ${photo.description ? `
          <div class="meta-grid-item" style="grid-column: 1/-1">
            <svg viewBox="0 0 24 24"><path d="M4 12h16"/><path d="M4 18h7"/><path d="M4 6h16"/></svg>
            ${photo.description}
          </div>` : ''}
          ${photo.best_for ? `
          <div class="meta-grid-item">
            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            ${photo.best_for}
          </div>` : ''}
          ${photo.orientation ? `
          <div class="meta-grid-item">
            <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
            ${orientationLabel(photo.orientation)}
          </div>` : ''}
          <div class="meta-grid-item">
            <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            ${formattedSize}
          </div>
          <div class="meta-grid-item">
            <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            ${formattedDate}
          </div>
        </div>
        <div class="lightbox-actions">
          <button class="btn-outline-primary btn-sm" id="lightbox-copy">
            <svg viewBox="0 0 24 24" width="14" height="14"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copiar URL
          </button>
          <a class="btn-ghost btn-sm" href="${photo.public_url}" download="${photo.filename}" target="_blank">
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Baixar
          </a>
          <button class="btn-danger btn-sm" id="lightbox-delete">
            <svg viewBox="0 0 24 24" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            Excluir
          </button>
        </div>
      </div>
    </div>
  `;

  overlay.classList.add('modal-open');
  document.body.style.overflow = 'hidden';

  // Close
  document.getElementById('lightbox-close').addEventListener('click', closeModal);

  // ESC key
  const escHandler = (e) => {
    if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', escHandler); }
  };
  document.addEventListener('keydown', escHandler);

  // Copy URL
  document.getElementById('lightbox-copy').addEventListener('click', () => copyUrl(photo.public_url));

  // Delete
  document.getElementById('lightbox-delete').addEventListener('click', () => {
    closeModal();
    setTimeout(() => confirmDelete(photo), 300);
  });
}

// ─── DELETE CONFIRMATION ───
function confirmDelete(photo) {
  const overlay = document.getElementById('modal-overlay');
  const container = document.getElementById('modal-content');

  container.innerHTML = `
    <div class="upload-modal" style="max-width:420px">
      <div class="modal-header">
        <h2 class="modal-title" style="color:var(--accent-red)">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="var(--accent-red)"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          Excluir Imagem
        </h2>
        <button class="btn-icon modal-close" id="delete-close">
          <svg viewBox="0 0 24 24" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:var(--space-lg)">
        Tem certeza que deseja excluir <strong style="color:var(--text-primary)">${photo.filename}</strong>?
        Esta ação é irreversível.
      </p>
      <div class="modal-footer">
        <button class="btn-ghost" id="delete-cancel">Cancelar</button>
        <button class="btn-danger" id="delete-confirm">
          <svg viewBox="0 0 24 24" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          Excluir
        </button>
      </div>
    </div>
  `;

  overlay.classList.add('modal-open');
  document.body.style.overflow = 'hidden';

  document.getElementById('delete-close').addEventListener('click', closeModal);
  document.getElementById('delete-cancel').addEventListener('click', closeModal);
  document.getElementById('delete-confirm').addEventListener('click', async () => {
    try {
      // 1. Delete from Storage
      const { error: storageErr } = await deleteSourceImage(photo.storage_path);
      if (storageErr) console.warn('[Delete] Storage error:', storageErr.message);

      // 2. Delete from table
      const { error: dbErr } = await deleteSourcePhoto(photo.id);
      if (dbErr) throw dbErr;

      showToast('✅ Imagem excluída!', 'success');
      closeModal();
      await loadPhotos(currentCategory);
    } catch (err) {
      console.error('[Delete] Error:', err);
      showToast(`❌ Erro ao excluir: ${err.message}`, 'error');
    }
  });
}

// ─── COPY URL ───
function copyUrl(url) {
  navigator.clipboard.writeText(url).then(() => {
    showToast('📋 URL copiada!', 'success');
  }).catch(() => {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = url;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    showToast('📋 URL copiada!', 'success');
  });
}

// ─── BADGE COUNTER ───
function updateBadge(count) {
  // Update settings menu item badge if it exists
  const menuItem = document.querySelector('.settings-menu-item[data-section="photos"]');
  if (menuItem) {
    const existingCount = menuItem.querySelector('.settings-photos-count');
    if (existingCount) {
      existingCount.textContent = count;
    } else {
      const badge = document.createElement('span');
      badge.className = 'settings-photos-count';
      badge.textContent = count;
      menuItem.appendChild(badge);
    }
  }
}

// ─── HELPERS ───
function categoryLabel(cat) {
  const map = { papers: 'Papéis', photos: 'Fotos', profile: 'Perfil' };
  return map[cat] || cat;
}

function orientationLabel(o) {
  const map = { portrait: 'Retrato', landscape: 'Paisagem', square: 'Quadrado' };
  return map[o] || o;
}

