# Editorial Clean — Checklist Específico do Estilo

> Checklist específico para validação de carrosséis no estilo **Editorial Clean**, complementar ao `review-checklist.md` (que cobre copy + consistência geral).
> Validado pela auditoria Uma (REFAC-004 sub-tarefa C). Doc completa: `aiox-project/docs/auditoria-editorial-clean.md`.
> Aplicação: Reviewer (Raul Revisão) usa este checklist no step-08 quando o estilo selecionado é Editorial Clean.

---

## 1. Tipografia

- [ ] **Hero text:** uma das variantes documentadas
  - 64px / 800 — base (slide de hook ou hierarquia padrão)
  - 48px / 800 — variant `dense-text` (slide com >30 palavras)
  - 96px / 800 — variant `data-feature` (data-hero, em Teal)
  - 44px / 600 italic — variant `quote` (quote-body)
  - 44px / 800 — variant `closing` (centralizado)
- [ ] **Body text:** 38px / 500 (base) ou 36px / 500 (variantes `dense-text`, `data-feature`/data-body)
- [ ] **Letter-spacing:** -0.02em a -0.03em em todo texto bold (peso ≥700) — exceto eyebrow uppercase (+0.12em)
- [ ] **Font-family** inclui fallback: `'Inter', system-ui, -apple-system, sans-serif`
- [ ] Tamanhos atendem mínimo §5.2 do algoritmo: body ≥36px, headline ≥36px

## 2. Cor (paleta de 6 tokens)

- [ ] `:root` declara exatamente os 6 tokens: `--bg`, `--ink`, `--ink-secondary`, `--muted`, `--accent`, `--divider`
- [ ] **Nenhum hex literal fora do `:root`** nos seletores (gate sistêmico — usar var(--token))
- [ ] **WCAG AA conforme:** texto secundário em `--muted` (#71717A) sobre `--bg` (#F4F4F5) = 4.6:1
- [ ] **Proibido:** `#94A3B8` (3.3:1, falha) e `#888888` (3.5:1, falha) — bloqueia render
- [ ] **Accent é Teal `#14B8A6` em TODO slide** — proibido `#2563EB` (azul) ou cores acidentais
- [ ] Hero e body em `--ink` / `--ink-secondary` (consistência — sem `#444444` ou `#333333` órfãos)

## 3. Espaçamento

- [ ] Padding do slide: **72px top/bottom × 80px left/right** (gera ~40% whitespace)
- [ ] Gap content: **32px** (base) ou **24px** (variant `dense-text`)
- [ ] Margin accent-bar: **12px 0** (vs 8px do estado anterior — respiração antes/depois)
- [ ] Border-top do footer: 1px sólido em `--divider` + padding-top 24px

## 4. Hierarquia visual

- [ ] **1 elemento principal por slide** — hero OU dado-hero OU citação (mutuamente exclusivos, nunca os 3 no mesmo slide)
- [ ] Accent-bar usada em **slides com dado/citação** — ausente em slides puramente textuais
- [ ] Divider top presente em slides com hierarquia (hook, dense-text) — **ausente** em variant `data-feature`, `quote` (que têm seus próprios protagonistas) e **centralizado** em variant `closing`
- [ ] Profile-photo 56px (não 48px do estado anterior)

## 5. Variantes (REFAC-004)

- [ ] Designer escolheu variante apropriada **antes** de copiar o bloco do template (não improvisou)
- [ ] Slide com **>30 palavras** → variant `dense-text` obrigatória (não comprimir base)
- [ ] Slide com **dado numérico pontual** → variant `data-feature` obrigatória (não usar accent-bar do base)
- [ ] Slide com **citação ou frase de autoridade** → variant `quote` obrigatória (com aspas decorativas)
- [ ] Slide de **fechamento informativo** (sem lead magnet) → variant `closing`
- [ ] Slide de **CTA com lead magnet** → bloco `<!-- CTA-SLIDE -->` com accent Teal (não azul)
- [ ] **Anti-AI gate:** pelo menos 2 slides do carrossel usam variantes diferentes do base (evita pattern uniforme — §6.1 do algoritmo classifica simetria excessiva como AI polish)

## 6. Anti-AI rules específicas

- [ ] `border-radius: 0px` em **todos** os containers (incluindo `cta-button` — corrigido vs estado anterior que tinha 8px)
- [ ] Sem listas perfeitamente paralelas (ex: 4 itens com mesma estrutura "Por que X"; quebrar com 1 item assimétrico)
- [ ] Sem gradientes no fundo, em texto, ou em accent-bar (paleta chapada)
- [ ] Sem ícones literais decorativos
- [ ] Sem boxes com sombra
- [ ] Sem mais de 2 elementos decorativos por slide

## 7. Algoritmo 2026 — gates de retenção

- [ ] **Dwell time (§3.1):** hero 64px e body 38px — testar legibilidade no preview mobile (slide deve ler em <2s sem zoom)
- [ ] **Click-through floor 35% (§5.2):** cada slide tem propósito visual distinto (não 8 slides idênticos) — leitor avança porque cada slide entrega algo novo
- [ ] **Save rate (§5.2 — 1.8× em documents):** se há dado salvável, está em variant `data-feature` (não enterrado em parágrafo)
- [ ] **Comments substantivos (§3.1 — 15× peso de like):** se há citação ou pergunta reflexiva, está em variant `quote` ou `closing`
- [ ] **AI-detection (§6.1):** carrossel não é "perfeitamente uniforme" — variantes quebram o pattern

---

## Veto Conditions (rejeição automática para Editorial Clean)

1. Hex literal fora do `:root` em qualquer seletor
2. Cor `#94A3B8` ou `#888888` presente em qualquer elemento (falha WCAG AA)
3. Accent não-Teal (ex: `#2563EB` órfão) em qualquer slide
4. `border-radius` ≠ 0 em containers/buttons
5. Hero abaixo de 44px ou body abaixo de 36px (viola §5.2)
6. Carrossel com 100% dos slides em layout `base` (sem variantes — risco AI-look §6.1)
7. Divergência entre o template renderizado e o documentado em `data/visual-styles.md §50`

---

## Formato de feedback Editorial Clean

### Quando aprovado
```
## ✅ Editorial Clean — Validado
- Paleta: 6 tokens, sem violations
- WCAG AA: passa (--muted 4.6:1)
- Tipografia: hero/body conforme spec
- Variantes usadas: [N de M slides]
- Anti-AI gates: passa
```

### Quando rejeitado
```
## ❌ Editorial Clean — Veto

### Violations
1. [linha:hex] — token [nome] está [#hex] (esperado [var(--token)])
2. [Slide N] — hero [Xpx] abaixo do mínimo 44px

### Como corrigir
1. [Edit cirúrgico exato]
2. [Edit cirúrgico exato]

> 🔄 Devolver ao Designer (step-06) para correção.
```
