-- ═══════════════════════════════════════════════════════════
-- Etapa 3 — Schema: Pautas, Distribuição, Átomos Estratégicos
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- Migration: 20260423_etapa3_schema.sql
-- Author: Dara (data-engineer) via plano Aria (architect)
-- ═══════════════════════════════════════════════════════════

-- ─── UTILITY: Trigger function for updated_at ───
-- Reusable across all tables with updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════
-- 1. PAUTAS CENTRAIS
-- Chapéu temático estrutural (ex: "Skills em Produção")
-- Thiago decide pautas. Squads sugerem subpautas.
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS pautas_centrais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  fonte_tese TEXT NOT NULL CHECK (fonte_tese IN (
    'skills_producao', 'benchmark_real', 'process_diagnostic', 'falha_documentada'
  )),
  descricao TEXT,
  ordem INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE pautas_centrais IS 'Pautas centrais temáticas — chapéus estruturais decididos pelo Thiago';
COMMENT ON COLUMN pautas_centrais.fonte_tese IS 'Fonte de tese recorrente: skills_producao | benchmark_real | process_diagnostic | falha_documentada';
COMMENT ON COLUMN pautas_centrais.ordem IS 'Ordem de exibição na UI (menor = primeiro)';

CREATE TRIGGER trg_pautas_centrais_updated_at
  BEFORE UPDATE ON pautas_centrais
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════
-- 2. SUBPAUTAS
-- Ângulo concreto já formulado como tese-embrião.
-- Geradas pelo squad seed-pautas-centrais, editadas inline na UI.
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS subpautas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pauta_central_id UUID NOT NULL REFERENCES pautas_centrais(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  angulo TEXT,
  hook_embrionario TEXT,
  materia_prima TEXT,
  urgencia TEXT DEFAULT 'relevante' CHECK (urgencia IN ('urgente', 'relevante', 'pode_esperar')),
  status TEXT DEFAULT 'ativa' CHECK (status IN ('ativa', 'usada', 'descartada')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE subpautas IS 'Subpautas táticas — ângulos concretos formulados como tese-embrião';
COMMENT ON COLUMN subpautas.angulo IS 'Ângulo concreto da tese — o que diferencia esta subpauta';
COMMENT ON COLUMN subpautas.hook_embrionario IS 'Hook embrionário — rascunho do gancho para o post';
COMMENT ON COLUMN subpautas.materia_prima IS 'Matéria-prima de onde sai a tese (skill, benchmark, etc)';
COMMENT ON COLUMN subpautas.status IS 'ativa = disponível | usada = já gerou post | descartada = rejeitada';

CREATE INDEX IF NOT EXISTS idx_subpautas_pauta_central ON subpautas(pauta_central_id);
CREATE INDEX IF NOT EXISTS idx_subpautas_status ON subpautas(status);

-- ═══════════════════════════════════════════════════════════
-- 3. LISTA DE DISTRIBUIÇÃO
-- Pessoas para matéria-colab estilo G4 adaptada.
-- Gate: sem título-com-lente, sem matéria.
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS lista_distribuicao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  funcao TEXT,
  rede_relevante TEXT,
  titulo_com_lente TEXT,
  expectativa TEXT,
  expande_bolha BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'ativa' CHECK (status IN ('ativa', 'em_andamento', 'publicada', 'descartada')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE lista_distribuicao IS 'Lista de pessoas para matéria-colab — gate: título-com-lente obrigatório';
COMMENT ON COLUMN lista_distribuicao.titulo_com_lente IS 'Título da matéria formulado pela lente Built, not prompted';
COMMENT ON COLUMN lista_distribuicao.expande_bolha IS 'true = pessoa fora da bolha Winning (prioridade)';
COMMENT ON COLUMN lista_distribuicao.rede_relevante IS 'Pra quem a rede dessa pessoa alcança — ICP indireto';

-- ═══════════════════════════════════════════════════════════
-- 4. EXCLUSÕES DE DISTRIBUIÇÃO
-- Arquétipos e pessoas vetados — injetados como blacklist nos prompts.
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS exclusoes_distribuicao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL CHECK (tipo IN ('arquetipo', 'pessoa_especifica')),
  nome_ou_arquetipo TEXT NOT NULL,
  motivo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE exclusoes_distribuicao IS 'Blacklist de distribuição — arquétipos e pessoas vetados';
COMMENT ON COLUMN exclusoes_distribuicao.tipo IS 'arquetipo = categoria genérica | pessoa_especifica = nome individual';

-- ═══════════════════════════════════════════════════════════
-- 5. ÁTOMOS ESTRATÉGICOS
-- 18 átomos — unidades atômicas da estratégia v2.
-- Fonte única de verdade. UI edita, squads consomem.
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS atomos_estrategicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chave TEXT UNIQUE NOT NULL,
  valor JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE atomos_estrategicos IS 'Átomos estratégicos — fonte única de verdade da estratégia v2';
COMMENT ON COLUMN atomos_estrategicos.chave IS 'Chave única do átomo (ex: brand_lens, flag_anchor)';
COMMENT ON COLUMN atomos_estrategicos.valor IS 'Conteúdo completo do átomo em JSONB';

CREATE UNIQUE INDEX IF NOT EXISTS idx_atomos_chave ON atomos_estrategicos(chave);

CREATE TRIGGER trg_atomos_updated_at
  BEFORE UPDATE ON atomos_estrategicos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════
-- 6. ALTER TABLE posts — novas colunas
-- fonte_tese substitui pillar na classificação
-- pauta_central_id conecta post à pauta (determinístico via código)
-- ═══════════════════════════════════════════════════════════
ALTER TABLE posts ADD COLUMN IF NOT EXISTS fonte_tese TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS pauta_central_id UUID REFERENCES pautas_centrais(id);

COMMENT ON COLUMN posts.fonte_tese IS 'Fonte de tese: skills_producao | benchmark_real | process_diagnostic | falha_documentada (substitui pillar ACRE)';
COMMENT ON COLUMN posts.pauta_central_id IS 'FK para pauta central — setado deterministicamente pela plataforma via código';

CREATE INDEX IF NOT EXISTS idx_posts_fonte_tese ON posts(fonte_tese);
CREATE INDEX IF NOT EXISTS idx_posts_pauta_central ON posts(pauta_central_id);

-- ═══════════════════════════════════════════════════════════
-- 7. ROW LEVEL SECURITY
-- Mesmo padrão open do projeto (sem auth layer, single-user)
-- ═══════════════════════════════════════════════════════════
ALTER TABLE pautas_centrais ENABLE ROW LEVEL SECURITY;
ALTER TABLE subpautas ENABLE ROW LEVEL SECURITY;
ALTER TABLE lista_distribuicao ENABLE ROW LEVEL SECURITY;
ALTER TABLE exclusoes_distribuicao ENABLE ROW LEVEL SECURITY;
ALTER TABLE atomos_estrategicos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "open_access" ON pautas_centrais FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_access" ON subpautas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_access" ON lista_distribuicao FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_access" ON exclusoes_distribuicao FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_access" ON atomos_estrategicos FOR ALL USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════
-- DONE — Schema Etapa 3
-- Next: Run 20260423_etapa3_seeds.sql for initial data
-- ═══════════════════════════════════════════════════════════
