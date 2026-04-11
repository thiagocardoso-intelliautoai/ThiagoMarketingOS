# 🔬 Squad: Pesquisa e Conteúdo LinkedIn

> Pipeline otimizado de pesquisa → criação → aprovação de posts de texto
> para o perfil LinkedIn do Thiago C.Lima / Winning Sales.

---

## 🎯 Objetivo

Posicionar o Thiago como referência em IA aplicada a vendas B2B no Brasil
através de posts de texto LinkedIn de alta qualidade, baseados em pesquisa
e alinhados com a estratégia ACRE.

---

## 👥 Agentes

| Agente | Arquivo | Papel |
|--------|---------|-------|
| **Pesquisador** | `agents/pesquisador.md` | Analista de mercado e tendências — pesquisa, benchmark, curadoria |
| **Redator** | `agents/redator.md` | Copywriter LinkedIn — hooks, post final, revisão de qualidade integrada |
| **Revisor** | `agents/revisor.md` | ⚠️ Standby — checklist absorvido pelo Redator |

---

## 🔄 Workflow v2.0 (7 passos — Modos 1/2/3)

```
FASE 1: PESQUISA
  01 → Pesquisa (com Contexto BR) ........ [pesquisador]
  02 → ⏸️ CHECKPOINT — Seleção e Decisão .. [humano]

FASE 2: CRIAÇÃO
  05 → Criação de Hooks .................. [redator]
  06 → ⏸️ CHECKPOINT — Escolha do Hook .... [humano]
  07 → Post Final + Revisão Integrada .... [redator]

FASE 3: APROVAÇÃO
  09 → ⏸️ CHECKPOINT FINAL + CCC ......... [humano]
```

**4 checkpoints humanos** garantem que nada é publicado sem aprovação do Thiago.
**Integração CCC:** Post aprovado é salvo automaticamente no Thiago Marketing OS.

---

## 📁 Estrutura de Arquivos

```
pesquisa-conteudo-linkedin/
├── squad.yaml              # Configuração da squad
├── README.md               # Este arquivo
├── agents/
│   ├── pesquisador.md      # Agente de pesquisa
│   ├── redator.md          # Agente de redação + revisão integrada
│   └── revisor.md          # Agente de revisão (standby)
├── workflows/
│   └── workflow.yaml       # Pipeline v2.0 (7 passos)
├── tasks/
│   ├── 00-selecao-modo.md
│   ├── 01-pesquisa-semanal.md
│   ├── 01-benchmark-concorrentes.md
│   ├── 01-briefing-on-demand.md
│   ├── 03-aprofundamento.md   # ⚠️ DEPRECIADO
│   ├── 05-criacao-hooks.md
│   ├── 05-planejamento-mensal.md
│   ├── 07-estruturacao-post.md # Post final + revisão integrada
│   └── 08-revisao-qualidade.md # ⚠️ DEPRECIADO (absorvido pelo 07)
├── data/
│   ├── linkedin-strategy.md     # Estratégia, ICP, pilares ACRE
│   ├── tone-of-voice.md         # Tom de voz e vocabulário
│   ├── hook-structures.md       # 9 estruturas de hook validadas
│   ├── post-structure-linkedin.md # Frameworks de post
│   ├── research-sources.md      # Fontes Tier 1/2/3
│   ├── competitors.md           # Benchmark concorrentes gringos
│   └── lead-magnet-template.md  # Template de lead magnet
├── templates/
│   ├── post-template.md         # Template do post final
│   └── armazem-template.md      # Template de entrada no armazém
├── checklists/
│   └── review-checklist.md      # Checklist de revisão (4 blocos)
└── output/
    ├── armazem/
    │   └── ideias.md            # Armazém cronológico
    ├── hooks.md                 # Hooks gerados
    └── post-final.md            # Post aprovado (com score)
```

---

## 🚀 Como Usar

1. Ativar com `/z-pesquisa-conteudo-linkedin`
2. Escolher modo de operação (1-5)
3. Seguir o workflow, pausando em cada **⏸️ CHECKPOINT**
4. Aprovar/ajustar em cada checkpoint antes de prosseguir
5. Post final em `output/post-final.md` → salvo automaticamente no Thiago Marketing OS

---

## 📏 Regras Inegociáveis

- **Dados verificáveis** — Sem dado solto, sempre com fonte
- **Tom anti-guru** — Sem game changer, sinergia, hack, disruptivo
- **Rule of 1** — Um post, uma ideia
- **Max 210 chars hook / 1.300 chars post**
- **Postar 7h-9h BRT** — Pico do ICP
- **4 checkpoints humanos** — Nada é publicado sem OK do Thiago

---

## 📝 Changelog

- **v2.0** — Pipeline otimizado: 10→7 steps. Removido Aprofundamento (absorvido pelo Step 01), fundido Seleção+Armazém, integrado revisão no Redator. Adicionada integração Thiago Marketing OS.
- **v1.1** — Adicionado Modo 5 (Planejamento Mensal de 12 posts).
- **v1.0** — Pipeline original com 10 steps.
