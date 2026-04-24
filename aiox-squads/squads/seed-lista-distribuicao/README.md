# 🎯 Seed Lista de Distribuição

## Propósito

Pesquisar, sugerir e manter a lista de alvos para matéria-colab no LinkedIn. O squad pesquisa candidatos cuja rede inclui o ICP, aplica o gate da lente com **ângulos distintos** e filtra exclusões.

**Lista inicial:** 4 nomes reais (Victor Baggio, Ivan Nunes, Coutinho, Rafael Faria).
**Objetivo:** Expandir com pessoas fora da bolha Winning Sales.

---

## Conceito Central: Ângulos

Uma pessoa não tem 1 ângulo — tem potencialmente vários. **Pessoa é sujeito; ângulo é a leitura pela minha lente.** Cada ângulo é uma tese diferente com evidências próprias. "Título alternativo" (reformulação) é coisa diferente de "ângulo distinto" (multiplicidade).

Cada ângulo tem:
- **Arquétipo** — classificação orientativa entre 4 tipos + misto/outro
- **Título pela lente** — formulado pela lente "Built, not prompted"
- **Evidências específicas** — 1-3 itens públicos que sustentam aquele ângulo
- **Risco** — sensibilidade se houver

---

## Agentes

- **🎯 Paulo Prospector** — Pesquisador de alvos. Pesquisa candidatos, formula ângulos com arquétipo, aplica gate da lente, filtra exclusões, aprofunda pessoas existentes.

## 2 Modos de Uso

### Modo 1 — Pesquisar Candidatos Novos
```
step-01 (pesquisar) → step-02 (aprovação) → step-03 (atualizar lista) → step-04 (confirmação)
```

### Modo 2 — Aprofundar Pessoa Existente
```
step-A1 (aprofundar) → step-A2 (aprovação ângulos) → step-03 (atualizar lista) → step-04 (confirmação)
```

Steps 03 e 04 são compartilhados entre os dois modos.

## Regras Críticas

1. **Gate da lente:** "Consigo formular ângulo pela minha lente?" — se não, descarta
2. **Ângulos ≠ Títulos alternativos:** Ângulo é tese diferente com evidências diferentes. Reformulação não conta
3. **Exclusões:** Gurus de prompt, influencers genéricos, acadêmicos puros
4. **Prioridade:** Fora da bolha Winning primeiro
5. **Formato:** Jornalismo com formato de colab — sem entrevista, sem reunião
6. **Direção do Thiago:** Tem precedência sobre defaults do squad
7. **Expectativa de engajamento:** Atributo da pessoa, não do ângulo

## Estrutura

```
squads/seed-lista-distribuicao/
├── squad.yaml
├── README.md
├── agents/
│   └── pesquisador-alvos.md       # Paulo Prospector
├── tasks/
│   ├── 01-pesquisar-alvos.md      # Pesquisa + ângulos + gate + exclusões
│   ├── 02-atualizar-lista.md      # Adicionar/descartar (Modo A e B)
│   └── 03-aprofundar-pessoa.md    # Ângulos novos pra pessoa existente
├── workflows/
│   └── workflow.yaml
├── data/
│   ├── linkedin-strategy.md       # Mecânica de distribuição
│   ├── exclusions.md              # Arquétipos vetados + nomes na lista
│   └── gate-rules.md              # Gate + arquétipos de matéria + regras
├── templates/
│   ├── candidato-template.md      # Template com ângulos
│   └── aprofundamento-template.md # Template de aprofundamento
└── output/
    ├── lista-distribuicao.md      # Lista ativa (persistente)
    ├── candidatos-pesquisados.md  # Output do Modo 1
    └── angulos-aprofundados.md    # Output do Modo 2
```
