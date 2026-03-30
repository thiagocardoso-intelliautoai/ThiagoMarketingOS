# Story SUPABASE-005 — Botões de Download + UX Polish

**🏷️ ID:** `SUPABASE-005`
**📐 Estimativa:** 1h
**🔗 Depende de:** Story 004
**🔗 Bloqueia:** Story 007
**👤 Assignee:** Dev Frontend
**🏷️ Labels:** `frontend`, `ux`, `download`
**📊 Status:** `[x]` Ready for Review

---

## Descrição

> Como **Thiago**, eu quero ter **botões de download** para baixar a capa (PNG) e o carrossel (PDF) diretamente do modal "Ver Post", além do botão "Copiar Post" que já existe.

---

## Sub-tarefas

- [x] **5.1** Atualizar o `modal-footer` em `openViewPostModal()` (render.js, linha ~492):

**Regras de exibição dos botões:**
- Se post **tem capa** (`post.covers?.image_url`) → mostrar "⬇️ Baixar Capa" como `<a download>`
- Se post **não tem capa** → mostrar "🖼️ Gerar Capa" (abre modal de prompt como hoje)
- Se post **tem carrossel** (`post.carousels?.pdf_url`) → mostrar "📄 Baixar PDF"
- Se post **não tem carrossel** → mostrar "🎠 Gerar Carrossel" (abre modal de prompt como hoje)
- **"📋 Copiar Post"** → sempre visível

- [x] **5.2** Adicionar botões de download dentro do preview LinkedIn (abaixo da imagem/viewer):
  - Abaixo da capa: `⬇️ Baixar Capa (PNG)`
  - Abaixo do carrossel: `📄 Baixar PDF Completo`

- [x] **5.3** Estilizar `.li-media-actions` — flex, centered, com hover animation sutil

- [x] **5.4** Implementar download cross-origin se necessário:

```javascript
// O atributo download pode não funcionar cross-origin (Supabase).
// Se necessário, usar fetch → blob → download programático:
async function downloadFile(url, filename) {
  const res = await fetch(url);
  const blob = await res.blob();
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
```

- [x] **5.5** Adicionar indicadores visuais nos cards da Biblioteca:
  - Badge "📸 Capa" com cor verde se capa existe (com URL real no banco)
  - Badge "📄 Carrossel" com cor azul se carrossel existe (com URL real no banco)
  - Manter badges atuais cinza se post não tem mídia no banco

---

## Acceptance Criteria

- [x] Botão "Baixar Capa" baixa o arquivo PNG no computador
- [x] Botão "Baixar PDF" baixa o arquivo PDF no computador
- [x] Botões condicionais — "Gerar" quando não tem, "Baixar" quando tem
- [x] Downloads funcionam mesmo com URLs cross-origin do Supabase
- [x] Badges visuais distinguem posts com/sem mídia na biblioteca

## Definition of Done

✅ Download funcional para todos os formatos (PNG, PDF)
✅ UX intuitiva — botões claros e contextuais
✅ Zero console errors

## File List

- `[x]` `content-command-center/js/render.js` — [MODIFY] modal footer + badges + downloadFile()
- `[x]` `content-command-center/js/linkedin-preview.js` — [MODIFY] botões download inline + handleInlineDownload()
- `[x]` `content-command-center/css/styles.css` — [MODIFY] .li-media-actions, .btn-download, .badge-media-ready/pending

## Dev Agent Record

### Change Log
- **5.1** — Modal footer now conditionally renders "Baixar Capa" / "Gerar Capa" and "Baixar PDF" / "Gerar Carrossel" based on `post.covers?.image_url` and `post.carousels?.pdf_url`
- **5.2** — Inline download buttons added below cover image (`li-download-cover`) and carousel viewer (`li-download-pdf`) inside LinkedIn preview
- **5.3** — `.li-media-actions` styled as flex centered container with `.li-media-download-btn` pill buttons featuring hover lift and icon bounce animations
- **5.4** — `downloadFile()` in render.js and `handleInlineDownload()` in linkedin-preview.js both use fetch→blob→createObjectURL pattern for cross-origin Supabase downloads with fallback to window.open
- **5.5** — Library card badges now use `.badge-media-ready` (green for cover, blue for carousel) when real URL exists in database, `.badge-media-pending` (dimmed opacity) when only derivation metadata exists

### Agent Model Used
Claude Opus 4.6 (Thinking)

