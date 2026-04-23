# Task: Review do Briefing

> Step 03 do pipeline — Revisar briefing completo antes da aprovação do Thiago.

---

## Metadata
- **Step:** step-03-review-briefing
- **Agent:** redator-briefing (Bruno Briefing — auto-review)
- **Input:** `output/briefing-{slug}.md`
- **Output:** `output/briefing-{slug}.md` (revisado, com score)

---

## Context Loading

Carregar antes de executar:
- `output/briefing-{slug}.md` — Briefing a revisar
- `data/formato-materia-colab.md` — Regras do formato
- `data/linkedin-strategy.md` — Lente e regras de qualidade

---

## Instruções

### 1. Verificar Vetos (OBRIGATÓRIO — PRIMEIRO)

Se QUALQUER veto disparar, REFAZER antes de continuar:

1. ❌ Existe referência a "entrevista", "reunião prévia" ou "pauta combinada"
2. ❌ Headline não passa no gate da lente
3. ❌ Citação sem fonte verificável
4. ❌ Menos de 3 seções na estrutura

### 2. Avaliar Completude

| Seção | Presente? | Qualidade |
|-------|-----------|-----------|
| Contexto da pessoa | [ ] | [1-10] |
| Ângulo pela lente | [ ] | [1-10] |
| Estrutura de matéria (3-5 seções) | [ ] | [1-10] |
| Citações/dados como lastro | [ ] | [1-10] |
| Ganchos de DM (2-3) | [ ] | [1-10] |
| Headlines alternativas (2-3) | [ ] | [1-10] |
| Formato visual indicado | [ ] | [1-10] |

### 3. Avaliar Aderência à Lente

- A matéria reforça "Built, not prompted" em todas as seções?
- As headlines passam no gate test?
- O sujeito é veículo da tese do Thiago, não protagonista desconectado?

### 4. Calcular Score

| Critério | Peso | Nota (1-10) | Ponderado |
|----------|------|-------------|-----------|
| Completude | 30% | ___ | ___ |
| Aderência à lente | 30% | ___ | ___ |
| Qualidade das citações/lastro | 20% | ___ | ___ |
| Headlines + ganchos de DM | 20% | ___ | ___ |
| **TOTAL** | 100% | | **___** |

- **Score ≥ 7/10** → ✅ Entregar para aprovação do Thiago
- **Score < 7/10** → 🔄 Refazer (max 1 tentativa, depois reescrever seções fracas)

### 5. Adicionar Nota de Review

Incluir no final do briefing:

```
---
## Review
- **Score:** [X]/10
- **Status:** ✅ Aprovado para review do Thiago / 🔄 Refazer
- **Pontos fortes:** [1-2 itens]
- **Pontos a melhorar:** [1-2 itens, se houver]
```

---

## Próximo Passo

→ **step-04**: ⏸️ CHECKPOINT FINAL — Thiago revisa e aprova briefing
