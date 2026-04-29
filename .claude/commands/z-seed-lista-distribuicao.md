---
description: Squad Seed Lista de Distribuição — pipeline de pesquisa e manutenção de alvos para matéria-colab
---

# 🎯 Squad: Seed Lista de Distribuição

**Pipeline de pesquisa, filtragem e manutenção de alvos para matéria-colab.**
Pesquisa LinkedIn/web por candidatos cuja rede inclui o ICP, aplica gate da lente com ângulos distintos e filtra exclusões. Suporta 2 modos: pesquisar candidatos novos e aprofundar pessoa já na lista.

## INSTRUÇÕES CRÍTICAS

1. Leia COMPLETAMENTE o arquivo `aiox-squads/squads/seed-lista-distribuicao/squad.yaml`
2. Leia o workflow em `aiox-squads/squads/seed-lista-distribuicao/workflows/workflow.yaml`
3. Carregue o perfil do agente:
   - **Paulo Prospector 🎯**: `aiox-squads/squads/seed-lista-distribuicao/agents/pesquisador-alvos.md`
4. Carregue os dados de referência em `aiox-squads/squads/seed-lista-distribuicao/data/`
   - `linkedin-strategy.md` — Estratégia LinkedIn
   - `exclusions.md` — Arquétipos e candidatos vetados
   - `gate-rules.md` — Regras do gate da lente + arquétipos de matéria + regras de ângulos
5. Carregue os templates em `aiox-squads/squads/seed-lista-distribuicao/templates/`
   - `candidato-template.md` — Formato de candidato com ângulos
   - `aprofundamento-template.md` — Formato de aprofundamento de pessoa existente
6. Carregue as tasks em `aiox-squads/squads/seed-lista-distribuicao/tasks/`
   - `01-pesquisar-alvos.md` — Pesquisa com ângulos
   - `02-atualizar-lista.md` — Atualizar lista (Modo A: candidatos novos / Modo B: ângulos novos)
   - `03-aprofundar-pessoa.md` — Gerar ângulos novos para pessoa existente
7. **Identifique qual modo o Thiago quer usar e siga o pipeline correspondente:**

## 2 Modos de Uso

### Modo 1 — Pesquisar Candidatos Novos (6 Steps)

| Step | Tipo | Descrição |
|------|------|-----------|
| 01 | 🤖 Pesquisador | Pesquisa candidatos para matéria-colab. Aplica gate da lente com ângulos distintos (arquétipo + título + evidências + risco) e filtra exclusões |
| 02 | ⏸️ Checkpoint | **Aprovação dos Candidatos** — Thiago revisa cada candidato e ângulos: ✅ Aprovar ou ❌ Descartar (exclusões com motivo) |
| 03 | 🤖 Pesquisador | Adiciona candidatos aprovados à lista ativa com ângulos e registra descartados nas exclusões |
| 04 | ⏸️ Checkpoint | **Confirmação da Lista** — Thiago confirma lista atualizada. Resumo: total de pessoas, ângulos, % fora da bolha |

### Modo 2 — Aprofundar Pessoa Existente (4 Steps)

| Step | Tipo | Descrição |
|------|------|-----------|
| A1 | 🤖 Pesquisador | Pesquisa ângulos novos sobre pessoa já na lista. Se Thiago deu input, ancora nele; se não, pesquisa movimento público recente |
| A2 | ⏸️ Checkpoint | **Aprovação de Ângulos Novos** — Thiago revisa ângulos propostos: ✅ Aprovar ou ❌ Descartar |
| 03 | 🤖 Pesquisador | Adiciona ângulos aprovados à ficha da pessoa na lista ativa |
| 04 | ⏸️ Checkpoint | **Confirmação da Lista** — Thiago confirma lista atualizada |

## Input Necessário

**Modo 1 — Pesquisa:**
- Direção do Thiago (ex: "quero alvos no segmento de SaaS B2B" ou "foco em líderes de vendas enterprise")

**Modo 2 — Aprofundamento:**
- Nome da pessoa (obrigatório — deve já estar na lista ativa)
- Input livre do Thiago (opcional — ex: "vi esse post dela sobre X", "ela acabou de anunciar Y")

## Regras Importantes

- O gate da lente é obrigatório: "Consigo formular ângulo pela minha lente (Built, not prompted)?"
- **Ângulo ≠ título alternativo:** Ângulo é tese diferente com evidências diferentes. Reformulação não conta
- Exclusões são permanentes — candidato descartado + motivo ficam registrados em `data/exclusions.md`
- Expectativa de engajamento é atributo da pessoa, não do ângulo
- Direção do Thiago tem precedência sobre defaults do squad

## Output

- Candidatos pesquisados em `output/candidatos-pesquisados.md`
- Ângulos aprofundados em `output/angulos-aprofundados.md`
- Lista ativa atualizada em `output/lista-distribuicao.md`
