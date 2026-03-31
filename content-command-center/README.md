# Content Command Center

Dashboard visual para orquestrar os squads de conteúdo LinkedIn.

## Como Usar

1. **Produção:** [content-command-center-rose.vercel.app](https://content-command-center-rose.vercel.app)

2. **Local (dev):** Precisa de um server local (ES Modules exigem HTTP, não file://)

```bash
# Opção 1: Python
cd content-command-center
python -m http.server 5500

# Opção 2: Node.js (npx)
npx serve .

# Opção 3: VS Code Live Server extension
```

3. **Abrir no browser:** `http://localhost:5500` (modo dev)

## Funcionalidades

### Dashboard
- **4 modos de pesquisa** como cards clicáveis
- **Pipeline Tracker** visual com status de cada step
- **Prompt Generator** — copia o comando formatado para colar no Antigravity

### Biblioteca de Posts
- Lista de todos os posts salvos com filtros (Pilar, Status, Urgência)
- **Ver Post** — modal com conteúdo completo
- **Gerar Carrossel** — monta prompt para o squad de carrosséis
- **Gerar Capa** — em construção 🚧
- **Adicionar Post** — formulário completo
- **Export/Import JSON** — backup de dados

### Modos de Pesquisa
| Modo | Nome | O que faz |
|------|------|-----------|
| 1 | 🔍 Pesquisa Semanal | Varre fontes Tier 1/2/3 |
| 2 | 🏆 Benchmark | Analisa top players gringos |
| 3 | 📋 Briefing On-Demand | Pesquisa tema específico |
| 4 | ✍️ Post Direto | Pula pesquisa, vai pro Redator |

## Estrutura

```
content-command-center/
├── index.html          # SPA
├── css/styles.css      # Design system dark
├── js/
│   ├── app.js          # Entry point + router
│   ├── data.js         # CRUD localStorage
│   ├── state.js        # Pipeline state machine
│   ├── prompts.js      # Templates de prompt
│   └── render.js       # Renderização DOM
├── data/seed.json      # Dados iniciais
└── README.md
```

## Persistência

Dados são salvos no `localStorage` do browser. Use Export/Import para backup.

## Supabase Integration

Dados são armazenados no Supabase (PostgreSQL + Storage):
- **Tabelas:** `posts`, `covers`, `carousels`, `carousel_slides`, `source_photos`
- **Storage:** Bucket `content-assets` (capas, carrosséis, fotos de referência)
- **Fallback:** Se o Supabase estiver offline, o CCC funciona com localStorage

### Settings Drawer

Acessível via ícone ⚙️ no header:
- **Banco de Imagens** — CRUD de fotos de referência (Supabase Storage)
- *Em breve:* Perfil LinkedIn, Estilos de Capa, Conexão Supabase
