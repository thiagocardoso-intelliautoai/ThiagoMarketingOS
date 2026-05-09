-- ============================================================
-- REFAC-005A-INFRA: Suporte ao Formato Multi-Image
-- Migration: 004-covers-multi-image.sql
-- Descrição: Permite N capas por post (multi-image post nativo do LinkedIn)
--            mantendo single-image como caso default (sequence=1).
-- Idempotente: Sim (validações + IF NOT EXISTS / IF EXISTS)
-- ============================================================

-- 1. Validação prévia: garantir que não há rows duplicadas por post_id
--    (a UNIQUE(post_id) atual deveria garantir isso, mas é boa prática verificar
--     antes de droppar a constraint, pra falhar alto se algo estiver inconsistente)
DO $$
DECLARE
  dup_count INT;
BEGIN
  SELECT COUNT(*) INTO dup_count
  FROM (
    SELECT post_id
    FROM covers
    WHERE post_id IS NOT NULL
    GROUP BY post_id
    HAVING COUNT(*) > 1
  ) AS dups;

  IF dup_count > 0 THEN
    RAISE EXCEPTION 'Encontradas % rows duplicadas em covers por post_id — limpar antes de aplicar migration', dup_count;
  END IF;
END $$;

-- 2. Drop UNIQUE(post_id) — preserva data via constraint name lookup
--    O nome canônico da constraint criada por UNIQUE(post_id) é covers_post_id_key
ALTER TABLE covers DROP CONSTRAINT IF EXISTS covers_post_id_key;

-- 3. Adicionar coluna sequence (single-image vira sequence=1 por default — sem regressão)
ALTER TABLE covers ADD COLUMN IF NOT EXISTS sequence INT NOT NULL DEFAULT 1;

-- 4. Adicionar coluna caption (legenda opcional por imagem, nullable)
ALTER TABLE covers ADD COLUMN IF NOT EXISTS caption TEXT;

-- 5. Adicionar UNIQUE composto (post_id, sequence)
--    Idempotente: drop antes pra permitir re-criação se já existe (caso migration rode 2x com schema parcial)
ALTER TABLE covers DROP CONSTRAINT IF EXISTS covers_post_id_sequence_key;
ALTER TABLE covers ADD CONSTRAINT covers_post_id_sequence_key UNIQUE (post_id, sequence);

-- 6. Index pra query de vitrine (ordena por sequence ASC dentro de cada post)
CREATE INDEX IF NOT EXISTS idx_covers_post_id_sequence ON covers (post_id, sequence);

-- 7. Comentários inline pra documentação
COMMENT ON COLUMN covers.sequence IS 'Ordem da imagem no post multi-image (1..N). Single-image = 1.';
COMMENT ON COLUMN covers.caption IS 'Legenda opcional da imagem no post multi-image (nullable).';
