# Task: Atualizar Lista de Distribuição

> Step 03 do pipeline principal — Adicionar candidatos aprovados à lista ativa.
> Também usado pelo fluxo de aprofundamento (step-A2 → task 02) para adicionar ângulos novos a pessoas existentes.

---

## Metadata
- **Step:** step-03-atualizar-lista (pipeline principal) / pós-step-A2 (fluxo aprofundamento)
- **Agent:** pesquisador-alvos (Paulo Prospector)
- **Input:** candidatos/ângulos aprovados pelo Thiago
- **Output:** `output/lista-distribuicao.md` (atualizado)

---

## Context Loading

Carregar antes de executar:
- `output/lista-distribuicao.md` — Lista ativa atual
- `output/candidatos-pesquisados.md` — Candidatos aprovados no checkpoint (modo pesquisa)
- `output/angulos-aprofundados.md` — Ângulos aprovados no checkpoint (modo aprofundamento)
- `data/exclusions.md` — Para atualizar com nomes descartados

---

## Instruções

### 1. Identificar Modo de Operação

**Modo A — Pesquisa de Candidatos Novos** (vindo do step-02):
- O Thiago aprovou candidatos inteiros (com todos os seus ângulos ou seleção de ângulos)
- Adicionar pessoa nova à lista com seus ângulos aprovados

**Modo B — Aprofundamento de Pessoa Existente** (vindo do step-A2):
- O Thiago aprovou ângulos novos para pessoa que já está na lista
- Adicionar ângulos novos à ficha da pessoa existente (sem duplicar os que já estavam)

### 2. Receber Decisão do Thiago

Do checkpoint anterior, o Thiago terá:
- ✅ Aprovado candidatos/ângulos (entram na lista)
- ❌ Descartado candidatos/ângulos (candidatos descartados entram nas exclusões com motivo; ângulos descartados são apenas ignorados)

### 3. Atualizar Lista Ativa

#### Modo A — Pessoa Nova

Adicionar candidatos aprovados a `output/lista-distribuicao.md`:

```
## [Nome]
- **Função:** [cargo/empresa]
- **Adicionado em:** [data]
- **Rede relevante:** [audiência]
- **Expectativa de engajamento:** (atributo da pessoa)
  - Comentário: [provável / possível / incerto]
  - Repost: [provável / possível / incerto]
- **Expande bolha:** [sim/não]
- **Ângulos:**
  1. [Arquétipo] — "[título pela lente]" — Status: 🆕 Novo
  2. [Arquétipo] — "[título pela lente]" — Status: 🆕 Novo
```

#### Modo B — Ângulos Novos em Pessoa Existente

Adicionar ângulos aprovados à ficha da pessoa que já está na lista:

```
- **Ângulos:**
  1. [Arquétipo] — "[título existente]" — Status: 📋 Briefing gerado  ← já estava
  2. [Arquétipo] — "[título existente]" — Status: 🆕 Novo             ← já estava
  3. [Arquétipo] — "[título NOVO]" — Status: 🆕 Novo                  ← adicionado agora
  4. [Arquétipo] — "[título NOVO]" — Status: 🆕 Novo                  ← adicionado agora
```

**Legenda de status por ângulo:**
- 🆕 Novo — ângulo aprovado, não usado ainda
- 📋 Briefing gerado — briefing da matéria criado
- 📝 Matéria em produção — matéria sendo escrita
- ✔️ Publicada — matéria publicada

### 4. Atualizar Exclusões

Adicionar candidatos descartados (Modo A) a `data/exclusions.md` na seção de nomes descartados, com motivo.

**Nota:** Ângulos descartados no aprofundamento (Modo B) não entram em exclusões — exclusão é nível pessoa, não nível ângulo.

### 5. Exibir Resumo

```
📊 Lista atualizada:
- Modo: [Pesquisa de candidatos / Aprofundamento de pessoa]
- Total de pessoas na lista: [N]
- Novos adicionados: [N pessoas] (Modo A) / [N ângulos novos pra [nome]] (Modo B)
- Descartados: [N]
- Bolha Winning: [N] ([%])
- Fora da bolha: [N] ([%])
- Total de ângulos na lista: [N]
```

---

## Veto Conditions

Rejeitar se:
1. ❌ Candidato/ângulo adicionado sem aprovação explícita do Thiago
2. ❌ Candidato descartado sem motivo registrado (Modo A)
3. ❌ Ângulo duplicado adicionado (já existia na ficha da pessoa)

---

## Quality Criteria

- [ ] Lista atualizada com dados completos
- [ ] Cada pessoa tem pelo menos 1 ângulo com status
- [ ] Exclusões atualizadas com motivo (Modo A)
- [ ] Resumo estatístico exibido
- [ ] Status de cada ângulo atualizado
- [ ] Sem duplicatas de ângulos na ficha de nenhuma pessoa

---

## Próximo Passo

→ **step-04**: ⏸️ CHECKPOINT — Thiago confirma lista atualizada
