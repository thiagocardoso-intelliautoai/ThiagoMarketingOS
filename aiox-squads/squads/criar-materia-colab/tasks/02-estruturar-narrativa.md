# Task: Estruturar Narrativa do Briefing

> Step 02 do pipeline — Definir esqueleto narrativo (tese-primeiro, personagem-evidência, fechamento-tese) e ancorar evidências com fonte.

---

## Metadata
- **Step:** step-02-estruturar
- **Agent:** redator-materia (Rita Estratégista-Editorial)
- **Input:** `output/dossie-{slug}.md` + ângulo aprovado + input livre do Thiago
- **Output:** estrutura narrativa do briefing (consolidada na Etapa 03)

---

## Context Loading

Carregar antes de executar:
- `output/dossie-{slug}.md` — Dossiê aprofundado do Ivan
- `data/linkedin-strategy.md` — Lente, mecânica, lacuna
- `data/formato-materia-colab.md` — Papel deste squad como estratégico-editorial
- `data/atomos-estrategicos.md` — 6 átomos estratégicos
- `data/veto-conditions.md` — Vetos (com destaque pro Veto 1: teste de remoção do nome)
- `agents/redator-materia.md` — Persona da Rita

---

## Instruções

### 1. Absorver dossiê + ângulo + input livre

Ler dossiê do Ivan, o ângulo aprovado e o input livre do Thiago. Identificar:
- A **tese do Thiago** que vai ser o esqueleto narrativo (frase única)
- O comportamento do personagem que serve de evidência viva da tese
- As citações/dados mais fortes pra usar como lastro (com fonte verificável)
- O risco declarado e como endereçar
- A lacuna ancorada (frame "dentro vs fora"), se aplicável

### 2. Formular a tese (esqueleto)

**Antes de qualquer coisa, formule a tese do Thiago em 1 frase.** Essa frase é o esqueleto narrativo do briefing — o que abre o post e o que fecha.

Exemplos:
- "Roadmap é ferramenta de quem ainda não entregou."
- "IA não substitui SDR — substitui o processo que o SDR odeia."
- "Quem opera de dentro vê padrão que consultor de fora nunca alcança."

A tese **não menciona o nome da pessoa**. É afirmação do Thiago, válida com ou sem o personagem.

### 3. Definir esqueleto narrativo obrigatório

Estruturar o briefing nesta ordem **inegociável**:

```
Bloco 1 — Abertura: TESE DO THIAGO
  - 1-2 frases que enunciam a tese
  - Sem nome do personagem
  - Esta é a abertura do post (slide 1 / capa quando virar carrossel)

Bloco 2 — Tese desenvolvida
  - Por que essa tese
  - Contra o que ela vai (consenso, padrão de mercado, vício comum)
  - Sem nome do personagem ainda

Bloco 3 — Personagem entra como EVIDÊNCIA
  - Nome aparece pela primeira vez aqui
  - 1-2 frases descrevendo comportamento que confirma a tese
  - Inclui fato/citação ancorada com fonte (URL + data)

Bloco 4 — Lacuna ancorada (quando aplicável)
  - Diferencial Thiago: "Ele faz de fora, eu de dentro"
  - Frame "dentro vs fora" só quando o ângulo permitir
  - Se não aplicável: pular este bloco e justificar

Bloco 5 — Fechamento: VOLTA À TESE
  - Retoma a tese do Bloco 1
  - NÃO termina elogiando a pessoa
  - Pode levar a uma pergunta genuína ou ação específica
```

> **Regra inegociável:** A tese é o esqueleto. O personagem é evidência viva. Se você inverteu, refaz.

> **Importante:** estes blocos **não são slides 1:1**. São instrução narrativa pro `carrosseis-linkedin` traduzir em quantos slides achar melhor. A ordem não é negociável.

### 4. Para cada bloco, definir conteúdo estratégico

Para cada bloco, o briefing deve conter:

- **Função do bloco** (o que ele faz na narrativa — ex: "abre com tese", "introduz personagem como evidência")
- **Substância** (1-3 frases descrevendo o conteúdo do bloco — não copy de slide, instrução estratégica)
- **Evidência ancorada** (quando aplicável: citação literal entre aspas + URL + data)
- **Conexão com lente** (como "Built, not prompted" atravessa esse bloco)

### 5. Aplicar teste de remoção do nome (auto-check imediato)

Antes de seguir pra Etapa 03, fazer **agora** o teste:

> Substituir mentalmente "[nome da pessoa]" por "[Fulano]" no esqueleto que você acabou de montar. Ler de ponta a ponta com [Fulano]. **A tese se sustenta sozinha?**
> - Se sim → seguir pra Etapa 03
> - Se não → refazer Etapa 02 (a tese provavelmente não está clara o suficiente, ou o personagem está sendo posto como sujeito)

### 6. Verificar risco declarado

Se o ângulo tem risco:
- [ ] O esqueleto endereça o risco com tese desafiadora?
- [ ] Não vira puxa-saco por medo do risco?
- [ ] Tom é respeitoso mas com posição?

### 7. Respeitar input livre do Thiago

Se o Thiago deu direção:
- "Foca no case X" → case X vira evidência central no Bloco 3
- "Tom mais duro" → tese mais provocativa, fechamento mais afiado
- "Rime com minha última falha documentada" → ponte narrativa explícita no fechamento

---

## Output da Etapa

Não gera arquivo final. Gera **estrutura narrativa intermediária** que a Etapa 03 vai consolidar no `briefing-editorial.md`. Formato sugerido:

```
## Tese (esqueleto)
"[frase única da tese do Thiago]"

## Esqueleto narrativo (5 blocos)

### Bloco 1 — Abertura: Tese
- Função: [...]
- Substância: [...]
- Conexão com lente: [...]

### Bloco 2 — Tese desenvolvida
- Função: [...]
- Substância: [...]

### Bloco 3 — Personagem como evidência
- Função: introduzir [Nome] como prova viva da tese
- Substância: [...]
- Evidência ancorada:
  - "[citação]" — [URL + data]
  - [dado] — [URL + data]

### Bloco 4 — Lacuna ancorada (ou "Não aplicável" + justificativa)
- Frame: dentro vs fora
- Substância: [...]

### Bloco 5 — Fechamento: volta à tese
- Função: retomar tese do Bloco 1
- Substância: [...]

## Auto-check Veto 1 (teste de remoção do nome): ✅ passa / ❌ veta
```

---

## Veto Conditions

Rejeitar e reestruturar se:
1. ❌ **Veto 1 — Teste de remoção do nome falha** (esqueleto desmonta sem o nome)
2. ❌ Personagem aparece no Bloco 1 (capa)
3. ❌ Fechamento (Bloco 5) elogia a pessoa em vez de retomar a tese
4. ❌ Bloco 3 não tem evidência ancorada com fonte
5. ❌ Risco declarado ignorado
6. ❌ Sugestão de entrevista/reunião em qualquer bloco

---

## Quality Criteria

- [ ] Tese formulada como frase única, sem personagem
- [ ] 5 blocos seguindo a ordem obrigatória
- [ ] Personagem entra apenas no Bloco 3 (não antes)
- [ ] Bloco 3 tem evidência ancorada com URL + data
- [ ] Bloco 5 retoma a tese (não elogia a pessoa)
- [ ] Lacuna tratada (aplicada ou justificada como não aplicável)
- [ ] Risco endereçado se declarado
- [ ] Auto-check Veto 1 passou
- [ ] Input do Thiago respeitado

---

## Próximo Passo

→ **step-03**: Rita consolida o esqueleto + evidências + lente + risco no `briefing-editorial.md` final.
