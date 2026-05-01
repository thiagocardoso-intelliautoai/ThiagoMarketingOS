# Task: Buscar História Relevante

> Step 04 do pipeline — Verifica narrativa-relevance e busca história autêntica do Thiago via subagent quando aplicável.

---

## Metadata
- **Step:** step-04-historia
- **Subagent:** `historia-thiago` (invocado via Task tool, isolamento proposital)
- **Input:** `ideia-aprovada` do step-02 (com OU sem campo `narrativa-relevance`)
- **Output:** `output/historia-relevante.md` (formato YAML padronizado)

---

## Context Loading

Carregar antes de executar:
- `data/linkedin-strategy.md` — Contexto de fontes de tese e ICP
- Path de referência do critério: `../../../historia-thiago/criterio-narrativa-relevance.md` (subagent o lê internamente)

---

## Pré-condição

Receber `ideia-aprovada` do step-02. Pode vir com ou sem campo `narrativa-relevance`:
- **Modo 3 (briefing):** subpauta vem da Eva já classificada (HISTORIA-003)
- **Modo 4 (avulso):** ideia pode chegar sem classificação — auto-classificação obrigatória

---

## Lógica de Execução

### Caminho 1 — Ideia tem `narrativa-relevance: ⚫` (NULA)

```
→ Output em output/historia-relevante.md:
  status: skip
  classificacao_aplicada: "⚫"
  historias: []
  sugestao_redator: "Tema factual/tutorial — post sem âncora narrativa"

→ Prosseguir direto para step-05 sem invocar subagent
```

### Caminho 2 — Ideia SEM `narrativa-relevance` (Modo 4 avulso)

```
→ Invocar historia-thiago via Task tool com query: {ideia, modo: "auto-classificar"}
→ Subagent lê criterio-narrativa-relevance.md, aplica os 4 sinais, retorna YAML

  Se subagent retornou status: skip (auto-classificou ⚫):
    → Prosseguir para step-05 sem busca
  Se subagent retornou status: encontrada / adjacente / nenhuma_encontrada:
    → Tratar conforme casos abaixo
```

### Caminho 3 — Ideia tem `narrativa-relevance: 🔴` ou `🟡`

```
→ Invocar historia-thiago via Task tool com {ideia, narrativa-relevance: <nível>}
→ Subagent busca direta + Opção C (adjacente) e retorna YAML
→ Tratar conforme casos abaixo
```

---

## Casos de Retorno do Subagent

### Caso A — `status: encontrada` (1+ histórias diretas)

```yaml
status: encontrada
classificacao_aplicada: "🔴" | "🟡"
historias:
  - titulo: "..."
    fala_literal: "..."
    contexto: "..."
    tags: [...]
    aderencia: direta
sugestao_redator: "Use a fala literal no hook 1 — emoção alta"
```

**Ação:** salvar em `output/historia-relevante.md`. Sinalizar step-05 e step-07: "história disponível com aderência direta".

### Caso B — `status: adjacente` (0 diretas, N adjacentes — Opção C)

```yaml
status: adjacente
classificacao_aplicada: "🔴" | "🟡"
historias:
  - titulo: "..."
    fala_literal: "..."
    aderencia: adjacente
sugestao_redator: "Sugestão adjacente — Thiago decide se aceita no checkpoint do hook (step-06)"
```

**Ação:** salvar em `output/historia-relevante.md`. No step-06 (checkpoint do hook), apresentar para Thiago decidir entre usar a sugestão adjacente OU pedir hook sem história.

### Caso C — `status: nenhuma_encontrada` (0 diretas + 0 adjacentes)

**Ação depende do modo:**

| Modo | Classificação | Ação |
|------|--------------|------|
| 3 (briefing) | 🔴 ou 🟡 | Salvar `nenhuma_encontrada`, avisar Thiago, **seguir para step-05** sem história |
| 4 (avulso) | 🟡 | Salvar `nenhuma_encontrada`, **seguir para step-05** sem história |
| 4 (avulso) | 🔴 | **BLOQUEAR pipeline** — retorno ao step-02 |

**Mensagem de bloqueio (Modo 4 + 🔴 + 0 histórias):**
```
🔴 Tema classificado como ALTA mas sem histórias aderentes (nem diretas nem adjacentes).

Opções:
1. Reclassificar como 🟡 e seguir sem história (post de insight, não storytelling)
2. Escolher outro ângulo que tenha história disponível
3. Adicionar nova história à base historia-thiago/ antes de prosseguir

Retornando ao step-02 para nova decisão.
```

---

## Veto Conditions

Rejeitar e refazer (ou bloquear) se:

1. ❌ Output do subagent contém **paráfrase em vez de fala literal** — exigir citação literal ou skip
2. ❌ Output lista **>3 histórias sem ranqueamento** — exigir top 3 com score de aderência
3. ❌ `historia-relevante.md` não foi gerado (subagent retornou erro ou timeout) — degradar gracefully (Caminho 1: status skip)
4. ❌ Hook embrionário tem 🔴 mas `historias` array está vazio com `status: encontrada` — incoerência

---

## Output Format

`output/historia-relevante.md` (formato YAML padronizado, vindo direto do subagent):

```yaml
status: encontrada | adjacente | nenhuma_encontrada | skip
classificacao_aplicada: "🔴" | "🟡" | "⚫"
historias:
  - titulo: "..."
    fala_literal: "..."
    contexto: "..."
    tags: [...]
    aderencia: direta | adjacente
sugestao_redator: "..."
```

**Quem persiste o arquivo:** ESTA task (step-04). O subagent apenas **retorna os dados** — esta task escreve no disco.

---

## Degradação Graceful

Se step-04-historia falhar por qualquer motivo (subagent indisponível, timeout, erro inesperado):
- Salvar `output/historia-relevante.md` com `status: skip` e log do erro em `sugestao_redator`
- Prosseguir para step-05 normalmente
- **Exceção:** Modo 4 + 🔴 + falha técnica → ainda BLOQUEAR (não degrada o requisito de qualidade do storytelling)

História é **enrichment**, não dependência obrigatória — exceto Modo 4 + 🔴 que é bloqueio intencional.

---

## Quality Criteria

- [ ] Output YAML válido e completo (todos os 4 campos do schema)
- [ ] `status` reflete corretamente o resultado (encontrada/adjacente/nenhuma_encontrada/skip)
- [ ] Em casos `encontrada` ou `adjacente`: `historias` tem ≥1 item com fala literal preservada
- [ ] Em casos `nenhuma_encontrada` ou `skip`: `historias` é `[]`
- [ ] `sugestao_redator` é coerente com o status e nível

---

## Próximo Passo

→ **step-05**: Criação de Hooks (consome `output/historia-relevante.md` se houver história)

**Exceção:** Modo 4 + 🔴 + `nenhuma_encontrada` → **return_to: step-02** (bloqueio funcional)
