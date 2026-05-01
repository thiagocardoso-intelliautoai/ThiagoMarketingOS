# Story HISTORIA-003 — Eva Classifica Subpautas

**🏷️ ID:** `HISTORIA-003`
**📐 Estimativa:** 1.5h
**🔗 Épico:** [HISTORIA-EPIC](./HISTORIA-EPIC.md)
**🔗 Depende de:** [HISTORIA-001](./HISTORIA-001-criterio-narrativa-relevance.md) (critério), [HISTORIA-002](./HISTORIA-002-subagent-auto-classificacao.md) (subagent atualizado)
**🔗 Bloqueia:** HISTORIA-004
**👤 Executor:** @dev (Dex)
**🛡️ Quality Gate:** @po (Pax)
**📊 Status:** `InReview`

> ✅ **Desbloqueada:** HISTORIA-001 e HISTORIA-002 Done (2026-05-01).

---

## Story

**As a** sistema de geração de subpautas (squad `seed-pautas-centrais`, agente Eva),
**I want** classificar cada subpauta gerada com `narrativa-relevance` (🔴/🟡/⚫) no momento da criação,
**so that** o squad `pesquisa-conteudo-linkedin` receba subpautas já classificadas e possa decidir automaticamente se deve buscar história — sem precisar reclassificar na hora de criar o post.

---

## Contexto Técnico

O squad `seed-pautas-centrais` gera subpautas que alimentam o squad de posts. Atualmente, subpautas não têm campo `narrativa-relevance`. Após esta story:
1. O template de subpauta terá 2 novos campos
2. Eva lerá `criterio-narrativa-relevance.md` antes de classificar cada subpauta
3. A task `02-gerar-subpautas.md` terá um passo explícito de classificação
4. O veto bloqueará subpautas sem classificação

**5 arquivos a modificar:**
1. `aiox-squads/squads/seed-pautas-centrais/templates/subpauta-template.md`
2. `aiox-squads/squads/seed-pautas-centrais/tasks/02-gerar-subpautas.md`
3. `aiox-squads/squads/seed-pautas-centrais/tasks/01-inicializacao.md`
4. `aiox-squads/squads/seed-pautas-centrais/agents/estrategista.md`
5. `aiox-squads/squads/seed-pautas-centrais/squad.yaml`

---

## Acceptance Criteria

1. Toda nova subpauta gerada tem campos `narrativa-relevance` + `justificativa-narrativa`
2. Eva consulta `criterio-narrativa-relevance.md` antes de classificar (referenciado no context loading da task)
3. Distribuição em batch real é realista — não 100% 🔴 (critério conservador garante isso)
4. Veto condition bloqueia geração sem classificação — subpauta sem campo `narrativa-relevance` não passa
5. Justificativa é coerente com a classificação atribuída (pelo menos 1 linha explicativa)
6. `squad.yaml` referencia `criterio-narrativa-relevance.md` em `data:` com path correto

---

## Definition of Done

- [x] Todos os 5 arquivos atualizados
- [x] Teste manual: subpauta-template.md com campos `narrativa-relevance` + `justificativa-narrativa`
- [x] Validação: passo 3.5 instrui conservadorismo — alerta se 100% 🔴
- [x] Validação: justificativa-narrativa obrigatória em todos os arquivos (veto condition + quality criteria)

---

## Tasks / Subtasks

- [x] **Task 1 — `subpauta-template.md`** (AC: 1)
  - [x] 1.1 Adicionar campo `Narrativa-relevance:` com valores possíveis 🔴/🟡/⚫
  - [x] 1.2 Adicionar campo `Justificativa-narrativa:` (texto livre, 1-2 linhas)

- [x] **Task 2 — `tasks/02-gerar-subpautas.md`** (AC: 2, 3, 4, 5)
  - [x] 2.1 Adicionar `criterio-narrativa-relevance.md` ao Context Loading da task
  - [x] 2.2 Adicionar passo 3.5 "Classificar Narrativa-Relevance" entre os passos 3 e 4 atuais
  - [x] 2.3 Instruir Eva a aplicar os 4 sinais e registrar `justificativa-narrativa` com raciocínio
  - [x] 2.4 Adicionar veto condition: "subpauta sem campo `narrativa-relevance` → BLOQUEAR, classificar antes de prosseguir"
  - [x] 2.5 Adicionar quality criteria: "distribuição de níveis deve ser realista — alertar se 100% 🔴 em batch"

- [x] **Task 3 — `tasks/01-inicializacao.md`** (AC: 1, 2)
  - [x] 3.1 Mesmo tratamento da Task 2: adicionar critério ao context loading
  - [x] 3.2 Subpautas embrionárias geradas na inicialização também precisam ser classificadas

- [x] **Task 4 — `agents/estrategista.md`** (AC: 2)
  - [x] 4.1 Adicionar competência "Classificação de Narrativa-Relevance" ao perfil da Eva
  - [x] 4.2 Documentar que Eva usa `criterio-narrativa-relevance.md` como referência autoritativa

- [x] **Task 5 — `squad.yaml`** (AC: 6)
  - [x] 5.1 Adicionar `criterio-narrativa-relevance.md` à seção `data:` com path relativo correto: `../../../historia-thiago/criterio-narrativa-relevance.md`
  - [x] 5.2 Verificar que path relativo funciona a partir da pasta do squad

---

## Dev Notes

### Paths dos arquivos

```
aiox-squads/squads/seed-pautas-centrais/
├── templates/
│   └── subpauta-template.md          ← adicionar 2 campos
├── tasks/
│   ├── 01-inicializacao.md           ← adicionar classificação
│   └── 02-gerar-subpautas.md         ← passo 3.5 + veto + quality
├── agents/
│   └── estrategista.md               ← nova competência
└── squad.yaml                        ← data reference
```

### Path do critério (cross-squad)

O critério está em `historia-thiago/criterio-narrativa-relevance.md`.
A partir da raiz do projeto, o path é: `historia-thiago/criterio-narrativa-relevance.md`
A partir do squad: `../../../historia-thiago/criterio-narrativa-relevance.md`

### Passo 3.5 esperado em 02-gerar-subpautas.md

```markdown
### Passo 3.5 — Classificar Narrativa-Relevance

Para cada subpauta gerada no passo 3:
1. Ler `criterio-narrativa-relevance.md` (já no context loading)
2. Aplicar os 4 sinais à subpauta
3. Classificar: 🔴 ALTA / 🟡 MÉDIA / ⚫ NULA
4. Registrar no campo `Narrativa-relevance` do template
5. Escrever `Justificativa-narrativa` com 1-2 linhas de raciocínio

**Regra de conservadorismo:** Em caso de dúvida entre 🟡 e ⚫, classificar ⚫.

**VETO:** Subpauta sem `Narrativa-relevance` preenchido → BLOQUEADA. Classificar antes de finalizar.
```

### Campos no template de subpauta

```markdown
## Narrativa-relevance
**Nível:** 🔴 / 🟡 / ⚫
**Justificativa:** [1-2 linhas explicando a classificação]
```

### Teste manual esperado

Rodar `/z-seed-pautas-centrais` no Modo 2 (gerar batch de subpautas). Em um batch de 10 subpautas:
- Esperado: mix realista (ex: 3x🔴, 4x🟡, 3x⚫)
- Red flag: 10/10 classificadas como 🔴 → critério não está sendo aplicado conservadoramente

---

## 🤖 CodeRabbit Integration

**Primary Type:** Documentation / Agent Configuration
**Complexity:** Medium (5 arquivos interconectados)

**Quality Gate Tasks:**
- [ ] Pre-Commit: verificar paths relativos consistentes antes de marcar Done
- [ ] Revisão manual pelo @po: campos template, passo 3.5, veto condition

---

## Change Log

| Data | Versão | Descrição | Autor |
|------|--------|-----------|-------|
| 2026-04-30 | 1.0 | Story criada a partir do plano arquitetural HISTORIA | River (@sm) |
| 2026-05-01 | 1.1 | Implementação @dev: 5 arquivos atualizados — subpauta-template (2 campos novos), 02-gerar-subpautas (passo 3.5 + veto + quality), 01-inicializacao (passo 2.5 + veto + quality), estrategista.md (princípio 8 + always-do 5/6), squad.yaml (criterio em data). Status Blocked→InReview. | Dex (@dev) |
