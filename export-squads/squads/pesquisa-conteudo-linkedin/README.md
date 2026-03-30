# Pesquisa e Geração de Conteúdo LinkedIn

> Squad de pesquisa semanal, benchmark de concorrentes e geração de posts texto para LinkedIn.
> Foco em vendas B2B, IA aplicada a vendas e automação comercial.

## O que faz

1. **Pesquisa semanal** — Varre fontes curadas e traz os top insights
2. **Benchmark de concorrentes** — Monitora o que os melhores do mundo estão publicando
3. **Armazém de ideias** — Acumula temas para nunca ficar sem pauta
4. **Geração de posts** — Hooks, estrutura e texto completo para LinkedIn
5. **Revisão de qualidade** — Checklist rigoroso antes de publicar

## Como usar

```
/opensquad pesquisa-conteudo-linkedin
```

Ou abra o `squad.yaml` e siga o pipeline de 9 steps.

## Estrutura

```
pesquisa-conteudo-linkedin/
├── squad.yaml              # Config principal
├── squad-party.csv         # Equipe
├── memories.md             # Contexto persistente
├── README.md               # (este arquivo)
├── agents/
│   ├── pesquisador.agent.md
│   ├── redator.agent.md
│   └── revisor.agent.md
├── pipeline/
│   ├── pipeline.yaml       # Sequência dos 9 steps
│   ├── data/               # 7 arquivos de referência
│   │   ├── research-sources.md
│   │   ├── competitors.md
│   │   ├── hook-structures.md
│   │   ├── post-structure-linkedin.md
│   │   ├── lead-magnet-template.md
│   │   ├── tone-of-voice.md
│   │   └── linkedin-strategy.md
│   └── steps/              # 9 passos do pipeline
│       ├── step-01-mode-selection.md
│       ├── step-02-research.md
│       ├── step-03-approve-research.md
│       ├── step-04-save-ideas.md
│       ├── step-05-select-idea.md
│       ├── step-06-create-hook.md
│       ├── step-07-structure-post.md
│       ├── step-08-review.md
│       └── step-09-final-approval.md
└── output/
    └── armazem/
        └── ideias.md       # Banco de ideias acumuladas
```

## Pipeline Visual

```
[MODO] → PESQUISA → APROVAÇÃO → ARMAZÉM → IDEIA → HOOK → POST → REVISÃO → FINAL
  01       02         03          04       05      06     07      08       09
```

## Agentes

| Agente | Papel | Steps |
|--------|-------|-------|
| Pesquisador | Minerador de dados + insights | 02, 04 |
| Redator | Criador de hooks e posts | 06, 07 |
| Revisor | Guardião da qualidade | 08 |
