# Story ASSETS-002 — CLIs de Gestão + Script de Migração

**🏷️ ID:** `ASSETS-002`
**📐 Estimativa:** 2h
**🔗 Depende de:** ASSETS-001
**🔗 Bloqueia:** Stories 003, 004, 005
**👤 Assignee:** Dev (Backend)
**🏷️ Labels:** `cli`, `migration`, `supabase`, `node`
**📊 Status:** `[x]` Done

---

## Descrição

> Como **gestor de conteúdo**, eu quero ferramentas CLI para listar, fazer upload e migrar fotos para o Supabase, para que eu possa gerenciar o banco de imagens via terminal de forma eficiente.

## Contexto Técnico

- Tabela `source_photos` e storage paths criados na ASSETS-001
- Scripts vão em `aiox-squads/shared/scripts/`
- Reutilizar padrão de `upload-to-supabase.js` existente (service role key, dotenv, idempotente)
- **Review #1:** `fetch-source-photo-cli.js` foi eliminado — download não é mais necessário como CLI separado
- As fotos locais estão em:
  - `aiox-squads/squads/capas-linkedin/assets/papers/` (6 JPGs, ~12 MB)
  - `aiox-squads/squads/capas-linkedin/assets/photos/` (11 JPGs, ~1.2 MB)
  - `aiox-squads/squads/capas-linkedin/assets/profile-photo.png` (1 PNG, ~600 KB)

---

## Sub-tarefas

- [x] **2.1** Criar `upload-source-photo-cli.js` — upload individual + metadados

```bash
# Uso:
node shared/scripts/upload-source-photo-cli.js \
  --category papers \
  --file assets/papers/paper-01-monitor-winning-sales-mao-segurando.jpg \
  --description "Mão segurando caderno + monitor WS" \
  --best-for "Vendas B2B, WS" \
  --orientation retrato
```

Requisitos:
- Upload para `content-assets/source-photos/{category}/{filename}`
- Insert na tabela `source_photos` com metadados
- Idempotente: se `(category, filename)` já existe → upsert
- Usar `SUPABASE_SERVICE_ROLE_KEY` (padrão dos CLIs existentes)
- Retornar `public_url` no stdout
- Validar que arquivo existe antes de upload

- [x] **2.2** Criar `list-source-photos-cli.js` — listagem formatada

```bash
# Uso:
node shared/scripts/list-source-photos-cli.js --category papers
node shared/scripts/list-source-photos-cli.js               # lista todas
node shared/scripts/list-source-photos-cli.js --json         # output JSON
```

Requisitos:
- Query na tabela `source_photos` filtrada por `category` e `active = true`
- Output: tabela formatada (filename, description, best_for, orientation, public_url)
- Flag `--json` para output JSON (consumo por scripts)
- Ordenar por `sort_order`, depois `filename`

- [x] **2.3** Criar `migrate-source-photos.js` — migração one-shot

```bash
# Uso:
node shared/scripts/migrate-source-photos.js
```

Requisitos:
- Lê `assets/papers/*.jpg` — extrai metadados do `README.md` existente na pasta
- Lê `assets/photos/*.jpg` — usa filename como description
- Lê `assets/profile-photo.png` — categoria `profile`
- Para cada foto: upload para Storage + insert na tabela
- Idempotente: pula fotos que já existem (por filename + category)
- Log detalhado com progresso: `[3/18] ✅ paper-01...jpg → uploaded`
- Resumo final: `✅ 18 fotos migradas (6 papers + 11 photos + 1 profile)`

---

## Acceptance Criteria

- [x] `upload-source-photo-cli.js` faz upload + insert com sucesso
- [x] `upload-source-photo-cli.js` é idempotente (re-run não duplica)
- [x] `list-source-photos-cli.js --category papers` lista 6 fotos após migração
- [x] `list-source-photos-cli.js --category photos` lista 11 fotos após migração
- [x] `list-source-photos-cli.js --json` retorna JSON válido
- [x] `migrate-source-photos.js` migra todas as 18 fotos (6 + 11 + 1)
- [x] `migrate-source-photos.js` é idempotente (re-run reporta "já existe")
- [x] Todas as `public_url` retornadas são acessíveis via browser

## Definition of Done

✅ 3 scripts CLI funcionais em `shared/scripts/`
✅ 18 fotos migradas e acessíveis no Supabase Storage
✅ Tabela `source_photos` populada com metadados corretos

## File List

- `[x]` `aiox-squads/shared/scripts/upload-source-photo-cli.js`
- `[x]` `aiox-squads/shared/scripts/list-source-photos-cli.js`
- `[x]` `aiox-squads/shared/scripts/migrate-source-photos.js`
