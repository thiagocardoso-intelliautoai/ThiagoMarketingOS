# Estilos Visuais — Carrosséis LinkedIn

> **Design System:** Consultar `../../data/design-system.md` para paleta master, tipografia e regras globais.
> **Anti-AI Rules:** Consultar `../../data/anti-ai-design-rules.md` antes de criar qualquer slide.

## Perfil

- **Nome:** Thiago C.Lima
- **@:** othiago-clima
- **Foto de perfil:** `squads/carrosseis-linkedin/assets/profile-photo.png`

---

## Estilo 1: Twitter-Style

### Conceito
Formato inspirado em tweets/posts do X (Twitter) — fundo charcoal, identidade minimalista, texto branco de alto impacto. **Fluxo print-first, fallback-text (REFAC-004):** o slide 1 tem 2 layouts possíveis dependendo da disponibilidade de um print autêntico.

### Quando Usar
- **Fonte de tese:** Falha Documentada, Benchmark Real
- **Tipo de conteúdo:** Trending topics, breaking news, lançamentos de ferramentas, opiniões rápidas
- **Gatilho:** Sempre que o conteúdo tem ancoragem em algo público (com print) **ou** o tom é tweet-like — opinião curta, direta, formato rede-social (sem print)

### Perde Quando
- A reação cabe em 1 frame sem perder força (vai melhor como capa Print de Autoridade — squad de capas)
- O conteúdo é puramente didático/framework, longo e estruturado (vai melhor Editorial Clean)
- Tom é provocativo/cru com bastidor pessoal (vai melhor Notebook Raw)

### Fluxo Slide 1 — print-first, fallback-text

Antes de renderizar, o Designer executa `../../shared/tasks/obter-print-autoridade.md`, que retorna **path/URL** ou **null**. O Designer escolhe o layout do template `twitter-style-base.html`:

| Retorno | Layout | Slide 1 | Total de slides |
|---------|--------|---------|------------------|
| path/URL | **`with-print`** | Print real em image-fill (~70% do slide) + hero text **32px** por cima | N (preserva) |
| null | **`no-print`** | Texto-tweet puro (BG `#0F1419`, body **52-58px**, sem imagem). O conteúdo do que seria slide 2 **sobe para a posição 1** | **N-1** (encolhe) |

#### Exemplo — Layout `with-print`

```
┌──────────────────────────────────────────┐
│  [foto80] Thiago C.Lima  @othiago-clima  │
│                                           │
│  Hero text curto (32px), complementa     │
│  o print abaixo                          │
│                                           │
│  ┌────────────────────────────────────┐  │
│  │                                    │  │
│  │      [PRINT AUTÊNTICO ~70%]        │  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
│  1/N                          Deslize →  │
└──────────────────────────────────────────┘
BG: #1A1A2E  •  Container print: #27293D + border #3F3F5C
```

#### Exemplo — Layout `no-print`

```
┌──────────────────────────────────────────┐
│  [foto80] Thiago C.Lima  @othiago-clima  │
│                                           │
│  Texto-tweet aqui.                       │
│  Hook em destaque.                       │
│  (corpo 52-58px, hook forte que abre     │
│  o post sozinho — ex-slide-2 promovido)  │
│                                           │
│                                           │
│  1/N-1                        Deslize →  │
└──────────────────────────────────────────┘
BG: #0F1419 (mais escuro que with-print, "modo tweet")
```

### Especificações Compartilhadas — Slides Seguintes (Body)
- **Fundo:** `#1A1A2E` (Charcoal)
- **Perfil:** Foto 80px + nome + @ no topo (consistência)
- **Texto:** `#F1F5F9` (Chalk), Inter 500, 34-38px, foco total no conteúdo textual
- **Sem print** — o foco é no texto/ensinamento
- **Último slide:** CTA claro OU CTA-SLIDE quando `is_lead_magnet=true`
- **Highlight inline:** `#14B8A6` (Teal) ou `#F59E0B` (Amber)

### Gate de Autenticidade (Layout with-print)
Quando o slide 1 = print real, o Reviewer valida no checklist:
- URL pública e acessível (não conteúdo behind-login privado)
- Atribuição correta (autor/veículo nomeado)
- Sem deepfake, sem citação fora de contexto, sem manipulação visual
- Domínio na white-list da task `obter-print-autoridade` (ou aprovado por upload manual)

### Gate de Hook Forte (Layout no-print)
Quando o slide 1 = texto-tweet, o Reviewer valida que:
- O ex-slide-2 promovido tem hook forte o suficiente para abrir o post sem o ancoramento visual do print
- Conteúdo do post não foi perdido com o encolhimento N→N-1 (Copywriter ajusta hierarquia)

---

## Estilo 2: Editorial Clean

### Conceito
Formato premium/editorial — fundo claro, tipografia bold sans-serif, cor de destaque única (Teal), whitespace generoso. Sério, profissional, altamente legível. Inspirado em publicações como Bloomberg e The Economist.

### Quando Usar
- **Fonte de tese:** Skills em Produção, Process Diagnostic
- **Tipo de conteúdo:** Frameworks, step-by-step, conteúdo educacional, processos, listas estruturadas
- **Gatilho:** Quando o conteúdo é denso e precisa de máxima clareza e legibilidade

### Perde Quando
- O tom é provocativo/pessoal/cru (vai melhor como Notebook Raw)
- O conteúdo é só dados numéricos comparativos (vai melhor como Data-Driven)
- A peça não pede premium — é opinião rápida (vai melhor como Notebook Raw)

### Especificações (pós-auditoria Uma — REFAC-004)

> **Fonte das specs:** auditoria completa em `aiox-project/docs/auditoria-editorial-clean.md`. O template `editorial-clean-base.html` declara 6 tokens em `:root` — proibido hex literal fora deles.

#### Paleta (6 tokens — únicos permitidos)
| Token | Valor | Uso |
|-------|-------|-----|
| `--bg` | `#F4F4F5` (Cloud) | Fundo do slide |
| `--ink` | `#18181B` | Hero, profile-name, citação |
| `--ink-secondary` | `#3F3F46` | Body text, list-text (token único) |
| `--muted` | `#71717A` | Profile-handle, footer-brand, swipe-hint, eyebrow (passa WCAG AA 4.6:1) |
| `--accent` | `#14B8A6` (Teal) | Highlight, accent-bar, divider, list-marker, data-hero, quote-mark, CTA. **Único accent permitido — proibido azul.** |
| `--divider` | `#E5E5E5` | Border-top do footer |

#### Tipografia (mín. §5.2 + auditoria)
- **Hero (base):** Inter 800, **64px**, line-height 1.12, letter-spacing -0.03em
- **Body:** Inter 500, **38px**, line-height 1.45, color `--ink-secondary`
- **Profile-name:** Inter 700, 24px, letter-spacing -0.02em
- **Profile-handle:** Inter 400, 19px, color `--muted`
- **Footer-brand:** Inter 600, 20px, uppercase, letter-spacing 0.05em, color `--muted`
- **Font-family:** `'Inter', system-ui, -apple-system, sans-serif` (fallback gracioso)

#### Estrutura
- **Padding slide:** 72px top/bottom × 80px left/right (whitespace 40%+)
- **Profile-photo:** 56px (presença editorial sem competir com hero)
- **Gap content:** 32px (24px na variant `dense-text`)
- **Accent-bar:** `border-left: 6px solid var(--accent)` + padding-left 28px + margin 12px 0
- **Divider top:** 80×4px em `--accent` (sinal de slide com hierarquia)
- **CTA-button:** `border-radius: 0px` (anti-AI rule — sem rounded)
- **Sem imagens decorativas** — 100% tipografia

### Variantes (REFAC-004 — auditoria Uma §3)

O template `editorial-clean-base.html` documenta **5 blocos** marcados por comentário. Designer escolhe o bloco apropriado por slide:

| Bloco | Quando usar | Ajustes principais |
|-------|-------------|--------------------|
| `<!-- LAYOUT: base -->` | Slide de hook ou slide com hierarquia padrão (hero + accent-bar opcional) | Hero 64px, body 38px, divider top |
| `<!-- VARIANT: data-feature -->` | UM dado é o protagonista (ex: "47% em 12 dias") | Eyebrow 22px uppercase + data-hero 96px Teal + data-body 32px |
| `<!-- VARIANT: quote -->` | Citação ou frase de autoridade | Aspas decorativas 120px Teal + corpo 44px italic 600 + atribuição 22px |
| `<!-- VARIANT: dense-text -->` | Slide com >30 palavras (densidade controlada) | Hero 48px, body 36px, gap 24px, line-height-body 1.42 |
| `<!-- VARIANT: closing -->` | Slide de fechamento minimalista (não-CTA) | Centralizado, divider auto-margin, hero 44px max-width 720px |
| `<!-- CTA-SLIDE -->` | Apenas se `is_lead_magnet=true` (REFAC-002) | Eyebrow Teal "Próximo passo" + cta-slide-text 56px + accent-bar 6px Teal |

#### Exemplo de uso por carrossel de 6 slides

```
Slide 1: LAYOUT base (hook + accent-bar com dado)
Slide 2: LAYOUT base (hero + body texto)
Slide 3: VARIANT data-feature (47% — protagonista)
Slide 4: VARIANT quote (citação de cliente)
Slide 5: LAYOUT base (resumo)
Slide 6: VARIANT closing (sem lead magnet) OU CTA-SLIDE (com lead magnet)
```

**Anti-AI gate:** pelo menos **2 slides do carrossel devem usar variantes diferentes do base** — evita pattern uniforme que algoritmo §6.1 classifica como "AI polish".

### Strengths
- Legibilidade máxima mobile (body 38px + line-height 1.45 + contraste 9.1:1 em texto secundário)
- Maior save rate (§5.2 — saves 1.8× em document posts; variant `data-feature` privilegia dado salvável)
- Sério e premium sem ser corporativo
- Template mais versátil dos 4 (5 variantes documentadas)
- Conformidade WCAG AA em todos os elementos (correção das cores #94A3B8 e #888888 que falhavam 4.5:1)

---

## Estilo 3: Data-Driven

### Conceito
Formato focado em dados e resultados — fundo charcoal profundo, números gigantes de impacto, barras de progresso, cards de comparação. Cada slide tem UM dado central que conta a história. Inspirado em relatórios de BI e dashboards.

### Quando Usar
- **Fonte de tese:** Benchmark Real (com dados)
- **Tipo de conteúdo:** Case studies, resultados mensuráveis, ROI, antes/depois, benchmarks
- **Gatilho:** Quando existem números concretos que sustentam a narrativa

### Perde Quando
- Existe apenas 1 dado central (vai melhor como capa Micro-Infográfico)
- Não há nenhum dado quantitativo central na narrativa
- Os dados não têm fonte verificável (sem fonte = sem credibilidade no formato Dashboard)

### Especificações
- **Fundo:** `#1A1A2E` (Charcoal — `--bg-dark`)
- **Texto principal:** `#F1F5F9` (Chalk — `--text-primary-dark`)
- **Accent primário:** `#14B8A6` (Teal — `--accent-primary`)
- **Accent secundário:** `#F59E0B` (Amber — `--accent-secondary`) — para números-hero e barras de progresso
- **Tipografia:** Inter 900 para números-hero (72-96px), Inter 700 para hero text (52px), Inter 500 para body (34px)
- **Label de dado:** Text-transform uppercase, letter-spacing 0.08em, cor `#64748B` (`--text-muted`)
- **Barras de progresso:** CSS puro com gradient Teal→Amber, 16px height, border-radius 8px
- **Cards de dado:** Fundo `#27293D` (`--surface`), border `#3F3F5C` (`--border`) 1px, border-radius 0px (regra Anti-AI: sem rounded cards)
- **Comparação antes/depois:** 2 colunas — antes (card neutro) vs depois (card com borda Teal)
- **Separadores:** Linhas horizontais finas (`#3F3F5C` — `--border`)
- **Assinatura rodapé:** "Thiago C.Lima" em Inter 500, 20px, cor `#64748B` (`--text-muted`)

### Strengths
- Maior share rate (dados são shareable)
- Altamente "salvável" como referência
- Prova autoridade com evidência concreta
- Impacto visual imediato com números grandes

---

## Estilo 4: Notebook Raw

### Conceito
Formato anti-template, anti-AI — estética de caderno de anotações com tipografia que simula escrita manual, markers, sublinhados e imperfeições intencionais. Humanizado e autêntico. Pattern interrupt poderoso num feed dominado por carrosséis polidos.

> **NOTA:** Este estilo usa paleta EXCLUSIVA (não a paleta master), conforme definido no Design System global.

### Quando Usar
- **Fonte de tese:** Falha Documentada
- **Tipo de conteúdo:** Conteúdo provocativo, mitos/desmistificação, opinião forte, bastidores, reflexões pessoais
- **Gatilho:** Quando o tom é pessoal, controverso ou anti-corporativo

### Perde Quando
- É matéria-colab — exige tom premium-neutro (vai melhor como Editorial Clean)
- Conteúdo tem dados centrais comparativos como elemento principal (vai melhor como Data-Driven)
- O tema é puramente educacional/tutorial sem opinião pessoal forte (vai melhor como Editorial Clean)

### Especificações
- **Fundo:** `#F5F0E8` (Craft — `--bg-craft`) com linhas de caderno sutis (CSS repeating-linear-gradient)
- **Margem vertical:** Linha vermelha transparente na esquerda (estilo caderno escolar)
- **Texto hero:** Caveat 700 (Google Font — simula escrita manual), 58px, cor `#2D2D2D`
- **Texto body:** Inter 500, 34px, cor `#444444` — legível, contraste com o hero handwriting
- **Accent vermelho:** `#DC2626` (`--accent-notebook-red`) para sublinhados marker e setas
- **Accent azul:** `#2563EB` (`--accent-notebook-blue`) para tags de tópico, números circulados e destaques tipo "caneta bic"
- **Sublinhado marker:** `background-image` com faixa semi-transparente vermelha posicionada em 88% da baseline
- **Note box:** Border 2px dashed `#B0A090`, pin emoji no canto, rotação sutil (0.3deg)
- **Setas:** Caracteres Unicode (→ ↓) em Caveat, cor vermelha, rotação -2deg
- **Steps:** Números dentro de círculos em azul (border 3px solid, border-radius 50%)
- **Imperfeição intencional:** `transform: rotate(-0.3deg a 0.8deg)` em elementos visuais
- **Footer:** Assinatura "— Thiago C.Lima" em Caveat + "vira a página →"
- **Sem foto de perfil** — o estilo notebook substitui por assinatura

### Regras Anti-AI (Específicas deste estilo)
1. **ZERO gradientes radiais ou complexos** — cores chapadas, como caneta real
2. **ZERO simetria perfeita** — rotações sutis intencionais em elementos
3. **ZERO paletas metálicas/douradas** — cores de instrumento de escrita (vermelho marker, azul bic, preto caneta)
4. **ZERO imagens geradas** — 100% tipografia, Unicode e CSS
5. **Texturas sutis via CSS** — grain/noise pattern, linhas de caderno
6. **Imperfeição ELEGANTE** — nunca sujo, sempre intencional e legível

### Strengths
- Pattern interrupt máximo (se destaca de tudo no feed)
- Gera confiança por parecer "real" e "humano"
- Conexão emocional forte com a audiência
- Anti-AI por design

---

## Viewport e Tipografia (Todos os Estilos)

| Elemento | Twitter-Style | Editorial Clean | Data-Driven | Notebook Raw |
|----------|--------------|----------------|-------------|-------------|
| Viewport | 1080 × 1350 | 1080 × 1350 | 1080 × 1350 | 1080 × 1350 |
| Hero text | 58px / 700 | 56px / 800 | 52px / 700 (96px / 900 para números) | 58px / 700 (Caveat) |
| Body text | 38px / 500 | 36px / 500 | 34px / 500 | 34px / 500 (Inter) |
| Caption | 24px / 500 | 18px / 600 | 20px / 700 | 24px / 600 (Caveat) |
| Font | Inter | Inter | Inter | Caveat + Inter |

---

## Guia de Seleção Rápida

| Pergunta | Estilo Recomendado |
|----------|-------------------|
| Tem um print/screenshot de autoridade? | **Twitter-Style** |
| É framework, processo ou tutorial? | **Editorial Clean** |
| Tem números/dados concretos de resultado? | **Data-Driven** |
| É opinião forte, provocação ou bastidor? | **Notebook Raw** |
| Não sabe qual? | **Editorial Clean** (mais versátil) |
