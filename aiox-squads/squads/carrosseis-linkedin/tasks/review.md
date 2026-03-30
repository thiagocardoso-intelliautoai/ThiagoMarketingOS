# Task: Revisão Final

## Metadata
- **Step:** step-08-review
- **Agent:** reviewer (Raul Revisão)
- **Input:** `output/slides-report.md`
- **Output:** `output/review.md`

---

## Context Loading

Carregar antes de executar:
- `output/carousel-copy.md` — Copy final do carrossel
- `output/slides-report.md` — Relatório de slides com screenshots
- `data/quality-criteria.md` — Critérios de qualidade
- `data/linkedin-strategy.md` — Estratégia e tom de voz
- `agents/reviewer.md` — Persona do Raul Revisão

---

## Instructions

### Process
1. Ler o copy completo do carrossel (caption + slides)
2. Visualizar screenshots renderizados de todos os slides
3. Scoring dos 5 critérios (1-10 cada): tom de voz, legibilidade visual, CTA funcional, aderência ACRE, consistência entre slides
4. Compilar veredicto: APPROVE (média >= 7, nenhum < 5) ou REJECT (média < 7 OU algum < 5)
5. Listar strengths, required changes (se REJECT) e suggestions (sempre)

---

## Output Format

```
# Review — [TEMA]

## Veredicto: [APPROVE / REJECT]
**Overall Score:** [X.X/10]

## Scoring

| Critério | Score | Justificativa |
|----------|-------|---------------|
| Tom de voz | X/10 | ... |
| Legibilidade visual | X/10 | ... |
| CTA funcional | X/10 | ... |
| Aderência ACRE | X/10 | ... |
| Consistência entre slides | X/10 | ... |

## Strengths
- [ponto forte específico]

## Required Changes (se REJECT)
- **Slide N:** [problema] → [fix]

## Suggestions
- [sugestão não-bloqueante]
```

---

## Output Example

```
# Review — IA substituindo SDRs

## Veredicto: APPROVE
**Overall Score:** 8.2/10

## Scoring

| Critério | Score | Justificativa |
|----------|-------|---------------|
| Tom de voz | 9/10 | Direto, coloquial BR, anti-guru. Hook provocador. |
| Legibilidade visual | 8/10 | Texto 38px legível em 1080x1350. Contraste 21:1. |
| CTA funcional | 7/10 | Claro mas poderia especificar o que recebe |
| Aderência ACRE | 8/10 | Alcance com hook provocador, estrutura alinhada |
| Consistência slides | 9/10 | Design system uniforme, progressão lógica |

## Strengths
- Hook contrário ("IA não substitui SDR, substitui o PROCESSO") diferencia e provoca
- Dados específicos (15h, 47%, 3 semanas ROI) criam credibilidade tangível

## Suggestions
- Slide 3: quebrar lista de 5 itens em 2 slides para melhor legibilidade mobile
- CTA: especificar o que vai mandar ("mando o workflow em PDF")
```

---

## Veto Conditions

Rejeitar e refazer se:
1. Algum critério sem justificativa
2. Veredicto contradiz scores

---

## Quality Criteria

- [ ] 5 critérios avaliados com score + justificativa
- [ ] Pelo menos 1 strength identificado
- [ ] Suggestions presentes (mesmo em APPROVE)
- [ ] Required changes com slide/seção específica e fix (se REJECT)
