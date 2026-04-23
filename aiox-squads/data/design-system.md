---
name: "Thiago C.Lima — O Estrategista Técnico"
version: "alpha"
description: "Charcoal & Teal. Anti-hype, técnico acessível, resultado > teoria."

colors:
  # ── Cores Estruturais (Fundos) ──
  bg-dark: "#1A1A2E"             # Charcoal — fundo dark principal
  bg-light: "#F4F4F5"            # Cloud — fundo Editorial Clean
  bg-craft: "#F5F0E8"            # Craft — fundo Notebook Raw (exclusivo)
  surface: "#27293D"             # Slate — cards, containers, surfaces elevadas
  border: "#3F3F5C"              # Zinc — borders em dark mode

  # ── Cores de Texto ──
  text-primary-dark: "#F1F5F9"   # Chalk — sobre dark bg (14.2:1)
  text-primary-light: "#18181B"  # Ink — sobre light bg (16.8:1)
  text-secondary: "#94A3B8"      # Mist — sobre dark bg (5.3:1)
  text-muted: "#64748B"          # Fog — sobre dark bg (3.4:1, só captions grandes)

  # ── Cores de Accent ──
  accent-primary: "#14B8A6"         # Teal — tecnologia + confiança
  accent-secondary: "#F59E0B"       # Amber — urgência inteligente
  accent-notebook-red: "#DC2626"    # Vermelho Marker (exclusivo Notebook Raw/Rascunho)
  accent-notebook-blue: "#2563EB"   # Azul Bic (exclusivo Notebook Raw/Rascunho)

typography:
  hero:
    fontFamily: Inter
    fontSize: 52px
    fontWeight: "700"
    lineHeight: 1.1
    letterSpacing: -0.02em
  hero-number:
    fontFamily: Inter
    fontSize: 96px
    fontWeight: "900"
    lineHeight: 1.0
    letterSpacing: -0.03em
  subtitle:
    fontFamily: Inter
    fontSize: 38px
    fontWeight: "600"
    lineHeight: 1.2
    letterSpacing: -0.01em
  body:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: "400"
    lineHeight: 1.4
  caption:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: "500"
    lineHeight: 1.3
  micro:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: "400"
    lineHeight: 1.2
  handwriting:
    fontFamily: Caveat
    fontSize: 58px
    fontWeight: "700"
    lineHeight: 1.2

rounded:
  cards: 0px       # Regra Anti-AI: sem border-radius em cards
  profile: 9999px  # Apenas para foto de perfil circular
  data-bar: 8px    # Exceção funcional: barras de progresso

spacing:
  page-padding: 64px
  section-gap: 48px
  element-gap: 24px
  footer-margin: 32px

components:
  # ── FOOTER ──
  footer-dark:
    textColor: "{colors.text-muted}"
    typography: "{typography.micro}"
    padding: "{spacing.footer-margin}"
  footer-light:
    textColor: "{colors.text-secondary}"
    typography: "{typography.micro}"
    padding: "{spacing.footer-margin}"
  footer-notebook:
    textColor: "#2D2D2D"
    typography: "{typography.handwriting}"
    padding: "{spacing.footer-margin}"

  # ── CONTAINERS ──
  print-container:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary-dark}"
    rounded: "{rounded.cards}"
    padding: 24px
  card-dark:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary-dark}"
    rounded: "{rounded.cards}"
    padding: "{spacing.element-gap}"

  # ── PROFILE HEADER ──
  profile-header:
    rounded: "{rounded.profile}"
    size: 80px
  profile-header-small:
    rounded: "{rounded.profile}"
    size: 48px

  # ── DATA VISUALIZATION ──
  data-bar:
    backgroundColor: "{colors.accent-primary}"
    height: 16px
    rounded: "{rounded.data-bar}"

  # ── DECORATORS ──
  quote-decorator:
    textColor: "{colors.accent-primary}"
    size: 120px
  editorial-separator:
    backgroundColor: "{colors.accent-primary}"
    width: 80px
    height: 4px

  # ── NOTEBOOK SPECIFIC ──
  notebook-line:
    backgroundColor: "#E8E0D0"
    height: 1px
  notebook-margin:
    backgroundColor: "{colors.accent-notebook-red}"
    width: 1px
---

## Overview

Charcoal & Teal — "O Estrategista Técnico". Design system para conteúdo visual LinkedIn/Instagram do Thiago C.Lima.

**Inspiração:** Bloomberg Terminal, Vercel Dashboard, Linear.app
**Posicionamento:** Anti-hype, técnico acessível, resultado > teoria
**Escopo:** Todos os squads visuais (capas-linkedin, carrosseis-linkedin, futuros)

### Identidade Fixa

| Elemento | Valor | Observação |
|----------|-------|------------|
| **Nome** | Thiago C.Lima | Grafia fixa, sempre essa |
| **@** | othiago-clima | Handle LinkedIn |
| **Foto** | `assets/profile-photo.png` | Compartilhada entre squads |
| **Viewport** | 1080 × 1350 (4:5 portrait) | LinkedIn + Instagram |
| **Formato** | HTML self-contained → PNG | Renderizado via Puppeteer headless |

O design system governa 9 estilos visuais divididos em dois grupos:
- **Digitais** (paleta master): Twitter-Style, Editorial Clean, Data-Driven, Micro-Infográfico, Print de Autoridade, Quote Card
- **Orgânicos** (paleta exclusiva): Notebook Raw, Rascunho no Papel, Pessoa+Texto

## Colors

A paleta segue a **regra 60-30-10**: 60% fundo (Charcoal/Cloud), 30% texto (Chalk/Ink), 10% accent (Teal/Amber).

- **bg-dark (#1A1A2E):** Charcoal — fundo dos estilos Twitter-Style, Data-Driven, Print, Quote Card, Micro-Infográfico. Inspirado na interface do Bloomberg Terminal.
- **bg-light (#F4F4F5):** Cloud — fundo do Editorial Clean. Off-white sofisticado, não branco puro.
- **bg-craft (#F5F0E8):** Craft — fundo do Notebook Raw. Simula papel craft real. Exclusivo deste estilo.
- **surface (#27293D):** Slate — cards, containers, surfaces elevadas sobre dark. Sutil diferença tonal vs charcoal.
- **border (#3F3F5C):** Zinc — borders de containers em dark mode. Visível mas não dominante.
- **accent-primary (#14B8A6):** Teal — tecnologia + confiança. Accent principal para destaques, dados-chave, barras, links.
- **accent-secondary (#F59E0B):** Amber — urgência inteligente. Apenas em KPIs, alertas, números-hero. Usado quase exclusivamente no estilo Data-Driven.
- **accent-notebook-red (#DC2626):** Vermelho Marker — exclusivo Notebook Raw/Rascunho. Sublinhados, markers.
- **accent-notebook-blue (#2563EB):** Azul Bic — exclusivo Notebook Raw/Rascunho. Tags, números circulados.

### Restrições de Cor

- **Máximo 1 accent por peça visual** (Teal OU Amber, não os dois)
- **Exceção:** Data-Driven pode usar Teal + Amber em barras de progresso (gradient funcional)
- **Notebook Raw/Rascunho** usam APENAS suas cores exclusivas (vermelho marker + azul bic)
- **NUNCA** usar accent como background de área grande
- **NUNCA** gradiente no texto (regra Anti-AI)
- **Todas as cores flat** — sem gradientes radiais, sem glow

### Mapeamento por Estilo

#### Estilos Digitais (paleta master)

| Estilo | Fundo | Texto | Accent | Surface |
|--------|-------|-------|--------|---------|
| **Twitter-Style** | `bg-dark` | `text-primary-dark` | — | `surface` (p/ print) |
| **Editorial Clean** | `bg-light` | `text-primary-light` | `accent-primary` (Teal) | — |
| **Data-Driven** | `bg-dark` | `text-primary-dark` | `accent-primary` + `accent-secondary` | `surface` |
| **Micro-Infográfico** | `bg-dark` | `text-primary-dark` | `accent-primary` (Teal) | — |
| **Print de Autoridade** | `bg-dark` | `text-primary-dark` | — | `surface` (p/ print) |
| **Quote Card** | `bg-dark` | `text-primary-dark` | `accent-primary` (Teal) | — |

#### Estilos Orgânicos (paleta exclusiva)

| Estilo | Fundo | Texto | Accent |
|--------|-------|-------|--------|
| **Notebook Raw** | `bg-craft` | Inter `#444444` / Caveat `#2D2D2D` | `accent-notebook-red` + `accent-notebook-blue` |
| **Rascunho no Papel** | Foto real | Manuscrito (imagem) | — |
| **Pessoa + Texto** | Foto real | `#FFFFFF` com text-shadow | — |

## Typography

Duas famílias com papéis distintos:
- **Inter** (Google Fonts, weights 400-900): todos os estilos digitais. Fonte neutra, geométrica, legível em mobile.
- **Caveat** (Google Fonts, weight 700): exclusiva Notebook Raw e Rascunho no Papel. Simula escrita manual.

### Escala de Tamanhos

O YAML define os **valores base**. Na prática, o designer ajusta dentro dos ranges conforme o conteúdo:

| Token | Base (YAML) | Range permitido | Uso |
|-------|-------------|-----------------|-----|
| `hero` | 52px | 52-96px | Título principal, números de impacto |
| `hero-number` | 96px | 72-96px | Números gigantes em Data-Driven, Micro-Info |
| `subtitle` | 38px | 34-42px | Subtítulo, contexto |
| `body` | 32px | 28-36px | Texto corrido, explicações |
| `caption` | 20px | 18-24px | Legendas, fontes, atribuições |
| `micro` | 18px | 14-18px | Marca/assinatura no rodapé (18px = absolute floor) |
| `handwriting` | 58px | 34-58px | Notebook Raw hero, assinatura Caveat |

### Regras Tipográficas Inegociáveis

- **Mínimo absoluto:** 18px — nada menor que isso, jamais
- **Hero em mobile:** mínimo 44px (precisa ser legível no feed do celular)
- **Hierarquia por peso/tamanho** — NUNCA por efeitos (glow, shadow, gradient text)
- **Uma palavra em accent** para destaque semântico — permitido, mas max 1 por peça

## Layout & Spacing

Grid editorial assimétrico. O layout segue princípios de design editorial, não de UI/UX de app.

- **`page-padding` (64px):** Margem interna generosa. Conteúdo nunca encosta nas bordas.
- **`section-gap` (48px):** Espaço entre blocos de conteúdo. Cria respiração entre seções.
- **`element-gap` (24px):** Espaço entre elementos dentro de um bloco.
- **`footer-margin` (32px):** Margem bottom fixa para assinatura.

### Regras de Layout

- **Alinhamento padrão:** esquerda (não centralizado — regra Anti-AI)
- **Mínimo 30% de espaço negativo** por peça visual
- **Peso visual** no terço superior ou inferior (lei dos terços)
- **Máximo 2 elementos decorativos** por peça

## Elevation & Depth

Design flat por princípio. Profundidade por contraste tonal, não por sombras pesadas.

- **Level 1 (Base):** Fundo sólido (`bg-dark` ou `bg-light`)
- **Level 2 (Surface):** Cards em `surface` (#27293D) sobre Charcoal, com border `border` (#3F3F5C) de 1px
- **Sem gradientes radiais** — textura noise/grain CSS em opacity <5% quando necessário
- **Print containers:** `box-shadow: 0 8px 32px rgba(0,0,0,0.4)` — único uso permitido de sombra pesada

## Shapes

Border-radius é restrito como regra Anti-AI. O design usa cantos retos por padrão.

- **Cards:** 0px (regra Anti-AI: sem rounded cards — parece Canva/SaaS)
- **Foto de perfil:** `9999px` (círculo, único elemento com radius generoso)
- **Barras de progresso:** 8px (exceção funcional em Data-Driven)

## Components

### Footer (Assinatura Visual)

O footer é a assinatura consistente em toda peça visual. Formato padrão: `Thiago C.Lima`.

- **Dark mode (`footer-dark`):** Inter 500, 18-20px, cor `text-muted` (#64748B), alinhado à esquerda, 32px de margem bottom. Zero decoração — sem box, sem linha, sem ícone.
- **Light mode (`footer-light`):** Mesma regra, cor `text-secondary` (#94A3B8).
- **Notebook (`footer-notebook`):** Caveat 700, "— Thiago C.Lima" + "vira a página →". Sem foto de perfil.
- **Twitter-Style:** Header com foto circular + nome + @ no topo. Footer no rodapé é opcional.

### Print Container

Card elevado para screenshots, citações de autoridade. Fundo `surface`, padding 24px, border-radius 0px (flat), shadow sutil.

### Profile Header

Foto circular 80px (padrão) ou 48px (versão compacta). Único elemento que usa border-radius 50%.

### Data Visualization

Barras de progresso em Teal (#14B8A6), 16px de altura, border-radius 8px. Exceção funcional à regra de 0px radius.

### Decorators

- **Quote decorator:** Aspas decorativas 120px+ em Teal. Único elemento decorativo permitido em Quote Card.
- **Editorial separator:** Barra horizontal 80×4px em Teal. Separa seções em Editorial Clean.

### Notebook Elements

- **Linhas de caderno:** 1px, cor #E8E0D0 (papel), repetidas a cada ~32px
- **Margem vermelha:** 1px, cor `accent-notebook-red`, vertical, 80px da borda esquerda

## Do's and Don'ts

### ❌ Don'ts (AI Tell-Tales — Marcadores de IA)

- **Don't** use gradient text fills (`-webkit-background-clip: text`) — clichê de IA
- **Don't** use radial glow / background glow atrás de elementos — marcador visual de IA
- **Don't** use ícones literais/óbvios (alerta p/ alerta, cérebro p/ IA) — IA é previsível
- **Don't** center everything symmetrically — criar tensão/assimetria intencional
- **Don't** use connector dots/arrows entre elementos — parece dashboard/UI stepper
- **Don't** use boxes com border + border-radius decorativos — parece Canva/SaaS
- **Don't** stack mais de 2 elementos decorativos — IA empilha efeitos, humano contém
- **Don't** use paleta óbvia (vermelho=perigo, verde=ok) — subverter expectativas de cor
- **Don't** use mais de 1 accent por peça (exceção: Data-Driven com gradient funcional)

### ✅ Do's (Human Design Markers)

- **Do** use solid flat typography com hierarquia por peso/tamanho
- **Do** create intentional asymmetry (editorial grid, left-aligned)
- **Do** use generous negative space (minimum 30% do viewport)
- **Do** add subtle noise/grain texture via CSS (opacity <5%) quando necessário
- **Do** reference editorial layouts (Bloomberg, The Economist, McKinsey, Vercel, Linear)
- **Do** exercise restraint — se remover um elemento torna a mensagem mais clara, remover
- **Do** maintain WCAG AA contrast ratios (4.5:1 para texto legível)
- **Do** document design system antes de qualquer HTML
- **Do** verify render antes de entregar — se parecer IA, refazer

### Referências Editoriais

Cada peça visual deve poder responder: "Onde um humano veria esse layout?"

**✅ Aprovadas:** Bloomberg Terminal, Bloomberg Businessweek, The Economist infographics, McKinsey/BCG one-slide insights, Vercel Dashboard, Linear.app, Annual report covers

**❌ Proibidas:** Canva templates, Dribbble "premium dark UI" shots, Behance gradients, "Aesthetic" Instagram quotes, Templates genéricos de carrossel LinkedIn

### Checklist de Conformidade

Antes de renderizar QUALQUER peça visual, verificar:

- [ ] Cores usadas estão neste Design System (hex exatos do YAML)
- [ ] Fonte é Inter ou Caveat (nenhuma outra)
- [ ] Tamanho mínimo respeitado (18px absolute floor)
- [ ] Contraste WCAG AA 4.5:1 para texto legível
- [ ] Máximo 1 accent (exceção: Data-Driven com 2)
- [ ] Assinatura presente e no formato padrão
- [ ] Alinhamento não é 100% centralizado
- [ ] Mínimo 30% espaço negativo
- [ ] Máximo 2 elementos decorativos
- [ ] Passes Anti-AI Design Rules (`anti-ai-design-rules.md`)
