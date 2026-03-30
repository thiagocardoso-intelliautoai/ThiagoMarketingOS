---
task: "Revisão de Qualidade"
order: 1
input: |
  - carousel_copy: Copy final do carrossel
  - rendered_slides: Screenshots dos slides renderizados
output: |
  - scoring_table: Tabela com 5 critérios e scores
  - verdict: APPROVE ou REJECT
  - feedback: Feedback estruturado
---

# Revisão de Qualidade

Revisão enxuta e eficaz. 5 critérios, scoring rápido, veredicto claro.

## Process

1. Ler o copy completo do carrossel (post caption + texto dos slides)
2. Visualizar os screenshots renderizados de todos os slides
3. Ler `pipeline/data/quality-criteria.md` para referência dos critérios
4. Ler `pipeline/data/linkedin-strategy.md` para verificar tom de voz
5. Scoring de cada critério (1-10) com justificativa curta
6. Compilar veredicto: APPROVE (média >= 7, nenhum < 5) ou REJECT
7. Listar required changes (se REJECT) e suggestions (sempre)

## Output Format

```yaml
verdict: "APPROVE | REJECT"
overall_score: "X.X/10"

scoring:
  - criterion: "Alinhamento com tom de voz"
    score: "X/10"
    justification: "..."
  - criterion: "Legibilidade visual"
    score: "X/10"
    justification: "..."
  - criterion: "CTA funcional"
    score: "X/10"
    justification: "..."
  - criterion: "Aderência ACRE"
    score: "X/10"
    justification: "..."
  - criterion: "Consistência entre slides"
    score: "X/10"
    justification: "..."

strengths:
  - "..."

required_changes: # only if REJECT
  - slide: N
    issue: "..."
    fix: "..."

suggestions: # always present
  - "..."
```

## Output Example

> Use as quality reference, not as rigid template.

```yaml
verdict: "APPROVE"
overall_score: "8.2/10"

scoring:
  - criterion: "Alinhamento com tom de voz"
    score: "9/10"
    justification: "Tom direto, coloquial BR, sem corporativês. Hook agressivo alinhado com anti-guru."
  - criterion: "Legibilidade visual"
    score: "8/10"
    justification: "Texto legível em 1080x1350. Font sizes atendem mínimos. Contraste branco/preto excelente."
  - criterion: "CTA funcional"
    score: "7/10"
    justification: "CTA claro (comenta WORKFLOW) mas poderia ser mais específico sobre o que recebe."
  - criterion: "Aderência ACRE"
    score: "8/10"
    justification: "Post de Alcance com hook provocador. Tom e estrutura alinhados com o pilar."
  - criterion: "Consistência entre slides"
    score: "9/10"
    justification: "Design system uniforme, progressão lógica, último slide fecha com CTA coerente."

strengths:
  - "Hook do slide 1 passa scroll-stop test — contraste emocional forte"
  - "Dados específicos (15h/semana, 47%) criam credibilidade"

suggestions:
  - "Slide 3: considerar quebrar lista de 5 itens em 2 slides para melhor legibilidade mobile"
  - "CTA: adicionar o que o usuário vai receber ('mando o PDF com o workflow completo')"
```

## Quality Criteria

- [ ] Todos os 5 critérios avaliados com score e justificativa
- [ ] Veredicto consistente com scores (sem contradição)
- [ ] Pelo menos 1 strength identificado
- [ ] Suggestions separadas de required changes
- [ ] Feedback referencia slides/seções específicas

## Veto Conditions

Reject and redo if ANY are true:
1. Algum critério avaliado sem justificativa
2. Veredicto contradiz os scores (ex: APPROVE com critério abaixo de 5)
