---
task: "Render Slides"
order: 3
input: |
  - html_files: Array de HTML files gerados
  - design_system: Design system documentado
output: |
  - screenshots: Array de screenshots PNG renderizados
  - verification: Status de verificação visual de cada slide
---

# Render Slides

Renderiza todos os slides HTML via Playwright e verifica qualidade visual de cada um.

## Process

1. **Gerar slug** do título/hook do carrossel (passado pelo step anterior via `carousel-copy.md`):
   - Extrair título da primeira linha `# Carousel Copy — {título}`
   - Converter: lowercase, sem acentos, espaços→hífens, remover especiais, max 60 chars
   - Ex: `"A Falácia do Sem Esforço"` → `a-falacia-do-sem-esforco`
2. Salvar todos os HTML files no diretório `squads/carrosseis-linkedin/output/slides/{slug}/`
3. **Auto-render PNG** — para cada HTML salvo, usar o browser tool:
   a. Navegar para `http://localhost:7788/output/slides/{slug}/slide-NN.html` (HTTP server já rodando)
   b. Resize viewport para 1080x1350
   c. Screenshot full page → salvar como `output/slides/{slug}/slide-NN.png`
4. Renderizar slide 1 primeiro e verificar: texto legível, cores corretas, nenhum conteúdo cortado, layout balanceado
5. Se slide 1 OK: batch render slides 2-N com mesmo processo
6. Se slide 1 FALHAR: corrigir HTML e re-renderizar antes de prosseguir
7. Compilar todos os screenshots como entregáveis finais

> **IMPORTANTE**: O número de slides é dinâmico — não hardcode 6 slides. Detecte quantos HTMLs foram gerados e renderize todos.

## Output Format

```yaml
slug: "{slug-do-carrossel}"
renders:
  - slide: 1
    html: "output/slides/{slug}/slide-01.html"
    screenshot: "output/slides/{slug}/slide-01.png"
    status: "pass | fail"
    notes: "..."
  - slide: 2
    html: "output/slides/{slug}/slide-02.html"
    screenshot: "output/slides/{slug}/slide-02.png"
    status: "pass | fail"
    notes: "..."

total_rendered: N
total_passed: N
verification_complete: true
```

## Output Example

> Use as quality reference, not as rigid template.

```yaml
slug: "a-falacia-do-sem-esforco"
renders:
  - slide: 1
    html: "output/slides/a-falacia-do-sem-esforco/slide-01.html"
    screenshot: "output/slides/a-falacia-do-sem-esforco/slide-01.png"
    status: "pass"
    notes: "Hero text 58px legível, perfil circular renderizado corretamente, contraste 21:1 (branco/#000)"
  - slide: 2
    html: "output/slides/a-falacia-do-sem-esforco/slide-02.html"
    screenshot: "output/slides/a-falacia-do-sem-esforco/slide-02.png"
    status: "pass"
    notes: "Body text 38px claro, layout balanceado, espaçamento consistente"
  - slide: 3
    html: "output/slides/a-falacia-do-sem-esforco/slide-03.html"
    screenshot: "output/slides/a-falacia-do-sem-esforco/slide-03.png"
    status: "pass"
    notes: "Lista numerada alinhada, accent color destaca pontos chave"

total_rendered: 5
total_passed: 5
verification_complete: true
```

## Quality Criteria

- [ ] Slide 1 renderizado e verificado ANTES do batch
- [ ] Todos os screenshots em resolução 1080x1350
- [ ] Texto legível em todos os slides (sem corte, sem overflow)
- [ ] Cores renderizadas conforme design system
- [ ] Nenhum conteúdo cortado nas bordas

## Veto Conditions

Reject and redo if ANY are true:
1. Algum slide tem texto cortado ou ilegível no screenshot
2. Viewport do screenshot diferente de 1080x1350
