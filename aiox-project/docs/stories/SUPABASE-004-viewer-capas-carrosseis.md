# Story SUPABASE-004 — Visualização Real de Capas e Carrosseis no Frontend

**🏷️ ID:** `SUPABASE-004`
**📐 Estimativa:** 2.5h
**🔗 Depende de:** Story 003
**🔗 Bloqueia:** Story 005
**👤 Assignee:** Dev Frontend
**🏷️ Labels:** `frontend`, `ui`, `media`, `high-impact`
**📊 Status:** `[x]` Ready for Review

---

## Descrição

> Como **Thiago (usuário do CCC)**, eu quero que ao clicar em **"Ver Post"**, a **capa apareça como imagem real** e o **carrossel apareça como slides navegáveis** (com setas ‹ ›), em vez de mostrar apenas o caminho do arquivo.

## Contexto Técnico

- **Arquivo principal:** `content-command-center/js/linkedin-preview.js` — 205 linhas
- **Arquivo secundário:** `content-command-center/js/render.js` — 833 linhas (modal `openViewPostModal` na linha 435)
- **CSS:** `content-command-center/css/styles.css` — 44KB
- **Problema atual:** Linhas 109 e 132 de `linkedin-preview.js` renderizam `<code>{path}</code>` em vez de `<img>`
- **Dados disponíveis após Story 3:** Cada post tem `covers.image_url` e `carousels.carousel_slides[].image_url`

---

## Sub-tarefas

- [x] **4.1** Refatorar `coverSection` em `linkedin-preview.js` (linhas 118-134) — trocar `<code>` por `<img>`:

```javascript
// ANTES (linha 122-134):
// <div class="li-cover-path"><code>${esc(coverData.coverPath)}</code></div>

// DEPOIS:
const coverImageUrl = post.covers?.image_url || coverData.coverPath || null;
const coverSection = hasCover && coverImageUrl ? `
    <div class="li-preview-cover">
      <img src="${coverImageUrl}" 
           alt="Capa: ${esc(post.title)}" 
           class="li-cover-image"
           loading="lazy" />
    </div>
` : '';
```

- [x] **4.2** Refatorar `carouselSection` em `linkedin-preview.js` (linhas 92-116) — trocar path por slide viewer com navegação:

```javascript
const slides = post.carousels?.carousel_slides || [];
// Se tem slides com URLs → renderizar viewer navegável
// Se não tem slides → mostrar só badges como fallback
```

O viewer deve ter:
- Container com `position: relative`
- `<img>` para cada slide (apenas o ativo visível)
- Botões ‹ › nas laterais (posição absoluta)
- Dots indicadores embaixo
- Counter `1/8` ao lado dos dots

- [x] **4.3** Adicionar event handler para navegação do carrossel em `attachLinkedInPreviewEvents()`:
  - Função `goToSlide(n)` que troca o slide ativo
  - Click nas setas ‹ › navega prev/next (com loop)
  - Click nos dots navega direto
  - Atualizar counter e dot ativo

- [x] **4.4** Adicionar CSS em `styles.css` para os novos componentes:

**Componentes CSS necessários:**
- `.li-cover-image` — imagem da capa (width 100%, max-height, object-fit contain)
- `.li-carousel-viewer` — container do viewer (relative, flex, background escuro)
- `.carousel-slide-container` — container dos slides (aspect-ratio 1080/1350)
- `.carousel-slide` — cada slide (display none por padrão)
- `.carousel-slide-active` — slide ativo (display block)
- `.carousel-nav` — botões ‹ › (absolutos, circular, semi-transparente)
- `.carousel-prev` / `.carousel-next` — posição esquerda/direita
- `.carousel-indicators` — container dos dots
- `.carousel-dot` / `.carousel-dot-active` — dots indicadores
- `.carousel-counter` — texto `1/8`

- [x] **4.5** Adicionar thumbnail nos cards da biblioteca em `renderPostCard()` (render.js, linha 328):
  - Se `post.covers?.image_url` existe → mostrar `<img>` mini antes do título
  - CSS `.post-card-thumb` — width 100%, height 140px, object-fit cover, border-radius top

---

## Acceptance Criteria

- [x] Clicar "Ver Post" num post com **capa** → imagem PNG aparece no preview LinkedIn
- [x] Clicar "Ver Post" num post com **carrossel** → slides aparecem navegáveis com setas ‹ ›
- [x] Clicar nos dots navega para o slide correto
- [x] Counter mostra `1/8`, `2/8`, etc.
- [x] Posts sem mídia continuam funcionando normalmente (só texto)
- [x] Cards na lista da biblioteca mostram mini thumbnail da capa
- [x] Imagens carregam com `loading="lazy"` para performance
- [x] Nenhum `<code>` com path de arquivo aparece mais

## Definition of Done

✅ Capas renderizam como imagens reais no preview
✅ Carrosseis navegáveis com setas e dots
✅ Zero caminhos de arquivo visíveis na UI
✅ Performance OK (lazy loading)

## File List

- `[x]` `content-command-center/js/linkedin-preview.js` — [MODIFY] coverSection + carouselSection + navigation events
- `[x]` `content-command-center/js/render.js` — [MODIFY] thumbnail nos cards (renderPostCard)
- `[x]` `content-command-center/css/styles.css` — [MODIFY] novos componentes (.li-cover-image, .carousel-viewer, .post-card-thumb)
