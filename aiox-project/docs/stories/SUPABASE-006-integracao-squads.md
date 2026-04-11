# Story SUPABASE-006 — Integração dos Squads com Supabase (Workflows)

**🏷️ ID:** `SUPABASE-006`
**📐 Estimativa:** 1.5h
**🔗 Depende de:** Story 001
**🔗 Bloqueia:** Story 007
**👤 Assignee:** Data Engineer
**🏷️ Labels:** `integration`, `workflow`, `squads`
**📊 Status:** `[x]` Done ✅

---

## Descrição

> Como **operador dos squads no Antigravity**, eu quero que quando um post for **aprovado** ele seja **salvo automaticamente no Supabase**, e quando uma capa ou carrossel for gerado o asset seja **uploaded automaticamente**, eliminando o `inbox.json`.

## Contexto Técnico

- **Squad Pesquisa:** workflow em `.agents/workflows/z-pesquisa-conteudo-linkedin.md` — hoje grava em `inbox.json`
- **Squad Capas:** workflow em `.agents/workflows/z-capas-linkedin.md` — grava PNG local + atualiza `inbox.json`
- **Squad Carrosseis:** workflow em `.agents/workflows/z-carrosseis-linkedin.md` — grava slides + PDF local + atualiza `inbox.json`
- **Script compartilhado:** `upload-to-supabase.js` (criado na Story 002)

---

## Sub-tarefas

- [x] **6.1** Criar `aiox-squads/shared/scripts/save-post-cli.js` [NOVO]

```bash
# Uso: node save-post-cli.js --title "Título" --file post-final.md
# Lê o markdown, extrai campos (hook, body, cta, etc.), e chama savePost()
```

O CLI deve:
- Aceitar `--title`, `--file`, `--pillar`, `--status`, `--urgency`, `--review-score`
- Parsear o markdown para extrair seções conhecidas do post-final
- Chamar `savePost()` do `upload-to-supabase.js`
- Imprimir: `✅ Post "{título}" salvo no Supabase (id: {uuid})`

- [x] **6.2** Criar `aiox-squads/shared/scripts/upload-cover-cli.js` [NOVO]

```bash
# Uso: node upload-cover-cli.js --slug "slug" --file cover.png --style "Estilo" --post-title "Título"
```

O CLI deve:
- Aceitar `--slug`, `--file` (caminho do PNG), `--style`, `--post-title`
- Buscar o post_id pelo título no Supabase
- Chamar `uploadCover()` do `upload-to-supabase.js`
- Imprimir: `✅ Capa "{slug}" uploaded → {public_url}`

- [x] **6.3** Criar `aiox-squads/shared/scripts/upload-carousel-cli.js` [NOVO]

```bash
# Uso: node upload-carousel-cli.js --slug "slug" --slides-dir output/slides/slug/ --style "estilo" --post-title "Título"
```

O CLI deve:
- Aceitar `--slug`, `--slides-dir` (diretório com slide-XX.png e PDF), `--style`, `--post-title`
- Detectar automaticamente os slides PNG e o PDF no diretório
- Buscar o post_id pelo título no Supabase
- Chamar `uploadCarousel()` do `upload-to-supabase.js`
- Imprimir: `✅ Carrossel "{slug}" uploaded → {N} slides + PDF`

- [x] **6.4** Atualizar workflow `z-pesquisa-conteudo-linkedin.md` — adicionar step final:

```markdown
## Step Final — Publicar no Banco de Dados
Após aprovação do post final:
1. Executar: `node aiox-squads/shared/scripts/save-post-cli.js --title "TITULO" --file output/post-final.md`
2. Verificar no Supabase Dashboard que o post aparece
3. O post agora estará disponível no Thiago Marketing OS automaticamente
```

- [x] **6.5** Atualizar workflow `z-capas-linkedin.md` — adicionar step final:

```markdown
## Step Final — Upload da Capa
Após aprovação da capa renderizada:
1. Executar: `node aiox-squads/shared/scripts/upload-cover-cli.js --slug "SLUG" --file output/covers/SLUG/cover.png --style "ESTILO" --post-title "TITULO"`
2. Verificar no CCC que a capa aparece no preview do post
```

- [x] **6.6** Atualizar workflow `z-carrosseis-linkedin.md` — adicionar step final:

```markdown
## Step Final — Upload do Carrossel
Após aprovação do carrossel renderizado:
1. Executar: `node aiox-squads/shared/scripts/upload-carousel-cli.js --slug "SLUG" --slides-dir output/slides/SLUG/ --style "ESTILO" --post-title "TITULO"`
2. Verificar no CCC que o carrossel aparece navegável no preview
```

- [x] **6.7** Testar workflow completo:
  1. Rodar `save-post-cli.js` com post existente → verificar no CCC
  2. Rodar `upload-cover-cli.js` com PNG existente → verificar no CCC
  3. Rodar `upload-carousel-cli.js` com slides existentes → verificar no CCC

---

## Acceptance Criteria

- [x] `save-post-cli.js` salva post no Supabase a partir de um markdown
- [x] `upload-cover-cli.js` faz upload de PNG e cria registro na tabela `covers`
- [x] `upload-carousel-cli.js` faz upload de slides + PDF e cria registros
- [x] Workflows `.md` dos 3 squads têm step final documentado
- [x] Fluxo end-to-end: squad gera → CLI salva → CCC exibe

## Definition of Done

✅ 3 CLIs funcionais e testados
✅ Workflows atualizados com documentação
✅ Testado end-to-end com dado real

## File List

- `[x]` `aiox-squads/shared/scripts/save-post-cli.js` — [NEW]
- `[x]` `aiox-squads/shared/scripts/upload-cover-cli.js` — [NEW]
- `[x]` `aiox-squads/shared/scripts/upload-carousel-cli.js` — [NEW]
- `[x]` `.agents/workflows/z-pesquisa-conteudo-linkedin.md` — [MODIFY] step final
- `[x]` `.agents/workflows/z-capas-linkedin.md` — [MODIFY] step final
- `[x]` `.agents/workflows/z-carrosseis-linkedin.md` — [MODIFY] step final
