# Story HISTORIA-001 — Critério de Narrativa-Relevance (Foundation)

**🏷️ ID:** `HISTORIA-001`
**📐 Estimativa:** 0.5h (documento estruturado, sem código)
**🔗 Épico:** [HISTORIA-EPIC](./HISTORIA-EPIC.md)
**🔗 Depende de:** Nenhuma (foundation story)
**🔗 Bloqueia:** HISTORIA-002, HISTORIA-003
**👤 Executor:** @dev (Dex)
**🛡️ Quality Gate:** @po (Pax) — validação obrigatória antes de desbloquear dependentes
**📊 Status:** `InProgress`
**📋 Origem:** [HISTORIA-thiago-integration.md](../architecture/HISTORIA-thiago-integration.md) — aprovado pela Aria (Architect)

> ⚠️ **Foundation Story:** Erro aqui contamina HISTORIA-002, HISTORIA-003 e HISTORIA-004. @po deve validar esta story separadamente antes de @dev iniciar qualquer dependente.

---

## Story

**As a** squad de conteúdo (Eva no `seed-pautas-centrais` e pipelines em `pesquisa-conteudo-linkedin`),
**I want** um documento único e autoritativo de critério de narrativa-relevance,
**so that** a classificação de quando buscar uma história do Thiago seja objetiva, conservadora e reproduzível por qualquer agente.

---

## Contexto Técnico

O subagent `historia-thiago` já existe em `.claude/agents/historia-thiago.md` com 60+ histórias catalogadas. O problema é: **quando** invocar o subagent? Sem critério explícito:
- Eva pode forçar classificação 🔴 em subpautas técnicas/factuais → degrada qualidade
- O subagent pode ser chamado em temas sem aderência real → desperdício de tokens + histórias forçadas

Este documento é o **single source of truth** para todos os agentes e squads que precisam decidir se devem buscar uma história.

**Localização do arquivo a criar:** `historia-thiago/criterio-narrativa-relevance.md`

---

## Acceptance Criteria

1. Arquivo criado em `historia-thiago/criterio-narrativa-relevance.md`
2. Os 4 sinais explicitamente descritos com exemplos positivos E negativos (ver estrutura abaixo)
3. Os 3 níveis (🔴/🟡/⚫) com critérios automatizáveis — não subjetivos
4. ≥9 exemplos totais (≥3 por nível) baseados em subpautas reais da base existente
5. Tabela de decisão rápida presente (matriz fonte-de-tese × tipo-de-proposição → nível default)
6. Documento conservador por design: em dúvida, classifica ⚫
7. ≥3 contraexemplos (subpautas que NÃO devem puxar história mesmo que pareça tentador)
8. Regra de tie-break explícita (verbo pessoal explícito > fonte de tese quando sinais conflitam)

---

## Definition of Done

- [x] Arquivo `historia-thiago/criterio-narrativa-relevance.md` escrito e revisado
- [x] Os 4 sinais com exemplos positivos e negativos de subpautas reais
- [x] Exemplos validados contra histórias em `historia-thiago/jornada-profissional.md` e `historia-thiago/evolucao-pessoal.md`
- [x] Linkado no `historia-thiago/_index.md` (adicionar referência ao critério)
- [ ] @po valida antes de desbloquear HISTORIA-002 e HISTORIA-003

---

## Tasks / Subtasks

- [x] **Task 1 — Criar `criterio-narrativa-relevance.md`** (AC: 1)
  - [x] 1.1 Estruturar seção "Os 4 Sinais" com sinal 1 (verbo pessoal), sinal 2 (fonte de tese), sinal 3 (tipo de proposição), sinal 4 (marcadores temporais/sociais)
  - [x] 1.2 Para cada sinal: listar ✅ exemplos positivos e ❌ exemplos negativos concretos
  - [x] 1.3 Estruturar seção "Os 3 Níveis" com 🔴 ALTA, 🟡 MÉDIA, ⚫ NULA e critérios objetivos
  - [x] 1.4 Adicionar regra de tie-break: verbo pessoal explícito > fonte de tese

- [x] **Task 2 — Exemplos baseados em dados reais** (AC: 4)
  - [x] 2.1 Ler `historia-thiago/jornada-profissional.md` — identificar ≥3 temas que merecem 🔴
  - [x] 2.2 Ler `historia-thiago/evolucao-pessoal.md` — identificar ≥3 temas que merecem 🟡
  - [x] 2.3 Definir ≥3 contraexemplos de subpautas ⚫ (técnicas/factuais/tutoriais)

- [x] **Task 3 — Tabela de decisão rápida** (AC: 5)
  - [x] 3.1 Criar matriz: Fonte-de-tese (eixo Y) × Tipo-de-proposição (eixo X) → nível default
  - [x] 3.2 Validar: resultado da matriz == resultado da aplicação dos 4 sinais em ≥5 casos

- [x] **Task 4 — Linkar no índice** (DoD)
  - [x] 4.1 Adicionar referência ao critério em `historia-thiago/_index.md`

---

## Dev Notes

### Os 4 sinais (conteúdo esperado no documento)

**Sinal 1 — Verbo pessoal no hook embrionário**
- ✅ Forte: `aprendi`, `errei`, `descobri`, `fechei`, `perdi`, `tentei`, `consegui`, `vendi`, `passei`
- ✅ Possessivos: `meu primeiro X`, `quando eu tinha Y`
- ❌ Ausência: `"70% das empresas..."`, `"5 passos para..."`

**Sinal 2 — Fonte de tese da subpauta**
| Fonte | Probabilidade de narrativa |
|-------|---------------------------|
| Falha Documentada | 🔴 Alta |
| Process Diagnostic Anônimo | 🟡 Média |
| Skills em Produção | 🟢 Baixa |
| Benchmark Real | ⚫ Quase nula |

**Sinal 3 — Tipo de proposição**
- ✅ Experiencial / Observacional pessoal / Conceitual com âncora pessoal
- ❌ Factual puro / Conceitual puro / Tutorial

**Sinal 4 — Marcadores temporais/sociais**
- ✅ Idade, período, pessoas reais nomeadas
- ❌ Vago: `recentemente`, `as empresas`

### Os 3 níveis

- **🔴 ALTA:** ≥2 sinais positivos fortes — busca obrigatória no subagent
- **🟡 MÉDIA:** sinais mistos — busca exploratória
- **⚫ NULA:** factual/técnico/tutorial — skip (economiza tokens)

### Arquivos de referência para exemplos reais

- `historia-thiago/_index.md` — mapa geral das histórias
- `historia-thiago/jornada-profissional.md` — 27 histórias profissionais (mais candidatas a 🔴)
- `historia-thiago/evolucao-pessoal.md` — 13 histórias pessoais
- `historia-thiago/momentos-marcantes.md` — catálogo por arquetipo (útil para contraexemplos)

### Design philosophy

O critério deve ser **conservador**: quando há dúvida entre 🟡 e ⚫, classifica ⚫. O custo de uma história forçada (post degradado) é maior que o custo de um post sem história (post ok, sem diferencial). A irreversibilidade do dano a qualidade justifica a cautela.

---

## 🤖 CodeRabbit Integration

**Primary Type:** Documentation
**Complexity:** Low

**Story Type Analysis:** documento markdown puro, sem código. CodeRabbit focus em estrutura e completude, não em code patterns.

**Quality Gate Tasks:**
- [ ] Revisão manual pelo @po: document structure, completeness, critérios objetivos
- [ ] Validação de exemplos contra dados reais (histórias existentes)

---

## ⚠️ Pré-requisito de Infraestrutura (bloqueio para @dev iniciar)

Os assets referenciados nesta story (`historia-thiago/` e `.claude/agents/historia-thiago.md`) estão no branch `claude/amazing-gates-7f5fe8` e **não foram mergeados em main** no momento desta validação.

**@devops deve:** fazer merge de `claude/amazing-gates-7f5fe8` → `main` antes de @dev iniciar.
**@dev deve:** verificar que `historia-thiago/jornada-profissional.md` e `historia-thiago/evolucao-pessoal.md` estão acessíveis antes de executar as Tasks 2 e 3.

---

## Change Log

| Data | Versão | Descrição | Autor |
|------|--------|-----------|-------|
| 2026-04-30 | 1.0 | Story criada a partir do plano arquitetural HISTORIA | River (@sm) |
| 2026-04-30 | 1.1 | Validação @po: GO 8/10 — Status Draft→Ready. Achado crítico: assets em branch não-mergeado. Should-Fix: adicionar seção Out-of-Scope e Riscos. | Pax (@po) |
| 2026-04-30 | 1.2 | Implementação @dev: `criterio-narrativa-relevance.md` criado com 4 sinais, 3 níveis, tabela de decisão, 9 exemplos reais (3x🔴/3x🟡/3x⚫), regra de tie-break. `_index.md` copiado e atualizado com referência ao critério. Status Ready→InProgress. | Dex (@dev) |
