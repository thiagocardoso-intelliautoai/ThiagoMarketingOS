# Thiago Marketing OS

Sistema de produção de conteúdo LinkedIn com squads de IA — pesquisa, texto, capas e carrosséis.

## 🏗️ Arquitetura

```
├── content-command-center/   # Dashboard SPA (HTML/CSS/JS + Supabase)
├── aiox-squads/              # Squads de conteúdo (3 pipelines)
│   ├── pesquisa-conteudo/    # Pesquisa + texto LinkedIn
│   ├── capas-linkedin/       # Capas visuais (5 estilos)
│   └── carrosseis-linkedin/  # Carrosséis (4 estilos)
├── aiox-project/             # Framework de governança (Synkra AIOX)
│   ├── docs/stories/         # Stories de desenvolvimento
│   └── supabase/migrations/  # Schema do banco
└── .agents/workflows/        # Workflows para Antigravity
```

## 🚀 Quick Start

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar Supabase
```bash
cp aiox-project/.env.example aiox-project/.env
# Preencher SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
```

### 3. Abrir o Dashboard
```bash
cd content-command-center
npx serve .
# Abrir http://localhost:3000
```

## 📋 Como criar conteúdo

1. Abrir o **Content Command Center** no browser
2. Selecionar o **modo de pesquisa** (1-5) no Dashboard
3. **Copiar o prompt** gerado
4. **Colar no Antigravity** (ativa o squad correspondente)
5. Seguir os **checkpoints humanos** do squad (aprovar hooks, post)
6. Post salvo automaticamente no **Supabase**
7. **Gerar capa/carrossel** na Biblioteca do CCC

## 🔧 Stacks

| Componente | Tecnologia |
|--|--|
| Dashboard | Vanilla JS (ES Modules), CSS, Supabase CDN |
| Rendering | Node.js, Playwright (HTML → PNG) |
| Database | Supabase (PostgreSQL + Storage) |
| Squads | YAML config + Markdown agents |
| CI/CD | GitHub Actions (em construção) |

## 📚 Documentação

- [Constitution](aiox-project/.aiox-core/constitution.md) — Princípios do projeto
- [Architecture: Rendering Engine](aiox-project/docs/architecture/CCC-RENDERING-ENGINE.md) — Design do motor de rendering
- [Stories](aiox-project/docs/stories/) — Backlog de desenvolvimento
