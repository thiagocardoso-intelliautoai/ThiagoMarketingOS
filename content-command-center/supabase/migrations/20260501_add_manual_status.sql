-- Migration: Add 'manual' status for posts published/scheduled outside the platform
-- Posts with status='manual' are read-only from platform perspective (no re-publish, no auto-delete)

ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_status_check;
ALTER TABLE posts
  ADD CONSTRAINT posts_status_check
  CHECK (status IN ('rascunho', 'agendado', 'publicado', 'manual'));

COMMENT ON COLUMN posts.status IS
  'rascunho=draft | agendado=scheduled via platform | publicado=published via platform | manual=published/scheduled outside platform';
