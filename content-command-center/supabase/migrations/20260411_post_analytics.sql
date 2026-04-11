-- Migration: Post Analytics + Status Cleanup
-- Run this in Supabase SQL Editor

-- 1. Create post_analytics table
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

-- 2. Add post_urn column to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS post_urn TEXT;

-- 3. Migrate old status values to new system
UPDATE posts SET status = 'rascunho' WHERE status IN ('armazem', 'em_producao', 'aprovado');

-- 4. Enable RLS on post_analytics
ALTER TABLE post_analytics ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policy — allow authenticated reads/writes
CREATE POLICY "Allow authenticated access to post_analytics"
  ON post_analytics
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 6. Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_post_analytics_post_id ON post_analytics(post_id);
CREATE INDEX IF NOT EXISTS idx_posts_post_urn ON posts(post_urn) WHERE post_urn IS NOT NULL;
