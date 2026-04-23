# Task: Criar Copy do Carrossel

## Metadata
- **Step:** step-04-create-copy
- **Agent:** copywriter (Caio Carrossel)
- **Input:** `output/angles.md`
- **Output:** `output/carousel-copy.md`

---

## Context Loading

Carregar antes de executar:
- `output/angles.md` — Ângulos gerados (step 02)
- `data/theme-input.md` — Tema e estilo do usuário
- `data/linkedin-strategy.md` — Estratégia completa
- `data/tone-of-voice.md` — Tom selecionado
- `data/output-examples.md` — Exemplos de referência
- `data/anti-patterns.md` — Erros a evitar
- `agents/copywriter.md` — Persona do Caio

---

## Instructions

### Process
1. Ler o ângulo selecionado e o tom de voz escolhido pelo usuário
2. Absorver a voz do Thiago de linkedin-strategy.md
3. Escrever hook do slide 1 (max ~210 chars, scroll-stop test obrigatório)
4. Desenvolver 3-8 slides de conteúdo (1 ideia, max 30 palavras por slide)
5. Criar slide CTA final (ação específica ou pergunta genuína)
6. Escrever post caption completo (contexto + CTA + 3-5 hashtags)
7. Rodar Copy Stress Test: verificar cada claim, cortar filler 15-25%
8. Incluir notas para o designer em slides que precisam de foto ou print

---

## Output Format

```
# Carrossel — [TEMA]

**Fonte de tese:** [classificação]
**Ângulo:** [driver selecionado]
**Tom:** [tom aplicado]
**Total slides:** [N]

---

## Post Caption (LinkedIn)

[Texto completo do post — max 3000 chars]
[Hook + contexto + chamada para slides]

[hashtags na última linha]

---

## Slides

### Slide 1 — Hook
**Texto:** [texto do slide]
**Nota visual:** [instrução para o designer — print, foto, etc.]

### Slide 2 — [tipo]
**Texto:** [texto do slide]

### Slide N — CTA
**Texto:** [texto do CTA]
**Nota visual:** [instrução para o designer]
```

---

## Output Example

```
# Carrossel — IA substituindo SDRs

**Fonte de tese:** Benchmark Real
**Ângulo:** ↔️ Contrário
**Tom:** Direto e Provocador
**Total slides:** 5

---

## Post Caption (LinkedIn)

IA não vai substituir seu SDR.

Vai substituir o PROCESSO que o seu SDR odeia fazer.

A gente automatizou a parte chata da qualificação. O resultado?
→ 15h/semana devolvidas ao time
→ +47% no volume de leads qualificados
→ Zero headcount novo

Deslize para ver como funciona →

#AutomacaoB2B #VendasB2B #IA #SalesOps #WorkflowAutomation

---

## Slides

### Slide 1 — Hook
**Texto:** IA não vai substituir seu SDR. Vai substituir o PROCESSO que ele odeia.
**Nota visual:** Print de post ou manchete sobre "IA substituindo vendedores"

### Slide 2 — Contexto
**Texto:** O problema real não é o SDR. É o que o SDR é obrigado a fazer: pesquisa manual, qualificação um por um, follow-up copy-paste.

### Slide 3 — Sistema
**Texto:** O que a gente automatizou: 1. Pesquisa → automática 2. Primeiro contato → IA 3. Qualificação → score por ICP 4. SDR entra quando importa → conversa real

### Slide 4 — Resultado
**Texto:** 30 dias depois: → 15h/semana devolvidas → +47% em qualificação → Score 23% mais preciso → Zero aumento de custo

### Slide 5 — CTA
**Texto:** Se seu SDR gasta mais tempo pesquisando do que vendendo, a gente precisa conversar. Me manda um DM.
**Nota visual:** Foto do Thiago (se Pessoa-style) ou perfil minimalista (se Twitter-style)
```

---

## Veto Conditions

Rejeitar e refazer se:
1. Hook ultrapassa 210 caracteres
2. Algum slide tem mais de 40 palavras

---

## Quality Criteria

- [ ] Hook passa scroll-stop test
- [ ] Cada slide: 1 ideia, max 30 palavras
- [ ] CTA é ação específica ou pergunta genuína
- [ ] Sem vocabulário proibido
- [ ] 3-5 hashtags na última linha do post
