// linkedin-preview.js — LinkedIn Post Preview Engine
// Ported from: 1AWINNINGCONTENT/components/PostCreator.tsx (lines 457-603)
// and CreationsHistory.tsx (lines 17-48)

// ─── TRUNCATION CONSTANTS (LinkedIn-accurate) ───
const LINKEDIN_MAX_LINES = 3;
const LINKEDIN_CHARS_PER_LINE = 70;
const LINKEDIN_MAX_CHARS = 200;

// ─── TRUNCATION LOGIC ───
// Exact port from PostCreator.tsx getLinkedInTruncation()
export function getLinkedInTruncation(text) {
  if (!text) return { shouldTruncate: false, truncatedText: '' };
  const lines = text.split('\n');
  let visualLineCount = 0;
  let realCharIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const wrappedLines = line.length === 0 ? 1 : Math.ceil(line.length / LINKEDIN_CHARS_PER_LINE);

    for (let w = 0; w < wrappedLines; w++) {
      visualLineCount++;
      const charsInThisWrap = w < wrappedLines - 1
        ? LINKEDIN_CHARS_PER_LINE
        : (line.length - w * LINKEDIN_CHARS_PER_LINE);
      realCharIndex += charsInThisWrap;

      if (visualLineCount >= LINKEDIN_MAX_LINES || realCharIndex >= LINKEDIN_MAX_CHARS) {
        let pos = 0;
        for (let j = 0; j < i; j++) pos += lines[j].length + 1;
        pos += Math.min((w + 1) * LINKEDIN_CHARS_PER_LINE, line.length);
        return { shouldTruncate: pos < text.length, truncatedText: text.slice(0, pos).trimEnd() };
      }
    }
    realCharIndex++; // count the \n
  }
  return { shouldTruncate: false, truncatedText: text };
}

// ─── SVG ICONS (LinkedIn-specific, not in render.js Icons) ───
const LiIcons = {
  globe: '<svg class="li-icon-globe" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clip-rule="evenodd"/></svg>',
  avatar: '<svg class="li-icon-avatar" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/></svg>',
  like: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/></svg>',
  comment: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>',
  carousel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',
  pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
};

// ─── HTML ESCAPE (standalone, doesn't depend on render.js) ───
function esc(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ─── RENDER LINKEDIN PREVIEW ───
// Generates the complete LinkedIn post mockup HTML
// Works for BOTH text posts and carousel posts
export function renderLinkedInPreview(post) {
  // Deduplicate: avoid repeating hook/cta if body already contains them
  let bodyText = post.body || '';
  const hook = (post.hookText || '').trim();
  const cta = (post.cta || '').trim();

  // Normalize whitespace for comparison (hook may use spaces where body uses newlines)
  const normalize = (s) => s.replace(/\s+/g, ' ').trim();
  // If body already starts with hook text, don't prepend hook
  const bodyStartsWithHook = hook && normalize(bodyText).startsWith(normalize(hook));
  // If body already ends with cta text, don't append cta
  const bodyEndsWithCta = cta && normalize(bodyText).endsWith(normalize(cta));

  const parts = [];
  if (!bodyStartsWithHook && hook) parts.push(hook, '');
  parts.push(bodyText);
  if (!bodyEndsWithCta && cta) parts.push('', cta);
  const hashtagStr = (post.hashtags || []).join(' ');
  if (hashtagStr) parts.push('', hashtagStr);

  const fullText = parts
    .filter(s => s !== undefined && s !== null)
    .join('\n')
    .trim();

  const truncation = getLinkedInTruncation(fullText);

  // Carousel section — only if post is carousel type
  const hasCarousel = post.contentType === 'carousel' || post.derivations?.carousel;
  const slideCount = post.slideCount || post.derivations?.carousel?.slidesCount || '—';
  const pdfPath = post.pdfPath || post.derivations?.carousel?.pdfPath || null;
  const visualStyle = post.visualStyle || post.derivations?.carousel?.style || 'twitter-style';

  // Get actual slide image data from Supabase
  const slides = post.derivations?.carousel?.slides || [];
  const hasSlideImages = slides.length > 0 && slides.some(s => s.imageUrl);

  let carouselSection = '';
  if (hasCarousel) {
    if (hasSlideImages) {
      // Real slide viewer with navigation
      carouselSection = `
        <div class="li-carousel-viewer" id="carousel-viewer">
          <div class="carousel-slide-container">
            ${slides.map((slide, i) => `
              <div class="carousel-slide ${i === 0 ? 'carousel-slide-active' : ''}" data-slide="${i}">
                <img src="${slide.imageUrl}" 
                     alt="Slide ${slide.number || i + 1}" 
                     class="carousel-slide-img"
                     loading="${i === 0 ? 'eager' : 'lazy'}" />
              </div>
            `).join('')}
          </div>
          <button class="carousel-nav carousel-prev" id="carousel-prev" aria-label="Slide anterior">‹</button>
          <button class="carousel-nav carousel-next" id="carousel-next" aria-label="Próximo slide">›</button>
          <div class="carousel-bottom-bar">
            <div class="carousel-indicators" id="carousel-indicators">
              ${slides.map((_, i) => `
                <span class="carousel-dot ${i === 0 ? 'carousel-dot-active' : ''}" data-dot="${i}"></span>
              `).join('')}
            </div>
            <span class="carousel-counter" id="carousel-counter">1/${slides.length}</span>
          </div>
        </div>
        ${pdfPath ? `
          <div class="li-media-actions">
            <button class="li-media-download-btn" id="li-download-pdf"
              data-url="${pdfPath}"
              data-filename="carrossel-${esc((post.title || 'post').replace(/[^a-zA-Z0-9]/g, '-').slice(0, 40))}.pdf">
              ${LiIcons.download} Baixar PDF Completo
            </button>
          </div>
        ` : ''}
      `;
    } else {
      // Fallback: badge-only display (no images available yet)
      carouselSection = `
        <div class="li-preview-carousel">
          <div class="li-carousel-header">
            <span class="li-carousel-icon">${LiIcons.carousel}</span>
            <span class="li-carousel-label">Carrossel LinkedIn</span>
          </div>
          <div class="li-carousel-meta">
            <span class="li-carousel-badge">${LiIcons.carousel} ${slideCount} slides</span>
            <span class="li-carousel-badge">${visualStyle}</span>
            ${pdfPath ? `<span class="li-carousel-badge">${LiIcons.pdf} PDF gerado</span>` : ''}
          </div>
          <div class="li-carousel-dots">
            ${Array.from({ length: Math.min(Number(slideCount) || 5, 10) }, (_, i) =>
              `<span class="li-dot ${i === 0 ? 'li-dot-active' : ''}"></span>`
            ).join('')}
          </div>
        </div>
      `;
    }
  }

  // Cover section — only if post has cover data
  const hasCover = post.contentType === 'cover' || post.derivations?.cover;
  const coverData = post.derivations?.cover || {};

  const coverSection = hasCover ? `
    <div class="li-preview-cover">
      <div class="li-cover-header">
        <span class="li-cover-icon">${LiIcons.image}</span>
        <span class="li-cover-label">Capa LinkedIn</span>
      </div>
      <div class="li-cover-meta">
        <span class="li-cover-badge">${esc(coverData.style || 'Rascunho no Papel')}</span>
        <span class="li-cover-badge">${esc(coverData.slug || '—')}</span>
      </div>
      ${(post.covers?.image_url || coverData.coverPath) ? `
        <div class="li-cover-image-wrapper">
          <img src="${post.covers?.image_url || coverData.coverPath}" 
               alt="Capa: ${esc(post.title)}" 
               class="li-cover-image"
               loading="lazy"
               onerror="this.parentElement.innerHTML='<span class=\\'li-cover-error\\'>⚠️ Imagem indisponível</span>'" />
        </div>
      ` : ''}
    </div>
    ${(post.covers?.image_url || coverData.coverPath) ? `
      <div class="li-media-actions">
        <button class="li-media-download-btn" id="li-download-cover"
          data-url="${post.covers?.image_url || coverData.coverPath}"
          data-filename="capa-${esc((post.title || 'post').replace(/[^a-zA-Z0-9]/g, '-').slice(0, 40))}.png">
          ${LiIcons.download} Baixar Capa (PNG)
        </button>
      </div>
    ` : ''}
  ` : '';

  return `
    <div class="li-preview" id="linkedin-preview-card">
      <!-- LinkedIn Post Header -->
      <div class="li-preview-header">
        <div class="li-avatar">
          ${LiIcons.avatar}
        </div>
        <div class="li-author">
          <div class="li-author-name">
            Thiago Cardoso <span class="li-author-degree">• 1º</span>
          </div>
          <div class="li-author-meta">
            Agora • ${LiIcons.globe}
          </div>
        </div>
      </div>

      <!-- LinkedIn Post Body (text with truncation) -->
      <div class="li-preview-body">
        <div class="li-text" id="li-text-content">
          <span id="li-text-truncated">${esc(truncation.truncatedText)}</span>${truncation.shouldTruncate
            ? `<span class="li-see-more" id="li-see-more">  ...mais</span>`
            : ''
          }
          <span id="li-text-full" style="display:none">${esc(fullText)}<span class="li-see-less" id="li-see-less">  ...menos</span></span>
        </div>
      </div>

      <!-- Carousel section (only for carousel posts) -->
      ${carouselSection}

      <!-- Cover section (only for posts with cover) -->
      ${coverSection}

      <!-- LinkedIn Post Footer (decorative) -->
      <div class="li-preview-actions">
        <span class="li-action">${LiIcons.like} Gostei</span>
        <span class="li-action">${LiIcons.comment} Comentar</span>
        <span class="li-action">${LiIcons.share} Compartilhar</span>
        <span class="li-action">${LiIcons.send} Enviar</span>
      </div>
    </div>
  `;
}

// ─── EVENT HANDLERS ───
// Must be called AFTER the HTML is injected into the DOM
export function attachLinkedInPreviewEvents() {
  // ── See more / See less toggle ──
  const seeMore = document.getElementById('li-see-more');
  const seeLess = document.getElementById('li-see-less');
  const truncatedSpan = document.getElementById('li-text-truncated');
  const fullSpan = document.getElementById('li-text-full');

  if (seeMore && truncatedSpan && fullSpan) {
    seeMore.addEventListener('click', () => {
      truncatedSpan.style.display = 'none';
      seeMore.style.display = 'none';
      fullSpan.style.display = 'inline';
    });
  }

  if (seeLess && truncatedSpan && fullSpan) {
    seeLess.addEventListener('click', () => {
      truncatedSpan.style.display = 'inline';
      seeMore.style.display = 'inline';
      fullSpan.style.display = 'none';
    });
  }

  // ── Carousel slide navigation (only if carousel exists) ──
  const viewer = document.getElementById('carousel-viewer');
  if (viewer) {
    const allSlides = viewer.querySelectorAll('.carousel-slide');
    const allDots = viewer.querySelectorAll('.carousel-dot');
    const counter = document.getElementById('carousel-counter');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const total = allSlides.length;
    let current = 0;

    function goToSlide(n) {
      // Loop around
      if (n < 0) n = total - 1;
      if (n >= total) n = 0;

      allSlides.forEach(s => s.classList.remove('carousel-slide-active'));
      allDots.forEach(d => d.classList.remove('carousel-dot-active'));

      allSlides[n]?.classList.add('carousel-slide-active');
      allDots[n]?.classList.add('carousel-dot-active');

      if (counter) counter.textContent = `${n + 1}/${total}`;
      current = n;
    }

    prevBtn?.addEventListener('click', () => goToSlide(current - 1));
    nextBtn?.addEventListener('click', () => goToSlide(current + 1));

    // Dot click navigation
    allDots.forEach(dot => {
      dot.addEventListener('click', () => {
        goToSlide(parseInt(dot.dataset.dot));
      });
    });

    // Keyboard navigation (arrows) when carousel is in viewport
    document.addEventListener('keydown', (e) => {
      if (!viewer.offsetParent) return; // not visible
      if (e.key === 'ArrowLeft') { e.preventDefault(); goToSlide(current - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goToSlide(current + 1); }
    });
  }

  // ── SUPABASE-005: Inline download buttons ──
  const downloadCoverBtn = document.getElementById('li-download-cover');
  const downloadPdfBtn = document.getElementById('li-download-pdf');

  async function handleInlineDownload(url, filename) {
    try {
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
    } catch (err) {
      console.error('Inline download failed:', err);
      // Fallback: open in new tab
      window.open(url, '_blank');
    }
  }

  downloadCoverBtn?.addEventListener('click', () => {
    handleInlineDownload(downloadCoverBtn.dataset.url, downloadCoverBtn.dataset.filename);
  });

  downloadPdfBtn?.addEventListener('click', () => {
    handleInlineDownload(downloadPdfBtn.dataset.url, downloadPdfBtn.dataset.filename);
  });
}
