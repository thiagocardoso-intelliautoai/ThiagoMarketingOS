# Story SUPABASE-001 — Setup do Banco de Dados Supabase

**🏷️ ID:** `SUPABASE-001`
**📐 Estimativa:** 1h
**🔗 Bloqueia:** Stories 002, 003, 006
**👤 Assignee:** Data Engineer
**🏷️ Labels:** `database`, `infra`, `setup`
**📊 Status:** `[x]` Done ✅

---

## Descrição

> Como **desenvolvedor do CCC**, eu quero que as **tabelas, bucket e políticas de segurança** estejam criadas no Supabase, para que o sistema tenha onde armazenar posts, capas e carrosseis.

## Contexto Técnico

- **Projeto Supabase já criado** — credenciais em `aiox-squads/squads/capas-linkedin/.env`
- **URL do dashboard:** `https://supabase.com/dashboard/project/mvryaxohnbftupocdlqa`
- **A URL correta da API** para o SDK é: `https://mvryaxohnbftupocdlqa.supabase.co`
- **Anon Key e Service Role Key** já estão no `.env`

---

## Sub-tarefas

- [x] **1.1** Corrigir variável `SUPABASE_URL` no `.env` — atualmente é a URL do dashboard, precisa ser `https://mvryaxohnbftupocdlqa.supabase.co`

- [x] **1.2** Copiar credenciais Supabase para o `.env` central do `aiox-project/.env` (manter DRY)

- [x] **1.3** Executar DDL no Supabase SQL Editor — criar tabela `posts`

```sql
CREATE TABLE posts (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  content_type  TEXT NOT NULL DEFAULT 'text',
  theme         TEXT,
  pillar        CHAR(1) NOT NULL DEFAULT 'A',
  pillar_label  TEXT,
  hook_text     TEXT NOT NULL,
  hook_structure TEXT,
  framework     TEXT,
  body          TEXT NOT NULL,
  cta           TEXT,
  hashtags      TEXT[] DEFAULT '{}',
  sources       TEXT[] DEFAULT '{}',
  review_score  INTEGER CHECK (review_score BETWEEN 0 AND 100),
  status        TEXT NOT NULL DEFAULT 'armazem',
  urgency       TEXT NOT NULL DEFAULT 'relevante',
  week          INTEGER,
  post_number   INTEGER,
  series        TEXT,
  series_order  INTEGER,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),
  published_at  TIMESTAMPTZ
);

CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_pillar ON posts(pillar);
CREATE INDEX idx_posts_content_type ON posts(content_type);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
```

- [x] **1.4** Executar DDL — criar tabela `covers`

```sql
CREATE TABLE covers (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id     UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  slug        TEXT NOT NULL,
  style       TEXT NOT NULL,
  image_url   TEXT NOT NULL,
  image_path  TEXT NOT NULL,
  file_size   INTEGER,
  width       INTEGER DEFAULT 1080,
  height      INTEGER DEFAULT 1350,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id)
);
```

- [x] **1.5** Executar DDL — criar tabela `carousels`

```sql
CREATE TABLE carousels (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id      UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  slug         TEXT NOT NULL,
  visual_style TEXT NOT NULL,
  slide_count  INTEGER NOT NULL,
  pdf_url      TEXT NOT NULL,
  pdf_path     TEXT NOT NULL,
  pdf_size     INTEGER,
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id)
);
```

- [x] **1.6** Executar DDL — criar tabela `carousel_slides`

```sql
CREATE TABLE carousel_slides (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  carousel_id  UUID NOT NULL REFERENCES carousels(id) ON DELETE CASCADE,
  slide_number INTEGER NOT NULL,
  image_url    TEXT NOT NULL,
  image_path   TEXT NOT NULL,
  file_size    INTEGER,
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(carousel_id, slide_number)
);
```

- [x] **1.7** Criar bucket `content-assets` no Supabase Storage como **público** (leitura aberta)

- [x] **1.8** Configurar RLS (Row Level Security) — habilitar RLS nas 4 tabelas e criar policies:

```sql
-- Habilitar RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE covers ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousels ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_slides ENABLE ROW LEVEL SECURITY;

-- Policies de leitura pública
CREATE POLICY "Public read" ON posts FOR SELECT USING (true);
CREATE POLICY "Public read" ON covers FOR SELECT USING (true);
CREATE POLICY "Public read" ON carousels FOR SELECT USING (true);
CREATE POLICY "Public read" ON carousel_slides FOR SELECT USING (true);

-- Policies de escrita
CREATE POLICY "Anon insert" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon update" ON posts FOR UPDATE USING (true);
CREATE POLICY "Anon delete" ON posts FOR DELETE USING (true);

CREATE POLICY "Anon insert" ON covers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon update" ON covers FOR UPDATE USING (true);
CREATE POLICY "Anon delete" ON covers FOR DELETE USING (true);

CREATE POLICY "Anon insert" ON carousels FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon update" ON carousels FOR UPDATE USING (true);
CREATE POLICY "Anon delete" ON carousels FOR DELETE USING (true);

CREATE POLICY "Anon insert" ON carousel_slides FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon update" ON carousel_slides FOR UPDATE USING (true);
CREATE POLICY "Anon delete" ON carousel_slides FOR DELETE USING (true);
```

- [x] **1.9** Validar — smoke test automatizado confirmou tabelas, RLS, JOINs e CASCADE delete

---

## Acceptance Criteria

- [x] As 4 tabelas (`posts`, `covers`, `carousels`, `carousel_slides`) existem no PostgreSQL
- [x] O bucket `content-assets` está criado e público para leitura
- [x] RLS habilitado com policies corretas
- [x] `.env` do `aiox-project/` tem as 3 variáveis Supabase preenchidas
- [x] `SUPABASE_URL` aponta para `https://mvryaxohnbftupocdlqa.supabase.co` (não o dashboard)

## Definition of Done

✅ Tabelas acessíveis via Supabase SDK com a anon key
✅ Bucket aceita upload de PNG/PDF
✅ Nenhum erro ao conectar com as credenciais do `.env`

## File List

- `[x]` `aiox-project/.env` — credenciais Supabase corrigidas (URL → `.supabase.co`)
- `[x]` `aiox-squads/squads/capas-linkedin/.env` — SUPABASE_URL corrigido
- `[x]` `aiox-project/supabase/migrations/001-initial-schema.sql` — DDL completo (idempotente)
- `[x]` `aiox-project/supabase/scripts/run-migration.js` — script de validação + smoke test
- `[x]` `aiox-project/package.json` — @supabase/supabase-js adicionado
