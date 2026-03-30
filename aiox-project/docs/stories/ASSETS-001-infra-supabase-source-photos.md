# Story ASSETS-001 — Infraestrutura Supabase para Source Photos

**🏷️ ID:** `ASSETS-001`
**📐 Estimativa:** 1h
**🔗 Bloqueia:** Stories 002, 003, 004, 005, 006
**👤 Assignee:** Data Engineer
**🏷️ Labels:** `database`, `infra`, `storage`, `RLS`
**📊 Status:** `[x]` Done

---

## Descrição

> Como **gestor de conteúdo**, eu quero que a tabela `source_photos` e as policies de acesso estejam configuradas no Supabase, para que fotos de referência possam ser armazenadas e gerenciadas pela UI e CLIs.

## Contexto Técnico

- **Projeto Supabase existente** — credenciais em `aiox-squads/squads/capas-linkedin/.env`
- **Bucket `content-assets`** já existe (criado na story SUPABASE-001)
- Novo path de storage: `content-assets/source-photos/{papers|photos|profile}/`
- RLS policies completas: 4 na tabela + 3 no Storage (conforme Review #2)

---

## Sub-tarefas

- [x] **1.1** Executar DDL no Supabase SQL Editor — criar tabela `source_photos`

```sql
CREATE TABLE source_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('papers', 'photos', 'profile')),
  filename TEXT NOT NULL,
  description TEXT,
  best_for TEXT,
  orientation TEXT,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT DEFAULT 'image/jpeg',
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(category, filename)
);
```

- [x] **1.2** Configurar RLS na tabela `source_photos`

```sql
ALTER TABLE source_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "source_photos_anon_select" ON source_photos FOR SELECT USING (true);
CREATE POLICY "source_photos_anon_insert" ON source_photos FOR INSERT WITH CHECK (true);
CREATE POLICY "source_photos_anon_update" ON source_photos FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "source_photos_anon_delete" ON source_photos FOR DELETE USING (true);
```

- [x] **1.3** Configurar policies de Storage no bucket `content-assets` para o path `source-photos/`

```sql
CREATE POLICY "source_photos_storage_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'content-assets' AND
    (storage.foldername(name))[1] = 'source-photos'
  );

CREATE POLICY "source_photos_storage_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'content-assets' AND
    (storage.foldername(name))[1] = 'source-photos'
  );

CREATE POLICY "source_photos_storage_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'content-assets' AND
    (storage.foldername(name))[1] = 'source-photos'
  );
```

- [x] **1.4** Criar pastas no Storage via upload de `.gitkeep`:
  - `source-photos/papers/`
  - `source-photos/photos/`
  - `source-photos/profile/`

- [x] **1.5** Salvar DDL como `aiox-project/supabase/migrations/002-source-photos.sql`

- [x] **1.6** Validar — smoke test: SELECT/INSERT/DELETE na tabela + upload/delete teste no Storage

---

## Acceptance Criteria

- [x] Tabela `source_photos` existe com 12 colunas e constraint UNIQUE(category, filename)
- [x] RLS habilitado com 4 policies (SELECT/INSERT/UPDATE/DELETE) na tabela
- [x] 3 policies de Storage criadas para path `source-photos/`
- [x] Upload de imagem via anon key funciona no path `source-photos/papers/test.jpg`
- [x] Delete de imagem via anon key funciona no path `source-photos/papers/test.jpg`
- [x] DDL salvo em `002-source-photos.sql`

## Definition of Done

✅ Tabela acessível via Supabase SDK (anon key) com CRUD completo
✅ Storage aceita upload/delete no path `source-photos/` via anon key
✅ Migration script versionado no repositório

## File List

- `[x]` `aiox-project/supabase/migrations/002-source-photos.sql` — DDL + RLS completo
