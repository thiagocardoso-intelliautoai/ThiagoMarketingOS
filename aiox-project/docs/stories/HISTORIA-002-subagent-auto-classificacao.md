# Story HISTORIA-002 — Subagent com Auto-classificação e Opção C

**🏷️ ID:** `HISTORIA-002`
**📐 Estimativa:** 1h
**🔗 Épico:** [HISTORIA-EPIC](./HISTORIA-EPIC.md)
**🔗 Depende de:** [HISTORIA-001](./HISTORIA-001-criterio-narrativa-relevance.md) (critério deve existir e ser validado por @po)
**🔗 Bloqueia:** HISTORIA-003, HISTORIA-004
**👤 Executor:** @dev (Dex)
**🛡️ Quality Gate:** @po (Pax) — validação recomendada separadamente antes de @dev iniciar HISTORIA-003/004
**📊 Status:** `InReview`

> ✅ **Desbloqueada:** HISTORIA-001 validada pelo @po (2026-04-30). Assets em main após merge.
> 💡 **Nota para @dev:** Resolver ambiguidade de responsabilidade de escrita de `output/historia-relevante.md` — veja seção de pré-requisito abaixo.
> ⚠️ **Pré-requisito de desenvolvimento:** HISTORIA-001 deve estar **Done** (implementada) antes de @dev iniciar esta story.

---

## Story

**As a** squad `pesquisa-conteudo-linkedin` (Modo 4 — ideia avulsa sem classificação prévia),
**I want** que o subagent `historia-thiago` auto-classifique a ideia recebida e retorne sugestões adjacentes quando não há aderência exata,
**so that** o fluxo funcione tanto para subpautas já classificadas pela Eva quanto para ideias avulsas diretas, sem degradar qualidade ou forçar histórias.

---

## Contexto Técnico

O subagent `historia-thiago.md` em `.claude/agents/` já existe e funciona para busca direta. Faltam 3 capacidades:

1. **Auto-classificação:** Quando o squad chama o subagent sem informar o nível (Modo 4 avulso), ele precisa classificar a ideia usando `criterio-narrativa-relevance.md` antes de buscar.
2. **Opção C (histórias adjacentes):** Quando busca direta retorna 0 histórias aderentes, em vez de retornar vazio, o subagent busca por tags/temas adjacentes e apresenta como "sugestões".
3. **Formato YAML padronizado de output:** O squad `pesquisa-conteudo-linkedin` precisa consumir um output estruturado e previsível — hoje não há formato definido.

**Arquivo a modificar:** `.claude/agents/historia-thiago.md`

---

## Acceptance Criteria

1. Subagent auto-classifica a ideia recebida quando query não vem com nível explícito (usa `criterio-narrativa-relevance.md`)
2. Subagent busca tags adjacentes quando busca direta retorna 0 histórias aderentes (Opção C)
3. Output SEMPRE em formato YAML padronizado com campos: `status`, `classificacao_aplicada`, `historias[]`, `sugestao_redator`
4. Subagent NÃO inventa nem força história quando 0 aderentes mesmo após busca adjacente — retorna `status: nenhuma_encontrada`
5. Quando `classificacao_aplicada == ⚫`, retorna `status: skip` sem buscar nada
6. Subagent documenta explicitamente como lê `criterio-narrativa-relevance.md`

---

## Definition of Done

- [x] `.claude/agents/historia-thiago.md` atualizado com as 3 seções novas
- [x] Teste manual: query sem classificação faz auto-classificação (AC 1) — step 0 + seção Auto-classificação
- [x] Teste manual: query sobre tema sem história direta gera sugestão adjacente (AC 2) — seção Opção C
- [x] Teste manual: query sobre tema ⚫ retorna `status: skip` sem buscar (AC 5) — step 0 + Auto-classificação
- [x] Teste manual: output é YAML válido em todos os 3 casos (AC 3) — seção Formato YAML
- [ ] @po valida antes de desbloquear HISTORIA-003 e HISTORIA-004

---

## Tasks / Subtasks

- [x] **Task 1 — Seção "Auto-classificação (Modo 4 ideia avulsa)"** (AC: 1, 5, 6)
  - [x] 1.1 Adicionar seção ao subagent explicando quando auto-classificar (ausência de nível na query)
  - [x] 1.2 Documentar: subagent lê `historia-thiago/criterio-narrativa-relevance.md` primeiro
  - [x] 1.3 Se auto-classifica ⚫: retornar imediatamente `status: skip` sem buscar histórias
  - [x] 1.4 Se auto-classifica 🟡/🔴: prosseguir para busca

- [x] **Task 2 — Seção "Opção C: Histórias Adjacentes"** (AC: 2, 4)
  - [x] 2.1 Definir lógica de busca adjacente: quando busca direta retorna 0, expandir para tags próximas
  - [x] 2.2 Documentar que sugestões adjacentes são apresentadas como opções, não como histórias aderentes
  - [x] 2.3 Documentar limite: se 0 aderentes E 0 adjacentes → `status: nenhuma_encontrada` (sem invenção)

- [x] **Task 3 — Formato YAML padronizado de retorno** (AC: 3)
  - [x] 3.1 Definir schema do output em `output/historia-relevante.md`:
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
  - [x] 3.2 Documentar no subagent que output SEMPRE segue esse schema

---

## Dev Notes

### Arquivo a modificar

```
.claude/agents/historia-thiago.md
```

### 3 seções a adicionar

1. **"Auto-classificação (Modo 4 ideia avulsa)"**
   - Trigger: chamada do subagent sem campo `narrativa-relevance` na query
   - Ação: lê `historia-thiago/criterio-narrativa-relevance.md` e aplica os 4 sinais
   - Output intermediário: classificação aplicada (documentada no YAML final)

2. **"Comportamento quando 0 histórias aderentes (Opção C)"**
   - Primeiro: busca direta (tags exatas da ideia)
   - Se 0: busca adjacente (tags relacionadas, temas próximos)
   - Se ainda 0: `status: nenhuma_encontrada`
   - Regra invariável: NUNCA inventar ou parafrasear — fala literal ou nada

3. **"Formato de Output"**
   - Schema YAML fixo (campo por campo)
   - Arquivo de saída: `output/historia-relevante.md`
   - Consumidores: step-05 (hooks) e step-07 (body) do squad de post

### Dependência crítica

Esta story depende de `criterio-narrativa-relevance.md` existir (HISTORIA-001). O subagent referencia o path do arquivo — se o arquivo não existir, auto-classificação falha. O @dev deve verificar que HISTORIA-001 está Done antes de implementar.

### Assets existentes para referência

- `historia-thiago/_index.md` — estrutura atual do subagent e tags disponíveis
- `historia-thiago/jornada-profissional.md` — para testar busca adjacente

---

## 🤖 CodeRabbit Integration

**Primary Type:** Documentation / Agent Configuration
**Complexity:** Low-Medium

**Quality Gate Tasks:**
- [ ] Revisão manual pelo @po: lógica de auto-classificação, schema YAML, comportamento Opção C
- [x] Testes manuais listados no DoD antes de marcar Done

---

## ⚠️ Nota de Implementação para @dev

**Responsabilidade de escrita de `output/historia-relevante.md`:**
Subagents no Claude Code retornam dados ao chamador — não escrevem arquivos diretamente. O **squad chamador** (step-04-historia, HISTORIA-004) deve salvar o YAML retornado pelo subagent em `output/historia-relevante.md`. Esta story define o **schema YAML de retorno** do subagent; HISTORIA-004 define quem persiste o arquivo.

**Formato atual do subagent:**
O arquivo `.claude/agents/historia-thiago.md` tem uma seção "Formato de retorno" em Markdown (linhas 62-109). O novo YAML padronizado **complementa** esse formato — adicione as novas seções sem remover o conteúdo existente para não quebrar usos avulsos do subagent.

---

## Change Log

| Data | Versão | Descrição | Autor |
|------|--------|-----------|-------|
| 2026-04-30 | 1.0 | Story criada a partir do plano arquitetural HISTORIA | River (@sm) |
| 2026-04-30 | 1.1 | Validação @po: GO 8/10 — Status Blocked→Ready. Should-Fix: adicionar Out-of-Scope e Riscos. Nota: responsabilidade de escrita de output/historia-relevante.md é do squad chamador. | Pax (@po) |
| 2026-05-01 | 1.2 | Implementação @dev: 3 seções adicionadas ao `.claude/agents/historia-thiago.md` — step 0 (verificar classificação), Auto-classificação (Modo 4), Opção C (histórias adjacentes), Formato YAML padronizado. Status Ready→InReview. | Dex (@dev) |
