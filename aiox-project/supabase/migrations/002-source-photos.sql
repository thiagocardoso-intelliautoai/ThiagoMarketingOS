-- ============================================================
-- ASSETS-001: Infraestrutura Supabase para Source Photos
-- Migration: 002-source-photos.sql
-- Descrição: Cria tabela source_photos com RLS + Storage policies
--            para path source-photos/{papers|photos|profile}/
-- Idempotente: Sim (IF NOT EXISTS / DO $$ BEGIN...END $$)
-- Rollback: DROP TABLE IF EXISTS source_photos CASCADE;
-- ============================================================

-- ============================================================
-- 1. TABELA: source_photos
-- ============================================================
CREATE TABLE IF NOT EXISTS source_photos (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category     TEXT NOT NULL CHECK (category IN ('papers', 'photos', 'profile')),
  filename     TEXT NOT NULL,
  description  TEXT,
  best_for     TEXT,
  orientation  TEXT,
  storage_path TEXT NOT NULL,
  public_url   TEXT NOT NULL,
  file_size    INTEGER,
  mime_type    TEXT DEFAULT 'image/jpeg',
  sort_order   INTEGER DEFAULT 0,
  active       BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now(),

  UNIQUE(category, filename)
);

-- Índices para queries frequentes
CREATE INDEX IF NOT EXISTS idx_source_photos_category ON source_photos(category);
CREATE INDEX IF NOT EXISTS idx_source_photos_active ON source_photos(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_source_photos_sort ON source_photos(category, sort_order);

-- ============================================================
-- 2. RLS na tabela source_photos (4 policies)
-- ============================================================
ALTER TABLE source_photos ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'source_photos_anon_select' AND tablename = 'source_photos') THEN
    CREATE POLICY "source_photos_anon_select" ON source_photos FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'source_photos_anon_insert' AND tablename = 'source_photos') THEN
    CREATE POLICY "source_photos_anon_insert" ON source_photos FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'source_photos_anon_update' AND tablename = 'source_photos') THEN
    CREATE POLICY "source_photos_anon_update" ON source_photos FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'source_photos_anon_delete' AND tablename = 'source_photos') THEN
    CREATE POLICY "source_photos_anon_delete" ON source_photos FOR DELETE USING (true);
  END IF;
END $$;

-- ============================================================
-- 3. STORAGE POLICIES para bucket content-assets, path source-photos/
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'source_photos_storage_select' AND tablename = 'objects') THEN
    CREATE POLICY "source_photos_storage_select" ON storage.objects
      FOR SELECT USING (
        bucket_id = 'content-assets' AND
        (storage.foldername(name))[1] = 'source-photos'
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'source_photos_storage_insert' AND tablename = 'objects') THEN
    CREATE POLICY "source_photos_storage_insert" ON storage.objects
      FOR INSERT WITH CHECK (
        bucket_id = 'content-assets' AND
        (storage.foldername(name))[1] = 'source-photos'
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'source_photos_storage_delete' AND tablename = 'objects') THEN
    CREATE POLICY "source_photos_storage_delete" ON storage.objects
      FOR DELETE USING (
        bucket_id = 'content-assets' AND
        (storage.foldername(name))[1] = 'source-photos'
      );
  END IF;
END $$;

-- ============================================================
-- 4. COMENTÁRIOS para documentação inline
-- ============================================================
COMMENT ON TABLE source_photos IS 'Fotos de referência (papers, photos, profile) para composição de capas e conteúdo visual';
COMMENT ON COLUMN source_photos.category IS 'Categoria: papers (folhas/documentos), photos (fotos gerais), profile (fotos de perfil)';
COMMENT ON COLUMN source_photos.best_for IS 'Estilos visuais onde a foto funciona melhor (ex: rascunho-papel, minimal-tech)';
COMMENT ON COLUMN source_photos.orientation IS 'Orientação da foto: portrait, landscape, square';
COMMENT ON COLUMN source_photos.storage_path IS 'Path relativo no bucket content-assets (ex: source-photos/papers/foto.jpg)';
COMMENT ON COLUMN source_photos.public_url IS 'URL pública completa do Supabase Storage';
COMMENT ON COLUMN source_photos.sort_order IS 'Ordem de exibição na UI (menor = primeiro)';
COMMENT ON COLUMN source_photos.active IS 'Flag para desativar fotos sem deletar';
