# 🎯 Seed Lista de Distribuição

## Propósito

Pesquisar, sugerir e manter a lista de alvos para matéria-colab no LinkedIn. O squad pesquisa candidatos cuja rede inclui o ICP, aplica o gate da lente e filtra exclusões.

**Lista inicial:** 4 nomes reais (Victor Baggio, Ivan Nunes, Coutinho, Rafael Faria).
**Objetivo:** Expandir com pessoas fora da bolha Winning Sales.

---

## Agentes

- **🎯 Paulo Prospector** — Pesquisador de alvos. Pesquisa candidatos, aplica gate da lente, filtra exclusões.

## Pipeline

```
step-01 (pesquisar) → step-02 (aprovação) → step-03 (atualizar lista) → step-04 (confirmação)
```

## Regras Críticas

1. **Gate da lente:** "Consigo formular título da matéria pela minha lente?" — se não, descarta
2. **Exclusões:** Gurus de prompt, influencers genéricos, acadêmicos puros
3. **Prioridade:** Fora da bolha Winning primeiro
4. **Formato:** Jornalismo com formato de colab — sem entrevista, sem reunião

## Estrutura

```
squads/seed-lista-distribuicao/
├── squad.yaml
├── README.md
├── agents/
│   └── pesquisador-alvos.md     # Paulo Prospector
├── tasks/
│   ├── 01-pesquisar-alvos.md    # Pesquisa + gate + exclusões
│   └── 02-atualizar-lista.md    # Adicionar/descartar
├── workflows/
│   └── workflow.yaml
├── data/
│   ├── linkedin-strategy.md     # Mecânica de distribuição
│   ├── exclusions.md            # Arquétipos vetados + nomes na lista
│   └── gate-rules.md            # Regras do gate com exemplos
├── templates/
│   └── candidato-template.md
└── output/
    ├── lista-distribuicao.md    # Lista ativa (persistente)
    └── candidatos-pesquisados.md
```
