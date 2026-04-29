---
description: Squad Seed Pautas Centrais — pipeline de geração e manutenção de pautas estratégicas e subpautas
---

# 🌱 Squad: Seed Pautas Centrais

**Pipeline de geração e manutenção de Pautas Centrais (temas macro) e Subpautas (ângulos táticos semanais).**
Foco em estratégia de conteúdo LinkedIn com base nas fontes recorrentes de tese.

## INSTRUÇÕES CRÍTICAS

1. Leia COMPLETAMENTE o arquivo `aiox-squads/squads/seed-pautas-centrais/squad.yaml`
2. Leia o workflow em `aiox-squads/squads/seed-pautas-centrais/workflows/workflow.yaml`
3. Carregue o perfil do agente:
   - **Eva Estratégia 🌱**: `aiox-squads/squads/seed-pautas-centrais/agents/estrategista.md`
4. Carregue os dados de referência em `aiox-squads/squads/seed-pautas-centrais/data/`
5. Carregue os templates em `aiox-squads/squads/seed-pautas-centrais/templates/`
6. Carregue as tasks em `aiox-squads/squads/seed-pautas-centrais/tasks/`
7. **Siga o pipeline abaixo, começando pelo Step 00 — Seleção de Modo:**

## Step 00 — Seleção de Modo (PRIMEIRO PASSO OBRIGATÓRIO)

Pergunte ao usuário como quer operar hoje:

| # | Modo | O que faz |
|---|------|-----------|
| **1** | 🏗️ Inicialização | Primeira vez — confirma 4 Pautas Centrais e gera 12 Subpautas embrionárias |
| **2** | 📝 Gerar Subpautas | Execuções subsequentes — gera subpautas novas dentro das pautas existentes |

## Pipeline por Modo

### Modo 1 → Inicialização (primeira vez)

| Step | Tipo | Descrição |
|------|------|-----------|
| 00 | ⏸️ Checkpoint | Seleção de Modo |
| 01 | 🤖 Estrategista | Confirma 4 Pautas Centrais (derivadas das fontes de tese) + gera 3 Subpautas embrionárias por pauta |
| 02 | ⏸️ Checkpoint | **Aprovação** — Thiago revisa Pautas Centrais e Subpautas. Pode renomear, ajustar, editar, excluir ou adicionar |

### Modo 2 → Geração de Subpautas (semanal)

| Step | Tipo | Descrição |
|------|------|-----------|
| 00 | ⏸️ Checkpoint | Seleção de Modo |
| 03 | 🤖 Estrategista | Analisa estoque de subpautas, identifica gaps e gera 2-4 subpautas novas balanceadas |
| 04 | ⏸️ Checkpoint | **Aprovação** — Thiago revisa subpautas geradas. Pode aprovar, editar ou descartar |

## Regras Importantes

- **Pauta Central nova só nasce por decisão explícita do Thiago** — Eva nunca cria por conta
- As 4 Pautas Centrais nascem das fontes recorrentes de tese (`content_sources`)
- Subpautas são ângulos táticos com hook embrionário e classificação

## Output

- **Modo 1:** Pautas Centrais em `output/pautas-centrais.md` + Subpautas em `output/subpautas/seed-inicial.md`
- **Modo 2:** Subpautas novas em `output/subpautas/subpautas-{data}.md`
