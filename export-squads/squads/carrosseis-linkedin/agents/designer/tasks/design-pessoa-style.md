---
task: "Design Pessoa-Style"
order: 2
input: |
  - carousel_copy: Copy aprovado com texto por slide e notas de foto
  - photo_bank: Path do banco de fotos
output: |
  - selected_photo: Foto selecionada e justificativa
  - adaptation_decision: Se precisa adaptar por IA ou usar original
  - design_system: Documentação do design system
  - html_files: Array de HTML self-contained por slide
---

# Design Pessoa-Style

Cria slides usando fotos reais do Thiago. Segue pipeline inteligente de seleção e possível adaptação por IA.

## Process

1. Ler o copy aprovado — identificar o tom emocional e contexto de cada slide que precisa foto
2. Ler `pipeline/data/visual-styles.md` → seção "Estilo 2: Pessoa-Style"
3. **Analisar banco de fotos** em `assets/photos/`:
   - Listar todas as imagens disponíveis
   - Para cada foto: avaliar expressão, contexto, qualidade, vestimenta
   - Selecionar a mais adequada ao tema/emoção do conteúdo
4. **Decidir adaptação:**
   - Se a foto serve como está → usar original (path direto no HTML)
   - Se precisa alteração → definir exatamente o que mudar (fundo, iluminação, contexto)
5. **Se adaptar: validar antes de gerar:**
   - A alteração proposta mantém realismo?
   - A face/expressão permanecem intactas?
   - O resultado vai parecer natural ou artificial?
   - Se a validação FALHAR → usar original (fallback seguro)
6. **Gerar/usar imagem:** Se aprovada, gerar com IA (tool: generate_image). Se não, usar original
7. **Definir design system:** cores derivadas da foto + cor accent complementar
8. **Criar HTML slides:** foto integrada com overlay de texto (gradient 60%+)

## Output Format

```yaml
photo_selection:
  selected: "photo-name.jpg"
  rationale: "Porque a expressão X combina com o tom Y do conteúdo"
  adaptation_needed: true | false
  adaptation_description: "..." # se adaptation_needed = true
  adaptation_validated: true | false # se adaptation_needed = true
  final_image: "path/to/final/image"

design_system:
  viewport: "1080x1350"
  colors:
    primary: "#..." # derivada da foto
    accent: "#..."
    text: "#FFFFFF"
    overlay: "linear-gradient(...)"
  typography:
    family: "Inter ou Montserrat"
    hero: "52px / 700"
    body: "34px / 500"

slides:
  - file: "slide-01.html"
    uses_photo: true
    photo_position: "background | left | right"
  - file: "slide-02.html"
    uses_photo: false
```

## Output Example

> Use as quality reference, not as rigid template.

```yaml
photo_selection:
  selected: "thiago-computador-01.jpg"
  rationale: "Expressão focada combina com tom 'Bastidor Técnico'. Contexto de trabalho (computador) alinha com tema de automação."
  adaptation_needed: false
  final_image: "assets/photos/thiago-computador-01.jpg"

design_system:
  viewport: "1080x1350"
  colors:
    primary: "#1A1A3E"
    accent: "#4DA6FF"
    text: "#FFFFFF"
    overlay: "linear-gradient(180deg, rgba(26,26,62,0.2) 0%, rgba(26,26,62,0.85) 60%)"
  typography:
    family: "Inter"
    hero: "52px / 700"
    body: "34px / 500"

slides:
  - file: "slide-01.html"
    uses_photo: true
    photo_position: "background"
    text_overlay: "15h/semana desperdiçadas. Aqui está o que a gente fez."
  - file: "slide-02.html"
    uses_photo: false
    background: "#1A1A3E"
```

## Quality Criteria

- [ ] Foto selecionada com justificativa clara
- [ ] Se adaptação IA: face/expressão NÃO foram alteradas
- [ ] Se adaptação IA: resultado validado como realista
- [ ] Contraste de texto protegido (overlay 60%+ ou gradient)
- [ ] Cores derivadas harmonicamente da foto
- [ ] HTML self-contained com viewport 1080x1350
- [ ] Design system documentado

## Veto Conditions

Reject and redo if ANY are true:
1. Adaptação IA alterou face ou expressão do Thiago
2. Texto ilegível sobre a foto (contraste < 4.5:1)
