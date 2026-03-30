# Task: Criar Slides Visuais

## Metadata
- **Step:** step-06-create-slides
- **Agent:** designer (Denis Design)
- **Input:** `output/carousel-copy.md`
- **Output:** `output/slides-report.md`

---

## Context Loading

Carregar antes de executar:
- `output/carousel-copy.md` — Copy aprovado com texto e notas visuais
- `data/theme-input.md` — Estilo visual selecionado (1=Twitter, 2=Pessoa)
- `data/visual-styles.md` — Especificações dos 2 estilos
- `data/output-examples.md` — Exemplos visuais de referência
- `data/anti-patterns.md` — Erros visuais a evitar
- `agents/designer.md` — Persona do Denis Design
- Foto de perfil: Supabase `content-assets/source-photos/profile-photo.png` _(fallback: `assets/profile-photo.png`)_
- Banco de fotos: Supabase `source_photos` table via `node shared/scripts/list-source-photos-cli.js --category photos` _(fallback: `assets/photos/`)_

> 📌 **Source of truth: Supabase.** Fallback: `assets/` local (fase de transição).

---

## Instructions

### Process
1. Ler o estilo visual selecionado no theme-input.md
2. **Gerar slug do carrossel:**
   - Extrair o título/hook do carrossel de `carousel-copy.md`
   - Converter para kebab-case sem acentos: `"A Falácia do Sem Esforço"` → `a-falacia-do-sem-esforco`
   - Regras: lowercase, sem acentos, espaços→hífens, remover caracteres especiais, max 60 chars
3. Se **Twitter-Style (1):**
   - Definir design system (preto, branco, accent)
   - Criar HTML self-contained para cada slide com foto de perfil + @ + texto
   - Slide 1: incluir área de print de autoridade
4. Se **Pessoa-Style (2):**
   - Listar fotos: `node shared/scripts/list-source-photos-cli.js --category photos`
   - Selecionar foto mais adequada, usar URL Supabase _(fallback: `assets/photos/`)_
   - Decidir se adapta por IA ou usa original
   - Definir design system (cores da foto + accent)
   - Criar HTML com foto integrada + overlay de texto
5. **Render:**
   - Salvar HTMLs em `output/slides/{slug}/slide-NN.html`
   - Auto-render PNG: browser tool → navegação ao HTML, viewport 1080x1350, screenshot como `output/slides/{slug}/slide-NN.png`
   - Render slide 1 primeiro, verificar, depois batch o resto
6. Compilar relatório com design system + lista de slides + screenshots

---

## Output Format

```
# Slides Report

## Slug
{slug-do-carrossel}

## Design System
[Documentação completa: cores, fontes, espaçamento, grid]

## Estilo Aplicado
[Twitter-Style ou Pessoa-Style]

## Slides Gerados

### Slide 1 — [tipo]
- HTML: output/slides/{slug}/slide-01.html
- Screenshot: output/slides/{slug}/slide-01.png
- Status: pass/fail
- Notes: [observações visuais]

### Slide N — [tipo]
...

## Photo Selection (Pessoa-Style only)
- Selected: [foto]
- Adaptation: [sim/não]
- Rationale: [justificativa]
```

---

## Output Example

```
# Slides Report

## Slug
a-falacia-do-sem-esforco

## Design System
- Viewport: 1080x1350
- Background: #000000
- Text: #FFFFFF
- Accent: #4DA6FF
- Font: Inter 58px/700 (hero), 38px/500 (body), 24px/500 (caption)
- Profile: Thiago C.Lima / @othiago-clima / circular 80px (slide1) 48px (rest)

## Estilo Aplicado
Twitter-Style

## Slides Gerados

### Slide 1 — Hook
- HTML: output/slides/a-falacia-do-sem-esforco/slide-01.html
- Screenshot: output/slides/a-falacia-do-sem-esforco/slide-01.png
- Status: pass
- Notes: Hero 58px legível, perfil renderizado, contraste 21:1

### Slide 2 — Contexto
- HTML: output/slides/a-falacia-do-sem-esforco/slide-02.html
- Screenshot: output/slides/a-falacia-do-sem-esforco/slide-02.png
- Status: pass
- Notes: Body 38px claro, layout grid consistente

### Slide 5 — CTA
- HTML: output/slides/a-falacia-do-sem-esforco/slide-05.html
- Screenshot: output/slides/a-falacia-do-sem-esforco/slide-05.png
- Status: pass
- Notes: Accent color destaca CTA, texto legível
```

---

## Veto Conditions

Rejeitar e refazer se:
1. Algum slide tem texto ilegível no screenshot renderizado
2. HTML tem dependências externas (CDN, JS externo)
3. Qualquer slide contém hashtags (#) no texto visual — hashtags são exclusivas da legenda do post

---

## Quality Criteria

- [ ] Design system documentado antes dos slides
- [ ] Todos os HTMLs self-contained com viewport 1080x1350
- [ ] Slide 1 verificado antes do batch
- [ ] Contraste WCAG AA 4.5:1 em todos os slides
- [ ] Font sizes atendem mínimos da plataforma
