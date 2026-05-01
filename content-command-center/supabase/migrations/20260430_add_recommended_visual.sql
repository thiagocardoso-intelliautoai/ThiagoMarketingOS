-- ═══════════════════════════════════════════════════════════
-- VISUAL-002 — Coluna recommended_visual em posts
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- Migration: 20260430_add_recommended_visual.sql
-- Author: Dara (data-engineer) via plano Aria (architect) — VISUAL-RECOMMENDER-PLAN.md §3.6
-- Story: VISUAL-002
-- ═══════════════════════════════════════════════════════════

-- ─── Contexto ───────────────────────────────────────────────
-- Squad de redação emite uma sugestão de visual no post-final.md no formato
--   "carrossel/Notebook Raw (motivo curto)"
-- save-post-cli.js extrai e grava nesta coluna. CCC lê ao exibir o post e
-- destaca o card recomendado nos modais de carrossel/capa.
-- Decisão arquitetural (V1): TEXT livre, sem enum, sem constraint, sem default.
-- Posts antigos ficam NULL — CCC faz fallback client-side via recommendVisual().

-- ─── Migration ──────────────────────────────────────────────
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS recommended_visual TEXT NULL;

COMMENT ON COLUMN posts.recommended_visual IS
  'VISUAL-002: sugestão automática de visual emitida pelo squad. Formato: "<formato>/<Estilo> (<motivo curto>)". Ex: "carrossel/Notebook Raw (5 etapas + skills)". NULL = squad não emitiu, CCC fará fallback client-side.';

-- ─── Verificação ────────────────────────────────────────────
-- Após executar, valide com:
--   SELECT column_name, data_type, is_nullable
--   FROM information_schema.columns
--   WHERE table_name = 'posts' AND column_name = 'recommended_visual';
-- Esperado: 1 linha — recommended_visual | text | YES
