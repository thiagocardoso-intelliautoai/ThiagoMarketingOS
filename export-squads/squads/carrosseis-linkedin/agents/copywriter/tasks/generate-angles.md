---
task: "Gerar Ângulos"
order: 1
input: |
  - tema: Tema fornecido pelo usuário no checkpoint
  - pilar_acre: Classificação ACRE inferida do tema
output: |
  - angles: 5 ângulos distintos com driver psicológico, hook preview e rationale
---

# Gerar Ângulos

Gera 5 ângulos distintos a partir do MESMO tema, cada um usando um driver psicológico diferente. Ângulo = perspectiva emocional sobre o assunto, NÃO um tema diferente.

## Process

1. Ler o tema fornecido e classificar no pilar ACRE (Alcance/Credibilidade/Retorno/Engajamento)
2. Rodar Pre-Writing Diagnosis: awareness level do público (Carlos Oliveira), market sophistication, Big Idea, e driver psicológico dominante
3. Gerar 5 ângulos usando drivers diferentes: Medo/Perda, Oportunidade, Educacional, Contrário, Inspiracional
4. Para cada ângulo: criar preview do hook (max 210 chars) + rationale de 1 linha

## Output Format

```yaml
tema: "..."
pilar_acre: "Alcance | Credibilidade | Retorno | Engajamento"
angles:
  - id: 1
    driver: "🔴 Medo/Perda"
    hook_preview: "..."
    rationale: "..."
  - id: 2
    driver: "🟢 Oportunidade"
    hook_preview: "..."
    rationale: "..."
  - id: 3
    driver: "📚 Educacional"
    hook_preview: "..."
    rationale: "..."
  - id: 4
    driver: "↔️ Contrário"
    hook_preview: "..."
    rationale: "..."
  - id: 5
    driver: "⭐ Inspiracional"
    hook_preview: "..."
    rationale: "..."
tom_recomendado: "nome do tom de tone-of-voice.md"
```

## Output Example

> Use as quality reference, not as rigid template.

```yaml
tema: "IA substituindo SDRs"
pilar_acre: "Alcance"
angles:
  - id: 1
    driver: "🔴 Medo/Perda"
    hook_preview: "Em 12 meses, SDRs que não usam IA vão custar 3x mais do que produzem. A conta já começou."
    rationale: "Loss aversion + dado específico cria urgência sem ser guru"
  - id: 2
    driver: "🟢 Oportunidade"
    hook_preview: "Enquanto o mercado debate se IA substitui SDRs, quem já integrou tá economizando 15h/semana."
    rationale: "Janela de oportunidade + dado concreto da Winning Sales"
  - id: 3
    driver: "📚 Educacional"
    hook_preview: "Testei 3 ferramentas de IA para qualificação de leads. Uma mudou a operação. As outras foram hype."
    rationale: "Teste real + filtro anti-hype alinha com posicionamento do Thiago"
  - id: 4
    driver: "↔️ Contrário"
    hook_preview: "IA não vai substituir seu SDR. Vai substituir o PROCESSO que o seu SDR odeia fazer."
    rationale: "Reframe da narrativa dominante, posição que diferencia"
  - id: 5
    driver: "⭐ Inspiracional"
    hook_preview: "Imagine seu time de vendas focando 100% em vender. Todo o resto? Automatizado. Já existe."
    rationale: "Future pacing + prova de que é possível (Winning Sales já faz)"
tom_recomendado: "Direto e Provocador"
```

## Quality Criteria

- [ ] Exatamente 5 ângulos, cada um com driver psicológico diferente
- [ ] Todos os ângulos são sobre o MESMO tema (não temas distintos)
- [ ] Hook preview cabe em ~210 caracteres
- [ ] Cada ângulo tem rationale de 1 linha explicando por que funciona
- [ ] Tom recomendado está alinhado com o pilar ACRE identificado

## Veto Conditions

Reject and redo if ANY are true:
1. Menos de 5 ângulos ou ângulos com drivers repetidos
2. Algum ângulo é sobre um tema diferente do fornecido pelo usuário
