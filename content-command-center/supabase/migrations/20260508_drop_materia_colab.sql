-- REFAC-001: Demolição Seletiva — remover tabelas de matéria-colab
-- Rollback: re-executar seções 3 e 4 de 20260423_etapa3_schema.sql
-- Nota: tabelas nunca chegaram ao banco remoto (etapa3 não foi aplicada remotamente).
--       Este DROP é idempotente (IF EXISTS) — no-op se tabelas não existirem.

DROP TABLE IF EXISTS exclusoes_distribuicao;
DROP TABLE IF EXISTS lista_distribuicao;
