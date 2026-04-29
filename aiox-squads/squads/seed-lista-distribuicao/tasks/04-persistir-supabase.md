# Task: Persistir no Supabase

> Step final de ambos os modos — salvar pessoa + ângulos aprovados no banco de dados do Thiago Marketing OS.

---

## Metadata
- **Step:** step-05-persistir (após step-04-confirmacao)
- **Agent:** pesquisador-alvos (Paulo Prospector)
- **Input:** dados confirmados pelo Thiago no step-04
- **Output:** confirmação de persistência no Supabase

---

## Context Loading

Carregar antes de executar:
- `output/lista-distribuicao.md` — Lista ativa confirmada
- `output/candidatos-pesquisados.md` — Candidatos pesquisados (Modo 1)
- `output/angulos-aprofundados.md` — Ângulos aprofundados (Modo 2)

---

## Instruções

### 1. Identificar Modo de Operação

**Modo 1 — Pesquisa de Candidatos Novos:**
- Para cada candidato aprovado, rodar o CLI em modo `pesquisa`

**Modo 2 — Aprofundamento de Pessoa Existente:**
- Para a pessoa aprofundada, rodar o CLI em modo `aprofundamento`

### 2. Executar o CLI

**Modo 1 — Pesquisa (para cada pessoa nova aprovada):**
```bash
node aiox-squads/shared/scripts/save-distribuicao-cli.js \
  --nome "NOME_DA_PESSOA" \
  --file aiox-squads/squads/seed-lista-distribuicao/output/candidatos-pesquisados.md \
  --mode pesquisa \
  --funcao "CARGO_EMPRESA" \
  --rede-relevante "DESCRICAO_REDE" \
  --expande-bolha \
  --expectativa-comentario "provavel|possivel|incerto" \
  --expectativa-repost "provavel|possivel|incerto"
```

**Modo 2 — Aprofundamento (para pessoa existente):**
```bash
node aiox-squads/shared/scripts/save-distribuicao-cli.js \
  --nome "NOME_DA_PESSOA" \
  --file aiox-squads/squads/seed-lista-distribuicao/output/angulos-aprofundados.md \
  --mode aprofundamento \
  --expectativa-comentario "provavel|possivel|incerto" \
  --expectativa-repost "provavel|possivel|incerto"
```

### 3. Verificar Output

O CLI deve retornar:
```
✅ NOME — N ângulo(s) salvo(s) no Supabase
```

Se houver duplicatas (ângulos já existentes), o CLI as ignora automaticamente e reporta:
```
⚠️ N ângulo(s) ignorado(s) (duplicata ou erro)
```

### 4. Confirmar na Plataforma

Após rodar o CLI, verificar que os dados aparecem na plataforma:
- URL: https://thiagomarketingos.vercel.app/ → aba Distribuição
- A pessoa deve aparecer com os ângulos aprovados

---

## Veto Conditions

Rejeitar se:
1. ❌ CLI não foi executado após confirmação do Thiago
2. ❌ Ângulo salvo sem confirmação prévia (step-04)
3. ❌ Erro no CLI não tratado (reportar e investigar)

---

## Quality Criteria

- [ ] CLI executado com argumentos corretos para o modo
- [ ] Output do CLI mostra ângulos salvos com sucesso
- [ ] Sem erros fatais no output
- [ ] Dados visíveis na plataforma (se online)

---

## Próximo Passo

→ Pipeline concluído. Ângulos disponíveis para consumo pelo squad `z-criar-materia-colab`.
