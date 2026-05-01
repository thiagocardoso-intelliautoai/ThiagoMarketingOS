# Story VISUAL-002 — Recomendador Automático de Visual (recommendVisual)

**🏷️ ID:** `VISUAL-002`
**📐 Estimativa:** 3-4h
**🔗 Depende de:** VISUAL-001 (vocabulário "vence/perde" usado nos motivos da sugestão)
**🔗 Bloqueia:** —
**👤 Assignee:** Dev (Frontend + Squads) + Data Engineer (DDL)
**🏷️ Labels:** `frontend`, `CCC`, `squads`, `recommender`, `supabase`
**📊 Status:** `[ ]` Ready

**📚 Referência arquitetural:** [VISUAL-RECOMMENDER-PLAN.md §3](../architecture/VISUAL-RECOMMENDER-PLAN.md)

---

## Descrição

> Como **operador de conteúdo**, eu quero que cada post finalizado já venha com uma sugestão automática de qual estilo visual usar (formato + estilo específico + motivo), exibida como uma estrelinha discreta no card recomendado dentro do CCC, para que eu pare de escolher no chute e tenha decisão guiada por critério estratégico — sem perder a liberdade de fazer override manual.

**UX minimalista (decisão do operador):** o card recomendado ganha apenas uma estrelinha (⭐), borda destacada e 1 linha de motivo no rodapé. **Sem banner separado, sem botão "aceitar", sem pré-seleção.** O operador continua copiando o prompt manualmente como hoje — a estrela apenas indica qual.

## Contexto Técnico

- **Sinais já existentes no post** (confirmado em `data.js`): `framework`, `fonteTese`, `hookText`, `hookStructure`, `body`, `cta`
- **Sinais derivados em runtime:** `char_count`, `dados_quant` (regex), `tem_etapas` (regex de listas numeradas), `frase_falsificavel` (heurística simples)
- **Sinais via checkbox no preview:** `tem_print_autoridade`, `tem_foto_contextual`
- **Arquitetura:** sugestão nasce no squad (post-final.md → save-post-cli → DB), CCC lê do DB; se vazio, recalcula client-side via `recommendVisual()`
- **Confiança visível como cor da borda:** alta = Teal sólido + ⭐; média = Teal 60% opacity; baixa = neutra + label "baixa confiança"
- **Sem mudança no DB exceto:** 1 coluna `posts.recommended_visual TEXT NULL`

---

## Sub-tarefas

### 2.1 — Função `recommendVisual()` client-side

- [ ] **2.1.1** Criar [content-command-center/js/recommend-visual.js](../../../content-command-center/js/recommend-visual.js) (NOVO arquivo) com:
  - `extractSignals(post)` — deriva sinais do post object
  - `recommendVisual(post)` — retorna `{ formato, estilo, confianca, motivo }`
  - Tabela de motivos curtos (1 frase por ramo da árvore de decisão)

```javascript
// Estrutura esperada:
export function recommendVisual(post) {
  const sig = extractSignals(post);
  const motivos = [];

  // Decisão 1: capa OU carrossel
  let formato;
  if (sig.tem_etapas >= 3) { formato = 'carrossel'; motivos.push('tem ≥3 etapas'); }
  else if (sig.dados_quant_comparativos >= 2) { formato = 'carrossel'; motivos.push('múltiplos dados comparativos'); }
  else if (sig.char_count > 1100 && ['Lista','Declaração+Defesa'].includes(sig.framework)) {
    formato = 'carrossel'; motivos.push('framework denso > 1100 chars');
  }
  else if (sig.framework === 'Storytelling' && sig.char_count > 1000) {
    formato = 'carrossel'; motivos.push('storytelling com arco longo');
  }
  else if (sig.frase_falsificavel || sig.dados_quant === 1 || sig.char_count <= 800) {
    formato = 'capa'; motivos.push('mensagem unitária');
  }
  else { formato = 'capa'; motivos.push('default — CTR maior na thumbnail'); }

  // Decisão 2: qual estilo (ramificação por formato — ver pseudo-código completo no plano §3.4)
  let estilo;
  if (formato === 'carrossel') {
    if (sig.dados_quant_comparativos >= 2 && sig.fonte_tese === 'Benchmark Real') estilo = 'Data-Driven';
    else if (sig.tem_print && sig.char_count > 800) estilo = 'Twitter-Style';
    else if (post.fonte === 'materia-colab') estilo = 'Editorial Clean';
    else if (['Falha Documentada','Skills em Produção','Process Diagnostic'].includes(sig.fonte_tese)) estilo = 'Notebook Raw';
    else estilo = 'Editorial Clean';
  } else {
    if (sig.frase_falsificavel && sig.char_count <= 600) estilo = 'Quote Card';
    else if (sig.dados_quant === 1) estilo = 'Micro-Infográfico';
    else if (sig.tem_print) estilo = 'Print de Autoridade';
    else if (sig.tem_foto_contextual && sig.framework === 'Storytelling') estilo = 'Pessoa + Texto';
    else estilo = 'Rascunho no Papel';
  }

  return { formato, estilo, confianca: calcConfidence(sig), motivo: motivos.join('; ') };
}
```

- [ ] **2.1.2** Implementar `extractSignals(post)` com regex:
  - `dados_quant`: count de `/\d+%/g`, `/R\$\s?\d+/g`, `/\d+x\b/g`, `/\d+\s*(?:min|h|seg|dias?)\b/gi`
  - `dados_quant_comparativos`: presença de `/(?:de|from)\s+\d+\s+(?:para|to)\s+\d+/i` OU múltiplos de `/\bvs\b/i`
  - `tem_etapas`: count de `/^\s*\d+[\.\)]\s/m` ≥ 3 OU `/passo \d/gi` ≥ 3
  - `frase_falsificavel`: hookText < 140 chars + termo contraintuitivo (`/não|nunca|verdade|mito|errado/i`)

- [ ] **2.1.3** Função `calcConfidence(sig)` retorna `'alta' | 'media' | 'baixa'` baseado em quantos sinais fortes são unânimes vs ambíguos

### 2.2 — Squads emitem sugestão no post-final.md

- [ ] **2.2.1** Atualizar [aiox-squads/squads/pesquisa-conteudo-linkedin/data/post-structure-linkedin.md](../../../aiox-squads/squads/pesquisa-conteudo-linkedin/data/post-structure-linkedin.md) (seção "Formato Técnico Obrigatório") — adicionar campo:

```markdown
## Metadata
- **Pilar ACRE:** ... (legacy)
- **Fonte de Tese:** ...
- **Tema:** ...
- **Framework:** ...
- **Hook:** ...
- **Sugestão Visual:** carrossel/Notebook Raw (lista de 5 pontos com tom pessoal)
```

- [ ] **2.2.2** Atualizar [aiox-squads/squads/pesquisa-conteudo-linkedin/tasks/07-estruturacao-post.md](../../../aiox-squads/squads/pesquisa-conteudo-linkedin/tasks/07-estruturacao-post.md) — passo final do redator emite a sugestão usando os sinais que ele já tem (framework, fonte_tese, char_count) + análise qualitativa

- [ ] **2.2.3** Atualizar squad de matéria-colab equivalente em `aiox-squads/squads/criar-materia-colab/`

### 2.3 — Persistência (DELEGAR a `/data-engineer`)

- [ ] **2.3.1** **DELEGAÇÃO:** @data-engineer cria migration adicionando coluna `recommended_visual TEXT NULL` na tabela `posts`. Sem enum, sem constraint, sem default.

- [ ] **2.3.2** Atualizar [aiox-squads/shared/scripts/save-post-cli.js](../../../aiox-squads/shared/scripts/save-post-cli.js) — extrair linha `Sugestão Visual:` do markdown via regex e popular o novo campo no insert/update

- [ ] **2.3.3** Atualizar [content-command-center/js/data.js](../../../content-command-center/js/data.js) — campo `recommendedVisual` no parse de row (`row.recommended_visual`) e no save (`recommended_visual: post.recommendedVisual`)

### 2.4 — UI minimalista no CCC

- [ ] **2.4.1** Em [content-command-center/js/render.js](../../../content-command-center/js/render.js), área do style selector (~linhas 600-740):
  - Importar `recommendVisual` de `recommend-visual.js`
  - Calcular `rec = post.recommendedVisual || stringify(recommendVisual(post))` (DB primeiro, fallback client-side)
  - Identificar qual card corresponde à sugestão (mapear nome do estilo → `data-style`)
  - Adicionar classe CSS `style-card-recommended` no card certo
  - Renderizar 1 linha pequena no rodapé do card recomendado: *"Sugestão para esse post — &lt;motivo curto&gt;"*

```javascript
// Pseudo-código:
const rec = parseRecommendation(post);  // { formato, estilo, motivo, confianca }
const styleCard = container.querySelector(`[data-style="${slugToNum(rec.estilo)}"]`);
if (styleCard) {
  styleCard.classList.add('style-card-recommended', `confianca-${rec.confianca}`);
  styleCard.insertAdjacentHTML('beforeend', `
    <div class="recommend-reason">⭐ Sugestão para esse post — ${esc(rec.motivo)}</div>
  `);
}
```

- [ ] **2.4.2** Adicionar 2 checkboxes no preview (acima do seletor de estilo):
  - "☐ Este post tem print de autoridade disponível"
  - "☐ Este post tem foto contextual disponível"
  - Mudança do checkbox dispara recálculo do `recommendVisual()` e re-aplica a classe CSS

### 2.5 — CSS minimalista

- [ ] **2.5.1** Adicionar em arquivo CSS existente do CCC (NÃO criar arquivo novo):

```css
.style-card-recommended {
  position: relative;
  border: 2px solid var(--accent-primary); /* Teal sólido — confiança alta */
}
.style-card-recommended.confianca-media { border-color: rgba(20, 184, 166, 0.6); }
.style-card-recommended.confianca-baixa { border-color: var(--text-muted); }

.style-card-recommended::before {
  content: '⭐';
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 1.2rem;
}

.recommend-reason {
  margin-top: var(--space-sm);
  padding-top: var(--space-sm);
  border-top: 1px dashed var(--border);
  font-size: 0.85rem;
  color: var(--accent-primary);
  font-style: italic;
}

.style-card-recommended.confianca-baixa .recommend-reason::after {
  content: ' (baixa confiança — escolha manualmente)';
  color: var(--text-muted);
}
```

### 2.6 — Testes unitários

- [ ] **2.6.1** Adicionar suite de testes para `recommendVisual()` em `content-command-center/tests/recommend-visual.test.js`:
  - PAS curto + Storytelling → `capa/Rascunho no Papel`
  - Lista densa (>3 etapas) + Skills → `carrossel/Notebook Raw`
  - Benchmark com 2+ números → `carrossel/Data-Driven`
  - Frase ultra falsificável (<140 chars + termo contraintuitivo) → `capa/Quote Card`
  - Storytelling + tem_foto = true → `capa/Pessoa + Texto`
  - 1 dado isolado → `capa/Micro-Infográfico`

---

## Acceptance Criteria

- [ ] `recommend-visual.js` exporta função pura `recommendVisual(post)` com retorno `{ formato, estilo, confianca, motivo }`
- [ ] `extractSignals` detecta corretamente: dados_quant, tem_etapas, frase_falsificavel, char_count
- [ ] Squads de pesquisa e matéria-colab emitem `Sugestão Visual:` no `## Metadata` do post-final.md
- [ ] `save-post-cli.js` extrai a sugestão e salva em `posts.recommended_visual`
- [ ] CCC mostra estrelinha + borda + 1 linha de motivo no card recomendado (sem banner, sem botão)
- [ ] Borda muda de cor por confiança (Teal sólido / 60% / neutra)
- [ ] Confiança baixa exibe "(baixa confiança — escolha manualmente)"
- [ ] 2 checkboxes adicionais no preview (tem_print, tem_foto) recalculam a sugestão dinamicamente
- [ ] Operador pode sempre escolher outro estilo — a sugestão é hint, não imposição
- [ ] Posts antigos sem `recommended_visual` no DB usam fallback client-side
- [ ] Testes unitários cobrem 6 cenários da árvore de decisão

## Definition of Done

✅ Operador abre o CCC, vê estrelinha no card sugerido + motivo curto
✅ Squads novos já emitem a sugestão no post-final.md
✅ Posts antigos têm fallback client-side
✅ Coluna `recommended_visual` criada via @data-engineer

## File List

**Novos:**
- `[ ]` `content-command-center/js/recommend-visual.js`
- `[ ]` `content-command-center/tests/recommend-visual.test.js`
- `[ ]` `aiox-project/supabase/migrations/YYYYMMDDHHMM_add_recommended_visual.sql` (DELEGADO @data-engineer)

**Modificados:**
- `[ ]` `content-command-center/js/render.js` — classe CSS no card recomendado + 2 checkboxes
- `[ ]` `content-command-center/css/styles.css` (ou equivalente) — `.style-card-recommended`, `.recommend-reason`
- `[ ]` `content-command-center/js/data.js` — campo `recommendedVisual` no parse/save
- `[ ]` `aiox-squads/shared/scripts/save-post-cli.js` — extrair `Sugestão Visual:` do markdown
- `[ ]` `aiox-squads/squads/pesquisa-conteudo-linkedin/tasks/07-estruturacao-post.md`
- `[ ]` `aiox-squads/squads/pesquisa-conteudo-linkedin/data/post-structure-linkedin.md`
- `[ ]` `aiox-squads/squads/criar-materia-colab/` (equivalente — verificar arquivo certo)

---

## Change Log

- 2026-04-30 — Story criada por @sm (River) com base no plano arquitetural [VISUAL-RECOMMENDER-PLAN.md §3](../architecture/VISUAL-RECOMMENDER-PLAN.md)
- 2026-04-30 — @po (Pax) validou via `*validate-story-draft`. Score 8/10 → **GO**. Status: Draft → Ready. Observações: critério 4 (scope IN/OUT) implícito via File List + AC, aceitável; critério 8 (riscos) não documentado por ser lógica client-side determinística (baixo risco). Atenção @dev: sub-tarefa 2.3 (DDL) deve ser delegada a @data-engineer.
