# Task: Atualizar Lista de Distribuição

> Step 03 do pipeline — Adicionar candidatos aprovados à lista ativa.

---

## Metadata
- **Step:** step-03-atualizar-lista
- **Agent:** pesquisador-alvos (Paulo Prospector)
- **Input:** candidatos aprovados pelo Thiago
- **Output:** `output/lista-distribuicao.md` (atualizado)

---

## Context Loading

Carregar antes de executar:
- `output/lista-distribuicao.md` — Lista ativa atual
- `output/candidatos-pesquisados.md` — Candidatos aprovados no checkpoint
- `data/exclusions.md` — Para atualizar com nomes descartados

---

## Instruções

### 1. Receber Decisão do Thiago

Do checkpoint anterior, o Thiago terá:
- ✅ Aprovado candidatos (entram na lista)
- ❌ Descartado candidatos (entram nas exclusões com motivo)

### 2. Atualizar Lista Ativa

Adicionar candidatos aprovados a `output/lista-distribuicao.md`:

```
## [Nome]
- **Função:** [cargo/empresa]
- **Adicionado em:** [data]
- **Rede relevante:** [audiência]
- **Título-com-lente:** "[título formulado]"
- **Expectativa:** [comentário/repost]
- **Expande bolha:** [sim/não]
- **Status:** 🆕 Novo | 📋 Briefing gerado | 📝 Matéria em produção | ✔️ Publicada
```

### 3. Atualizar Exclusões

Adicionar candidatos descartados a `data/exclusions.md` na seção de nomes descartados, com motivo.

### 4. Exibir Resumo

```
📊 Lista atualizada:
- Total na lista: [N]
- Novos adicionados: [N]
- Descartados: [N]
- Bolha Winning: [N] ([%])
- Fora da bolha: [N] ([%])
```

---

## Veto Conditions

Rejeitar se:
1. ❌ Candidato adicionado sem aprovação explícita do Thiago
2. ❌ Candidato descartado sem motivo registrado

---

## Quality Criteria

- [ ] Lista atualizada com dados completos
- [ ] Exclusões atualizadas com motivo
- [ ] Resumo estatístico exibido
- [ ] Status de cada nome atualizado

---

## Próximo Passo

→ **step-04**: ⏸️ CHECKPOINT — Thiago confirma lista atualizada
