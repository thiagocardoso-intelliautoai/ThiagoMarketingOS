# Task: Revisar Capa

## Metadata
- **Step:** step-05-review
- **Agent:** reviewer (Rui Revisão)
- **Input:** `output/cover-report.md`
- **Output:** `output/review.md`

---

## Context Loading

Carregar antes de executar:
- `output/cover-report.md` — Relatório da capa criada (design system + screenshot)
- `output/covers/{slug}/cover.png` — Screenshot renderizado para avaliação visual
- `data/quality-criteria.md` — Critérios de qualidade
- `data/linkedin-strategy.md` — Estratégia LinkedIn para validar aderência à lente
- `agents/reviewer.md` — Persona do Rui Revisão

---

## Instructions

### Process
1. Ver o PNG renderizado da capa (`output/covers/{slug}/cover.png`)
2. Ler o design system documentado
3. Avaliar os 5 critérios com score 1-10 cada
4. Separar required changes de suggestions
5. Emitir veredicto: APPROVE ou REJECT

### Critérios de Avaliação

| # | Critério | O que avaliar |
|:-:|----------|---------------|
| 1 | **Impacto Visual** | Para o scroll em 1 segundo? Hierarquia visual clara? |
| 2 | **Legibilidade Mobile** | Texto legível em 375px de largura real? Fontes grandes o suficiente? |
| 3 | **Alinhamento Tom de Voz** | Combina com o post? Anti-guru, direto, sem hype? |
| 4 | **Aderência à Lente** | Reforça "Built, not prompted"? Alinhado com a fonte de tese? |
| 5 | **Consistência Visual** | Segue design system? Identidade reconhecível? |

### Veredicto
- **APPROVE:** Média >= 7/10 E nenhum critério abaixo de 5/10
- **REJECT:** Média < 7/10 OU qualquer critério abaixo de 5/10

---

## Output Format

```
# Review — Capa [{slug}]

## Scores

| Critério | Score | Justificativa |
|----------|:-----:|---------------|
| Impacto Visual | X/10 | ... |
| Legibilidade Mobile | X/10 | ... |
| Alinhamento Tom de Voz | X/10 | ... |
| Aderência à Lente | X/10 | ... |
| Consistência Visual | X/10 | ... |
| **MÉDIA** | **X/10** | |

## Strengths
- [pontos fortes específicos]

## Required Changes
- [mudanças obrigatórias — só se REJECT]

## Suggestions
- [melhorias opcionais]

## Verdict: APPROVE / REJECT
```

---

## Veto Conditions

Rejeitar automaticamente se:
1. Texto ilegível no PNG renderizado
2. Viewport incorreto (diferente de 1080x1350)
3. Design system não documentado

---

## Quality Criteria

- [ ] Os 5 critérios avaliados com score e justificativa
- [ ] Veredicto consistente com scores
- [ ] Feedback acionável com referência a elemento específico
- [ ] Pelo menos 1 Strength identificado
- [ ] Required changes e Suggestions separados
