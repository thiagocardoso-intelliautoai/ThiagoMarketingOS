# Story SUPABASE-002 — Script de Upload Compartilhado + Migração de Dados

**🏷️ ID:** `SUPABASE-002`
**📐 Estimativa:** 1.5h
**🔗 Depende de:** Story 001
**🔗 Bloqueia:** Story 003
**👤 Assignee:** Data Engineer
**🏷️ Labels:** `migration`, `scripts`, `data`
**📊 Status:** `[x]` Done

---

## Descrição

> Como **operador do CCC**, eu quero que todos os **posts, capas e carrosseis existentes** sejam migrados para o Supabase, e que exista um **script reutilizável** para uploads futuros.

## Contexto Técnico

- **Posts existentes:** 13 posts em `content-command-center/data/inbox.json` + 5 no `seed.json` (com sobreposição — ~17 únicos)
- **Capas existentes (7):** PNGs em `aiox-squads/squads/capas-linkedin/output/covers/{slug}/cover.png`
  - Slugs: `3-perguntas-antes-de-comprar-ia`, `70-sobrecarregados-ia-43-nao-batem-meta`, `acumular-nao-e-aprender`, `ia-elimina-tarefa-nao-profissao`, `ia-sistema-nervoso-numeros-reais`, `pipeline-b2b-2026-3-camadas`, `software-como-gerador-de-leads`
  - (Ignorar `teste-nano-banana` — é teste)
- **Carrosseis existentes (2):** PDFs + PNGs em `aiox-squads/squads/carrosseis-linkedin/output/slides/{slug}/`
  - `mais-ia-nao-e-mais-produtividade` — 8 slides + PDF
  - `pense-como-usuario-6-palavras` — 7 slides + PDF
- **Tamanho total estimado:** ~10 MB de assets
- **Root do projeto:** `d:\01AAntiGravity\Criação de conteúdo\`

---

## Sub-tarefas

- [x] **2.1** Instalar dependências no diretório `aiox-squads/`

```bash
cd d:\01AAntiGravity\Criação de conteúdo\aiox-squads
npm install @supabase/supabase-js dotenv
```

- [x] **2.2** Criar diretório `aiox-squads/shared/scripts/` se não existir

- [x] **2.3** Criar `aiox-squads/shared/scripts/upload-to-supabase.js` — módulo com 3 funções exportadas:

**Funções requeridas:**

| Função | Parâmetros | O que faz |
|--------|-----------|-----------|
| `savePost(postData)` | Objeto com campos do post | Upsert na tabela `posts` por slug |
| `uploadCover(slug, pngPath, style, postId)` | Slug, caminho PNG, estilo, ID do post | Upload PNG → bucket + insert tabela `covers` |
| `uploadCarousel(slug, slidePngs[], pdfPath, style, postId)` | Slug, array de paths PNG, path PDF, estilo, ID | Upload PDF + slides → bucket + insert tabelas `carousels` e `carousel_slides` |

**IMPORTANTE para o dev:**
- Usar `SUPABASE_SERVICE_ROLE_KEY` (não anon key) para uploads server-side — bypassa RLS
- Ler credenciais do `.env` via `dotenv` — path: `d:\01AAntiGravity\Criação de conteúdo\aiox-squads\squads\capas-linkedin\.env`
- Gerar slug a partir do título: `normalizar NFD → remover acentos → lowercase → replace [^a-z0-9] por "-" → trim hifens`
- Usar `upsert` com `onConflict` para idempotência (rodar múltiplas vezes sem duplicar)
- `contentType: 'image/png'` para PNGs e `contentType: 'application/pdf'` para PDFs

- [x] **2.4** Criar `aiox-squads/shared/scripts/migrate-existing.js` — script one-shot que:

1. Lê `content-command-center/data/inbox.json` e `seed.json`
2. Deduplicata posts por título (case-insensitive)
3. Para cada post: chama `savePost()`
4. Para cada post com `derivations.cover`: localiza o `cover.png` em disco e chama `uploadCover()`
5. Para cada post com `contentType === 'carousel'`: localiza slides + PDF em disco e chama `uploadCarousel()`
6. Faz log de progresso: `[1/17] ✅ Post "..." salvo` / `[2/17] ✅ + Capa uploaded`
7. No final: exibe resumo `✅ Migração concluída: X posts, Y capas, Z carrosseis`

**Mapeamento de paths para o script de migração:**
- Os paths de cover nos JSONs são **relativos ao root** do projeto: `aiox-squads/squads/capas-linkedin/output/covers/{slug}/cover.png`
- O root é: `d:\01AAntiGravity\Criação de conteúdo\`
- Para slides: `aiox-squads/squads/carrosseis-linkedin/output/slides/{slug}/slide-{NN}.png`
- Para PDFs: `aiox-squads/squads/carrosseis-linkedin/output/slides/{slug}/carrossel-{slug}.pdf`

- [x] **2.5** Executar `migrate-existing.js` e verificar no Supabase Dashboard:
  - Tabela `posts` → ~17 registros
  - Tabela `covers` → 7 registros
  - Tabela `carousels` → 2 registros
  - Tabela `carousel_slides` → 15 registros (8 + 7)
  - Bucket `content-assets` → PNGs e PDFs estão lá

- [x] **2.6** Testar que as URLs públicas dos assets funcionam — copiar URL do Supabase Storage e abrir no browser

---

## Acceptance Criteria

- [x] `upload-to-supabase.js` tem funções `savePost()`, `uploadCover()`, `uploadCarousel()` funcionais
- [x] `migrate-existing.js` roda sem erros e migra todos os dados
- [x] Todos os 17 posts existem na tabela `posts` com dados completos
- [x] Todas as 7 capas PNG estão no bucket e na tabela `covers` com `image_url` funcional
- [x] Os 2 carrosseis estão no bucket com PDF + slides individuais
- [x] URLs públicas abrem no browser (imagens aparecem, PDFs baixam)

## Definition of Done

✅ Script de migração rodou sem erros
✅ Dados validados no Supabase Dashboard
✅ URLs públicas acessíveis via browser

## File List

- `[x]` `aiox-squads/shared/scripts/upload-to-supabase.js` — [NEW]
- `[x]` `aiox-squads/shared/scripts/migrate-existing.js` — [NEW]
- `[x]` `aiox-squads/shared/scripts/validate-migration.js` — [NEW] (bônus)
- `[x]` `aiox-squads/package.json` — criado + deps instaladas
