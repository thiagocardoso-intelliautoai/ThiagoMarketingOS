# Story HARDENING-002 — Refatorar render.js + CSS Modular

**🏷️ ID:** `HARDENING-002`
**📐 Estimativa:** 2h
**🔗 Depende de:** HARDENING-001
**🔗 Bloqueia:** Nenhuma
**👤 Assignee:** Dev (Frontend)
**🏷️ Labels:** `frontend`, `refatoração`, `qualidade`, `CCC`
**📊 Status:** `[ ]` To Do
**📋 Origem:** Auditoria Arquitetural (Aria, 2026-03-30)
**🚨 Prioridade:** Importante — melhora manutenibilidade significativamente

---

## Descrição

> Como **desenvolvedor**, eu quero que o `render.js` (892 linhas) seja dividido em módulos coesos e o CSS monolítico (73KB) em partials organizadas, para que eu possa localizar e editar código rapidamente sem risco de efeitos colaterais.

## Contexto Técnico

O `render.js` é o "God File" do CCC — mistura 6 responsabilidades distintas:

| Bloco | Linhas (aprox.) | Responsabilidade |
|--|--|--|
| SVG Icons library | 1-41 | Definição de ~20 ícones inline |
| Constants (Pillar, Status, Urgency) | 44-62 | Mapeamentos de dados |
| Toast system | 65-82 | Notificações UI |
| Clipboard + Download | 84-119 | Utilidades |
| Modal system | 121-140 | Overlay control |
| Dashboard rendering | 142-287 | Tela principal |
| Library rendering | 289-460 | Lista de posts + filtros |
| All modals | 463-892 | View, Carousel, Cover, Delete, Add, Edit |

**Princípio:** Cada módulo ≤ 200 linhas. Imports explícitos. Responsabilidade única.

---

## Sub-tarefas

### 2.1 — Extrair `icons.js`

- [ ] **2.1.1** Criar `content-command-center/js/icons.js`:

```javascript
// icons.js — Lucide SVG Icon Library
// Extracted from render.js [HARDENING-002]

export const Icons = {
  // ... mover o objeto Icons inteiro do render.js (linhas 8-41)
};
```

- [ ] **2.1.2** Em `render.js`, remover o bloco `const Icons = { ... }` (linhas 8-41) e substituir por:

```javascript
import { Icons } from './icons.js';
```

---

### 2.2 — Extrair `toast.js`

- [ ] **2.2.1** Criar `content-command-center/js/toast.js`:

```javascript
// toast.js — Toast Notification System
// Extracted from render.js [HARDENING-002]
import { Icons } from './icons.js';

export function showToast(message, type = 'success') {
  // ... mover função showToast do render.js (linhas 65-82)
}
```

- [ ] **2.2.2** Em `render.js`, remover a função `showToast` e substituir por:

```javascript
import { showToast } from './toast.js';
```

> **Nota:** `showToast` é exportada no render.js e usada pelo `assets.js`. Atualizar imports em `assets.js` de `import { showToast } from './render.js'` para `import { showToast } from './toast.js'`.

---

### 2.3 — Extrair `modal.js`

- [ ] **2.3.1** Criar `content-command-center/js/modal.js`:

```javascript
// modal.js — Modal System
// Extracted from render.js [HARDENING-002]

export function openModal(contentHtml) {
  // ... mover função openModal do render.js (linhas 122-130)
}

export function closeModal() {
  // ... mover função closeModal do render.js (linhas 132-136)
}

// ESC handler
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
```

- [ ] **2.3.2** Em `render.js`, remover as funções `openModal`, `closeModal` e o event listener de ESC. Substituir por:

```javascript
import { openModal, closeModal } from './modal.js';
```

---

### 2.4 — Extrair `utils.js`

- [ ] **2.4.1** Criar `content-command-center/js/utils.js`:

```javascript
// utils.js — UI Utilities
// Extracted from render.js [HARDENING-002]
import { showToast } from './toast.js';

export async function copyToClipboard(text) {
  // ... mover do render.js (linhas 85-98)
}

export async function downloadFile(url, filename) {
  // ... mover do render.js (linhas 101-119)
}

export function escapeHtml(text) {
  // ... mover do render.js (buscar onde está definida)
}

export function truncate(text, maxLen) {
  // ... mover do render.js
}

export function formatDate(dateStr) {
  // ... mover do render.js
}
```

- [ ] **2.4.2** Em `render.js`, remover essas funções e substituir por:

```javascript
import { copyToClipboard, downloadFile, escapeHtml, truncate, formatDate } from './utils.js';
```

---

### 2.5 — Mover constants para `state.js`

- [ ] **2.5.1** Em `content-command-center/js/state.js`, adicionar ao final:

```javascript
export const PILLAR_CONFIG = {
  A: { label: 'Alcance', cssClass: 'badge-autoridade' },
  C: { label: 'Credibilidade', cssClass: 'badge-conexao' },
  R: { label: 'Retorno', cssClass: 'badge-resultado' },
  E: { label: 'Engajamento', cssClass: 'badge-engajamento' },
};

export const STATUS_LABELS = {
  armazem: 'Armazém',
  em_producao: 'Em produção',
  aprovado: 'Aprovado',
  publicado: 'Publicado',
};

export const URGENCY_LABELS = {
  urgente: 'Urgente',
  relevante: 'Relevante',
  pode_esperar: 'Pode esperar',
};
```

- [ ] **2.5.2** Em `render.js`, remover esses 3 objetos (linhas 44-62) e importar de `state.js`:

```javascript
import { MODE_LABELS, PILLAR_CONFIG, STATUS_LABELS, URGENCY_LABELS } from './state.js';
```

---

### 2.6 — Validar render.js final

- [ ] **2.6.1** O `render.js` resultante deve conter APENAS:
  - Imports dos novos módulos
  - `renderDashboard()` + funções auxiliares do dashboard
  - `renderLibrary()` + funções auxiliares da biblioteca
  - Funções de modal (openViewPostModal, openCarouselModal, etc.)
  - **Target: ≤ 500 linhas**

- [ ] **2.6.2** Testar no browser:
  - Dashboard renderiza os 5 modes
  - Biblioteca mostra posts com filtros
  - Modal "Ver Post" abre com tabs (LinkedIn Preview + Dados)
  - Modal "Gerar Carrossel" mostra 4 estilos e gera prompt
  - Modal "Gerar Capa" mostra 5 estilos e gera prompt
  - Toasts aparecem ao copiar prompt
  - Download de capa/PDF funciona
  - Settings drawer abre e mostra galeria

---

### 2.7 — CSS Modular (partials)

- [ ] **2.7.1** Criar estrutura de CSS partials:

```
content-command-center/css/
├── styles.css        ← importa os partials (arquivo mestre)
├── _tokens.css       ← custom properties, cores, spacing, typography
├── _base.css         ← reset, body, scrollbar, selection
├── _layout.css       ← header, nav, main, grid system
├── _components.css   ← buttons, badges, inputs, cards, selects
├── _dashboard.css    ← mode cards, expand panel, prompt block
├── _library.css      ← post cards, filters, empty state, FAB
├── _modals.css       ← modal overlay, modal content, form grid
├── _settings.css     ← settings drawer, menu, overlay
├── _toast.css        ← toast notifications
├── _preview.css      ← linkedin preview (se existir)
└── _responsive.css   ← media queries + prefers-reduced-motion
```

- [ ] **2.7.2** O `styles.css` final fica assim:

```css
/* styles.css — Design System: Charcoal & Teal */
/* Partials importados via CSS @import */

@import '_tokens.css';
@import '_base.css';
@import '_layout.css';
@import '_components.css';
@import '_dashboard.css';
@import '_library.css';
@import '_modals.css';
@import '_settings.css';
@import '_toast.css';
@import '_preview.css';
@import '_responsive.css';
```

- [ ] **2.7.3** Dividir o conteúdo atual de `styles.css` (73KB) nos partials seguindo os blocos de comentários existentes (`/* ─── HEADER ─── */`, `/* ─── MODE CARDS ─── */`, etc.)

> **Estratégia:** NÃO reescrever CSS — apenas mover blocos existentes para arquivos separados via cut-paste. A especificidade e ordem de cascata devem ser preservadas pela ordem dos `@import`.

- [ ] **2.7.4** Testar no browser que nenhum estilo quebrou (comparação visual com antes)

---

## Acceptance Criteria

- [ ] `render.js` tem ≤ 500 linhas
- [ ] 5 novos módulos JS criados (`icons.js`, `toast.js`, `modal.js`, `utils.js`, `config.js`)
- [ ] Constants movidas para `state.js`
- [ ] `styles.css` importa 11 partials via `@import`
- [ ] Nenhum partial excede 300 linhas
- [ ] Zero regressão visual ou funcional
- [ ] Todos os imports funcionam (nenhum módulo com `undefined`)

## Definition of Done

✅ render.js fragmentado (≤ 500 linhas)
✅ CSS fragmentado em partials temáticos
✅ Zero regressão funcional (dashboard, biblioteca, modals, toasts, downloads)
✅ Módulos com responsabilidade única

## Riscos Técnicos

| Risco | Probabilidade | Mitigação |
|--|--|--|
| Import circular entre módulos | Média | `icons.js` e `utils.js` são folhas (sem dependências circulares) |
| CSS `@import` performance | Baixa | Em dev local é imperceptível. Para production: concatenar em build |
| `showToast` importado de lugar errado | Média | Grep por `import.*showToast` e atualizar todos os consumers |
| Order of CSS partials importa | Média | Preservar a mesma ordem do CSS original ao dividir |

## File List

- `[ ]` `content-command-center/js/icons.js` — **NOVO** — SVG icon library
- `[ ]` `content-command-center/js/toast.js` — **NOVO** — toast system
- `[ ]` `content-command-center/js/modal.js` — **NOVO** — modal system
- `[ ]` `content-command-center/js/utils.js` — **NOVO** — clipboard, download, escapeHtml, formatDate, truncate
- `[ ]` `content-command-center/js/state.js` — adiciona PILLAR_CONFIG, STATUS_LABELS, URGENCY_LABELS
- `[ ]` `content-command-center/js/render.js` — refatorado (≤ 500 linhas)
- `[ ]` `content-command-center/js/assets.js` — atualiza import de showToast
- `[ ]` `content-command-center/css/styles.css` — vira import hub
- `[ ]` `content-command-center/css/_tokens.css` — **NOVO**
- `[ ]` `content-command-center/css/_base.css` — **NOVO**
- `[ ]` `content-command-center/css/_layout.css` — **NOVO**
- `[ ]` `content-command-center/css/_components.css` — **NOVO**
- `[ ]` `content-command-center/css/_dashboard.css` — **NOVO**
- `[ ]` `content-command-center/css/_library.css` — **NOVO**
- `[ ]` `content-command-center/css/_modals.css` — **NOVO**
- `[ ]` `content-command-center/css/_settings.css` — **NOVO**
- `[ ]` `content-command-center/css/_toast.css` — **NOVO**
- `[ ]` `content-command-center/css/_preview.css` — **NOVO**
- `[ ]` `content-command-center/css/_responsive.css` — **NOVO**
