# 🏛️ Architecture: CCC Rendering Engine

**Status:** Draft  
**Author:** Aria (Architect Agent)  
**Date:** 2026-03-29  
**Scope:** Transformar o Content Command Center de frontend estático em full-stack com motor de rendering  

---

## 1. Visão Geral

### 1.1 Problema

O Content Command Center (CCC) é atualmente um frontend estático (HTML/CSS/JS servido via `npx serve`). A geração visual de capas e carrosséis depende de execução manual de scripts Puppeteer via CLI ou via agente no Antigravity. Isso cria:

- Fricção na produção (copiar prompts, colar no chat, esperar, rodar CLIs)
- Dependência do Antigravity para tarefas 100% determinísticas (rendering HTML → PNG)
- Impossibilidade de preview visual inline antes do upload

### 1.2 Solução

Adicionar um **backend Node.js/Express** ao CCC que executa os scripts de rendering existentes via API HTTP e expõe os resultados para o frontend via endpoints REST.

### 1.3 Princípio Arquitetural

> **"O Antigravity é o cérebro. O CCC é a fábrica."**

| Responsabilidade | Ferramenta | Motivo |
|-----------------|------------|--------|
| Pesquisa de mercado | Antigravity | Web search + análise de fontes + IA conversacional |
| Criação de texto (posts) | Antigravity | Checkpoints criativos, tom de voz, IA de alto nível (Opus) |
| Criação de copy (carrosséis) | Antigravity | Mesmos motivos — IA conversacional com checkpoints |
| **Rendering visual (capas)** | **CCC** | Template HTML/CSS → Puppeteer → PNG. Zero IA necessária |
| **Rendering visual (slides)** | **CCC** | Mesmo: templates → Puppeteer → PNGs → PDF. Zero IA |
| **Validação de qualidade** | **CCC** | Checklist automático: viewport, contraste, placeholders |
| **Upload para Supabase** | **CCC** | Supabase SDK direto, sem intermediação |
| **Preview e aprovação** | **CCC** | UI dedicada com galeria, zoom, navegação |

---

## 2. Arquitetura do Sistema

### 2.1 Visão C4 — Container

```
┌────────────────────────────────────────────────────────┐
│                     USUÁRIO (Browser)                  │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │          CCC Frontend (HTML/CSS/JS)              │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │  │
│  │  │Dashboard │ │Biblioteca│ │ Rendering Wizard │ │  │
│  │  │(modos)   │ │(posts)   │ │ (capas/carrosséis)│ │  │
│  │  └──────────┘ └──────────┘ └──────────────────┘ │  │
│  └──────────────────┬───────────────────────────────┘  │
│                     │ HTTP (localhost:3000)             │
│  ┌──────────────────▼───────────────────────────────┐  │
│  │           CCC Backend (Express.js)               │  │
│  │  ┌────────────┐ ┌────────────┐ ┌──────────────┐ │  │
│  │  │ /api/cover │ │/api/carousel│ │ /api/upload  │ │  │
│  │  │  /render   │ │  /render    │ │  /validate   │ │  │
│  │  └──────┬─────┘ └──────┬─────┘ └──────┬───────┘ │  │
│  │         │              │              │          │  │
│  │  ┌──────▼──────────────▼──────┐ ┌─────▼───────┐ │  │
│  │  │     Puppeteer Engine       │ │  Supabase   │ │  │
│  │  │  (Chromium headless)       │ │  SDK Client │ │  │
│  │  └────────────────────────────┘ └─────────────┘ │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
                          │
                          │ HTTPS
                          ▼
                 ┌─────────────────┐
                 │    Supabase     │
                 │  (PostgreSQL +  │
                 │   Storage)      │
                 └─────────────────┘
```

### 2.2 Stack Tecnológico

| Camada | Tecnologia | Versão | Justificativa |
|--------|-----------|--------|---------------|
| Runtime | Node.js | 18+ | Já usado nos scripts existentes |
| Server | Express.js | 4.x | Leve, conhecido, suficiente |
| Rendering | Puppeteer | 21+ | **Já usado** nos scripts dos squads |
| PDF | pdf-lib | 1.x | **Já usado** no `png-to-pdf.js` |
| Database | @supabase/supabase-js | 2.x | **Já usado** nos CLIs de upload |
| Frontend | Vanilla JS (ES Modules) | - | **Já é a stack do CCC** |

> **Zero dependências novas.** Reutilizamos 100% do que já existe.

---

## 3. API Endpoints

### 3.1 Cover Rendering

```
POST /api/cover/render
```

**Request:**
```json
{
  "postId": "uuid-do-post",
  "style": 2,
  "overrides": {
    "title": "Texto customizado (opcional)",
    "data_point": "47% em 12 dias (opcional)"
  }
}
```

**Process:**
1. Busca post do Supabase (título, hook, body, pilar)
2. Seleciona template HTML base por estilo (`templates/pessoa-texto.html`, etc.)
3. Injeta dados do post no template (substituição de placeholders)
4. Copia assets necessários (profile-photo, fotos do banco)
5. Escreve HTML final em diretório temporário
6. Executa Puppeteer: viewport 1080×1350, `networkidle0`, screenshot
7. Retorna URL do PNG gerado (servido estaticamente)

**Response:**
```json
{
  "success": true,
  "coverUrl": "/renders/covers/{slug}/cover.png",
  "dimensions": { "width": 1080, "height": 1350 },
  "sizeKB": 287,
  "validation": {
    "viewport": "pass",
    "contrast": "pass",
    "selfContained": "pass",
    "noPlaceholders": "pass",
    "wordCount": 18
  }
}
```

---

### 3.2 Carousel Rendering

```
POST /api/carousel/render
```

**Request:**
```json
{
  "postId": "uuid-do-post",
  "style": 1,
  "slides": [
    { "type": "hook", "text": "IA não vai substituir seu SDR.", "visual_note": "print de autoridade" },
    { "type": "content", "text": "O problema real não é o SDR..." },
    { "type": "data", "text": "→ 15h/semana devolvidas", "data_point": "15h" },
    { "type": "cta", "text": "Me manda um DM." }
  ]
}
```

**Process:**
1. Para cada slide: seleciona template HTML base por estilo + tipo de slide
2. Injeta texto e dados no template
3. Copia assets (profile-photo.png)
4. Gera HTML de cada slide (`slide-01.html`, `slide-02.html`, ...)
5. Executa Puppeteer em cada slide (viewport 1080×1350)
6. Combina PNGs em PDF via `pdf-lib`
7. Retorna URLs dos PNGs + PDF

**Response:**
```json
{
  "success": true,
  "slides": [
    { "index": 1, "url": "/renders/slides/{slug}/slide-01.png", "sizeKB": 142 },
    { "index": 2, "url": "/renders/slides/{slug}/slide-02.png", "sizeKB": 118 }
  ],
  "pdfUrl": "/renders/slides/{slug}/carousel.pdf",
  "validation": {
    "viewport": "pass",
    "contrast": "pass",
    "maxWordsPerSlide": "pass",
    "consistency": "pass"
  }
}
```

---

### 3.3 Validation

```
POST /api/validate
```

**Request:**
```json
{
  "type": "cover",
  "path": "/renders/covers/{slug}/cover.html"
}
```

**Validações implementadas (baseadas nos checklists existentes):**

| # | Validação | Fonte | Implementação |
|---|-----------|-------|---------------|
| 1 | Viewport 1080×1350 | `review-checklist.md` | Puppeteer config garante |
| 2 | Contraste WCAG AA ≥ 4.5:1 | `review-checklist.md` | Extrai cores do CSS, calcula ratio via fórmula W3C |
| 3 | HTML self-contained | `review-checklist.md` | Regex: zero `<link>` ou `<script src="">` (exceto Google Fonts) |
| 4 | Sem placeholder text | `designer.md` (anti-pattern) | Regex: nenhum `{{...}}`, `[TODO]`, `Lorem`, `Texto aqui` |
| 5 | Max palavras (20 capa / 30 slide) | `designer.md` / `copywriter.md` | Conta palavras no texto visível |
| 6 | Consistência entre slides | `review-checklist.md` (carrossel) | Verifica mesma font-family e palette em todos HTMLs |

---

### 3.4 Adjust (Feedback de Rejeição)

```
POST /api/adjust
```

**Request:**
```json
{
  "type": "cover",
  "slug": "meu-post-slug",
  "feedback": "Título mais escuro. Overlay mais forte."
}
```

**Process:**
1. Lê o HTML atual do render
2. Parseia o feedback e mapeia para alterações CSS:
   - "mais escuro" → reduce lightness do color do título
   - "overlay mais forte" → aumenta opacidade do overlay (0.6 → 0.75)
   - "fonte maior" → aumenta font-size em 20%
   - "cor do número" → altera color do elemento `.data-point`
3. Aplica as alterações no HTML
4. Re-renderiza via Puppeteer
5. Retorna novo PNG

**Mapeamento de Feedback → CSS:**

| Feedback (pattern) | Ação CSS |
|-------------------|----------|
| `"mais escuro"` / `"darker"` | `color: hsl(H, S, L-15%)` |
| `"mais claro"` / `"lighter"` | `color: hsl(H, S, L+15%)` |
| `"maior"` / `"bigger"` | `font-size: current * 1.2` |
| `"menor"` / `"smaller"` | `font-size: current * 0.8` |
| `"overlay mais forte"` | `opacity: current + 0.15` |
| `"cor X"` (verde, azul, etc.) | Mapeia para hex do design system |

> **Nota:** Feedback não mapeável retorna aviso pedindo reformulação. Não há IA envolvida — são regex patterns + transformações CSS determinísticas.

---

### 3.5 Upload (Aprovar e Publicar)

```
POST /api/upload
```

**Request:**
```json
{
  "type": "cover",
  "postId": "uuid-do-post",
  "slug": "meu-post-slug",
  "style": "pessoa-texto"
}
```

**Process (reutiliza lógica dos CLIs existentes):**
1. Lê o PNG do diretório de renders
2. Upload para Supabase Storage bucket `content-assets`
3. Insere/atualiza registro na tabela `covers` ou `carousels` + `carousel_slides`
4. Retorna URL pública

---

## 4. Estrutura de Diretórios

```
content-command-center/
├── index.html                     # [EXISTENTE] Página principal
├── css/styles.css                 # [EXISTENTE] Estilos
├── js/
│   ├── app.js                     # [EXISTENTE] Router SPA
│   ├── data.js                    # [EXISTENTE] DataStore (Supabase)
│   ├── render.js                  # [MODIFICAR] Adicionar wizard de rendering
│   ├── linkedin-preview.js        # [EXISTENTE] Preview de posts
│   ├── prompts.js                 # [EXISTENTE] Generator de prompts
│   ├── state.js                   # [EXISTENTE] Mode definitions
│   ├── supabase.js                # [EXISTENTE] Supabase client
│   └── rendering-wizard.js        # [NOVO] UI do wizard de rendering
├── server.js                      # [NOVO] Express server
├── api/
│   ├── cover-render.js            # [NOVO] Handler de render de capas
│   ├── carousel-render.js         # [NOVO] Handler de render de carrossel
│   ├── validate.js                # [NOVO] Engine de validação/checklist
│   ├── adjust.js                  # [NOVO] Engine de ajustes CSS
│   └── upload.js                  # [NOVO] Upload Supabase
├── engine/
│   ├── puppeteer-renderer.js      # [NOVO] Wrapper reutilizável do Puppeteer
│   ├── template-injector.js       # [NOVO] Injeção de dados em templates HTML
│   ├── css-adjuster.js            # [NOVO] Parseador de feedback → CSS
│   ├── contrast-checker.js        # [NOVO] Validação WCAG AA
│   └── pdf-generator.js           # [NOVO] Wrapper do pdf-lib
├── renders/                       # [NOVO] Diretório de outputs temporários
│   ├── covers/{slug}/             # PNGs de capas geradas
│   └── slides/{slug}/             # PNGs + PDFs de carrosséis gerados
├── package.json                   # [NOVO] Dependências do server
└── .env                           # [NOVO] Credenciais (Supabase)
```

### 4.1 Referências Externas (Não Copiadas)

Os templates HTML e assets são **lidos diretamente** dos squads:

```
aiox-squads/squads/
├── capas-linkedin/
│   ├── templates/           # Templates HTML de capas (5 estilos)
│   │   ├── rascunho-papel.md
│   │   ├── pessoa-texto.html
│   │   ├── micro-infografico.html
│   │   ├── print-autoridade.html
│   │   └── quote-card.html
│   └── assets/              # Fotos, profile pic, papéis
│       ├── profile-photo.png
│       ├── photos/
│       └── papers/
│
└── carrosseis-linkedin/
    ├── templates/           # Templates HTML de slides (4 estilos)
    │   ├── twitter-style-base.html
    │   ├── editorial-clean-base.html
    │   ├── data-driven-base.html
    │   └── notebook-raw-base.html
    └── assets/
        └── profile-photo.png
```

> **Vantagem:** Qualquer melhoria nos templates dos squads reflete automaticamente no CCC sem deploy.

---

## 5. Fluxo de Dados

### 5.1 Capa — Fluxo Completo

```
[Usuário no CCC]
     │
     ├── 1. Clica "Gerar Capa" no post da Biblioteca
     │
     ├── 2. Modal: escolhe estilo (1-5)
     │
     ├── 3. Frontend envia POST /api/cover/render
     │       { postId, style }
     │
     ├── 4. Backend:
     │       a. Busca post do Supabase (título, hook, body)
     │       b. Lê template HTML do estilo em aiox-squads/
     │       c. Injeta dados no template
     │       d. Copia assets para renders/covers/{slug}/
     │       e. Puppeteer: HTML → PNG (1080×1350)
     │       f. Roda validações (checklist automático)
     │       g. Retorna { coverUrl, validation }
     │
     ├── 5. Frontend mostra:
     │       - Preview do PNG gerado
     │       - Resultado do checklist (✅/❌/⚠️)
     │       - Botões: [Aprovar] [Ajustar]
     │
     ├── 6a. Se APROVAR:
     │       POST /api/upload { type: "cover", postId, slug, style }
     │       → Upload Supabase → Capa aparece na Biblioteca
     │
     └── 6b. Se AJUSTAR:
             POST /api/adjust { type: "cover", slug, feedback: "..." }
             → Re-renderiza → Volta ao passo 5
```

### 5.2 Carrossel — Fluxo Completo

```
[Usuário no Antigravity]
     │
     ├── 1. /z-carrosseis-linkedin
     │       → Checkpoints 01-05 (tema, ângulos, copy)
     │       → Copy aprovado salvo no Supabase via save-post-cli.js
     │
[Usuário no CCC]
     │
     ├── 2. Biblioteca → Post → "Gerar Carrossel"
     │
     ├── 3. Modal: escolhe estilo visual (1-4)
     │
     ├── 4. Frontend envia POST /api/carousel/render
     │       { postId, style }
     │       (Backend busca os dados do copy do Supabase)
     │
     ├── 5. Backend:
     │       a. Busca post + copy dos slides do Supabase
     │       b. Lê templates HTML do estilo em aiox-squads/
     │       c. Gera slide-XX.html para cada slide
     │       d. Puppeteer: cada HTML → PNG
     │       e. pdf-lib: PNGs → PDF
     │       f. Validações automáticas
     │       g. Retorna { slides[], pdfUrl, validation }
     │
     ├── 6. Frontend mostra:
     │       - Galeria de slides navegável (← →)
     │       - PDR preview
     │       - Checklist automático
     │       - Botões: [Aprovar] [Ajustar]
     │
     ├── 7a. Se APROVAR:
     │       POST /api/upload { type: "carousel", postId, slug, style }
     │
     └── 7b. Se AJUSTAR:
             POST /api/adjust { type: "carousel", slug, feedback: "..." }
             → Re-renderiza slides afetados → Volta ao passo 6
```

---

## 6. Mudança no Schema do Supabase

### 6.1 Dados de Slides Individuais

Para que o CCC possa renderizar carrosséis, o copy de cada slide precisa estar disponível no banco. 

**Nova tabela ou campo necessário:**

```sql
-- Opção A: Coluna JSON na tabela existente `posts`
ALTER TABLE posts 
  ADD COLUMN slide_data JSONB DEFAULT NULL;

-- Formato do JSON:
-- [
--   { "index": 1, "type": "hook", "text": "...", "visual_note": "..." },
--   { "index": 2, "type": "content", "text": "..." },
--   { "index": 3, "type": "data", "text": "...", "data_point": "47%" },
--   { "index": 4, "type": "cta", "text": "..." }
-- ]
```

**Impacto:** O `save-post-cli.js` precisa ser atualizado para parsear o copy do carrossel e salvar o `slide_data` JSON.

---

## 7. Dependências e Reutilização

### 7.1 Scripts Reutilizados Diretamente

| Script existente | Localização | Reutilização |
|-----------------|-------------|--------------|
| `render-cover.js` | `squads/capas-linkedin/scripts/` | Lógica do Puppeteer copiada para `engine/puppeteer-renderer.js` |
| `render-slides.js` | `squads/carrosseis-linkedin/scripts/` | Mesma lógica, parametrizada |
| `png-to-pdf.js` | `squads/carrosseis-linkedin/scripts/` | Lógica copiada para `engine/pdf-generator.js` |
| `upload-cover-cli.js` | `squads/shared/scripts/` | Lógica Supabase copiada para `api/upload.js` |
| `upload-carousel-cli.js` | `squads/shared/scripts/` | Mesma lógica |

### 7.2 NPM Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "puppeteer": "^21.0.0",
    "pdf-lib": "^1.17.0",
    "@supabase/supabase-js": "^2.44.0",
    "dotenv": "^16.0.0"
  }
}
```

> **Todas essas dependências já estão instaladas** nos squads. Zero dependência nova no ecossistema.

---

## 8. Segurança

| Concern | Mitigação |
|---------|-----------|
| API key Supabase no frontend | Já está exposta (RLS protege). Backend usa a mesma key |
| Execução de Puppeteer | Sandbox ativado, `--no-sandbox` só em dev local |
| Path traversal nos slugs | Sanitizar slug: `/^[a-z0-9-]+$/` |
| CORS | Não necessário — mesmo servidor serve frontend e API |
| Rate limiting | Não necessário — uso local, single user |

---

## 9. Performance

| Operação | Tempo Estimado | Bottleneck |
|----------|---------------|------------|
| Render 1 capa PNG | 3-5s | Puppeteer boot + Google Fonts |
| Render 5 slides | 8-12s | Puppeteer reutiliza browser entre slides |
| Gerar PDF | < 1s | pdf-lib é síncrono |
| Upload Supabase | 1-2s | Network |
| **Total (capa)** | **~6s** | |
| **Total (carrossel 5 slides)** | **~15s** | |

### 9.1 Otimizações

- **Browser pool:** Manter 1 instância do Puppeteer rodando (warm) em vez de abrir/fechar
- **Reutilizar page:** Navegar entre HTMLs em vez de criar nova aba
- **Cache de fonts:** Primeira render demora mais, subsequentes são mais rápidas

---

## 10. Roadmap de Implementação

| Story | Título | Escopo | Esforço | Dependência |
|-------|--------|--------|---------|-------------|
| **CCC-001** | Server Express + Static | `server.js` servindo frontend + `/api/health` | 1h | — |
| **CCC-002** | Puppeteer Engine | `engine/puppeteer-renderer.js` — wrapper reutilizável | 2h | CCC-001 |
| **CCC-003** | Cover Render API | `api/cover-render.js` + `engine/template-injector.js` | 4h | CCC-002 |
| **CCC-004** | Carousel Render API | `api/carousel-render.js` + `engine/pdf-generator.js` | 4h | CCC-002 |
| **CCC-005** | Validation Engine | `api/validate.js` + `engine/contrast-checker.js` | 2h | CCC-003 |
| **CCC-006** | Adjust Engine | `api/adjust.js` + `engine/css-adjuster.js` | 3h | CCC-003 |
| **CCC-007** | Frontend Wizard | `js/rendering-wizard.js` — UI step-by-step | 4h | CCC-003, CCC-004 |
| **CCC-008** | Upload + Polish | `api/upload.js` + toasts + refresh biblioteca | 2h | CCC-005, CCC-007 |
| **CCC-009** | Slide Data Migration | Atualizar `save-post-cli.js` + campo `slide_data` | 2h | — |

**Total: ~24h (3-4 dias)**  
**Caminho crítico: CCC-001 → CCC-002 → CCC-003 → CCC-007 → CCC-008**

---

## 11. Validação de Qualidade — Prova de Zero Perda

### 11.1 O que gera a qualidade visual hoje

| Componente | Responsável | Muda na migração? |
|-----------|-------------|-------------------|
| Template HTML/CSS | Arquivo estático no squad | ❌ Não — mesmos templates |
| Puppeteer config (viewport, DPR, clip) | Script Node.js | ❌ Não — mesma config |
| Font rendering (Google Fonts + wait) | Puppeteer `networkidle0` + delay | ❌ Não — mesma estratégia |
| Asset handling (profile pic, fotos) | Script copia para dir local | ❌ Não — mesma cópia |
| Contraste e cores | CSS no template | ❌ Não — mesmo CSS |
| Copy dos slides | Gerado pela IA no Antigravity (Opus) | ❌ Não — continua no Antigravity |

**Conclusão: o pipeline é 100% determinístico. O mesmo input gera o mesmo output, independente de quem invoca o Puppeteer.**

### 11.2 Teste de Validação

```bash
# Gerar capa via script atual (squad)
node aiox-squads/squads/capas-linkedin/scripts/render-cover.js meu-slug

# Gerar capa via API do CCC (novo)
curl -X POST http://localhost:3000/api/cover/render -d '{"postId":"...","style":2}'

# Comparar os dois PNGs
# Devem ser pixel-identical (diff = 0 bytes)
```

---

## 12. Decisões Arquiteturais

| Decisão | Escolha | Alternativa descartada | Motivo |
|---------|---------|----------------------|--------|
| Server framework | Express.js | Fastify, Hono | Equipe já conhece Express, overhead mínimo |
| Templates: copiar ou referenciar? | Referenciar (`aiox-squads/`) | Copiar para `content-command-center/` | Evita duplicação, mudanças nos squads refletem automaticamente |
| Feedback de ajustes | Regex patterns → CSS | LLM para interpretar feedback | Sem custo de API, determinístico, previsível |
| Browser pool | Sim (warm instance) | Abrir/fechar por request | Performance: 3s vs 8s por render |
| Slide data storage | JSON column `slide_data` | Tabela separada `slide_texts` | Simplicidade, consulta única |

---

*— Aria, arquitetando o futuro 🏗️*
