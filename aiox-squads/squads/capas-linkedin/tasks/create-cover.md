# Task: Criar Capa Visual

## Metadata
- **Step:** step-03-create-cover
- **Agent:** designer (Dani Design)
- **Input:** `output/cover-input.md`
- **Output:** `output/cover-report.md`

---

## Context Loading

Carregar antes de executar:
- `output/cover-input.md` — Post de texto + estilo visual selecionado
- `data/visual-styles.md` — Especificações dos 5 estilos
- `agents/designer.md` — Persona da Dani Design
- Foto de perfil: Supabase `content-assets/source-photos/profile-photo.png` _(fallback: `assets/profile-photo.png`)_
- Banco de fotos: Supabase `source_photos` table via `node shared/scripts/list-source-photos-cli.js`

> 📌 **Source of truth: Supabase.** Fallback: `assets/` local (fase de transição).

---

## Instructions

### Process
1. Ler o estilo visual selecionado no cover-input.md
2. Ler o post de texto para extrair:
   - Dados/frameworks/fluxos para infográfico (para Rascunho no Papel)
   - Dado numérico (para Micro-Infográfico)
   - Contexto (para Pessoa+Texto)
   - Print/referência (para Print de Autoridade)
3. **Gerar slug da capa:**
   - Extrair título/hook do post
   - Converter para kebab-case sem acentos, max 60 chars
4. **Definir design system** — cores, fontes, espaçamento documentados
5. **Criar HTML self-contained** usando o template do estilo selecionado como base
6. **Render:**
   - Salvar HTML em `output/covers/{slug}/cover.html`
   - **RENDER VIA SCRIPT HEADLESS (OBRIGATÓRIO):**
     ```
     node scripts/render-cover.js {slug}
     ```
     ⚠️ **NUNCA usar browser tool para screenshot de capas!**
     O browser tool do Antigravity adiciona highlight azul de foco nos elementos.
     O script Puppeteer headless gera PNG limpo, pixel-perfect, sem artefatos.
   - Verificar render antes de entregar (view_file no PNG)
7. Compilar relatório com design system + screenshot

### Por Estilo

**Se Rascunho no Papel (1):**
- Verificar se Supabase `source_photos` (category=papers) tem fotos disponíveis — se vazio, recomendar outro estilo
- Listar fotos: `node shared/scripts/list-source-photos-cli.js --category papers`
- Extrair 3-5 blocos de informação-chave do post
- Selecionar foto de papel adequada ao contexto
- Seguir pipeline em `templates/rascunho-papel.md`
- **GERAR VIA SCRIPT NANO BANANA PRO (OBRIGATÓRIO):**
  ```
  node scripts/generate-cover-pro.js --slug {slug} --image-url "{URL_SUPABASE}" --prompt "{prompt}"
  ```
  > 📝 **Fallback local:** substituir `--image-url` por `--image assets/papers/{foto}.jpg`
- ⚠️ **NUNCA usar `generate_image` do Antigravity** — usa Gemini 3.1 Flash (inferior)
- O script usa `gemini-3-pro-image-preview` (Nano Banana Pro) — melhor modelo de imagem
- **NÃO usa HTML/CSS** — gera imagem diretamente via API

**Se Pessoa + Texto (2):**
- Listar fotos: `node shared/scripts/list-source-photos-cli.js --category photos`
- Selecionar foto mais adequada ao tema/emoção
- Usar URL Supabase direta no HTML: `src="{URL_SUPABASE}"` _(fallback: `assets/photos/`)_
- Decidir se usa original ou adapta por IA
- Overlay gradient 60%+, 3-7 palavras de impacto

**Se Micro-Infográfico (3):**
- Extrair O DADO mais impactante do post
- Encontrar/confirmar a fonte do dado
- Número hero grande + legenda + fonte citada

**Se Print de Autoridade (4):**
- Obter screenshot da referência mencionada no post
- Header com perfil do Thiago + opinião/chamada
- Print centralizado com borda e shadow

**Se Quote Card (5):**
- Extrair frase mais quotável do post
- Definir se é frase do Thiago ou de referência
- Design editorial com aspas decorativas + atribuição

---

## Output Format

```
# Cover Report

## Slug
{slug-da-capa}

## Design System
[Documentação: cores, fontes, espaçamento]

## Estilo Aplicado
[Nome do estilo selecionado]

## Capa Gerada
- HTML: output/covers/{slug}/cover.html
- Screenshot: output/covers/{slug}/cover.png
- Status: pass/fail
- Design Rationale: [justificativa das escolhas visuais]

## Photo Selection (Pessoa+Texto only)
- Selected: [foto]
- Adaptation: [sim/não]
- Rationale: [justificativa]
```

---

## Veto Conditions

Rejeitar e refazer se:
1. Texto ilegível no screenshot renderizado
2. HTML tem dependências externas (CDN, JS externo)
3. Mais de 20 palavras na capa
4. Contraste abaixo de 4.5:1

---

## Quality Criteria

- [ ] Design system documentado antes da criação
- [ ] HTML self-contained com viewport 1080x1350
- [ ] Render verificado antes da entrega
- [ ] Contraste WCAG AA 4.5:1
- [ ] Font sizes atendem mínimos
- [ ] Max 20 palavras na capa
