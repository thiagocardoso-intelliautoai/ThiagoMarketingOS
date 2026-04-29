---
description: Squad Pesquisa e Conteúdo LinkedIn — pipeline de pesquisa a post texto
---

# 📝 Squad: Pesquisa e Conteúdo LinkedIn

**Pipeline otimizado de pesquisa → criação → aprovação de posts texto para LinkedIn.**
Foco em IA aplicada a vendas B2B, gestão comercial e automação.

## INSTRUÇÕES CRÍTICAS

1. Leia COMPLETAMENTE o arquivo `aiox-squads/squads/pesquisa-conteudo-linkedin/squad.yaml`
2. Leia o workflow em `aiox-squads/squads/pesquisa-conteudo-linkedin/workflows/workflow.yaml`
3. Carregue os perfis dos agentes:
   - **Pedro Pesquisa 🔍**: `aiox-squads/squads/pesquisa-conteudo-linkedin/agents/pesquisador.md`
   - **Ricardo Redator ✍️**: `aiox-squads/squads/pesquisa-conteudo-linkedin/agents/redator.md`
4. Carregue os dados de referência em `aiox-squads/squads/pesquisa-conteudo-linkedin/data/`
5. Carregue os templates em `aiox-squads/squads/pesquisa-conteudo-linkedin/templates/`
6. Carregue o checklist em `aiox-squads/squads/pesquisa-conteudo-linkedin/checklists/`
7. **Siga o pipeline abaixo, começando pelo Step 00 — Seleção de Modo:**

## Step 00 — Seleção de Modo (PRIMEIRO PASSO OBRIGATÓRIO)

Pergunte ao usuário como quer operar hoje:

| # | Modo | O que faz |
|---|------|-----------|
| **1** | 🔍 Pesquisa Semanal | Varrer fontes Tier 1/2/3 e trazer os top insights da semana |
| **2** | 🏆 Benchmark de Concorrentes | Analisar o que os top players gringos estão publicando |
| **3** | 📋 Briefing On-Demand | Thiago dá um tema, o Pesquisador pesquisa a fundo |
| **4** | ✍️ Escrever Post Direto | Já tem a ideia — pula pesquisa e vai direto pro Redator |
| **5** | 📅 Planejamento Mensal (12 Posts) | Gerar plano tático de 4 semanas de uma vez |

## Pipeline por Modo

### Modos 1, 2, 3 → Pipeline completo (7 steps)

| Step | Tipo | Descrição |
|------|------|-----------|
| 00 | ⏸️ Checkpoint | Seleção de Modo |
| 01 | 🤖 Pesquisador | Executa pesquisa conforme o modo (com Contexto BR integrado) |
| 02 | ⏸️ Checkpoint | **Seleção e Decisão** — Thiago escolhe qual vira post, resto vai pro armazém |
| 05 | 🤖 Redator | Criação de 3 hooks (max 210 chars cada) |
| 06 | ⏸️ Checkpoint | Escolha do Hook |
| 07 | 🤖 Redator | **Post Final Completo** + Revisão integrada (4 blocos, score ≥ 80%) |
| 09 | ⏸️ Checkpoint | **Aprovação Final** + Salvar no Content Command Center |

### Modo 4 → Pipeline direto (6 steps)

| Step | Tipo | Descrição |
|------|------|-----------|
| 00 | ⏸️ Checkpoint | Seleção de Modo (4) |
| 02 | ⏸️ Checkpoint | Armazém de Ideias — escolher ideia existente ou nova |
| 05 | 🤖 Redator | Criação de 3 hooks |
| 06 | ⏸️ Checkpoint | Escolha do Hook |
| 07 | 🤖 Redator | Post Final Completo + Revisão integrada |
| 09 | ⏸️ Checkpoint | Aprovação Final + Salvar no Content Command Center |

### Modo 5 → Planejamento Mensal (12 Posts de uma vez)

| Step | Tipo | Descrição |
|------|------|-----------|
| 00 | ⏸️ Checkpoint | Seleção de Modo (5) + Direcionamento temático |
| 01-plan | 🤖 Redator | Gera tabela de 12 posts (DTC + ACRE, 4 semanas) |
| 02-plan | ⏸️ Checkpoint | Thiago revisa tabela — ajusta, aprova ou pede nova geração |
| Output | 📁 12 arquivos | Cada post salvo individualmente em `output/planejamento-mensal/post-XX.md` |

**Nota:** No Modo 5, o Redator usa `tasks/05-planejamento-mensal.md` com referência a todos os dados de estratégia, tom de voz e hooks. O usuário fornece apenas a direção geral (ex: "foco em automação de prospecção com IA este mês").

## Regra Extra: Lead Magnet

Se qualquer pesquisa (modos 1, 2 ou 3) gerar 4+ insights relevantes convergindo num tema, sugerir formato **Lead Magnet** (`data/lead-magnet-template.md`).

## Step Final — Publicar no Banco de Dados

Após aprovação do post final (Step 09):

1. Salvar o post aprovado em arquivo markdown: `aiox-squads/squads/pesquisa-conteudo-linkedin/output/post-final.md`
2. Executar o CLI para persistir no Supabase:
   ```bash
   node aiox-squads/shared/scripts/save-post-cli.js --title "TITULO_DO_POST" --file aiox-squads/squads/pesquisa-conteudo-linkedin/output/post-final.md --pillar PILAR --review-score SCORE
   ```
3. Verificar output: `✅ Post "TITULO" salvo no Supabase (id: UUID)`
4. O post agora estará disponível no Content Command Center automaticamente

> **Nota:** O CLI parseia automaticamente o markdown para extrair hook, body, CTA, fontes e metadata.
> É idempotente — pode rodar múltiplas vezes sem duplicar dados (upsert por slug).

## Output

- **Modos 1-4:** Output final salvo em `aiox-squads/squads/pesquisa-conteudo-linkedin/output/post-final.md`.
- **Modo 5:** Output salvo em `aiox-squads/squads/pesquisa-conteudo-linkedin/output/planejamento-mensal/post-01.md` a `post-12.md`.
