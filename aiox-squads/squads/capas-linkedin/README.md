# 🖼️ Capas LinkedIn & Instagram

Squad para criação de capas visuais (imagem única) para posts de texto no LinkedIn e Instagram.

## Visão Geral

Quando o post de texto **não precisa** de carrossel, ele precisa de uma **capa** — a imagem que acompanha o post no feed e funciona como "scroll-stopper" visual. Esta squad cria essa capa com 5 estilos pesquisados e validados por dados de performance algorítmica.

## Posição no Pipeline

```
Squad Pesquisa → Post de texto finalizado
                      ├── Squad Carrossel → carrossel visual (quando quer múltiplos slides)
                      └── Squad Capas → capa visual (quando quer imagem única) ← ESTA SQUAD
```

## 5 Estilos Visuais

| # | Estilo | Melhor para | LinkedIn | Instagram |
|:-:|--------|-------------|:--------:|:---------:|
| 1 | 📝 **Rascunho no Papel** | Muita info, hook fraco, framework | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 2 | 👤 **Pessoa + Texto** | Bastidor, storytelling | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 3 | 📊 **Micro-Infográfico** | Dado numérico, benchmark | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 4 | 🖼️ **Print de Autoridade** | Notícia + opinião | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 5 | ⚡ **Quote Card** | Frase compartilhável | ⭐⭐⭐ | ⭐⭐⭐⭐ |

## Agentes

- **🎨 Dani Design** — Designer visual especialista nos 5 estilos. Cria HTML self-contained, define design system, auto-renderiza PNG.
- **✅ Rui Revisão** — Revisor de qualidade com 5 critérios de scoring (impacto, legibilidade, tom, aderência à lente, consistência).

## Pipeline (7 Steps)

```
Step 01: [CHECKPOINT] Post + Estilo Visual
Step 02: [AUTO] Preparação do Design System
Step 03: [AUTO] Criação da Capa (HTML → PNG)
Step 04: [CHECKPOINT] Aprovação Visual
Step 05: [AUTO] Revisão de Qualidade
Step 06: [CHECKPOINT] Aprovação Final
Step 07: [AUTO] Publicar no Thiago Marketing OS
```

## Como Usar

### Via Workflow
```
/z-capas-linkedin
```

### Manual
1. Fornecer o post de texto finalizado
2. Escolher o estilo (1-5) — o designer pode recomendar
3. Revisar e aprovar a capa
4. Publicação automática no Thiago Marketing OS

## Estrutura

```
capas-linkedin/
├── squad.yaml              # Manifesto
├── README.md               # Este arquivo
├── agents/
│   ├── designer.md         # Dani Design
│   └── reviewer.md         # Rui Revisão
├── assets/
│   ├── profile-photo.png   # Foto de perfil
│   ├── photos/             # Banco de fotos pessoais
│   └── papers/             # Banco de fotos de papel/caderno
├── checklists/
│   └── review-checklist.md
├── data/
│   ├── linkedin-strategy.md
│   ├── quality-criteria.md
│   ├── tone-of-voice.md
│   └── visual-styles.md    # Specs detalhados dos 5 estilos
├── output/                 # Capas geradas
├── tasks/
│   ├── create-cover.md
│   ├── publish-to-ccc.md
│   └── review.md
├── templates/              # Templates HTML base
│   ├── rascunho-papel.md   # Rascunho no Papel (pipeline, não HTML)
│   ├── micro-infografico.html
│   ├── pessoa-texto.html
│   ├── print-autoridade.html
│   └── quote-card.html
└── workflows/
    └── workflow.yaml
```

## ⚠️ Uso Responsável de Prints (Estilo 4 — Print de Autoridade)

Esta squad pode capturar screenshots de posts públicos (Twitter/X, LinkedIn, sites de notícias) via EXA + Playwright. **O operador é o curador final** — verifica se o uso está dentro de fair use (citação com atribuição, comentário editorial sobre conteúdo público).

- Sempre incluir atribuição automática (`via @autor` para redes sociais ou `Fonte: <veículo>` para imprensa)
- Não capturar conteúdo claramente privado ou behind login wall
- Se a rede social bloquear o scraping (ex: Twitter sem login), usar Opção 1 (upload manual após baixar via extensão de browser)
- Domínios fora da white-list só são aceitos via Opção 1 (upload manual com URL/path)
- Cache local (`output/prints/index.json`) evita re-captura, mas operador sempre vê preview antes de aprovar

> Detalhes técnicos do fluxo: ver `tasks/obter-print-autoridade.md`.

---

## Requisitos Técnicos

- **Viewport:** 1080 x 1350 (4:5 portrait)
- **Formato:** PNG (renderizado de HTML via Playwright)
- **HTML:** Self-contained, sem dependências externas exceto Google Fonts
- **Contraste:** WCAG AA 4.5:1 mínimo
- **Texto:** Max 20 palavras por capa
