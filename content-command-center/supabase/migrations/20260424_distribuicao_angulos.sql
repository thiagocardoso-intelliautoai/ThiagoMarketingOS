-- ═══════════════════════════════════════════════════════════
-- Migration: 20260424_distribuicao_angulos.sql
-- Refatoração: Distribuição → Modelo Pessoa 1:N Ângulos
-- Author: Dara (data-engineer)
-- Breaking: Remove titulo_com_lente, expectativa, status de lista_distribuicao
-- ═══════════════════════════════════════════════════════════

-- ─── PARTE A — ALTER lista_distribuicao ───

-- Novos campos de contexto
ALTER TABLE lista_distribuicao ADD COLUMN IF NOT EXISTS observacao TEXT;
ALTER TABLE lista_distribuicao ADD COLUMN IF NOT EXISTS status_relacao TEXT;
ALTER TABLE lista_distribuicao ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Trigger updated_at (reusa função existente de etapa3_schema)
CREATE TRIGGER trg_lista_distribuicao_updated_at
  BEFORE UPDATE ON lista_distribuicao
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Drop colunas migradas para angulos_distribuicao
-- titulo_com_lente → agora é titulo_pela_lente no ângulo
-- expectativa → agora é expectativa_comentario/expectativa_repost no ângulo
-- status → agora cada ângulo tem status próprio
ALTER TABLE lista_distribuicao DROP COLUMN IF EXISTS titulo_com_lente;
ALTER TABLE lista_distribuicao DROP COLUMN IF EXISTS expectativa;
ALTER TABLE lista_distribuicao DROP COLUMN IF EXISTS status;

COMMENT ON TABLE lista_distribuicao IS 'Pessoas para matéria-colab — modelo 1:N com angulos_distribuicao';
COMMENT ON COLUMN lista_distribuicao.observacao IS 'Observação livre sobre a pessoa (notas, contexto, interações passadas)';
COMMENT ON COLUMN lista_distribuicao.status_relacao IS 'Nível de proximidade ou contexto da relação (ex: contato direto, rede distante)';

-- ═══════════════════════════════════════════════════════════
-- PARTE B — CREATE angulos_distribuicao
-- Cada pessoa pode ter N ângulos distintos pela lente
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS angulos_distribuicao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pessoa_id UUID NOT NULL REFERENCES lista_distribuicao(id) ON DELETE CASCADE,
  arquetipo TEXT NOT NULL CHECK (arquetipo IN (
    'contra_o_consenso', 'tradutor_de_bastidor',
    'pioneiro_silencioso', 'benchmark_vivo',
    'misto', 'outro'
  )),
  titulo_pela_lente TEXT NOT NULL,
  evidencias JSONB DEFAULT '[]',
  risco TEXT,
  expectativa_comentario TEXT CHECK (expectativa_comentario IN ('provavel', 'possivel', 'incerto')),
  expectativa_repost TEXT CHECK (expectativa_repost IN ('provavel', 'possivel', 'incerto')),
  origem TEXT DEFAULT 'manual' CHECK (origem IN (
    'pesquisa_inicial', 'aprofundamento_com_input',
    'aprofundamento_por_movimento_recente', 'manual'
  )),
  status TEXT DEFAULT 'novo' CHECK (status IN (
    'novo', 'briefing_gerado', 'materia_em_producao',
    'publicada', 'descartado'
  )),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE angulos_distribuicao IS 'Ângulos de matéria-colab por pessoa — cada ângulo é uma lente distinta sobre a pessoa';
COMMENT ON COLUMN angulos_distribuicao.arquetipo IS 'Arquétipo do ângulo: contra_o_consenso | tradutor_de_bastidor | pioneiro_silencioso | benchmark_vivo | misto | outro';
COMMENT ON COLUMN angulos_distribuicao.titulo_pela_lente IS 'Título da matéria formulado pela lente Built, not prompted';
COMMENT ON COLUMN angulos_distribuicao.evidencias IS 'Array JSONB de 1-3 evidências/sinais que sustentam o ângulo';
COMMENT ON COLUMN angulos_distribuicao.risco IS 'Risco editorial (ex: pode parecer propaganda, falta lastro público)';
COMMENT ON COLUMN angulos_distribuicao.expectativa_comentario IS 'Expectativa de comentário da pessoa: provavel | possivel | incerto';
COMMENT ON COLUMN angulos_distribuicao.expectativa_repost IS 'Expectativa de repost da pessoa: provavel | possivel | incerto';
COMMENT ON COLUMN angulos_distribuicao.origem IS 'Como o ângulo foi gerado: pesquisa_inicial | aprofundamento_com_input | aprofundamento_por_movimento_recente | manual';
COMMENT ON COLUMN angulos_distribuicao.status IS 'Status do ângulo: novo | briefing_gerado | materia_em_producao | publicada | descartado';

-- ═══════════════════════════════════════════════════════════
-- PARTE C — Indexes, RLS, Trigger
-- ═══════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_angulos_pessoa_id ON angulos_distribuicao(pessoa_id);
CREATE INDEX IF NOT EXISTS idx_angulos_status ON angulos_distribuicao(status);

ALTER TABLE angulos_distribuicao ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open_access" ON angulos_distribuicao FOR ALL USING (true) WITH CHECK (true);

CREATE TRIGGER trg_angulos_updated_at
  BEFORE UPDATE ON angulos_distribuicao
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════
-- PARTE D — Migração de dados
-- Os 4 nomes existentes ficam como pessoas com zero ângulos
-- titulo_com_lente estava vazio em todos → nada a migrar pra ângulos
-- As colunas removidas (titulo_com_lente, expectativa, status) já foram dropadas acima
-- ═══════════════════════════════════════════════════════════

-- DONE — Migration: Distribuição → Modelo Pessoa 1:N Ângulos
-- Verificar: SELECT * FROM lista_distribuicao;
-- Verificar: SELECT * FROM angulos_distribuicao;
-- Verificar: \d lista_distribuicao  (sem titulo_com_lente, expectativa, status)
