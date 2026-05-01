# Task: Persistir no Supabase

> Step final do pipeline — Salvar pautas centrais e subpautas aprovadas no Supabase.

---

## Metadata
- **Step:** step-03-persistir (Modo 1) / step-05-persistir (Modo 2)
- **Agent:** —
- **Input:** `output/pautas-centrais.md` + `output/subpautas/seed-inicial.md` (ou subpautas-{data}.md)
- **Output:** registros inseridos/atualizados nas tabelas `pautas_centrais` e `subpautas`

---

## Execução

Após aprovação do checkpoint, rodar:

```bash
# Modo 1 — seed inicial (pautas + subpautas)
node aiox-squads/shared/scripts/save-pautas-cli.js

# Modo 2 — subpautas novas (usar --subpautas-file com o arquivo da rodada)
node aiox-squads/shared/scripts/save-pautas-cli.js \
  --subpautas-file aiox-squads/squads/seed-pautas-centrais/output/subpautas/subpautas-{data}.md
```

O CLI é idempotente — pode rodar múltiplas vezes sem duplicar dados (upsert via ON CONFLICT).

---

## Verificação

1. Output esperado: `✅ 4 pauta(s) + N subpauta(s) salvas no Supabase`
2. Abrir CCC → aba Pautas → verificar que as pautas e subpautas aparecem
3. Se aparecer erro de constraint: verificar se a migration `20260430_pautas_constraints.sql` foi aplicada

---

## Troubleshooting

| Erro | Causa | Solução |
|------|-------|---------|
| `duplicate key value violates unique constraint` | UNIQUE constraint não existe | Aplicar migration `20260430_pautas_constraints.sql` |
| `invalid input value for enum` | enum DB diferente do esperado | Verificar schema real em `20260423_etapa3_schema.sql` |
| `Arquivo não encontrado` | Path incorreto | Usar `--pautas-file` e `--subpautas-file` explícitos |
| `SUPABASE_URL not defined` | .env não encontrado | O CLI carrega de `squads/capas-linkedin/.env` — verificar se existe |
