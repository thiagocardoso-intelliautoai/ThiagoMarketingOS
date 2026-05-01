# Story HISTORIA-004 — Step-04-Historia no Squad de Post

**🏷️ ID:** `HISTORIA-004`
**📐 Estimativa:** 3h
**🔗 Épico:** [HISTORIA-EPIC](./HISTORIA-EPIC.md)
**🔗 Depende de:** [HISTORIA-001](./HISTORIA-001-criterio-narrativa-relevance.md), [HISTORIA-002](./HISTORIA-002-subagent-auto-classificacao.md), [HISTORIA-003](./HISTORIA-003-eva-classifica-subpautas.md)
**🔗 Bloqueia:** Nenhuma (story final do épico)
**👤 Executor:** @dev (Dex)
**🛡️ Quality Gate:** @po (Pax) + @qa (Quinn)
**📊 Status:** `Blocked`

> 🔴 **Bloqueada por:** HISTORIA-001, HISTORIA-002 e HISTORIA-003 devem estar Done e validadas.

---

## Story

**As a** squad `pesquisa-conteudo-linkedin` (Modos 1, 2, 3 e 4),
**I want** um novo `step-04-historia` que busca história relevante antes dos hooks e um Redator que consome essa história nos hooks (step-05) e no post final (step-07),
**so that** posts gerados com temas narrativos contenham fala literal autêntica do Thiago, enquanto posts técnicos/factuais seguem sem alteração.

---

## Contexto Técnico

Esta é a story de maior escopo do épico: adiciona 1 arquivo novo e modifica 5 existentes no squad `pesquisa-conteudo-linkedin`, além de atualizar o slash command. Após esta story, o pipeline v2.1 estará completo.

**Pipeline v2.1:**
```
Modo 3: step-00 → step-01-briefing → step-02 → [NOVO] step-04-historia → step-05 → step-06 → step-07 → step-09
Modo 4: step-00 → step-02 → [NOVO] step-04-historia → step-05 → step-06 → step-07 → step-09
```

**6 arquivos a criar/modificar:**
1. ✨ NOVO: `aiox-squads/squads/pesquisa-conteudo-linkedin/tasks/04-buscar-historia.md`
2. 🔧 MODIFICAR: `aiox-squads/squads/pesquisa-conteudo-linkedin/workflows/workflow.yaml`
3. 🔧 MODIFICAR: `aiox-squads/squads/pesquisa-conteudo-linkedin/tasks/05-criacao-hooks.md`
4. 🔧 MODIFICAR: `aiox-squads/squads/pesquisa-conteudo-linkedin/tasks/07-estruturacao-post.md`
5. 🔧 MODIFICAR: `aiox-squads/squads/pesquisa-conteudo-linkedin/squad.yaml`
6. 🔧 MODIFICAR: `.claude/commands/z-pesquisa-conteudo-linkedin.md`

---

## Acceptance Criteria

1. `step-04-historia` executa em todos os modos (1, 2, 3, 4) — inserido no workflow entre step-02 e step-05
2. Skip automático quando classificação é ⚫ nula — pipeline continua sem chamar subagent
3. Bloqueio funcional quando 🔴 + 0 histórias + Modo 4 — apresenta mensagem e volta ao step-02
4. Hooks gerados em step-05 marcam explicitamente qual hook usa qual história (ex: "Hook 2 usa fala da história #jornada-profissional-12")
5. Body em step-07 contém fala literal em aspas/blockquote (verificável por grep por `"` ou `>`)
6. Veto conditions ativadas quando regras violadas (paráfrase em vez de literal, mais de 3 histórias retornadas sem filtro)
7. `squad.yaml` registra nova task `buscar-historia` e subagent externo `historia-thiago` com path
8. Slash command `z-pesquisa-conteudo-linkedin.md` atualizado com contagem correta de steps (7→8 para modos 1/2/3; 6→7 para modo 4)

---

## Definition of Done

- [ ] Todos os 6 arquivos criados/atualizados
- [ ] **Teste 1:** Modo 3 com tema 🔴 → fluxo completo, fala literal no post final
- [ ] **Teste 2:** Modo 3 com tema ⚫ → skip automático do subagent, fluxo segue normalmente
- [ ] **Teste 3:** Modo 4 com ideia avulsa sem classificação → auto-classificação + busca
- [ ] **Teste 4:** Modo 4 + classificação 🔴 + 0 histórias → bloqueio com retorno ao step-02
- [ ] **Teste 5:** Apenas histórias adjacentes disponíveis → sugestão apresentada no step-06 para Thiago decidir
- [ ] Score de qualidade do post final ≥ 80% (qualidade existente preservada — não pode degradar)

---

## Tasks / Subtasks

- [ ] **Task 1 — NOVO `04-buscar-historia.md`** (AC: 1, 2, 3, 6)
  - [ ] 1.1 Estruturar pré-condição: verificar campo `narrativa-relevance` na ideia recebida
  - [ ] 1.2 Se sem classificação (Modo 4 avulso): invocar subagent para auto-classificar primeiro
  - [ ] 1.3 Se ⚫: output "não-narrativa", seguir sem invocar subagent para busca
  - [ ] 1.4 Se 🟡/🔴: invocar subagent via Task tool com ideia + nível
  - [ ] 1.5 Tratar Caso A (1+ histórias aderentes): salvar em `output/historia-relevante.md`, sinalizar para step-05/07
  - [ ] 1.6 Tratar Caso B (0 aderentes, N adjacentes — Opção C): apresentar sugestões no step-06 para decisão do Thiago
  - [ ] 1.7 Tratar Caso C (0 nada): Modo 3 → aviso e segue; Modo 4 + 🔴 → BLOQUEIA, mensagem de retorno ao step-02
  - [ ] 1.8 Definir veto conditions: paráfrase em vez de literal, mais de 3 histórias no output sem ranqueamento

- [ ] **Task 2 — `workflow.yaml`** (AC: 1, 3)
  - [ ] 2.1 Inserir step-04-historia entre step-02 e step-05 em todos os modos
  - [ ] 2.2 Configurar `on_block` para Modo 4 + 🔴 + 0 histórias → retorno ao step-02
  - [ ] 2.3 Atualizar comentário de resumo dos modos com novo step

- [ ] **Task 3 — `05-criacao-hooks.md`** (AC: 4)
  - [ ] 3.1 Adicionar ao Step 1: leitura de `output/historia-relevante.md` além da ideia
  - [ ] 3.2 Adicionar regra: quando há história disponível, ≥1 dos 3 hooks DEVE usar fala literal
  - [ ] 3.3 Adicionar marcação obrigatória ao final de cada hook: "✓ usa fala de: [origem]" ou "✓ sem história"

- [ ] **Task 4 — `07-estruturacao-post.md`** (AC: 5, 6)
  - [ ] 4.1 Adicionar ao Step 1: leitura de `output/historia-relevante.md` + hook escolhido
  - [ ] 4.2 Adicionar passo 2.5 "Decidir uso da história no body": matriz framework × uso
  - [ ] 4.3 Adicionar veto #7: se história foi recebida, post final sem nenhuma fala literal → BLOQUEAR

- [ ] **Task 5 — `squad.yaml`** (AC: 7)
  - [ ] 5.1 Registrar nova task `buscar-historia` na seção de tasks
  - [ ] 5.2 Registrar subagent externo `historia-thiago` com path `.claude/agents/historia-thiago.md`

- [ ] **Task 6 — `.claude/commands/z-pesquisa-conteudo-linkedin.md`** (AC: 8)
  - [ ] 6.1 Atualizar tabela de Modo 3 com novo step-04-historia (step count: 7→8)
  - [ ] 6.2 Atualizar tabela de Modo 4 com novo step-04-historia (step count: 6→7)
  - [ ] 6.3 Atualizar descrição de ambos os modos com explicação do novo step

---

## Dev Notes

### Estrutura do `04-buscar-historia.md` (novo arquivo)

```markdown
# Task 04-buscar-historia — Buscar História Relevante

## Pré-condição
Receber ideia-aprovada do step-02 (com OU sem campo narrativa-relevance).

## Lógica de execução

### Se narrativa-relevance == ⚫ nula:
→ Output: `{status: "skip"}` em output/historia-relevante.md
→ Prosseguir para step-05 sem invocar subagent

### Se sem classificação (Modo 4 avulso):
→ Invocar historia-thiago para auto-classificar
→ Se auto-classificou ⚫: output skip
→ Se 🟡/🔴: continuar para busca

### Se 🔴/🟡:
→ Invocar historia-thiago via Task tool com {ideia, nivel}
→ Tratar retorno conforme 3 casos abaixo

## Casos de retorno

**Caso A — 1+ histórias aderentes:**
- Salvar em output/historia-relevante.md (formato YAML padrão)
- Sinalizar step-05 e step-07: "história disponível"

**Caso B — 0 aderentes, N adjacentes:**
- Registrar sugestões em output/historia-relevante.md com status: "adjacente"
- No step-06: apresentar para Thiago decidir (não bloqueia)

**Caso C — 0 nada:**
- Modo 3 → output skip com aviso, segue
- Modo 4 + 🔴 → BLOQUEAR; mensagem: "Tema classificado como 🔴 mas sem histórias aderentes. Reclassifique como 🟡 ou escolha outro ângulo. Retornando ao step-02."

## Veto conditions
- VETO: output contém paráfrase em vez de fala literal → exigir literal ou skip
- VETO: output lista >3 histórias sem ranqueamento → exigir top 3 com score de aderência
```

### Matriz framework × uso (para step-07)

| Framework do post | Como usar a história |
|-------------------|---------------------|
| Storytelling | História é o corpo principal — fala literal abre o post |
| PAS (Problem-Agitate-Solution) | Fala literal na seção "Agitate" — âncora emocional |
| STAR | Fala literal em "Situation" ou "Result" |
| Lista | Fala literal como item de abertura ou fechamento |
| Factual | Sem história obrigatória (se ⚫, omitir) |

### File list completo

```
aiox-squads/squads/pesquisa-conteudo-linkedin/
├── tasks/
│   ├── 04-buscar-historia.md         ← NOVO
│   ├── 05-criacao-hooks.md           ← modificar
│   └── 07-estruturacao-post.md       ← modificar
├── workflows/
│   └── workflow.yaml                 ← modificar
└── squad.yaml                        ← modificar

.claude/commands/
└── z-pesquisa-conteudo-linkedin.md   ← modificar
```

### Path do subagent

```
.claude/agents/historia-thiago.md
```

Invocar via Task tool (não incluir inline no contexto do squad — isolamento é proposital, ~3-5k tokens por execução vs ~30-50k inline).

### Degradação graceful

Se step-04-historia falhar por qualquer motivo (subagent indisponível, timeout), o squad deve **degradar gracefully** para o fluxo atual (sem história), não bloquear. A história é enrichment, não dependência obrigatória — exceto Modo 4 + 🔴 que é bloqueio intencional.

---

## 🤖 CodeRabbit Integration

**Primary Type:** Documentation / Agent Configuration
**Complexity:** High (6 arquivos, lógica de fluxo, veto conditions)

**Quality Gate Tasks:**
- [ ] Pre-Commit: verificar consistência entre workflow.yaml e tasks (step order)
- [ ] Revisão manual pelo @po: lógica do step-04, veto conditions, degradação graceful
- [ ] @qa valida todos os 5 testes do DoD antes de marcar Done

---

## Change Log

| Data | Versão | Descrição | Autor |
|------|--------|-----------|-------|
| 2026-04-30 | 1.0 | Story criada a partir do plano arquitetural HISTORIA | River (@sm) |
