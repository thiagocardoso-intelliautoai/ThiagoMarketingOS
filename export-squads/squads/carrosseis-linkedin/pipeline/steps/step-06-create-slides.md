---
execution: inline
agent: designer
format: linkedin-post
inputFile: squads/carrosseis-linkedin/output/carousel-copy.md
outputFile: squads/carrosseis-linkedin/output/slides-report.md
---

# Step 06: Criar Slides Visuais

## Context Loading

Load these files before executing:
- `squads/carrosseis-linkedin/output/carousel-copy.md` — Copy aprovado com texto e notas visuais
- `squads/carrosseis-linkedin/pipeline/data/theme-input.md` — Estilo visual selecionado (1=Twitter, 2=Pessoa)
- `squads/carrosseis-linkedin/pipeline/data/visual-styles.md` — Especificações dos 2 estilos
- `squads/carrosseis-linkedin/pipeline/data/output-examples.md` — Exemplos visuais de referência
- `squads/carrosseis-linkedin/pipeline/data/anti-patterns.md` — Erros visuais a evitar
- `squads/carrosseis-linkedin/agents/designer.agent.md` — Persona do Denis Design
- `squads/carrosseis-linkedin/agents/designer/tasks/design-twitter-style.md` — Se estilo 1
- `squads/carrosseis-linkedin/agents/designer/tasks/design-pessoa-style.md` — Se estilo 2
- `squads/carrosseis-linkedin/agents/designer/tasks/render-slides.md` — Instruções de render
- `squads/carrosseis-linkedin/assets/profile-photo.png` — Foto de perfil (Twitter-style)
- `squads/carrosseis-linkedin/assets/photos/` — Banco de fotos (Pessoa-style)

## Instructions

### Process
1. Ler o estilo visual selecionado no theme-input.md
2. **Gerar slug do carrossel:**
   - Extrair o título/hook do carrossel de `carousel-copy.md` (primeira linha `# Carousel Copy — {título}`)
   - Converter para kebab-case sem acentos: `"A Falácia do Sem Esforço"` → `a-falacia-do-sem-esforco`
   - Regras do slug: lowercase, sem acentos, espaços→hífens, remover caracteres especiais, max 60 chars
3. Se **Twitter-Style (1):**
   - Executar task `design-twitter-style.md`
   - Definir design system (preto, branco, accent)
   - Criar HTML self-contained para cada slide com foto de perfil + @ + texto
   - Slide 1: incluir area de print de autoridade
4. Se **Pessoa-Style (2):**
   - Executar task `design-pessoa-style.md`
   - Analisar banco de fotos, selecionar a mais adequada
   - Decidir se adapta por IA ou usa original
   - Se adaptar: validar, gerar. Se não: usar original
   - Definir design system (cores da foto + accent)
   - Criar HTML com foto integrada + overlay de texto
5. Executar task `render-slides.md`:
   - Salvar HTMLs em `output/slides/{slug}/slide-NN.html`
   - **Auto-render PNG**: após salvar cada HTML, usar o browser tool para navegar ao HTML via HTTP server local, resize viewport para 1080x1350, e tirar screenshot salvando como `output/slides/{slug}/slide-NN.png`
   - Render slide 1 primeiro, verificar, depois batch o resto
6. Compilar relatório com design system + lista de slides + screenshots

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

## Veto Conditions

Reject and redo if ANY of these are true:
1. Algum slide tem texto ilegível no screenshot renderizado
2. HTML tem dependências externas (CDN, JS externo)
3. Qualquer slide contém hashtags (#) no texto visual — hashtags são exclusivas da legenda do post, NUNCA devem aparecer renderizadas dentro das imagens/slides

## Quality Criteria

- [ ] Design system documentado antes dos slides
- [ ] Todos os HTMLs self-contained com viewport 1080x1350
- [ ] Slide 1 verificado antes do batch
- [ ] Contraste WCAG AA 4.5:1 em todos os slides
- [ ] Font sizes atendem mínimos da plataforma
