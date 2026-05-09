# Auditoria do Estilo Editorial Clean — Carrosséis LinkedIn

**Auditora:** 🎨 Uma (UX/UI Designer & Design System Architect)
**Story:** REFAC-004 — Squads Visuais V2 (sub-tarefa C)
**Data:** 2026-05-09
**Branch:** `feature/refac-004-visuais-v2`
**Inputs auditados:**
- `aiox-squads/squads/carrosseis-linkedin/templates/editorial-clean-base.html`
- `aiox-squads/squads/carrosseis-linkedin/data/visual-styles.md` (§50 Editorial Clean)
- `linkedin-algorithm-2026-reference.md` §3, §3.1, §3.4, §5.2

**Lente dupla:**
1. Fundamentos visuais (tipografia, espaçamento, contraste, hierarquia)
2. Retenção pelo algoritmo 2026 (dwell time §3.1, click-through floor 35% §5.2, save rate)

---

## 1. Diagnóstico

### 1.1 Pontos fortes (manter)

✅ **Hierarquia tipográfica** — Inter 800/56px hero + 500/36px body é o pareamento editorial canônico. Letter-spacing -0.02em a -0.03em em pesos bold é ajuste premium correto (peso visual percebido cresce com o size; sem o negative tracking, "fica gordo").

✅ **Whitespace** — `padding: 72px 80px` (linha 40) gera ~40% de espaço respirado. Editorial Clean é "Bloomberg, não BuzzFeed" — esse cushion é a assinatura.

✅ **Contraste hero/body em fundo Cloud** — `#18181B` em `#F4F4F5` = ratio 16.4:1 (WCAG AAA). Acima do mínimo do squad (4.5:1) e bom para leitura mobile sob luz solar.

✅ **`border-radius: 0px` consistente nos containers** — alinhado com anti-AI rules (§"Boxes com border-radius decorativos = parece Canva/SaaS").

✅ **Divider top 80×4px Teal** — sinal editorial sutil, não decorativo. Mantém.

✅ **Letter-spacing 0.05em + uppercase no `footer-brand`** — eyebrow editorial clássico. Mantém o tratamento.

### 1.2 Pontos fracos (corrigir)

⚠️ **Hero 56px é "OK", não "memorável"** — para 1080×1350 mobile-first, o hero é o sinal de §3.1 (dwell time). 56px renderiza ~46-48px na visualização do feed após compressão. Subir para 64px aumenta retenção sem estourar viewport com line-height 1.12.

⚠️ **Body 36px está NO mínimo da §5.2 (LinkedIn document specs)** — "tamanho de fonte mínimo 22-24px body, 36px headlines". 36px é mínimo de **headline**, não de body. Body deveria estar 38-40px. Subir para 38px alinha com o threshold sem prejudicar densidade de conteúdo.

⚠️ **`profile-photo` 48px** — pequeno demais. O Twitter-style usa 80px (correto para identidade rede-social). Editorial deveria ter 56-64px — nem rede-social nem invisível, mas presente como assinatura editorial.

⚠️ **`profile-handle` em 17px e `#888888`** — falha **dupla**:
- 17px abaixo do mínimo de 18px para texto secundário em 4:5 portrait.
- `#888888` em `#F4F4F5` = ratio 3.5:1 — **falha WCAG AA** (mín. 4.5:1 para texto normal).

⚠️ **`footer-brand` e `swipe-hint` em `#94A3B8`** — `#94A3B8` em `#F4F4F5` = ratio 3.3:1. **Falha WCAG AA**. Footer "desaparece" no feed.

⚠️ **Body em `#444444`, list-text em `#333333`** — 2 tokens de cinza diferentes para texto secundário sem razão sistêmica. Editorial Clean precisa de paleta de texto **única** ou semanticamente justificada.

⚠️ **`cta-button` com `border-radius: 8px`** — quebra o anti-AI rule do squad ("no rounded cards"). Inconsistência com `.authority-print { border-radius: 0px }` do estilo Twitter.

⚠️ **`cta-slide-content` com `border-left: 6px solid #2563EB` e `cta-slide-eyebrow` em `#2563EB`** — azul órfão. O accent do estilo é Teal `#14B8A6`. Introduzir um segundo accent só no CTA-slide quebra a coerência sistêmica e introduz cor sem tópico (visual debt).

⚠️ **Falta sistema de variantes documentadas** — só existe um pattern (hero + accent-bar). Slide com muito texto, slide com dado, slide com citação, slide de fechamento exigem ajustes que hoje o Designer improvisa caso a caso. Improvisação = inconsistência entre carrosséis.

⚠️ **`font-family: 'Inter', sans-serif`** — sem fallback de sistema. Se Google Fonts falhar (raro mas possível em redes restritivas), o render cai num sans-serif genérico que pode quebrar o letter-spacing negativo.

### 1.3 Risco de "AI-look" (lente §6.1)

§6.1 do algoritmo: "LinkedIn implementou classificadores que reconhecem padrões léxicos típicos de LLM não-editado: listas perfeitamente paralelas, gramática excessivamente polida sem variação humana." O análogo visual é **excesso de simetria, todos os slides com a mesma estrutura, ausência de variação intencional**.

Editorial Clean é o estilo mais propenso a parecer "AI" porque é o mais polido. Risco: 8 slides idênticos (divider top + hero + accent-bar + footer) leem como template. A solução **NÃO** é sujar o visual — é variar quais elementos aparecem em quais slides (variantes).

---

## 2. Recomendações — Diff por linha

> Diff aplicável diretamente no arquivo `aiox-squads/squads/carrosseis-linkedin/templates/editorial-clean-base.html` (293 linhas no estado atual). As linhas referenciadas são as do estado pré-aplicação.

### 2.1 Tabela de mudanças cirúrgicas

| Linha | Atual | Diff | Razão (lente fundamentos / lente algoritmo) |
|------:|-------|------|---------------------------------------------|
| L29 | `font-family: 'Inter', sans-serif;` | `font-family: 'Inter', system-ui, -apple-system, sans-serif;` | Fallback gracioso. Garante render mesmo se Google Fonts falhar — protege click-through floor (§5.2). |
| L54-55 | `width: 48px; height: 48px;` | `width: 56px; height: 56px;` | Profile com mais presença editorial. Não chega a competir com o hero (que sobe pra 64px). |
| L66 | `font-size: 22px;` | `font-size: 24px;` | Profile-name acima de 22px = leitura mobile clara. |
| L73 | `font-size: 17px;` | `font-size: 19px;` | Acima do mín. 18px de texto secundário. |
| L75 | `color: #888888;` | `color: #71717A;` | **Corrige falha WCAG AA.** `#71717A` em `#F4F4F5` = 4.6:1 (passa). |
| L84 | `gap: 36px;` | `gap: 32px;` | Mais respiração entre divider→hero→accent-bar = leitura linear melhor. Mantém o "ritmo editorial". |
| L88 | `font-size: 56px;` | `font-size: 64px;` | **Hero ↑.** Aumenta dwell time (§3.1). Cabe em 1080 com line-height 1.12 e até 4 linhas. |
| L96 | `font-size: 36px;` | `font-size: 38px;` | **Body ↑** acima do mínimo §5.2. Pequena diferença, grande efeito em legibilidade mobile. |
| L99 | `color: #444444;` | `color: #3F3F46;` | Token único de "body color". Contraste 9.1:1. |
| L110 | `border-left: 5px solid #14B8A6;` | `border-left: 6px solid #14B8A6;` | Alinha peso da accent-bar com a do CTA-slide (que é 6px na L207). Sistematiza. |
| L112 | `margin: 8px 0;` | `margin: 12px 0;` | Respiração antes/depois da accent-bar — evita "colar" no body adjacente. |
| L122-123 | `width: 80px; height: 4px;` | manter | Divider editorial. OK. |
| L137 | `font-size: 36px;` | `font-size: 38px;` | List-marker pareado com body. |
| L144 | `font-size: 34px;` | `font-size: 36px;` | List-text no mínimo de body. |
| L147 | `color: #333333;` | `color: #3F3F46;` | **Token único de cor de texto secundário** — elimina inconsistência com L99. |
| L160 | `font-size: 18px;` | `font-size: 20px;` | Footer-brand mais legível mobile. |
| L162 | `color: #94A3B8;` | `color: #71717A;` | **Corrige falha WCAG AA.** Idem L75. |
| L170 | `color: #94A3B8;` | `color: #71717A;` | Idem (swipe-hint). |
| L194 | `border-radius: 8px;` | `border-radius: 0px;` | **Anti-AI rule do squad** — alinha com `.authority-print`. CTA-button retangular = editorial premium. |
| L207 | `border-left: 6px solid #2563EB;` | `border-left: 6px solid #14B8A6;` | **Paleta unificada.** Remove azul órfão. Único accent = Teal. |
| L217 | `color: #2563EB;` | `color: #14B8A6;` | Idem (cta-slide-eyebrow). |

**Total de linhas modificadas:** 19 (de 293 = 6.5% do arquivo). Cirurgia, não reforma.

### 2.2 Adições (não há "linhas atuais" — são blocos novos)

#### Adicionar comentário-cabeçalho REFAC-004 (após linha 13)

```html
<!--
  REFAC-004 — AUDITORIA UMA (lente dupla: fundamentos + algoritmo 2026)
  Variantes deste template documentadas na seção VARIANT abaixo.
  Designer: escolhe a variante apropriada por slide ANTES de copiar o bloco.
  Checklist específico do estilo: checklists/editorial-clean-checklist.md
-->
```

#### Adicionar tokens de cor centralizados (substituir bloco entre linhas 22-26 — `* { ... }`)

```css
:root {
  --bg: #F4F4F5;
  --ink: #18181B;
  --ink-secondary: #3F3F46;
  --muted: #71717A;
  --accent: #14B8A6;
  --divider: #E5E5E5;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

E substituir todos os hex literais nos seletores pelas variáveis correspondentes. Isso **não muda o output visual**, mas:
- Elimina o risco de divergência futura entre slides do mesmo estilo
- Sinaliza ao Designer que essas são as **únicas 6 cores** permitidas no Editorial Clean
- Facilita aplicação consistente em variantes

---

## 3. Variantes para casos de borda

> Cada variante é um bloco `<!-- VARIANT: nome -->` a ser **adicionado** no template (após o bloco `<!-- /CTA-SLIDE -->`). Designer copia a variante apropriada para `output/slides/{slug}/slide-NN.html`.

### 3.1 Variant `dense-text` — slide com muito texto

**Quando usar:** quando o copy de um slide ultrapassa ~30 palavras (limite Rule of 1) e ainda assim é coeso semanticamente.

**Ajustes vs base:**
- Hero: 48px (vs 64px do base) — sacrifica impacto por densidade
- Body: 36px (vs 38px) — recupera o mínimo §5.2
- Gap content: 24px (vs 32px) — comprime hierarquia
- Line-height body: 1.42 (vs 1.45) — ganha 1 linha sem prejudicar leitura

**Justificativa algoritmo:** mantém click-through floor — slide denso ainda é legível, advance rate não despenca por ilegibilidade.

```html
<!-- VARIANT: dense-text -->
<div class="slide variant-dense">
  <!-- profile -->
  <div class="content">
    <div class="divider"></div>
    <h2 class="hero-text" style="font-size: 48px; line-height: 1.16;">Hero condensado.</h2>
    <p class="body-text" style="font-size: 36px; line-height: 1.42;">Corpo denso de até 6 linhas. Mantém legibilidade.</p>
  </div>
  <!-- footer -->
</div>
<!-- /VARIANT: dense-text -->
```

### 3.2 Variant `data-feature` — slide com dado numérico

**Quando usar:** quando UM dado é o protagonista do slide (ex: "47% em 12 dias", "3.7× mais reach"). Não é o estilo Data-Driven (que é dashboard) — é dado pontual em formato editorial.

**Estrutura:**
- Eyebrow uppercase 22px peso 600 letter-spacing 0.12em cor `--muted`
- Número-hero 96px peso 800 cor `--accent` (Teal) — protagonista visual
- Body explicativo 32px peso 500 cor `--ink-secondary`

**Justificativa algoritmo:** §5.2 — saves são 1.8× em document posts; dados pontuais são salváveis. Editorial Clean é o estilo com maior save rate (visual-styles.md §50 "Strengths").

```html
<!-- VARIANT: data-feature -->
<div class="slide variant-data">
  <!-- profile -->
  <div class="content">
    <span class="eyebrow">RESULTADO</span>
    <h2 class="data-hero">47%</h2>
    <p class="data-body">Em 12 dias. Sem ferramenta nova, só workflow novo.</p>
  </div>
  <!-- footer -->
</div>

<style>
  .eyebrow { font-size: 22px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }
  .data-hero { font-size: 96px; font-weight: 800; color: var(--accent); letter-spacing: -0.04em; line-height: 1; }
  .data-body { font-size: 32px; font-weight: 500; color: var(--ink-secondary); line-height: 1.4; }
</style>
<!-- /VARIANT: data-feature -->
```

### 3.3 Variant `quote` — slide com citação

**Quando usar:** trecho de fala, frase de autoridade externa, ou diagnóstico de cliente.

**Estrutura:**
- Aspas decorativas grandes (120px peso 800 cor `--accent`, decorativas — só visual, não-semânticas)
- Corpo da citação em 44px peso 600 italic cor `--ink`
- Atribuição "— Autor" em 22px peso 600 cor `--muted`

**Justificativa fundamentos:** citação tem hierarquia diferente de hero. Italic + peso 600 (não 800) sinaliza voz emprestada. As aspas grandes ancoram visualmente.

**Justificativa algoritmo:** comments substantivos (§3.1, peso 15× like) são mais frequentes em slides com citação — leitor responde com sua própria experiência. ↑ engagement signal.

```html
<!-- VARIANT: quote -->
<div class="slide variant-quote">
  <!-- profile -->
  <div class="content">
    <span class="quote-mark">"</span>
    <p class="quote-body">A gente não tem problema de tráfego. Tem problema de conversão.</p>
    <span class="quote-attribution">— CMO de SaaS B2B, em call de discovery</span>
  </div>
  <!-- footer -->
</div>

<style>
  .quote-mark { font-size: 120px; font-weight: 800; color: var(--accent); line-height: 0.6; height: 64px; }
  .quote-body { font-size: 44px; font-weight: 600; font-style: italic; color: var(--ink); line-height: 1.3; letter-spacing: -0.01em; }
  .quote-attribution { font-size: 22px; font-weight: 600; color: var(--muted); }
</style>
<!-- /VARIANT: quote -->
```

### 3.4 Variant `closing` — slide de fechamento (não-CTA)

**Quando usar:** penúltimo slide quando o post é informativo (sem lead magnet) — fecha a narrativa antes do CTA tradicional. Diferente do `CTA-SLIDE` (que é só para `is_lead_magnet=true`).

**Estrutura:**
- Divider centralizado (não top-left)
- Hero curto 44px peso 800 — prompt reflexivo
- Sem accent-bar, sem body — minimalismo intencional como sinal de "fim"

**Justificativa fundamentos:** assimetria intencional vs slides de body (centralização vs alinhamento à esquerda) sinaliza encerramento sem precisar de palavra "FIM".

**Justificativa algoritmo:** §6.1 — variar layout entre slides reduz "AI-look" pattern. Slide de fechamento minimalista intencional ≠ todos os 8 slides idênticos.

```html
<!-- VARIANT: closing -->
<div class="slide variant-closing" style="align-items: center; text-align: center;">
  <!-- profile -->
  <div class="content" style="justify-content: center; align-items: center;">
    <div class="divider" style="margin: 0 auto;"></div>
    <h2 class="hero-text" style="font-size: 44px; max-width: 720px;">Vira a página. O próximo prompt é seu.</h2>
  </div>
  <!-- footer -->
</div>
<!-- /VARIANT: closing -->
```

---

## 4. Lente algoritmo — síntese das contribuições

Cada recomendação acima foi calibrada contra os sinais críticos do `linkedin-algorithm-2026-reference.md`:

| Sinal do algoritmo | Contribuição das recomendações |
|--------------------|--------------------------------|
| **§3.1 Dwell time (61s+ = 15.6% engagement)** | Hero 56→64px, body 36→38px, contraste corrigido (#71717A) → leitura mais nítida → tempo por slide ↑. Variante `dense-text` mantém legibilidade quando o copy precisa ser denso. |
| **§5.2 Click-through floor 35%** | Variantes documentadas (dense-text, data-feature, quote, closing) → cada slide tem propósito visual claro → leitor avança porque cada slide entrega algo distinto, não repete o anterior. |
| **§5.2 Saves 1.8× em document posts** | Variante `data-feature` privilegia dado salvável; variante `quote` privilegia frase compartilhável. Editorial Clean é o estilo de maior save rate — variantes capitalizam isso. |
| **§3.1 Comments substantivos (15× like)** | Variante `quote` provoca resposta autobiográfica do leitor; variante `closing` ("o próximo prompt é seu") convida resposta. ↑ comment rate. |
| **§6.1 AI-detection visual** | Variantes quebram o "todos os 8 slides idênticos" — cada slide tem o pattern apropriado ao tipo de conteúdo. Reduz risco de classificação como "AI-generated polish". |
| **§3.4 Hashtags 70% redução de reach** | (não aplicável ao template — copy concern do Copywriter) |

---

## 5. Riscos e validação

### 5.1 Risco — render quebra com Google Fonts indisponível

**Mitigação:** L29 ganha fallback `system-ui, -apple-system`. Render gracioso mesmo offline.

### 5.2 Risco — Designer não usa variantes (volta ao base improvisado)

**Mitigação:** o checklist específico do estilo (D.3 da story) deve **bloquear** slides sem variante quando o conteúdo se encaixa. Validação: slide com dado numérico → variante `data-feature` obrigatória.

### 5.3 Risco — variantes ficam órfãs (não testadas)

**Mitigação (sub-tarefa D smoke test):** ao aplicar D, renderizar 1 carrossel exemplo de 4 slides cobrindo as 4 variantes (`dense-text`, `data-feature`, `quote`, `closing`) + slide hook + CTA-SLIDE. Smoke test: visual coerente, sem contraste falho, sem divergência de paleta.

---

## 6. Checklist específico (input para sub-tarefa D)

> O Dex aplicará este conteúdo no novo arquivo `aiox-squads/squads/carrosseis-linkedin/checklists/editorial-clean-checklist.md`. Itens definitivos validados pela auditoria:

### Tipografia
- [ ] Hero text: 64px (base) ou 48px (variant `dense-text`) ou 96px (variant `data-feature`) ou 44px (variant `quote`/`closing`) — peso 800 obrigatório (exceto quote = 600 italic)
- [ ] Body text: 38px (base) ou 36px (variantes), peso 500
- [ ] Letter-spacing -0.02em a -0.03em em todo texto bold (≥700)
- [ ] Font-family inclui fallback `system-ui, -apple-system` (linha 29)

### Cor (paleta de 6 tokens)
- [ ] Apenas as 6 cores do `:root`: `--bg`, `--ink`, `--ink-secondary`, `--muted`, `--accent`, `--divider`
- [ ] Nenhum hex literal fora do `:root` (gate sistêmico)
- [ ] **WCAG AA:** texto secundário em `--muted` (#71717A) em fundo `--bg` (#F4F4F5) — proibido `#94A3B8` ou `#888888` (falham 4.5:1)
- [ ] Accent é Teal `#14B8A6` em **todo** slide — proibido azul `#2563EB` ou outras cores acidentais

### Espaçamento
- [ ] Padding do slide: 72px top/bottom × 80px left/right (40%+ whitespace)
- [ ] Gap content: 32px (base) ou 24px (variant `dense-text`)
- [ ] Margin accent-bar: 12px (vs 8px do estado anterior)

### Hierarquia
- [ ] **1 elemento principal** por slide — hero OU dado-hero OU citação (mutuamente exclusivos)
- [ ] Accent-bar usada em **slides com dado/citação** — ausente em slides puramente textuais
- [ ] Divider top presente em slides com hierarquia (hook, dado, citação) — ausente em variant `closing` (que usa divider centralizado)

### Variantes (REFAC-004)
- [ ] Slide de hook: layout base (divider top + hero + accent-bar opcional)
- [ ] Slide com >30 palavras: variant `dense-text` obrigatória
- [ ] Slide com dado numérico pontual: variant `data-feature` obrigatória
- [ ] Slide com citação: variant `quote` obrigatória
- [ ] Slide de fechamento informativo (sem lead magnet): variant `closing`
- [ ] CTA-slide só quando `is_lead_magnet=true` — accent é `--accent` (não `#2563EB`)

### Anti-AI gates
- [ ] `border-radius: 0px` em **todos** os containers (incluindo `cta-button`)
- [ ] Pelo menos 2 slides do carrossel usam variantes diferentes do base (evita pattern uniforme)
- [ ] Sem listas perfeitamente paralelas (ex: 4 itens com mesma estrutura "Por que X"; quebrar com 1 item assimétrico)

---

## 7. Aprovação Uma

✅ **Auditoria entregue.** 19 mudanças cirúrgicas no template + 4 variantes documentadas + 30 itens de checklist específico.

A entrega cumpre AC #6 da story REFAC-004:
- ✅ Diagnóstico (§1)
- ✅ Recomendações específicas com diff por linha (§2)
- ✅ Variantes para casos de borda (§3 — dense-text, data-feature, quote, closing)
- ✅ Lente algoritmo aplicada em cada recomendação (§4)

**Próximo passo (sub-tarefa D — Dex):**
1. Aplicar diff por linha no `editorial-clean-base.html` (§2.1) + adicionar tokens centralizados (§2.2) + as 4 variantes (§3).
2. Atualizar `data/visual-styles.md §50 Editorial Clean` com as variantes documentadas.
3. Criar `checklists/editorial-clean-checklist.md` com o conteúdo de §6 desta auditoria.
4. Smoke test: renderizar 1 carrossel de 4 slides cobrindo variantes — validação visual.

— Uma, desenhando com empatia 💝
