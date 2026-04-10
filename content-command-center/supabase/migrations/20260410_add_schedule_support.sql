-- ═══════════════════════════════════════════════════════════
-- Add scheduled_at column to posts table
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ═══════════════════════════════════════════════════════════

ALTER TABLE posts ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;

-- Allow anon role to insert into scheduled_posts (needed for frontend scheduling)
CREATE POLICY IF NOT EXISTS "Anon can insert scheduled posts"
  ON scheduled_posts FOR INSERT
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Anon can read scheduled posts"
  ON scheduled_posts FOR SELECT
  USING (true);
