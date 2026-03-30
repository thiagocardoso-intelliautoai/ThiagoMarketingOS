# Story ASSETS-005 — Galeria de Gestão de Ativos no CCC

**🏷️ ID:** `ASSETS-005`
**📐 Estimativa:** 3h
**🔗 Depende de:** ASSETS-001
**🔗 Bloqueia:** Stories 006
**👤 Assignee:** Dev (Frontend)
**🏷️ Labels:** `frontend`, `CCC`, `gallery`, `upload`, `supabase`
**📊 Status:** `[ ]` To Do

---

## Descrição

> Como **gestor de conteúdo**, eu quero uma galeria visual dentro do Thiago Marketing OS (`localhost:5500/#ativos`) onde eu possa ver, adicionar e remover fotos do banco de imagens, para que eu gerencie as fotos usadas nos squads diretamente pelo browser sem depender de CLIs.

## Contexto Técnico

- **Design system:** Charcoal & Teal, princípios Anti-AI (Antigravity Design)
- **Rota:** `#ativos` — hash router existente, sem recarregar página
- **Supabase client:** Já configurado em `js/supabase.js` com anon key
- **RLS policies:** Criadas na ASSETS-001 (SELECT/INSERT/DELETE via anon key)
- Especificação de UX aprovada pelo Antigravity Design Expert

---

## Sub-tarefas

### 5.1 — Navegação + Rota

- [ ] **5.1.1** Modificar `index.html` — adicionar nav link "Ativos" no header

```html
<a href="#ativos" class="nav-link" data-section="ativos">
  <svg><!-- camera icon --></svg>
  Ativos
  <span class="badge" id="assets-count">0</span>
</a>
```

- [ ] **5.1.2** Modificar `js/app.js` — adicionar rota `#ativos`

```javascript
case 'ativos':
  document.getElementById('main-content').innerHTML = '';
  const { renderAssets } = await import('./assets.js');
  renderAssets();
  break;
```

### 5.2 — Módulo `js/assets.js`

- [ ] **5.2.1** Criar `js/assets.js` — módulo principal da galeria

**Funções exportadas:**
- `renderAssets()` — renderiza page header + category tabs + gallery grid
- `loadPhotos(category?)` — query Supabase `source_photos` filtrada por categoria
- `renderGalleryGrid(photos)` — gera cards com staggered entrance animation
- `openUploadModal()` — modal de upload com drag & drop
- `openLightbox(photo)` — modal lightbox full-size
- `deletePhoto(photoId, storagePath)` — delete do Storage + tabela com confirmação
- `copyUrl(publicUrl)` — clipboard + toast

### 5.3 — Supabase Helpers

- [ ] **5.3.1** Modificar `js/supabase.js` — adicionar helpers para `source_photos`

```javascript
// Source Photos CRUD
export async function getSourcePhotos(category = null) {
  let query = supabase.from('source_photos').select('*').eq('active', true).order('sort_order');
  if (category) query = query.eq('category', category);
  return query;
}

export async function insertSourcePhoto(data) {
  return supabase.from('source_photos').insert(data).select().single();
}

export async function deleteSourcePhoto(id) {
  return supabase.from('source_photos').delete().eq('id', id);
}

// Storage upload
export async function uploadSourceImage(file, storagePath) {
  return supabase.storage.from('content-assets').upload(storagePath, file, {
    cacheControl: '3600',
    upsert: true
  });
}

export async function deleteSourceImage(storagePath) {
  return supabase.storage.from('content-assets').remove([storagePath]);
}

export function getPublicUrl(storagePath) {
  return supabase.storage.from('content-assets').getPublicUrl(storagePath).data.publicUrl;
}
```

### 5.4 — Estilos CSS

- [ ] **5.4.1** Modificar `css/styles.css` — adicionar estilos da galeria

**Componentes CSS a adicionar:**
- `.assets-page` — container da página
- `.category-tabs` — tabs pill com badge (Papéis/Fotos/Perfil)
- `.category-tab.active` — fundo `rgba(20, 184, 166, 0.1)`, borda teal
- `.gallery-grid` — `grid-template-columns: repeat(auto-fill, minmax(240px, 1fr))`
- `.asset-card` — card com `border-radius: var(--radius-card)`, hover `translateY(-4px)`
- `.asset-card__thumbnail` — `aspect-ratio: 4/3`, `object-fit: cover`
- `.asset-card__info` — filename + description + orientation pill
- `.asset-card__actions` — botões copy URL + delete
- `.upload-modal` — modal de upload (reusa `.modal` existente)
- `.upload-dropzone` — dashed border, hover teal, pulse animation on drag
- `.upload-progress` — barra de progresso teal animada
- `.lightbox-overlay` — `rgba(0,0,0,0.85)` backdrop
- `.lightbox-image` — `max-height: 80vh`, `max-width: 90vw`
- `.lightbox-meta` — grid de metadados
- `@keyframes staggeredEntrance` — translateY + scale com delay
- `@media (prefers-reduced-motion: reduce)` — desativa animações

### 5.5 — Upload Modal

- [ ] **5.5.1** Implementar drag & drop zone com preview inline

```
┌────────────────────────────────────────┐
│ 📷 Upload de Imagem              [✕]  │
├────────────────────────────────────────┤
│  [Drag & drop zone com dashed border] │
│  Categoria:  [📓 Papéis ▼]            │
│  Descrição:  [________________]        │
│  Melhor para:[________________]        │
│  Orientação: [◯ Retrato ◯ Paisagem]    │
│  [Preview da imagem]                   │
│            [Cancelar]  [📤 Enviar]     │
└────────────────────────────────────────┘
```

**Validação (Review #5):**
- 🔴 **Hard block:** Tipo inválido (não JPG/PNG/WebP) ou tamanho > 10MB → toast de erro
- 🟡 **Soft warning:** Dimensão < 1080px → toast de aviso, mas **permite** upload

**Flow:**
1. Drag & drop ou click → FileReader API → preview inline
2. Preencher metadados (categoria, descrição, best_for, orientação)
3. Click "Enviar" → upload para Storage + insert na tabela
4. Barra de progresso durante upload
5. Toast "✅ Imagem enviada!" → refresh gallery

### 5.6 — Lightbox Modal

- [ ] **5.6.1** Implementar lightbox com metadados

- Imagem full-size: `max-height: 80vh`, `max-width: 90vw`
- Grid de metadados: filename, category, description, best_for, orientation, tamanho, data
- Botões: "Copiar URL" + "Baixar" + "Excluir"
- Close: ESC, click no overlay, botão X

### 5.7 — Badge Counter

- [ ] **5.7.1** Atualizar o badge no header com contagem de fotos ativas

---

## Acceptance Criteria

- [ ] Navegação para `#ativos` renderiza a galeria sem erros
- [ ] Category tabs filtram corretamente (Papéis/Fotos/Perfil)
- [ ] Cards mostram thumbnail, filename, description, orientation
- [ ] Click no card abre lightbox com imagem full-size + metadados
- [ ] "Copiar URL" copia a URL pública para o clipboard com toast
- [ ] Upload via drag & drop funciona com preview inline
- [ ] Upload hard block: rejeita arquivo .txt e arquivo > 10MB
- [ ] Upload soft warning: aceita JPG < 1080px com toast de aviso
- [ ] Upload cria registro na tabela `source_photos` + arquivo no Storage
- [ ] Delete remove do Storage + tabela com modal de confirmação
- [ ] Badge no header mostra contagem correta
- [ ] Staggered entrance animation nos cards
- [ ] `prefers-reduced-motion: reduce` desativa animações
- [ ] Layout responsivo com CSS Grid auto-fill

## Definition of Done

✅ Galeria funcional em `localhost:5500/#ativos`
✅ CRUD completo via browser (listar, upload, delete, copiar URL)
✅ Design Charcoal & Teal com Antigravity micro-animations
✅ Zero dependência de CLIs para gerenciar fotos pelo browser

## File List

- `[ ]` `content-command-center/js/assets.js` — [NEW] módulo de galeria
- `[ ]` `content-command-center/index.html` — nav link "Ativos"
- `[ ]` `content-command-center/js/app.js` — rota `#ativos`
- `[ ]` `content-command-center/js/supabase.js` — helpers source_photos + Storage
- `[ ]` `content-command-center/css/styles.css` — estilos galeria + upload + lightbox
