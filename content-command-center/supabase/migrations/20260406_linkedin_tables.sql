-- ═══════════════════════════════════════════════════════════
-- LinkedIn Integration Tables
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ═══════════════════════════════════════════════════════════

-- 1. OAuth States (CSRF protection, auto-cleaned)
CREATE TABLE IF NOT EXISTS oauth_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- 2. LinkedIn Tokens (encrypted access tokens)
CREATE TABLE IF NOT EXISTS linkedin_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE DEFAULT 'default',
  access_token TEXT NOT NULL,
  person_urn TEXT NOT NULL,
  display_name TEXT,
  profile_picture_url TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Scheduled Posts (publishing queue)
CREATE TABLE IF NOT EXISTS scheduled_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_content TEXT NOT NULL,
  post_type TEXT DEFAULT 'text' CHECK (post_type IN ('text', 'image', 'carousel')),
  media_url TEXT,
  media_filename TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'publishing', 'published', 'failed')),
  linkedin_post_urn TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- ─── Row Level Security ───
ALTER TABLE linkedin_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_states ENABLE ROW LEVEL SECURITY;

-- Allow Edge Functions (service_role) full access
CREATE POLICY "Service role full access" ON linkedin_tokens
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access" ON scheduled_posts
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access" ON oauth_states
  FOR ALL USING (true) WITH CHECK (true);

-- ─── Cleanup expired oauth states (optional cron) ───
-- If you have pg_cron enabled:
-- SELECT cron.schedule('cleanup-oauth-states', '*/30 * * * *', $$
--   DELETE FROM oauth_states WHERE expires_at < NOW();
-- $$);
