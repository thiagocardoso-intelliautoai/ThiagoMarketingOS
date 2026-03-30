# 📦 Export de Squads — Opensquad → Nova Plataforma

Exportado em: 2026-03-27

---

## 📁 Estrutura Exportada

```
export-squads/
├── squads/
│   ├── pesquisa-conteudo-linkedin/   ← Squad de Ideias + Posts
│   │   ├── agents/
│   │   │   ├── pesquisador.agent.md    (Pedro Pesquisa 🔍)
│   │   │   ├── redator.agent.md        (Ricardo Redator ✍️)
│   │   │   └── revisor.agent.md        (Rafael Revisor 📋)
│   │   ├── pipeline/
│   │   │   ├── pipeline.yaml           (9 steps, 4 checkpoints)
│   │   │   ├── steps/                  (9 step files)
│   │   │   └── data/                   (7 data files — fontes, hooks, tom, etc.)
│   │   ├── output/
│   │   │   ├── armazem/ideias.md       (Banco de Ideias ativas)
│   │   │   └── post-final.md           (Último post gerado)
│   │   ├── _memory/                    (Memória do squad)
│   │   ├── squad.yaml                  (Definição principal)
│   │   └── squad-party.csv             (Tabela de agentes+personas)
│   │
│   └── carrosseis-linkedin/            ← Squad de Carrosséis
│       ├── agents/
│       │   ├── copywriter.agent.md     (+ tasks/)
│       │   ├── designer.agent.md       (+ tasks/)
│       │   └── reviewer.agent.md       (+ tasks/)
│       ├── pipeline/
│       │   ├── pipeline.yaml
│       │   ├── steps/
│       │   └── data/                   (anti-patterns, quality-criteria, etc.)
│       ├── assets/
│       │   ├── photos/                 (4 fotos do perfil)
│       │   └── profile-photo.png
│       ├── output/
│       │   └── slides/                 (HTML+PNG renderizados)
│       ├── squad.yaml
│       └── squad-party.csv
│
└── shared/
    ├── brand-context/
    │   ├── company.md                  (Contexto da empresa/marca)
    │   └── preferences.md              (Preferências do user)
    ├── best-practices/                 (23 formatos de conteúdo)
    │   ├── linkedin-post.md
    │   ├── instagram-feed.md
    │   ├── copywriting.md
    │   └── ... (20+ formatos)
    └── skills/                         (8 skills customizadas)
        ├── apify/
        ├── canva/
        ├── image-creator/
        ├── image-generator/
        ├── instagram-publisher/
        └── ...
```

---

## 🧠 O que cada arquivo contém

### Agentes (`.agent.md`)
Cada agente tem: persona completa, princípios operacionais, framework de trabalho, anti-patterns, tom de voz, exemplos de output. Formato YAML frontmatter + Markdown.

### Pipeline (`pipeline.yaml` + `steps/`)
Sequência de execução com: tipo (checkpoint/agent), agent responsável, on_reject (review loops). Cada step tem instruções, veto conditions, output path.

### Data Files (`pipeline/data/`)
Conhecimento do squad: tom de voz, estruturas de hook, fontes de pesquisa, concorrentes, estratégia LinkedIn, templates de lead magnet.

### Armazém de Ideias (`output/armazem/ideias.md`)
Banco de ideias cronológico com: origem, tema, hook sugerido, formato, pilar ACRE, urgência, status (usado/não usado).

### Company Context (`shared/brand-context/company.md`)
Quem é a empresa, ICP, proposta de valor — compartilhado entre TODOS os squads.

### Best Practices (`shared/best-practices/`)
23 guias de formato (linkedin-post, instagram-feed, etc.) com regras detalhadas de cada plataforma.

---

## 🔄 Como usar na nova plataforma

### Os agentes são reutilizáveis
Os `.agent.md` contêm instruções completas. Copie o conteúdo para o prompt/system message de cada agente na nova plataforma.

### O pipeline é o workflow
`pipeline.yaml` define a ordem. Cada step em `steps/` é uma tela/etapa. Checkpoints = telas que esperam input do user.

### Os data files são o "cérebro"
`pipeline/data/` contém todo o conhecimento especializado. Na nova plataforma, esses viram contexto injetado nos agentes.

### O armazém é persistente
`ideias.md` é o banco de ideias acumulado. Na nova plataforma, isso vira uma tabela/database com CRUD.
