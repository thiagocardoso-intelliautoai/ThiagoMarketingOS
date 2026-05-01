# Story VISUAL-001 — Descrições "Vence Quando / Perde Quando" nos Estilos Visuais

**🏷️ ID:** `VISUAL-001`
**📐 Estimativa:** 2-3h
**🔗 Depende de:** —
**🔗 Bloqueia:** VISUAL-002 (motivo da sugestão usa o vocabulário cristalizado aqui)
**👤 Assignee:** Dev (Frontend + Squads)
**🏷️ Labels:** `frontend`, `CCC`, `squads`, `docs`, `cosmetic`
**📊 Status:** `[ ]` Ready

**📚 Referência arquitetural:** [VISUAL-RECOMMENDER-PLAN.md §2](../architecture/VISUAL-RECOMMENDER-PLAN.md)

---

## Descrição

> Como **operador de conteúdo**, eu quero ver, em cada card de estilo visual no CCC, uma descrição curta de "vence quando / perde quando", para que eu pare de escolher no chute e tenha critério claro na hora da decisão manual.

Hoje os 9 estilos visuais (5 de capa + 4 de carrossel) aparecem no CCC apenas como labels técnicos (ex: "Twitter-Style", "Notebook Raw"). Não há nenhuma indicação visível sobre quando cada um faz sentido. Esta story adiciona descrições curtas via tooltip/expansão no card e nos arquivos `visual-styles.md` dos squads.

**Decisão estratégica:** os nomes originais dos 9 estilos são mantidos (decisão do operador). A clareza vem da descrição, não do rótulo.

## Contexto Técnico

- **Frontend:** Vanilla JS no CCC, cards renderizados em `js/render.js` (área do style selector)
- **Squads:** 2 arquivos markdown (`visual-styles.md`) que documentam os estilos para os agentes
- **Source of truth:** markdown nos squads — operador edita facilmente, CCC consome
- **Sem mudança no DB:** zero migration, zero novos campos
- **Padrão visual:** Charcoal & Teal (consistente com Antigravity Design)

---

## Sub-tarefas

### 1.1 — Atualizar `visual-styles.md` da capa

- [ ] **1.1.1** Em [aiox-squads/squads/capas-linkedin/data/visual-styles.md](../../../aiox-squads/squads/capas-linkedin/data/visual-styles.md), adicionar bloco **"Perde Quando"** abaixo da seção **"Quando Usar"** existente em cada um dos 5 estilos:

| Estilo | Vence quando (já existe na seção "Quando Usar") | Perde quando (NOVO) |
|---|---|---|
| Rascunho no Papel | Conteúdo é visualizável em 3-5 blocos (framework, fluxo, comparação) e o tom permite informalidade | Conteúdo é puramente verbal (frase) ou puramente numérico (1 dado) |
| Pessoa + Texto | Post é sobre uma cena específica (palestra, cliente, setup) e existe foto adequada | Tema é abstrato/conceitual sem cena real para ancorar |
| Micro-Infográfico | Post inteiro orbita 1 dado quantitativo verificável com fonte citada | Tem ≥2 dados centrais (vai Data-Driven carrossel) ou nenhum dado |
| Print de Autoridade | Reação curta a algo público (tweet, headline) cabe em 1-2 parágrafos | Não tem print real, ou reação precisa de desenvolvimento longo |
| Quote Card | Existe UMA frase central falsificável que vira screenshot por si só | A força do post está no desenvolvimento, não numa frase isolada |

### 1.2 — Atualizar `visual-styles.md` do carrossel

- [ ] **1.2.1** Em [aiox-squads/squads/carrosseis-linkedin/data/visual-styles.md](../../../aiox-squads/squads/carrosseis-linkedin/data/visual-styles.md), adicionar bloco **"Perde Quando"** em cada um dos 4 estilos:

| Estilo | Vence quando | Perde quando |
|---|---|---|
| Twitter-Style | Há print real + reação tem desenvolvimento em ≥3 etapas/argumentos | Sem print disponível, ou reação cabe em 1 frame |
| Editorial Clean | Matéria-colab, framework denso/educacional, tutorial formal, tom premium-neutro | Tom é provocativo/pessoal (vai Notebook Raw) |
| Data-Driven | Há ≥2 números comparativos e a narrativa É sobre os dados | Só 1 número (vai Micro-Infográfico capa) ou não há dados centrais |
| Notebook Raw | Conteúdo tem arco pessoal/opinativo (mito, reflexão, framework pessoal) e tom é informal/cru | É matéria-colab (precisa premium) ou tem dados centrais (vai Data-Driven) |

### 1.3 — Estender labels no `prompts.js`

- [ ] **1.3.1** Em [content-command-center/js/prompts.js](../../../content-command-center/js/prompts.js) (linhas 82-87 e 99-105), trocar a estrutura de `estiloLabels` de `{ 1: 'string' }` para `{ 1: { label: '...', vence_quando: '...', perde_quando: '...' } }`.

```javascript
// Exemplo carrossel:
const estiloLabels = {
  1: {
    label: 'Twitter-style (fundo preto, print de autoridade)',
    vence_quando: 'Há print real + reação tem desenvolvimento em ≥3 etapas',
    perde_quando: 'Sem print disponível, ou reação cabe em 1 frame'
  },
  2: { label: '...', vence_quando: '...', perde_quando: '...' },
  // ...
};
```

- [ ] **1.3.2** Manter retrocompatibilidade — funções `carrossel()` e `capa()` continuam recebendo `estilo` numérico e renderizando o `label` no prompt (campos de descrição são metadata para o CCC).

### 1.4 — Adicionar tooltip nos cards do CCC

- [ ] **1.4.1** Em [content-command-center/js/render.js](../../../content-command-center/js/render.js) (área do style-selector, ~linhas 600-740), cada `.style-card` recebe `data-vence` e `data-perde` no HTML:

```javascript
// Exemplo dentro do loop que renderiza os cards:
<div class="style-card"
     data-style="${num}"
     data-vence="${esc(estiloLabels[num].vence_quando)}"
     data-perde="${esc(estiloLabels[num].perde_quando)}">
  <h4>${esc(estiloLabels[num].label)}</h4>
  <div class="style-card__hint">
    <span class="hint-vence">✅ ${esc(estiloLabels[num].vence_quando)}</span>
    <span class="hint-perde">❌ ${esc(estiloLabels[num].perde_quando)}</span>
  </div>
</div>
```

### 1.5 — Estilos CSS

- [ ] **1.5.1** Adicionar em arquivo CSS existente do CCC (NÃO criar novo arquivo):

```css
.style-card__hint {
  margin-top: var(--space-sm);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  font-size: 0.85rem;
  line-height: 1.4;
}
.hint-vence { color: var(--accent-primary); }   /* Teal */
.hint-perde { color: var(--text-muted); }
```

> **Decisão UX:** mostrar as 2 frases visíveis no card (sempre), não escondidas em tooltip. Tooltip CSS-puro é fallback para layouts comprimidos. Operador valida no review.

---

## Acceptance Criteria

- [ ] `visual-styles.md` da capa tem seção "Perde Quando" em cada um dos 5 estilos
- [ ] `visual-styles.md` do carrossel tem seção "Perde Quando" em cada um dos 4 estilos
- [ ] `prompts.js` exporta `estiloLabels` com estrutura `{ label, vence_quando, perde_quando }` para capa e carrossel
- [ ] Retrocompatibilidade preservada — funções `carrossel()` e `capa()` ainda funcionam com chamadas existentes
- [ ] Cards no CCC mostram as 2 frases (✅ vence / ❌ perde) abaixo do label técnico
- [ ] Estilo Charcoal & Teal mantido — cor `var(--accent-primary)` para "vence", `var(--text-muted)` para "perde"
- [ ] Conteúdo das frases idêntico entre `visual-styles.md` e `prompts.js` (consistência)
- [ ] Zero impacto em posts já salvos no DB
- [ ] Zero alteração nos slugs internos dos estilos

## Definition of Done

✅ Operador abre o CCC, vê descrições "vence/perde" em cada card de estilo
✅ Documentação dos squads atualizada — agentes e operador veem o mesmo critério
✅ Sem regressão visual nos cards existentes
✅ Sem alteração no DB

## File List

- `[ ]` `aiox-squads/squads/capas-linkedin/data/visual-styles.md` — adicionar "Perde Quando" nos 5 estilos
- `[ ]` `aiox-squads/squads/carrosseis-linkedin/data/visual-styles.md` — adicionar "Perde Quando" nos 4 estilos
- `[ ]` `content-command-center/js/prompts.js` — estrutura `{ label, vence_quando, perde_quando }`
- `[ ]` `content-command-center/js/render.js` — renderizar as 2 frases nos cards
- `[ ]` `content-command-center/css/styles.css` (ou arquivo equivalente) — `.style-card__hint`, `.hint-vence`, `.hint-perde`

---

## Change Log

- 2026-04-30 — Story criada por @sm (River) com base no plano arquitetural [VISUAL-RECOMMENDER-PLAN.md §2](../architecture/VISUAL-RECOMMENDER-PLAN.md)
- 2026-04-30 — @po (Pax) validou via `*validate-story-draft`. Score 8/10 → **GO**. Status: Draft → Ready. Observações: critério 4 (scope IN/OUT) implícito via File List, aceitável; critério 8 (riscos) não documentado por ser baixo risco (cosmético).
