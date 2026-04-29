# Task: Persistir no Supabase

> Step final — após aprovação da matéria, atualizar status do ângulo no Supabase.

---

## Metadata
- **Step:** step-07-persistir (após step-06-aprovacao)
- **Agent:** redator-materia (Rita Redatora)
- **Input:** matéria aprovada + dados do ângulo usado
- **Output:** confirmação de persistência no Supabase

---

## Context Loading

Carregar antes de executar:
- `output/materia-{slug}-{angulo}.md` — Matéria aprovada
- Dados do input original (nome da pessoa, título do ângulo)

---

## Instruções

### 1. Atualizar Status do Ângulo

Após aprovação da matéria, o ângulo usado deve ter seu status atualizado de `novo` para `materia_em_producao`:

```bash
node aiox-squads/shared/scripts/save-distribuicao-cli.js \
  --update-status \
  --pessoa "NOME_DA_PESSOA" \
  --angulo-titulo "TITULO_DO_ANGULO" \
  --status materia_em_producao
```

### 2. Verificar Output

O CLI deve retornar:
```
✅ Status atualizado: materia_em_producao
```

### 3. Status Possíveis

| Status | Significado |
|--------|-------------|
| `novo` | Ângulo aprovado, não usado ainda |
| `briefing_gerado` | Briefing da matéria criado |
| `materia_em_producao` | Matéria sendo escrita/aprovada |
| `publicada` | Matéria publicada como carrossel |
| `descartado` | Ângulo descartado |

### 4. Quando Atualizar para Outros Status

- `publicada` → atualizar quando o carrossel for publicado no LinkedIn (squad carrosseis-linkedin)
- `descartado` → atualizar se o Thiago descartar o ângulo durante a produção

---

## Veto Conditions

Rejeitar se:
1. ❌ CLI não foi executado após aprovação do Thiago
2. ❌ Status atualizado sem aprovação prévia (step-06)

---

## Quality Criteria

- [ ] CLI executado com argumentos corretos
- [ ] Output confirma atualização de status
- [ ] Status no Supabase reflete o estado real do ângulo

---

## Próximo Passo

→ Matéria aprovada alimenta: `carrosseis-linkedin` (Editorial Clean)
