-- ═══════════════════════════════════════════════════════════
-- Migration: 20260425_alinhar_arquetipos.sql
-- Alinha valores de arquétipo no DB com os nomes descritivos do squad
-- Os nomes antigos (benchmark_vivo, tradutor_de_bastidor, pioneiro_silencioso)
-- são substituídos pelos descritivos usados pelo squad seed-lista-distribuicao
-- ═══════════════════════════════════════════════════════════

-- 1. Remover o CHECK constraint antigo
ALTER TABLE angulos_distribuicao DROP CONSTRAINT IF EXISTS angulos_distribuicao_arquetipo_check;

-- 2. Migrar dados existentes (se houver) para os novos nomes
UPDATE angulos_distribuicao SET arquetipo = 'como_ele_faz_o_que_prega' WHERE arquetipo = 'benchmark_vivo';
UPDATE angulos_distribuicao SET arquetipo = 'o_que_aprendi_estudando_ele' WHERE arquetipo = 'tradutor_de_bastidor';
UPDATE angulos_distribuicao SET arquetipo = 'padrao_que_vi_no_trabalho_dele' WHERE arquetipo = 'pioneiro_silencioso';
-- contra_o_consenso, misto, outro permanecem iguais

-- 3. Adicionar novo CHECK constraint com nomes descritivos alinhados ao squad
ALTER TABLE angulos_distribuicao ADD CONSTRAINT angulos_distribuicao_arquetipo_check
  CHECK (arquetipo IN (
    'como_ele_faz_o_que_prega',
    'contra_o_consenso',
    'o_que_aprendi_estudando_ele',
    'padrao_que_vi_no_trabalho_dele',
    'misto',
    'outro'
  ));

-- 4. Atualizar comentário
COMMENT ON COLUMN angulos_distribuicao.arquetipo IS 'Arquétipo do ângulo: como_ele_faz_o_que_prega | contra_o_consenso | o_que_aprendi_estudando_ele | padrao_que_vi_no_trabalho_dele | misto | outro';

-- ═══════════════════════════════════════════════════════════
-- DONE — Arquétipos alinhados com gate-rules.md do squad
-- ═══════════════════════════════════════════════════════════
