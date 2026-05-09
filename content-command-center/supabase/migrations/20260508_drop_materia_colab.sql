-- REFAC-001: Demolição Seletiva — remover tabelas de matéria-colab
-- Rollback: re-aplicar seções 3-4 de 20260423_etapa3_schema.sql + 20260424_distribuicao_angulos.sql
--
-- IMPORTANTE: angulos_distribuicao tem FK → lista_distribuicao(id),
-- então deve ser dropada PRIMEIRO (ordem topológica child → parent).

DROP TABLE IF EXISTS angulos_distribuicao;
DROP TABLE IF EXISTS exclusoes_distribuicao;
DROP TABLE IF EXISTS lista_distribuicao;
