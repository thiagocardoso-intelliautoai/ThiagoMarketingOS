-- ═══════════════════════════════════════════════════════════
-- REFAC-002 — Marcação semântica de lead-magnet em posts
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- Migration: 20260509_lead_magnet_semantics.sql
-- Author: Dara (data-engineer) — story REFAC-002, plano Aria (architect) §5.1
-- Story: REFAC-002 (Label lead-magnet ponta a ponta)
-- ═══════════════════════════════════════════════════════════

-- ─── Contexto ───────────────────────────────────────────────
-- Decisão arquitetural (Aria, plan §5.1): COEXISTIR com lead_magnet_status.
--
--   • lead_magnet_status / lead_magnet_observation / lead_magnet_updated_at
--     (migration 20260501_lead_magnet_schema.sql) → trata WORKFLOW DE PRODUÇÃO
--     do material entregue ('a_fazer' | 'concluido' | observação livre).
--
--   • is_lead_magnet / lead_magnet_resource / cta_arte (esta migration)
--     → tratam MARCAÇÃO SEMÂNTICA: "este post É lead magnet, este é o recurso,
--     este é o CTA injetado na arte".
--
-- Os dois conceitos coexistem sem refactor — não migramos dados antigos.
-- Defaults garantem que posts pré-existentes continuam renderizando no CCC
-- (is_lead_magnet=false, recurso/cta_arte NULL).
--
-- Defesa contra §6.2 (engagement bait) e §6.10 (composição lead-magnet) do
-- linkedin-algorithm-2026-reference.md: o squad de pesquisa lê is_lead_magnet
-- e aplica regra dura anti-bait no body; squads de capa/carrossel lêem
-- cta_arte e injetam dentro da arte (não no texto).

-- ─── Migration ──────────────────────────────────────────────
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS is_lead_magnet boolean NOT NULL DEFAULT false;

ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS lead_magnet_resource text NULL;

ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS cta_arte text NULL;

COMMENT ON COLUMN posts.is_lead_magnet IS
  'REFAC-002: marcação semântica "este post É lead magnet". Coexiste com lead_magnet_status (workflow). Posts pré-existentes default false.';

COMMENT ON COLUMN posts.lead_magnet_resource IS
  'REFAC-002: nome do recurso entregue como lead magnet (ex: "framework de prospecção em 5 etapas"). NULL quando is_lead_magnet=false.';

COMMENT ON COLUMN posts.cta_arte IS
  'REFAC-002: texto do CTA injetado dentro da arte (capa/carrossel) quando is_lead_magnet=true. NUNCA aparece no body do post (defesa §6.2).';

-- ─── Index parcial ──────────────────────────────────────────
-- Otimiza queries de "listar todos os lead magnets" no CCC sem inflar índice.
CREATE INDEX IF NOT EXISTS idx_posts_is_lead_magnet
  ON posts(is_lead_magnet)
  WHERE is_lead_magnet = true;

-- ─── Verificação ────────────────────────────────────────────
-- Após executar, valide com:
--   SELECT column_name, data_type, is_nullable, column_default
--   FROM information_schema.columns
--   WHERE table_name = 'posts'
--     AND column_name IN ('is_lead_magnet', 'lead_magnet_resource', 'cta_arte')
--   ORDER BY column_name;
-- Esperado: 3 linhas
--   cta_arte             | text    | YES |
--   is_lead_magnet       | boolean | NO  | false
--   lead_magnet_resource | text    | YES |
--
-- Validar idempotência rodando a migration 2× — segunda execução não deve
-- falhar (todas as ops usam IF NOT EXISTS).
--
-- Validar que posts antigos ficaram com is_lead_magnet=false:
--   SELECT count(*) FROM posts WHERE is_lead_magnet IS NULL;  -- esperado: 0
