# 🌱 Seed Pautas Centrais

## Propósito

Gerar e manter Pautas Centrais (temas macro estruturais) e Subpautas (ângulos táticos semanais) para conteúdo LinkedIn do Thiago C.Lima.

As 4 Pautas Centrais nascem das fontes recorrentes de tese. Subpautas são geradas semanalmente como estoque de ângulos de conteúdo.

**Regra fundamental:** Pauta Central nova só nasce por decisão do Thiago. Pauta é estrutural, muda raramente. Subpauta é tática, muda toda semana.

---

## Agentes

- **🌱 Eva Estratégia** — Estrategista de pautas. Gera e classifica pautas centrais e subpautas a partir dos átomos estratégicos.

## Modos de Operação

| Modo | Quando usar | O que faz |
|------|-------------|-----------|
| 1. Inicialização | Primeira vez | Confirma 4 Pautas Centrais + gera 12 Subpautas embrionárias |
| 2. Gerar Subpautas | Semanal | Gera 2-4 Subpautas novas dentro das Pautas existentes |

## Pipeline

```
Modo 1: step-00 → step-01 (inicialização) → step-02 (aprovação pautas)
Modo 2: step-00 → step-03 (gerar subpautas) → step-04 (aprovação subpautas)
```

## Estrutura

```
squads/seed-pautas-centrais/
├── squad.yaml
├── README.md
├── agents/
│   └── estrategista.md          # Eva Estratégia
├── tasks/
│   ├── 00-selecao-modo.md       # Checkpoint: modo 1 ou 2
│   ├── 01-inicializacao.md      # Modo 1: pautas + subpautas iniciais
│   └── 02-gerar-subpautas.md    # Modo 2: subpautas semanais
├── workflows/
│   └── workflow.yaml            # Pipeline com branching
├── data/
│   └── linkedin-strategy.md     # Lente, bandeiras, fontes de tese, regras
├── templates/
│   ├── pauta-central-template.md
│   └── subpauta-template.md
└── output/
    ├── pautas-centrais.md       # As 4 pautas (persistente)
    └── subpautas/               # Subpautas por data de geração
```
