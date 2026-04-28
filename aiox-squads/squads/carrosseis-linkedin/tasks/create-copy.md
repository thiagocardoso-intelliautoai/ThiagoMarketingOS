# Task: Criar Copy do Carrossel

## Metadata
- **Step:** step-04-create-copy
- **Agent:** copywriter (Caio Carrossel)
- **Input:** `output/angles.md` (fluxo padrão) **ou** `briefing-editorial-{slug}-{angulo}.md` (fluxo matéria-colab vindo de `criar-materia-colab`)
- **Output:** `output/carousel-copy.md`

---

## Context Loading

Carregar antes de executar:
- `output/angles.md` — Ângulos gerados (step 02) **OU** briefing-editorial.md (fluxo matéria-colab)
- `data/theme-input.md` — Tema e estilo do usuário (não aplicável no fluxo matéria-colab)
- `data/linkedin-strategy.md` — Estratégia completa
- `data/tone-of-voice.md` — Tom selecionado
- `data/output-examples.md` — Exemplos de referência
- `data/anti-patterns.md` — Erros a evitar
- `agents/copywriter.md` — Persona do Caio

---

## Quando input é briefing-editorial.md (fluxo matéria-colab)

Quando o input vem de `criar-materia-colab`, ele é um **briefing editorial estruturado em 9 seções**, não um arquivo de ângulos. Comportamento muda:

### Regras especiais

1. **Estilo travado em "Editorial Clean"** — o briefing declara isso na §8 (assinatura da série matéria-colab). Não escolher outro estilo.
2. **Tese já formulada** — usar a frase única da §1 do briefing como base do hook do slide 1 (capa). **Não inventar tese nova.**
3. **Ângulo já aprovado** — usar §2 do briefing (arquétipo + título pela lente). Não gerar 5 ângulos divergentes.
4. **Esqueleto narrativo é INEGOCIÁVEL** — o briefing declara na §7 a sequência obrigatória dos 5 blocos:
   - **Bloco 1 (Abertura) = Tese.** Sem personagem na capa.
   - **Bloco 2 = Tese desenvolvida.** Por que essa tese, contra o que ela vai. Sem personagem ainda.
   - **Bloco 3 = Personagem como evidência.** Nome aparece pela primeira vez aqui, com fato/citação ancorada.
   - **Bloco 4 = Lacuna ancorada (quando aplicável).** Frame "dentro vs fora".
   - **Bloco 5 = Fechamento volta à tese.** Não termina elogiando a pessoa.
5. **Você decide quantos slides traduzem cada bloco** (3-8 total) e como distribuir, mas a **ordem dos blocos é inegociável**.
6. **Evidências ancoradas (§3 do briefing) com URL + data** — usar como conteúdo dos slides, sem inventar.
7. **Risco endereçado (§5 do briefing)** — se o briefing declarou risco, o copy deve carregar a tese desafiadora real, sem virar puxa-saco.
8. **Notas pra carrosseis-linkedin (final do briefing)** — ler e respeitar.

### Veto adicional no fluxo matéria-colab

❌ **Personagem aparece na capa (slide 1)** → veto. Slide 1 é tese, sem personagem.
❌ **Fechamento elogia a pessoa em vez de retomar a tese** → veto.
❌ **Estilo ≠ Editorial Clean** → veto.

### Pulando o "Process" abaixo

No fluxo matéria-colab você **pula** os passos 1-2 da seção `Process` (não precisa "ler ângulo selecionado" nem "absorver voz" — o briefing já entregou tudo) e vai direto pra escrever copy a partir do briefing.

---

## Instructions

### Process (fluxo padrão)
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
