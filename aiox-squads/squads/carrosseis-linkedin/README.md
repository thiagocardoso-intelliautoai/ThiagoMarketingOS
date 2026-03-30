# 🎯 Squad: Carrosséis LinkedIn

> Pipeline completo de criação de carrosséis visuais para o perfil LinkedIn
> do Thiago C.Lima / Winning Sales.
> 2 estilos: Twitter-style (fundo preto) e Pessoa-style (fotos reais).

---

## 🎯 Objetivo

Criar carrosséis LinkedIn de alto impacto visual que posicionam o Thiago
como referência em IA aplicada a vendas B2B. Cada carrossel combina copy
otimizado com design profissional renderizado em HTML/CSS via Playwright.

---

## 👥 Agentes

| Agente | Arquivo | Papel |
|--------|---------|-------|
| **Caio Carrossel** 🎯 | `agents/copywriter.md` | Copywriter — ângulos, copy de slides, caption |
| **Denis Design** 🎨 | `agents/designer.md` | Designer — HTML/CSS, renderização, assets visuais |
| **Raul Revisão** ✅ | `agents/reviewer.md` | Reviewer — quality gate, aprovação/rejeição |

---

## 🔄 Workflow (9 steps)

```
FASE 1: INPUT
  01 → ⏸️ CHECKPOINT — Tema e Estilo Visual .... [humano]

FASE 2: ÂNGULOS
  02 → Geração de 5 Ângulos ................. [copywriter]
  03 → ⏸️ CHECKPOINT — Seleção do Ângulo ....... [humano]

FASE 3: COPY
  04 → Criação do Copy (caption + slides) ... [copywriter]
  05 → ⏸️ CHECKPOINT — Aprovação do Copy ....... [humano]

FASE 4: DESIGN
  06 → Criação dos Slides (HTML/CSS) ........ [designer]
  07 → ⏸️ CHECKPOINT — Aprovação Visual ........ [humano]

FASE 5: REVISÃO
  08 → Revisão de Qualidade ................. [reviewer]
  09 → ⏸️ CHECKPOINT FINAL — Aprovação ......... [humano]
```

**5 checkpoints humanos** garantem controle total sobre o resultado.

---

## 🎨 Estilos Visuais

### Estilo 1: Twitter-Style
- Fundo preto (#000000), texto branco (#FFFFFF)
- Foto de perfil circular + nome + @ no topo
- Slide 1: print de autoridade como hook visual
- Slides seguintes: foco em texto/ensinamento
- Viewport: 1080 x 1350

### Estilo 2: Pessoa-Style
- Fotos reais do Thiago integradas ao design
- Overlay de texto com proteção de contraste (60%+)
- Cores derivadas da foto
- Possibilidade de adaptação por IA (com regras rígidas)
- Viewport: 1080 x 1350

→ Detalhes completos em `data/visual-styles.md`

---

## 📁 Estrutura de Arquivos

```
carrosseis-linkedin/
├── squad.yaml              # Configuração da squad
├── README.md               # Este arquivo
├── agents/
│   ├── copywriter.md       # Caio Carrossel
│   ├── designer.md         # Denis Design
│   └── reviewer.md         # Raul Revisão
├── workflows/
│   └── workflow.yaml       # Pipeline de 9 steps
├── tasks/
│   ├── generate-angles.md  # Geração de 5 ângulos
│   ├── create-copy.md      # Criação do copy
│   ├── create-slides.md    # Criação visual dos slides
│   └── review.md           # Revisão de qualidade
├── data/
│   ├── linkedin-strategy.md     # Estratégia, ICP, pilares ACRE
│   ├── tone-of-voice.md         # Tom de voz e vocabulário
│   ├── visual-styles.md         # Estilos visuais (Twitter + Pessoa)
│   ├── domain-framework.md      # Frameworks de domínio
│   ├── quality-criteria.md      # Critérios de qualidade
│   ├── output-examples.md       # Exemplos de output
│   ├── anti-patterns.md         # Anti-patterns a evitar
│   └── research-brief.md        # Template de brief de pesquisa
├── checklists/
│   └── review-checklist.md      # Checklist de revisão visual
├── templates/
│   ├── twitter-style-base.html  # Template HTML Twitter-style
│   └── pessoa-style-base.html   # Template HTML Pessoa-style
├── assets/
│   ├── profile-photo.png        # Foto de perfil do Thiago
│   └── photos/                  # Banco de fotos pessoais
└── output/
    ├── angles.md                # Ângulos gerados
    ├── carousel-copy.md         # Copy aprovado
    ├── slides-report.md         # Report dos slides
    └── review.md                # Feedback do reviewer
```

---

## 🚀 Como Usar

1. Acionar o squad via `/z-carrosseis-linkedin`
2. Informar o **tema** e escolher o **estilo visual** (1 = Twitter, 2 = Pessoa)
3. Seguir o workflow sequencialmente, pausando em cada **⏸️ CHECKPOINT**
4. Aprovar/ajustar em cada checkpoint antes de prosseguir
5. Slides finais renderizados como HTML + PNG em `output/`

---

## 📏 Regras Inegociáveis

- **Viewport exato**: 1080 x 1350 — otimizado para feed LinkedIn
- **Uma ideia por slide**: Max 20-30 palavras por slide
- **Hook ≤ 210 chars**: Cabe no preview do LinkedIn
- **HTML self-contained**: Sem dependências externas (exceto Google Fonts)
- **Tom anti-guru**: Sem game changer, sinergia, hack, disruptivo
- **Contraste mín. 4.5:1**: Legibilidade obrigatória
- **5 checkpoints humanos**: Nada é publicado sem OK do Thiago
