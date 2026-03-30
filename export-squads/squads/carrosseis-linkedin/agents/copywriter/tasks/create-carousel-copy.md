---
task: "Criar Copy do Carrossel"
order: 2
input: |
  - angle_selected: Ângulo escolhido pelo usuário
  - tema: Tema original
  - tom: Tom de voz selecionado
output: |
  - post_caption: Texto do post LinkedIn (max 3000 chars)
  - slides: Array de slides com texto por slide
  - hashtags: 3-5 hashtags
---

# Criar Copy do Carrossel

Escreve o copy completo do carrossel: post caption para LinkedIn + texto slide-a-slide, usando o ângulo e tom selecionados.

## Process

1. Ler o ângulo selecionado, o tema, e o tom de voz escolhido
2. Ler `pipeline/data/linkedin-strategy.md` para absorver a voz do Thiago
3. Ler `pipeline/data/tone-of-voice.md` para aplicar o tom correto
4. Escrever o hook do slide 1 (max ~210 chars, scroll-stop test)
5. Desenvolver 3-8 slides de conteúdo (1 ideia por slide, max 30 palavras)
6. Criar slide CTA final (ação específica ou pergunta genuína)
7. Escrever post caption completo (contexto + CTA + hashtags)
8. Rodar Copy Stress Test: scroll-stop test, prova por trás de cada claim, sem filler, word count reduzido 15-25%

## Output Format

```yaml
post_caption: |
  [Texto completo do post LinkedIn - max 3000 chars]
  [Inclui hook, contexto breve, chamada para slides, hashtags]

slides:
  - slide: 1
    type: hook
    text: "..."
    notes: "Print de autoridade (se Twitter-style) ou foto (se Pessoa-style)"
  - slide: 2
    type: content
    text: "..."
  - slide: 3
    type: content
    text: "..."
  - slide: N
    type: cta
    text: "..."

hashtags: "#tag1 #tag2 #tag3 #tag4 #tag5"
total_slides: N
pilar_acre: "..."
tom_aplicado: "..."
```

## Output Example

> Use as quality reference, not as rigid template.

```yaml
post_caption: |
  15 horas por semana.

  Era isso que nosso time de SDR gastava em tarefas que um sistema faz em 12 minutos.

  A gente construiu o workflow. Os resultados? Nos primeiros 30 dias:
  → 15h economizadas por semana
  → +47% no volume de qualificação
  → Zero aumento de headcount

  Deslize para ver o bastidor completo →

  #AutomacaoB2B #VendasB2B #n8n #WorkflowAutomation #SalesOps

slides:
  - slide: 1
    type: hook
    text: "15h/semana desperdiçadas. Aqui está o que a gente fez."
    notes: "Foto do Thiago na frente do computador (Pessoa-style)"
  - slide: 2
    type: content
    text: |
      O PROBLEMA
      Nosso time de SDR passava 3h/dia em:
      → Pesquisa manual de leads
      → Qualificação um por um
      → Follow-up copy-paste
  - slide: 3
    type: content
    text: |
      O SISTEMA
      1. Lead entra no CRM
      2. n8n dispara pesquisa automática
      3. IA qualifica com score baseado em ICP
      4. Score > 7: SDR recebe lead pronto
      5. Score < 7: nurture automático
  - slide: 4
    type: content
    text: |
      OS RESULTADOS (30 dias)
      → 15h/semana devolvidas
      → +47% qualificação
      → Score 23% mais preciso
      → Zero headcount novo
      → ROI: 3 semanas
  - slide: 5
    type: cta
    text: "Quer saber se seu time tem gargalos assim? Comenta 'GARGALO'."
    notes: "Foto do Thiago sorrindo"

hashtags: "#AutomacaoB2B #VendasB2B #n8n #WorkflowAutomation #SalesOps"
total_slides: 5
pilar_acre: "Credibilidade"
tom_aplicado: "Bastidor Técnico"
```

## Quality Criteria

- [ ] Hook do slide 1 cabe em ~210 chars e passa scroll-stop test
- [ ] Cada slide tem max 30 palavras e UMA ideia
- [ ] CTA é ação específica ou pergunta genuína
- [ ] Post caption tem hook + contexto + chamada para slides + hashtags
- [ ] 3-5 hashtags relevantes na última linha
- [ ] Tom consistente com a opção selecionada pelo usuário
- [ ] Sem vocabulário proibido (verificar contra linkedin-strategy.md)

## Veto Conditions

Reject and redo if ANY are true:
1. Hook ultrapassa 210 caracteres ou não passa scroll-stop test
2. Algum slide tem mais de 40 palavras (margem sobre o ideal de 30)
