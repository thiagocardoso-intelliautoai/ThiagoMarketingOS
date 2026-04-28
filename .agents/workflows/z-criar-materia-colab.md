---
description: Squad Criar Matéria-Colab — pipeline estratégico-editorial que produz briefing pra alimentar carrosseis-linkedin
---

# 📝 Squad: Criar Matéria-Colab (Briefing Editorial)

**Pipeline: ângulo aprovado → briefing-editorial.md → carrosseis-linkedin (Editorial Clean).**

Squad **puramente estratégico-editorial**. Recebe ângulo aprovado de `seed-lista-distribuicao` + nome da pessoa + input livre opcional, pesquisa em profundidade, formula a tese, monta esqueleto narrativo (tese-primeiro, personagem-evidência, fechamento-tese), aplica vetos editoriais (com destaque pro **teste de remoção do nome**). Output é `briefing-editorial.md` que alimenta `carrosseis-linkedin` no fluxo matéria-colab.

**NÃO escreve copy de slide, caption, hashtags, hook formatado, contagem de slides, DM, nem headlines alternativas.** Isso é trabalho do `carrosseis-linkedin`.

> **Substitui:** `briefing-materia-colab` (deprecated) e a versão v1.0 deste squad (que escrevia matéria longa de 2.500 palavras).

## INSTRUÇÕES CRÍTICAS

1. Leia COMPLETAMENTE o arquivo `aiox-squads/squads/criar-materia-colab/squad.yaml`
2. Leia o workflow em `aiox-squads/squads/criar-materia-colab/workflows/workflow.yaml`
3. Carregue os perfis dos agentes:
   - **Ivan Investigador 🔬**: `aiox-squads/squads/criar-materia-colab/agents/investigador-materia.md`
   - **Rita Estratégista-Editorial ✍️**: `aiox-squads/squads/criar-materia-colab/agents/redator-materia.md`
4. Carregue os dados de referência em `aiox-squads/squads/criar-materia-colab/data/`
   - `linkedin-strategy.md` — Estratégia LinkedIn (lente, mecânica, lacuna)
   - `formato-materia-colab.md` — Papel do squad e fronteira com `carrosseis-linkedin`
   - `atomos-estrategicos.md` — 6 átomos estratégicos (OBRIGATÓRIO)
   - `veto-conditions.md` — 6 condições de veto (Veto 1 sharpened: teste de remoção do nome)
5. Carregue o template em `aiox-squads/squads/criar-materia-colab/templates/`
   - `materia-template.md` — Template do briefing editorial (9 seções)
6. Carregue as tasks em `aiox-squads/squads/criar-materia-colab/tasks/`
   - `01-pesquisar-profundidade.md` — Pesquisa além do seed
   - `02-estruturar-narrativa.md` — Formular tese + esqueleto (tese-primeiro)
   - `03-finalizar-briefing.md` — Consolidar briefing nas 9 seções
   - `04-review-briefing.md` — Auto-review (Veto 1 primeiro)
7. **Siga o pipeline linear abaixo:**

## Pipeline (6 Steps)

| Step | Tipo | Agent | Descrição |
|------|------|-------|-----------|
| 00 | ⏸️ Checkpoint | — | Receber ângulo aprovado + input livre do Thiago |
| 01 | 🤖 Agente | 🔬 Ivan | Pesquisar pessoa em profundidade além do seed |
| 02 | 🤖 Agente | ✍️ Rita | Formular tese + montar esqueleto (5 blocos, tese-primeiro) |
| 03 | 🤖 Agente | ✍️ Rita | Finalizar briefing-editorial.md (9 seções) |
| 04 | 🤖 Agente | ✍️ Rita | Auto-review (Veto 1 primeiro + vetos 2-6 + fronteira) |
| 05 | ⏸️ Checkpoint | — | Aprovação final do briefing |

## Input Necessário

1. **Nome da pessoa** (sujeito do briefing — obrigatório)
2. **Ângulo específico aprovado** (obrigatório):
   - Arquétipo (Como faz o que prega / Contra o consenso / O que aprendi estudando ele / Padrão que vi no trabalho dele)
   - Título pela lente (≤ 210 chars)
   - Evidências (posts, cases, citações do seed)
   - Risco declarado (se houver)
3. **Input livre do Thiago** (opcional — ex: "foca no case X", "tom mais duro", "rime com minha última falha documentada")

## Esqueleto narrativo obrigatório

Ordem **inegociável** que o briefing declara e que `carrosseis-linkedin` deve respeitar:

1. **Abertura — Tese do Thiago.** Sem personagem.
2. **Tese desenvolvida.** Por que, contra o que.
3. **Personagem entra como evidência.** Nome aparece aqui.
4. **Lacuna ancorada (quando aplicável).** Frame "dentro vs fora".
5. **Fechamento volta à tese.** Não elogia a pessoa.

> A tese é o esqueleto. O personagem é evidência viva. Se você inverteu, refaz.

## Regras Importantes

- **Briefing estratégico, NÃO copy.** Output orienta decisões downstream — não escreve hook, slide, caption, hashtag, contagem de slides
- **Tese minha, pessoa como evidência.** Substitua mentalmente o nome por "[Fulano]" — a tese sustenta sozinha? Se sim, ✅. Se desmonta, ❌ refaz
- **6 átomos estratégicos obrigatórios.** Carregar TODOS antes de qualquer task
- **6 condições de veto.** QUALQUER uma disparar = rejeitar briefing, refazer
- **Veto 1 é o mais afiado.** Detecta inversão de arquitetura
- **Risco respeitado.** Se o ângulo tem risco, endereçar com tese desafiadora real
- **Citação verificável ou nada.** Nunca inventar
- **Editorial Clean sempre.** Assinatura da série
- **Input do Thiago tem precedência** sobre defaults
- **Sem DM, sem headlines alternativas, sem copy de slide.** Removidos / não é trabalho deste squad

## Veto Conditions (Resumo)

1. ⚠️ **Teste de remoção do nome** (PRIMEIRO check — detecta inversão)
2. ❌ Citação inventada ou sem fonte
3. ❌ Sugestão de reunião/entrevista
4. ❌ Tom de parceria/agradecimento/celebração
5. ❌ Estilo visual ≠ Editorial Clean
6. ❌ Risco declarado ignorado

**Política de retomada:**
- Veto 1 dispara → volta pra Etapa 02 (esqueleto)
- Vetos 2-6 → volta pra Etapa 03

## Output

- Dossiê aprofundado em `output/dossie-{slug}.md`
- Briefing editorial em `output/briefing-editorial-{slug}-{angulo}.md`
- Status final + vetos verificados incluídos no briefing

## Downstream

Briefing aprovado alimenta `carrosseis-linkedin` no **fluxo matéria-colab**:
- Pula `step-02-generate-angles` (ângulo já aprovado upstream)
- Adapta `step-04-create-copy` pra ler `briefing-editorial.md` e respeitar o esqueleto narrativo
- Trava estilo em Editorial Clean
