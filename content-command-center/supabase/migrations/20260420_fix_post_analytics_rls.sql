-- ═══════════════════════════════════════════════════════════
-- Fix: Create post_analytics table + anon RLS
-- The original migration (20260411) was never applied.
-- This migration creates the table AND sets proper RLS for anon.
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ═══════════════════════════════════════════════════════════

-- 1. Create post_analytics table (if not exists)
CREATE TABLE IF NOT EXISTS post_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  post_urn TEXT NOT NULL,
  impressions INTEGER DEFAULT 0,
  reactions INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  reshares INTEGER DEFAULT 0,
  members_reached INTEGER DEFAULT 0,
  last_fetched_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id)
);

-- 2. Add post_urn column to posts table (if not exists)
ALTER TABLE posts ADD COLUMN IF NOT EXISTS post_urn TEXT;

-- 3. Enable RLS
ALTER TABLE post_analytics ENABLE ROW LEVEL SECURITY;

-- 4. Allow anon to read (needed for frontend JOINs)
CREATE POLICY "Anon can read post_analytics"
  ON post_analytics FOR SELECT
  USING (true);

-- 5. Allow authenticated full access
CREATE POLICY "Authenticated full access post_analytics"
  ON post_analytics FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 6. Indexes
CREATE INDEX IF NOT EXISTS idx_post_analytics_post_id ON post_analytics(post_id);
CREATE INDEX IF NOT EXISTS idx_posts_post_urn ON posts(post_urn) WHERE post_urn IS NOT NULL;
