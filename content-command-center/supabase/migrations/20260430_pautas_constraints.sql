-- ═══════════════════════════════════════════════════════════
-- Migration: 20260430_pautas_constraints.sql
-- UNIQUE constraints + is_lead_magnet para upsert idempotente
-- ═══════════════════════════════════════════════════════════

-- UNIQUE em pautas_centrais(nome) — permite ON CONFLICT upsert
ALTER TABLE pautas_centrais
  ADD CONSTRAINT pautas_centrais_nome_unique UNIQUE (nome);

-- UNIQUE em subpautas(titulo, pauta_central_id) — permite ON CONFLICT upsert
ALTER TABLE subpautas
  ADD CONSTRAINT subpautas_titulo_pauta_unique UNIQUE (titulo, pauta_central_id);

-- Coluna is_lead_magnet em subpautas (não existe no schema original)
ALTER TABLE subpautas
  ADD COLUMN IF NOT EXISTS is_lead_magnet BOOLEAN DEFAULT false;

COMMENT ON COLUMN subpautas.is_lead_magnet IS 'true = subpauta gera post que promete um material externo (squad, vídeo, PDF)';
