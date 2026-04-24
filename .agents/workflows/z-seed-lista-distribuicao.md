---
description: Squad Seed Lista de Distribuição — pipeline de pesquisa e manutenção de alvos para matéria-colab
---

# 🎯 Squad: Seed Lista de Distribuição

**Pipeline de pesquisa, filtragem e manutenção de alvos para matéria-colab.**
Pesquisa LinkedIn/web por candidatos cuja rede inclui o ICP, aplica gate da lente e filtra exclusões.

## INSTRUÇÕES CRÍTICAS

1. Leia COMPLETAMENTE o arquivo `aiox-squads/squads/seed-lista-distribuicao/squad.yaml`
2. Leia o workflow em `aiox-squads/squads/seed-lista-distribuicao/workflows/workflow.yaml`
3. Carregue o perfil do agente:
   - **Paulo Prospector 🎯**: `aiox-squads/squads/seed-lista-distribuicao/agents/pesquisador-alvos.md`
4. Carregue os dados de referência em `aiox-squads/squads/seed-lista-distribuicao/data/`
   - `linkedin-strategy.md` — Estratégia LinkedIn
   - `exclusions.md` — Arquétipos e candidatos vetados
   - `gate-rules.md` — Regras do gate da lente
5. Carregue os templates em `aiox-squads/squads/seed-lista-distribuicao/templates/`
6. Carregue as tasks em `aiox-squads/squads/seed-lista-distribuicao/tasks/`
7. **Siga o pipeline abaixo na ordem:**

## Pipeline (4 Steps)

| Step | Tipo | Descrição |
|------|------|-----------|
| 01 | 🤖 Pesquisador | Pesquisa candidatos para matéria-colab. Aplica gate da lente ("consigo formular título pela minha lente?") e filtra exclusões (arquétipos vetados, duplicatas) |
| 02 | ⏸️ Checkpoint | **Aprovação dos Candidatos** — Thiago revisa cada candidato: ✅ Aprovar (entra na lista) ou ❌ Descartar (vai pra exclusões com motivo) |
| 03 | 🤖 Pesquisador | Adiciona candidatos aprovados à lista ativa e registra descartados nas exclusões com motivo |
| 04 | ⏸️ Checkpoint | **Confirmação da Lista** — Thiago confirma lista atualizada. Vê resumo: total, novos, % fora da bolha |

## Input Necessário

- Direção do Thiago (ex: "quero alvos no segmento de SaaS B2B" ou "foco em líderes de vendas enterprise")

## Regras Importantes

- O gate da lente é obrigatório: "Consigo formular um título de matéria-colab pela minha lente (IA aplicada a vendas)?"
- Exclusões são permanentes — candidato descartado + motivo ficam registrados em `data/exclusions.md`
- Lista inicial com mínimo 4 nomes reais

## Output

- Candidatos pesquisados em `output/candidatos-pesquisados.md`
- Lista ativa atualizada em `output/lista-distribuicao.md`
