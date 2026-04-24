# Task: Review da Matéria

> Step 05 do pipeline — Auto-review com veto check, completude e score ponderado.

---

## Metadata
- **Step:** step-05-review-materia
- **Agent:** redator-materia (Rita Redatora — auto-review)
- **Input:** `output/materia-{slug}-{angulo}.md` (com headlines e DM)
- **Output:** `output/materia-{slug}-{angulo}.md` (revisado, com score)

---

## Context Loading

Carregar antes de executar:
- `output/materia-{slug}-{angulo}.md` — Matéria completa a revisar
- `data/veto-conditions.md` — 6 condições de veto
- `data/atomos-estrategicos.md` — 6 átomos
- `data/formato-materia-colab.md` — Regras do formato

---

## Instruções

### 1. Verificar Vetos (OBRIGATÓRIO — PRIMEIRO)

Se QUALQUER veto disparar, REFAZER antes de continuar:

1. ❌ Matéria sem tese do Thiago (parece elogio/homenagem)
2. ❌ Citação inventada ou sem fonte verificável
3. ❌ Referência a entrevista, reunião ou pauta combinada
4. ❌ Tom de colab tradicional (agradecimento, celebração)
5. ❌ Formato diferente de Editorial Clean (ex: Caderno)
6. ❌ Risco declarado no ângulo ignorado

### 2. Avaliar Completude

| Seção | Presente? | Qualidade (1-10) |
|-------|-----------|------------------|
| Contexto da pessoa | [ ] | [___] |
| Seções de matéria (3-5 com frases) | [ ] | [___] |
| Evidências ancoradas com fonte | [ ] | [___] |
| Marcações de slide (`<!-- slide -->`) | [ ] | [___] |
| Citações e dados como lastro | [ ] | [___] |
| Headlines alternativas (2-3) | [ ] | [___] |
| Ganchos de DM (2-3 tons) | [ ] | [___] |
| Formato visual indicado | [ ] | [___] |

### 3. Avaliar Aderência à Lente

- [ ] "Built, not prompted" presente como fio condutor em TODAS as seções?
- [ ] Headlines passam no gate test?
- [ ] Sujeito é evidência viva da tese, não protagonista homenageado?
- [ ] Gap "dentro vs fora" visível quando relevante?
- [ ] Idade como consequência, nunca como hook?

### 4. Avaliar Risco

Se o ângulo tinha risco declarado:
- [ ] A matéria endereça o risco com tese desafiadora?
- [ ] NÃO virou puxa-saco por medo do risco?
- [ ] Tom é respeitoso mas tem posição?

### 5. Verificar Marcações de Slide

- [ ] `<!-- slide -->` entre cada seção?
- [ ] Cada seção funciona como slide isolado (título + frases + evidência)?
- [ ] Quantidade de seções/slides adequada (3-5)?

### 6. Calcular Score

| Critério | Peso | Nota (1-10) | Ponderado |
|----------|------|-------------|-----------|
| Tese do Thiago como fio condutor | 25% | ___ | ___ |
| Qualidade das seções/frases | 20% | ___ | ___ |
| Aderência à lente (6 átomos) | 20% | ___ | ___ |
| Citações/lastro verificável | 15% | ___ | ___ |
| Headlines + ganchos de DM | 10% | ___ | ___ |
| Risco endereçado (se aplicável) | 10% | ___ | ___ |
| **TOTAL** | 100% | | **___** |

- **Score ≥ 7/10** → ✅ Entregar para aprovação do Thiago
- **Score < 7/10** → 🔄 Refazer (max 1 tentativa — reescrever seções fracas)

### 7. Adicionar Nota de Review

Incluir no final da matéria:

```markdown
---
## Review
- **Score:** [X]/10
- **Status:** ✅ Pronta para aprovação / 🔄 Refazer
- **Pontos fortes:** [1-2 itens]
- **Pontos a melhorar:** [1-2 itens, se houver]
- **Risco endereçado:** [sim/não/n.a.]
- **Marcações de slide:** [ok/faltam]
```

---

## Próximo Passo

→ **step-06**: ⏸️ CHECKPOINT FINAL — Thiago revisa e aprova matéria completa
