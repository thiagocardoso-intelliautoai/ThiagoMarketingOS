# Story CCC-001 — Settings Drawer: Migrar Banco de Imagens para Painel de Configurações

**🏷️ ID:** `CCC-001`
**📐 Estimativa:** 2.5h
**🔗 Depende de:** ASSETS-005 (galeria existente)
**🔗 Bloqueia:** Nenhuma
**👤 Assignee:** Dev (Frontend)
**🏷️ Labels:** `frontend`, `CCC`, `navigation`, `settings`, `UX-refactor`
**📊 Status:** `[x]` Done
**📋 Origem:** Auditoria de Design (Antigravity Design Expert)

---

## Descrição

> Como **gestor de conteúdo**, eu quero que a navegação principal tenha apenas "Create" e "Conteúdos", e que o banco de imagens esteja acessível via um **drawer de Configurações (⚙️)**, para que a interface fique limpa e escalável, sem competição visual entre destinos de produção e ferramentas de suporte.

## Contexto Técnico

- **Problema identificado:** O "Banco de Imagens" ocupa um slot da nav principal com o mesmo peso visual de "Create" e "Conteúdos", mas é usado semanalmente vs. diariamente.
- **Decisão de design:** Opção A — Settings Drawer (slide-in lateral direito).
- **Design System:** Charcoal & Teal, Anti-AI Editorial, Antigravity motion.
- **Módulo existente:** `js/assets.js` (602 linhas) com CRUD completo via Supabase.
- **Restrição:** O módulo `assets.js` não deve ser reescrito — apenas seu ponto de montagem muda de `#main-content` para `#settings-drawer-content`.

### Mapeamento de features futuras no Settings (NÃO implementar agora)

| Item | Módulo Fonte | Dados Hardcoded Hoje |
|---|---|---|
| 👤 Perfil LinkedIn | `linkedin-preview.js` L207 | "Thiago Cardoso" |
| 🎨 Estilos de Capa | `render.js` L687-711 | 5 estilos estáticos |
| 🎠 Estilos de Carrossel | `render.js` L623-643 | 4 estilos estáticos |
| 🔗 Conexão Supabase | `supabase.js` L5-6 | URL + anon key |
| 📝 Prompts Base | `prompts.js` | Templates fixos |

> **Ação:** Renderizar itens com label + badge "Em breve" (disabled state). Isso comunica direção de produto sem gerar expectativa.

---

## Sub-tarefas

### 1.1 — Refatorar HTML: Nav Principal + Drawer Shell

- [x] **1.1.1** Em `index.html`, **remover** o link `<a href="#ativos">` (linhas 26-30) da `<nav class="header-nav">`

- [x] **1.1.2** Em `index.html`, **adicionar** botão ⚙️ **fora** do pill de navegação, como filho direto de `<header>`, após o `<nav>`:

```html
<button class="settings-trigger" id="settings-trigger" aria-label="Configurações" title="Configurações">
  <svg viewBox="0 0 24 24" width="20" height="20">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
</button>
```

> **Rationale arquitetural:** O botão de settings fica fora do `<nav>` pill porque ele não é um destino de rota — é um trigger de overlay. Isso preserva a semântica de navegação do pill (apenas rotas hash) e evita conflito visual com o active state.

- [x] **1.1.3** Em `index.html`, **adicionar** o drawer shell antes do `<!-- TOAST CONTAINER -->`:

```html
<!-- ─── SETTINGS DRAWER ─── -->
<div class="settings-overlay" id="settings-overlay"></div>
<aside class="settings-drawer" id="settings-drawer" role="complementary" aria-label="Painel de configurações">
  <div class="settings-drawer-header">
    <h2 class="settings-drawer-title">
      <svg viewBox="0 0 24 24" width="18" height="18">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
      </svg>
      Configurações
    </h2>
    <button class="btn-icon modal-close" id="settings-close" aria-label="Fechar">
      <svg viewBox="0 0 24 24" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>
  <nav class="settings-menu" id="settings-menu">
    <!-- Menu items injected by JS -->
  </nav>
  <div class="settings-drawer-content" id="settings-drawer-content">
    <!-- Active section content injected by JS -->
  </div>
</aside>
```

> **Nota:** O `<aside>` usa `role="complementary"` por ser conteúdo suplementar, não navegação primária.

---

### 1.2 — Refatorar JS: Router + Drawer Controller

- [x] **1.2.1** Em `app.js`, **remover** o case `#ativos` do switch router (linhas 18-22)

- [x] **1.2.2** Em `app.js`, **remover** a lógica de active state do `nav-ativos` que não existirá mais

- [x] **1.2.3** Em `app.js`, **adicionar** controller do drawer no `init()`:

```javascript
// ─── SETTINGS DRAWER CONTROLLER ───
const settingsTrigger = document.getElementById('settings-trigger');
const settingsDrawer = document.getElementById('settings-drawer');
const settingsOverlay = document.getElementById('settings-overlay');
const settingsClose = document.getElementById('settings-close');

function openSettings() {
  settingsDrawer.classList.add('settings-open');
  settingsOverlay.classList.add('settings-overlay-visible');
  document.body.style.overflow = 'hidden';
  // Lazy-load assets module on first open
  if (!settingsDrawer.dataset.loaded) {
    loadSettingsMenu();
    settingsDrawer.dataset.loaded = 'true';
  }
}

function closeSettings() {
  settingsDrawer.classList.remove('settings-open');
  settingsOverlay.classList.remove('settings-overlay-visible');
  document.body.style.overflow = '';
}

settingsTrigger?.addEventListener('click', openSettings);
settingsOverlay?.addEventListener('click', closeSettings);
settingsClose?.addEventListener('click', closeSettings);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && settingsDrawer.classList.contains('settings-open')) {
    closeSettings();
  }
});
```

> **Decisão arquitetural — Lazy Loading:** O `import('./assets.js')` só acontece no primeiro clique do ⚙️. Isso evita carregar ~600 linhas de JS que não são usadas em 80% das sessões.

- [x] **1.2.4** Em `app.js`, **adicionar** função `loadSettingsMenu()` que renderiza o menu e carrega o Banco de Imagens:

```javascript
async function loadSettingsMenu() {
  const menu = document.getElementById('settings-menu');
  const content = document.getElementById('settings-drawer-content');
  
  // Define all settings sections
  const sections = [
    { id: 'photos', icon: '📸', label: 'Banco de Imagens', active: true },
    { id: 'profile', icon: '👤', label: 'Perfil LinkedIn', active: false },
    { id: 'cover-styles', icon: '🎨', label: 'Estilos de Capa', active: false },
    { id: 'carousel-styles', icon: '🎠', label: 'Estilos de Carrossel', active: false },
    { id: 'connection', icon: '🔗', label: 'Conexão Supabase', active: false },
    { id: 'prompts', icon: '📝', label: 'Templates de Prompt', active: false },
  ];

  menu.innerHTML = sections.map(s => `
    <button class="settings-menu-item ${s.active ? 'settings-menu-active' : ''} ${!s.active ? 'settings-menu-disabled' : ''}"
            data-section="${s.id}" ${!s.active ? 'disabled' : ''}>
      <span class="settings-menu-icon">${s.icon}</span>
      <span class="settings-menu-label">${s.label}</span>
      ${!s.active ? '<span class="settings-menu-badge">Em breve</span>' : ''}
    </button>
  `).join('');

  // Load the active section (Banco de Imagens)
  const { renderAssets } = await import('./assets.js');
  renderAssets();
}
```

---

### 1.3 — Refatorar assets.js: Montar no Drawer

- [x] **1.3.1** Em `assets.js`, **alterar** a função `renderAssets()` (linha 18):

**DE:**
```javascript
export async function renderAssets() {
  const main = document.getElementById('main-content');
  main.innerHTML = buildPageHTML();
```

**PARA:**
```javascript
export async function renderAssets() {
  const target = document.getElementById('settings-drawer-content') 
                || document.getElementById('main-content');
  target.innerHTML = buildPageHTML();
```

> **Fallback preservado:** Se o drawer não existir (ex: testes isolados), usa `main-content`. Zero breaking changes.

- [x] **1.3.2** Em `assets.js`, **alterar** `buildPageHTML()` (linha 39) — remover o `<h1>` e subtítulo, pois o drawer header já identifica a seção:

**DE:**
```javascript
function buildPageHTML() {
  return `
    <section class="assets-page">
      <div class="assets-header">
        <div>
          <h1 class="section-title">Banco de Imagens</h1>
          <p class="section-subtitle">Fotos de referência para composição visual dos squads</p>
        </div>
        <button class="btn-primary" id="btn-upload-photo">
```

**PARA:**
```javascript
function buildPageHTML() {
  return `
    <section class="assets-page assets-page--drawer">
      <div class="assets-header">
        <span class="assets-header-label">Fotos de referência para composição visual</span>
        <button class="btn-primary btn-sm" id="btn-upload-photo">
```

> **Rationale:** Dentro do drawer, o título redundante desperdiça espaço vertical. O label descritivo vira uma linha sutil.

- [x] **1.3.3** Em `assets.js`, **alterar** `updateBadge()` (linha 561) — remover referência ao badge do header que não existe mais:

**DE:**
```javascript
function updateBadge(count) {
  const badge = document.getElementById('assets-badge');
```

**PARA:**
```javascript
function updateBadge(count) {
  const badge = document.getElementById('settings-photos-count');
```

> O badge agora vive dentro do menu item do settings, não no header global.

---

### 1.4 — CSS: Drawer + Overlay + Menu + Animações

- [x] **1.4.1** Em `styles.css`, **adicionar** ao final do arquivo (antes de `@media (prefers-reduced-motion)`) os estilos do Settings Drawer:

**Componentes CSS a adicionar:**

```
/* ─── SETTINGS TRIGGER (Header Button) ─── */
.settings-trigger                 → botão circular 36px, ghost, ícone engrenagem
.settings-trigger:hover           → rotate(45deg), teal glow sutil

/* ─── SETTINGS OVERLAY ─── */
.settings-overlay                 → fixed inset, rgba(0,0,0,0.5), z-index: 150
.settings-overlay-visible         → opacity: 1, pointer-events: auto

/* ─── SETTINGS DRAWER ─── */
.settings-drawer                  → fixed right: 0, top: 0, bottom: 0
                                     width: 420px, z-index: 200
                                     bg-secondary + backdrop-filter
                                     transform: translateX(100%)
                                     transition: transform var(--transition-smooth)
.settings-drawer.settings-open    → transform: translateX(0)

/* ─── DRAWER HEADER ─── */
.settings-drawer-header           → flex, justify-between, align-center
                                     padding, border-bottom sutil

/* ─── SETTINGS MENU ─── */
.settings-menu                    → flex column, gap: 2px, padding
.settings-menu-item               → flex, align-center, gap, padding
                                     border-radius: var(--radius-sm)
                                     transition: background
.settings-menu-item:hover         → bg rgba(255,255,255,0.04)
.settings-menu-active             → bg rgba(20,184,166,0.08)
                                     left border 2px teal
.settings-menu-disabled           → opacity: 0.4, cursor: not-allowed
.settings-menu-badge              → font-size 0.68rem, pill "Em breve"
                                     bg rgba(255,255,255,0.06)

/* ─── DRAWER CONTENT ─── */
.settings-drawer-content          → flex: 1, overflow-y: auto, padding

/* ─── DRAWER VARIANT para assets-page ─── */
.assets-page--drawer              → sem min-height (drawer tem seu próprio scroll)
.assets-page--drawer .gallery-grid → grid cols repeat(auto-fill, minmax(160px, 1fr))
                                     (menor minmax pois drawer é 420px)
```

**Especificações de animação:**
- Drawer: `transform: translateX(100%) → translateX(0)` com `var(--transition-smooth)` (400ms cubic-bezier)
- Overlay: `opacity: 0 → 1` com `var(--transition-base)` (250ms)
- Settings trigger hover: `rotate(45deg)` com `var(--transition-base)`
- Menu items: stagger de 0.04s na primeira abertura

- [x] **1.4.2** Em `styles.css`, **adicionar** regra `prefers-reduced-motion` para o drawer:

```css
@media (prefers-reduced-motion: reduce) {
  .settings-drawer { transition: none; }
  .settings-overlay { transition: none; }
  .settings-trigger:hover svg { transform: none; }
}
```

---

## Diagrama de Dependência entre Arquivos

```
index.html ──── Remove: <a href="#ativos">
           ├── Adiciona: <button .settings-trigger>
           └── Adiciona: <aside .settings-drawer>

app.js ──────── Remove: case '#ativos'
           ├── Adiciona: openSettings() / closeSettings()
           └── Adiciona: loadSettingsMenu() → lazy import('./assets.js')

assets.js ───── Altera: renderAssets() target → settings-drawer-content
           ├── Altera: buildPageHTML() → remove h1, adapta layout
           └── Altera: updateBadge() → settings-photos-count

styles.css ──── Adiciona: ~120 linhas (drawer + overlay + menu + responsivo)
```

---

## Acceptance Criteria

- [x] Header mostra apenas `Create` e `Conteúdos` na nav pill
- [x] Ícone ⚙️ aparece à direita, separado do pill de navegação
- [x] Click no ⚙️ abre drawer com slide-in suave da direita
- [x] Overlay escuro aparece ao abrir o drawer
- [x] ESC, click no overlay e botão ✕ fecham o drawer
- [x] Menu do drawer lista 6 itens (1 ativo + 5 "Em breve")
- [x] "Banco de Imagens" abre a galeria dentro do drawer
- [x] Galeria mostra thumbnails, filtros por categoria, upload e lightbox
- [x] Toda funcionalidade do ASSETS-005 preservada (CRUD, drag&drop, lightbox)
- [x] Lightbox abre normalmente usando o modal overlay existente (não fica preso no drawer)
- [x] Upload modal funciona sem conflito com o drawer
- [x] `prefers-reduced-motion: reduce` desativa animações do drawer
- [x] Layout do gallery grid adaptado para 420px de largura

## Definition of Done

✅ Nav principal contém apenas 2 rotas core (Create, Conteúdos)
✅ Banco de Imagens acessível via ⚙️ → Settings Drawer
✅ Zero regressão na funcionalidade do CRUD de fotos
✅ Drawer visualmente premium (Charcoal & Teal + Antigravity motion)
✅ 5 itens futuros visíveis como "Em breve" (comunicação de roadmap)

## Riscos Técnicos

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Modal do lightbox/upload conflita com o drawer overlay | Média | Lightbox usa `z-index: 300` (acima do drawer 200) |
| Gallery grid quebra em 420px | Baixa | Mudar `minmax(240px)` → `minmax(160px)` no `.assets-page--drawer` |
| Lazy import falha se `assets.js` tiver erro | Baixa | Wrap em try/catch + toast de erro |
| Hash `#ativos` em bookmark antigo | Baixa | Router redireciona `#ativos` → `#dashboard` + abre drawer |

## File List

- `[x]` `content-command-center/index.html` — remove nav Ativos, adiciona trigger + drawer shell
- `[x]` `content-command-center/js/app.js` — remove rota #ativos, adiciona drawer controller
- `[x]` `content-command-center/js/assets.js` — adapta montagem para drawer
- `[x]` `content-command-center/css/styles.css` — estilos do drawer completo
