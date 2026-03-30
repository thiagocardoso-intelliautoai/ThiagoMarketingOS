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
Formato inspirado em tweets/posts do X (Twitter) — fundo charcoal, identidade minimalista, texto branco de alto impacto com print de autoridade como hook visual.

### Quando Usar
- **Pilar ACRE:** Alcance (A)
- **Tipo de conteúdo:** Trending topics, breaking news, lançamentos de ferramentas, opiniões rápidas
- **Gatilho:** Quando existe um print/screenshot de autoridade que contextualiza o tema

### Especificações — Slide 1 (Hook)
- **Fundo:** `#1A1A2E` (Charcoal — `--bg-dark`)
- **Perfil:** Foto circular (80px diâmetro) + Nome "Thiago C.Lima" + @ "othiago-clima" no topo
- **Texto principal:** `#F1F5F9` (Chalk — `--text-primary-dark`), fonte Inter 700, 40-58px, alinhado à esquerda
- **Print de autoridade:** Screenshot de um post/notícia de alguém com autoridade no assunto, posicionado na metade inferior do slide como prova social/hook visual
- **Container do print:** `background: #27293D` (`--surface`), `border: 1px solid #3F3F5C` (`--border`), `padding: 24px`
- **Layout:** Compacto, simulando um post de rede social

### Especificações — Slides Seguintes (Conteúdo)
- **Fundo:** `#1A1A2E` (Charcoal)
- **Perfil:** Foto circular menor (48px) + nome no topo (consistência)
- **Texto:** `#F1F5F9` (Chalk), 34-43px, foco total no conteúdo textual
- **Sem print** — o foco é no texto/ensinamento
- **Último slide:** CTA claro (seguir, comentar, salvar)
- **Assinatura rodapé:** "Thiago C.Lima" em Inter 500, 20px, cor `#64748B` (`--text-muted`)

### Referência Visual
O print na primeira imagem funciona como "gatilho de autoridade" — usar posts reais de referências do mercado (ex: CEO de empresa conhecida, lançamento de ferramenta, dado relevante) para contextualizar e agregar credibilidade ao tema.

---

## Estilo 2: Editorial Clean

### Conceito
Formato premium/editorial — fundo claro, tipografia bold sans-serif, cor de destaque única (Teal), whitespace generoso. Sério, profissional, altamente legível. Inspirado em publicações como Bloomberg e The Economist.

### Quando Usar
- **Pilar ACRE:** Credibilidade (C)
- **Tipo de conteúdo:** Frameworks, step-by-step, conteúdo educacional, processos, listas estruturadas
- **Gatilho:** Quando o conteúdo é denso e precisa de máxima clareza e legibilidade

### Especificações
- **Fundo:** `#F4F4F5` (Cloud — `--bg-light`)
- **Texto principal:** `#18181B` (Ink — `--text-primary-light`)
- **Accent:** `#14B8A6` (Teal — `--accent-primary`)
- **Tipografia:** Inter 800 para hero (56px), Inter 500 para body (36px)
- **Layout:** Grid assimétrico, alinhado à esquerda, whitespace 40%+
- **Perfil no topo:** Foto circular pequena (48px) + nome + @
- **Barra lateral:** Linha vertical 5px na cor Teal (`--accent-primary`) para citações e dados-chave
- **Separador:** Linha horizontal 80px × 4px em Teal no topo de slides de conteúdo
- **Sem imagens decorativas** — 100% tipografia + dados
- **Footer:** "Thiago C.Lima" em Inter 500, 20px, cor `#94A3B8` (`--text-secondary`), separado por borda top sutil

### Strengths
- Legibilidade máxima mobile
- Maior save rate por ser conteúdo-referência
- Sério e premium sem ser corporativo
- Template mais versátil dos 4

---

## Estilo 3: Data-Driven

### Conceito
Formato focado em dados e resultados — fundo charcoal profundo, números gigantes de impacto, barras de progresso, cards de comparação. Cada slide tem UM dado central que conta a história. Inspirado em relatórios de BI e dashboards.

### Quando Usar
- **Pilar ACRE:** Credibilidade (C) com dados
- **Tipo de conteúdo:** Case studies, resultados mensuráveis, ROI, antes/depois, benchmarks
- **Gatilho:** Quando existem números concretos que sustentam a narrativa

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
- **Pilar ACRE:** Engajamento (E)
- **Tipo de conteúdo:** Conteúdo provocativo, mitos/desmistificação, opinião forte, bastidores, reflexões pessoais
- **Gatilho:** Quando o tom é pessoal, controverso ou anti-corporativo

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
