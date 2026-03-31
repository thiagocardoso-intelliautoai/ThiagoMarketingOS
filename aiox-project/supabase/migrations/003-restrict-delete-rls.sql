-- ============================================================
-- HARDENING-001: Restringir DELETE policies
-- Remove DELETE via anon key — requer service_role
-- ============================================================

-- Remover policies de delete antigas
DROP POLICY IF EXISTS "Anon delete" ON posts;
DROP POLICY IF EXISTS "Anon delete" ON covers;
DROP POLICY IF EXISTS "Anon delete" ON carousels;
DROP POLICY IF EXISTS "Anon delete" ON carousel_slides;

-- Criar policies de delete restritas (apenas service_role pode deletar)
CREATE POLICY "Service delete only" ON posts
  FOR DELETE USING (auth.role() = 'service_role');

CREATE POLICY "Service delete only" ON covers
  FOR DELETE USING (auth.role() = 'service_role');

CREATE POLICY "Service delete only" ON carousels
  FOR DELETE USING (auth.role() = 'service_role');

CREATE POLICY "Service delete only" ON carousel_slides
  FOR DELETE USING (auth.role() = 'service_role');

-- ============================================================
-- Trigger automático para updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS posts_updated_at ON posts;
CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
