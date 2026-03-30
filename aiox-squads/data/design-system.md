# Design System Global — Thiago C.Lima

> **Paleta:** Charcoal & Teal — "O Estrategista Técnico"
> **Inspiração:** Bloomberg Terminal, Vercel Dashboard, Linear.app
> **Posicionamento:** Anti-hype, técnico acessível, resultado > teoria
> **Escopo:** Todos os squads visuais (carrosseis-linkedin, capas-linkedin, futuros)

---

## Identidade Fixa

| Elemento | Valor | Observação |
|----------|-------|------------|
| **Nome** | Thiago C.Lima | Grafia fixa, sempre essa |
| **@** | othiago-clima | Handle LinkedIn |
| **Foto** | `assets/profile-photo.png` | Compartilhada entre squads |
| **Viewport** | 1080 × 1350 (4:5 portrait) | LinkedIn + Instagram |
| **Formato** | HTML self-contained → PNG | Renderizado via Puppeteer headless |

---

## Tipografia

### Font Stack

| Papel | Fonte | Weight | Quando Usar |
|-------|-------|--------|-------------|
| **Primária** | Inter (Google Fonts) | 400-900 | Todos os estilos digitais |
| **Manuscrita** | Caveat (Google Fonts) | 700 | Exclusiva: Notebook Raw, Rascunho no Papel |

### Escala Tipográfica

| Nível | Tamanho | Peso | Uso |
|-------|---------|------|-----|
| **Hero** | 52-96px | 700-900 | Título principal, números de impacto |
| **Subtitle** | 34-42px | 500-700 | Subtítulo, contexto |
| **Body** | 28-36px | 400-500 | Texto corrido, explicações |
| **Caption** | 18-24px | 400-600 | Legendas, fontes, atribuições |
| **Micro** | 14-16px | 400 | Apenas marca/assinatura no rodapé |

### Regras
- **Mínimo absoluto:** 18px (nada menor que isso, jamais)
- **Hero em mobile:** mínimo 44px (precisa ser legível no feed do celular)
- **Hierarquia por peso/tamanho** — NUNCA por efeitos (glow, shadow, gradient text)
- **Uma palavra em accent** para destaque semântico — permitido, mas max 1 por peça

---

## Paleta de Cores Master

### Cores Estruturais (Fundos e Textos)

| Token | Nome | Hex | Uso |
|-------|------|-----|-----|
| `--bg-dark` | Charcoal | `#1A1A2E` | Fundo dark: Twitter-Style, Data-Driven, Print, Quote, Micro-Info |
| `--bg-light` | Cloud | `#F4F4F5` | Fundo light: Editorial Clean |
| `--bg-craft` | Craft | `#F5F0E8` | Fundo paper: Notebook Raw (exclusivo) |
| `--surface` | Slate | `#27293D` | Cards, containers, surfaces elevadas sobre dark |
| `--border` | Zinc | `#3F3F5C` | Borders de containers em dark mode |

### Cores de Texto

| Token | Nome | Hex | Sobre | Contraste vs fundo |
|-------|------|-----|-------|-------------------|
| `--text-primary-dark` | Chalk | `#F1F5F9` | Dark bg | 14.2:1 ✅ |
| `--text-primary-light` | Ink | `#18181B` | Light bg | 16.8:1 ✅ |
| `--text-secondary` | Mist | `#94A3B8` | Dark bg | 5.3:1 ✅ |
| `--text-muted` | Fog | `#64748B` | Dark bg | 3.4:1 ⚠️ (só p/ captions grandes) |

### Cores de Accent

| Token | Nome | Hex | Uso | Personalidade |
|-------|------|-----|-----|---------------|
| `--accent-primary` | Teal | `#14B8A6` | Accent principal — destaques, dados-chave, barras, links | Tecnologia + Confiança |
| `--accent-secondary` | Amber | `#F59E0B` | Accent secundário — urgência, KPIs, alertas, números-hero | Urgência Inteligente |
| `--accent-notebook-red` | Vermelho Marker | `#DC2626` | Exclusivo Notebook Raw/Rascunho — sublinhados, markers | Caneta vermelha |
| `--accent-notebook-blue` | Azul Bic | `#2563EB` | Exclusivo Notebook Raw/Rascunho — tags, números circulados | Caneta azul |

### Regra 60-30-10

| Proporção | O que é | Exemplo |
|-----------|---------|---------|
| **60%** | Fundo (Charcoal ou Cloud) | Área dominante |
| **30%** | Texto (Chalk ou Ink) | Conteúdo principal |
| **10%** | Accent (Teal ou Amber) | Destaques, dados-chave |

### Restrições
- **Máximo 1 accent por peça visual** (Teal OU Amber, não os dois)
- **Exceção:** Data-Driven pode usar Teal + Amber em barras de progresso (gradient funcional)
- **Notebook Raw/Rascunho** usam APENAS suas cores exclusivas (vermelho marker + azul bic)
- **NUNCA** usar accent como background de área grande
- **NUNCA** gradiente no texto (regra Anti-AI)
- **Todas as cores flat** — sem gradientes radiais, sem glow

---

## Assinatura Visual (Footer)

### Formato Padrão

```
Thiago C.Lima
```

| Elemento | Valor |
|----------|-------|
| **Posição** | Rodapé inferior, 32px de margem bottom |
| **Alinhamento** | Esquerda (consistente com grid editorial) |
| **Fonte** | Inter 500, 20px |
| **Cor** | `--text-muted` (#64748B) sobre dark, `--text-secondary` (#94A3B8) sobre light |
| **Decoração** | Zero. Sem box, sem linha, sem ícone. Só texto discreto |

### Exceções
- **Notebook Raw:** Assinatura em Caveat ("— Thiago C.Lima") + "vira a página →"
- **Rascunho no Papel:** "Thiago C.Lima" discreto fora do papel, 18px
- **Twitter-Style:** Header com foto circular + nome no topo, assinatura no rodapé é opcional

---

## Grid e Spacing

| Token | Valor | Uso |
|-------|-------|-----|
| `--padding-page` | 64px | Margem interna das bordas |
| `--gap-sections` | 48px | Espaço entre blocos de conteúdo |
| `--gap-elements` | 24px | Espaço entre elementos dentro de bloco |
| `--radius-cards` | 0px | Sem border-radius em cards (regra Anti-AI) |
| `--radius-profile` | 50% | Apenas para foto de perfil circular |

### Regras de Layout
- **Alinhamento padrão:** esquerda (não centralizado — regra Anti-AI)
- **Mínimo 30% de espaço negativo** por peça visual
- **Peso visual** no terço superior ou inferior (lei dos terços)
- **Máximo 2 elementos decorativos** por peça

---

## Mapeamento por Estilo

### Estilos Digitais (usam paleta master)

| Estilo | Fundo | Texto | Accent | Surface |
|--------|-------|-------|--------|---------|
| **Twitter-Style** | `--bg-dark` | `--text-primary-dark` | — | `--surface` (p/ print) |
| **Editorial Clean** | `--bg-light` | `--text-primary-light` | `--accent-primary` (Teal) | — |
| **Data-Driven** | `--bg-dark` | `--text-primary-dark` | `--accent-primary` + `--accent-secondary` | `--surface` |
| **Micro-Infográfico** | `--bg-dark` | `--text-primary-dark` | `--accent-primary` (Teal) | — |
| **Print de Autoridade** | `--bg-dark` | `--text-primary-dark` | — | `--surface` (p/ print) |
| **Quote Card** | `--bg-dark` | `--text-primary-dark` | `--accent-primary` (Teal) | — |

### Estilos Orgânicos (paleta exclusiva)

| Estilo | Fundo | Texto | Accent |
|--------|-------|-------|--------|
| **Notebook Raw** | `--bg-craft` | Inter `#444444` / Caveat `#2D2D2D` | `--accent-notebook-red` + `--accent-notebook-blue` |
| **Rascunho no Papel** | Foto real | Manuscrito (imagem) | — |
| **Pessoa + Texto** | Foto real | `#FFFFFF` com text-shadow | — |

---

## Referências Editoriais

Cada peça visual deve poder responder: "Onde um humano veria esse layout?"

### ✅ Referências Aprovadas
- Bloomberg Terminal / Bloomberg Businessweek
- The Economist infographics
- McKinsey / BCG one-slide insights
- Vercel Dashboard
- Linear.app interface
- Annual report covers

### ❌ Referências Proibidas
- Canva templates
- Dribbble "premium dark UI" shots
- Behance gradients
- "Aesthetic" Instagram quotes
- Templates genéricos de carrossel LinkedIn

---

## Checklist de Conformidade

Antes de renderizar QUALQUER peça visual, verificar:

- [ ] Cores usadas estão neste Design System (hex exatos)
- [ ] Fonte é Inter ou Caveat (nenhuma outra)
- [ ] Tamanho mínimo respeitado (18px absolute floor)
- [ ] Contraste WCAG AA 4.5:1 para texto legível
- [ ] Máximo 1 accent (exceção: Data-Driven com 2)
- [ ] Assinatura presente e no formato padrão
- [ ] Alinhamento não é 100% centralizado
- [ ] Mínimo 30% espaço negativo
- [ ] Máximo 2 elementos decorativos
- [ ] Passes Anti-AI Design Rules (`anti-ai-design-rules.md`)
