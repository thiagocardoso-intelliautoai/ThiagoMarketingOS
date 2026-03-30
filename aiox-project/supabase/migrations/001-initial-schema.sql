-- ============================================================
-- SUPABASE-001: Setup do Banco de Dados
-- Migration: 001-initial-schema.sql
-- Descrição: Cria tabelas posts, covers, carousels, carousel_slides
--            com índices, RLS habilitado e policies
-- Idempotente: Sim (IF NOT EXISTS / CREATE OR REPLACE)
-- ============================================================

-- ============================================================
-- 1. TABELA: posts
-- ============================================================
CREATE TABLE IF NOT EXISTS posts (
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

CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_pillar ON posts(pillar);
CREATE INDEX IF NOT EXISTS idx_posts_content_type ON posts(content_type);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- ============================================================
-- 2. TABELA: covers
-- ============================================================
CREATE TABLE IF NOT EXISTS covers (
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

-- ============================================================
-- 3. TABELA: carousels
-- ============================================================
CREATE TABLE IF NOT EXISTS carousels (
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

-- ============================================================
-- 4. TABELA: carousel_slides
-- ============================================================
CREATE TABLE IF NOT EXISTS carousel_slides (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  carousel_id  UUID NOT NULL REFERENCES carousels(id) ON DELETE CASCADE,
  slide_number INTEGER NOT NULL,
  image_url    TEXT NOT NULL,
  image_path   TEXT NOT NULL,
  file_size    INTEGER,
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(carousel_id, slide_number)
);

-- ============================================================
-- 5. HABILITAR RLS em todas as tabelas
-- ============================================================
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE covers ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousels ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_slides ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 6. POLICIES de leitura pública
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read' AND tablename = 'posts') THEN
    CREATE POLICY "Public read" ON posts FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read' AND tablename = 'covers') THEN
    CREATE POLICY "Public read" ON covers FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read' AND tablename = 'carousels') THEN
    CREATE POLICY "Public read" ON carousels FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read' AND tablename = 'carousel_slides') THEN
    CREATE POLICY "Public read" ON carousel_slides FOR SELECT USING (true);
  END IF;
END $$;

-- ============================================================
-- 7. POLICIES de escrita (insert, update, delete)
-- ============================================================
DO $$ BEGIN
  -- posts
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anon insert' AND tablename = 'posts') THEN
    CREATE POLICY "Anon insert" ON posts FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anon update' AND tablename = 'posts') THEN
    CREATE POLICY "Anon update" ON posts FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anon delete' AND tablename = 'posts') THEN
    CREATE POLICY "Anon delete" ON posts FOR DELETE USING (true);
  END IF;

  -- covers
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anon insert' AND tablename = 'covers') THEN
    CREATE POLICY "Anon insert" ON covers FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anon update' AND tablename = 'covers') THEN
    CREATE POLICY "Anon update" ON covers FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anon delete' AND tablename = 'covers') THEN
    CREATE POLICY "Anon delete" ON covers FOR DELETE USING (true);
  END IF;

  -- carousels
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anon insert' AND tablename = 'carousels') THEN
    CREATE POLICY "Anon insert" ON carousels FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anon update' AND tablename = 'carousels') THEN
    CREATE POLICY "Anon update" ON carousels FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anon delete' AND tablename = 'carousels') THEN
    CREATE POLICY "Anon delete" ON carousels FOR DELETE USING (true);
  END IF;

  -- carousel_slides
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anon insert' AND tablename = 'carousel_slides') THEN
    CREATE POLICY "Anon insert" ON carousel_slides FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anon update' AND tablename = 'carousel_slides') THEN
    CREATE POLICY "Anon update" ON carousel_slides FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anon delete' AND tablename = 'carousel_slides') THEN
    CREATE POLICY "Anon delete" ON carousel_slides FOR DELETE USING (true);
  END IF;
END $$;

-- ============================================================
-- 8. COMENTÁRIOS para documentação inline
-- ============================================================
COMMENT ON TABLE posts IS 'Posts de conteúdo LinkedIn — texto, capas e carrosseis';
COMMENT ON TABLE covers IS 'Capas visuais (1080x1350) vinculadas a posts';
COMMENT ON TABLE carousels IS 'Carrosseis PDF vinculados a posts';
COMMENT ON TABLE carousel_slides IS 'Slides individuais PNG de cada carrossel';
