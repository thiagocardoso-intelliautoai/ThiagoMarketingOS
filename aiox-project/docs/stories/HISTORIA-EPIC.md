# Épico HISTORIA — Integração `historia-thiago` nos Squads de Conteúdo

**🏷️ ID:** `HISTORIA`
**📋 Autor arquitetural:** Aria (Architect)
**📅 Aprovado em:** 2026-04-30
**📊 Status:** `In Progress` (stories em Draft/Blocked)
**👤 Owner:** @sm (River) — criação de stories | @po (Pax) — validação | @dev (Dex) — implementação

---

## Resumo Executivo

Integrar o subagent `historia-thiago` (já criado em `.claude/agents/`) nos squads de conteúdo do Marketing OS, com critério explícito de relevância narrativa para evitar uso forçado de histórias em subpautas técnicas/factuais.

**Squads impactados:**
1. `seed-pautas-centrais` — Eva passa a classificar cada subpauta com `narrativa-relevance` (🔴/🟡/⚫)
2. `pesquisa-conteudo-linkedin` — Modos 3 e 4 ganham `step-04-historia` que invoca o subagent

**Resultado esperado:** Posts com fala literal autêntica do Thiago quando faz sentido; matéria-prima puramente externa quando o tema é técnico/factual. Storytelling autêntico vira ativo arquitetural, não ornamento.

---

## Contexto e Motivação

### Problema atual
- Posts gerados pelo squad `pesquisa-conteudo-linkedin` se baseiam apenas em pesquisa externa
- Hooks e bodies sem ancoragem em experiência real perdem força
- LinkedIn em 2026 valoriza voz autêntica > conteúdo factual genérico
- Thiago grava vídeos mensais com 10+ horas de transcrições — esse ativo não estava sendo aproveitado em produção

### Por que NÃO foi feito antes
- Sem critério, integrar = forçar história em tudo (degrada qualidade técnica)
- Sem subagent, ler todas as histórias inflaria contexto a cada execução de squad
- Ambas as peças dependem de base estruturada de histórias (criada na branch `claude/amazing-gates-7f5fe8`)

---

## Assets já disponíveis em main

- `historia-thiago/_index.md` — mapa de busca
- `historia-thiago/jornada-profissional.md` — 27 histórias profissionais
- `historia-thiago/evolucao-pessoal.md` — 13 histórias pessoais
- `historia-thiago/pessoas-marcantes.md` — 18 perfis
- `historia-thiago/momentos-marcantes.md` — catálogo cruzado por arquetipo
- `.claude/agents/historia-thiago.md` — subagent dedicado (sem auto-classificação ainda — escopo de HISTORIA-002)

---

## Decisões Arquiteturais

| Decisão | Resolução |
|---------|-----------|
| Posição do step de história | Novo `step-04-historia` entre step-02 e step-05 |
| Comportamento sem aderência exata | Opção C — sugere histórias adjacentes (não-bloqueante) |
| Modo 4 quando 🔴 sem história | Bloqueia, volta ao step-02 |
| Hooks (step-05) | ≥1 dos 3 hooks com fala literal se há história |
| Critério prévio | 4 sinais → 3 níveis (🔴/🟡/⚫) — Eva classifica antes |
| Single source of truth | `historia-thiago/criterio-narrativa-relevance.md` |
| Invocação do subagent | Squad principal via Task tool (contexto isolado ~3-5k tokens) |

---

## Stories do Épico

| Story | Título | Status | Depende de |
|-------|--------|--------|------------|
| HISTORIA-001 | Critério de Narrativa-Relevance (Foundation) | Draft | — |
| HISTORIA-002 | Subagent com Auto-classificação e Opção C | Blocked | HISTORIA-001 |
| HISTORIA-003 | Eva Classifica Subpautas | Blocked | HISTORIA-001, HISTORIA-002 |
| HISTORIA-004 | Step-04-Historia no Squad de Post | Blocked | HISTORIA-001, HISTORIA-002, HISTORIA-003 |

### Ordem de Execução

```
HISTORIA-001 (critério — foundation absoluta)
    ↓
HISTORIA-002 (subagent atualizado)
    ↓
HISTORIA-003 (Eva classifica) ─┐
                                ├─→ HISTORIA-004 (step-04 + redator)
HISTORIA-002 ──────────────────┘
```

**Nota de paralelismo:** HISTORIA-002 e HISTORIA-003 podem ser feitas em paralelo após HISTORIA-001 validada pelo @po.

---

## Fora de Escopo (consciente)

- ❌ Squad `criar-materia-colab` — sem componente narrativo direto neste épico
- ❌ Squad `seed-lista-distribuicao` — pesquisa de targets, sem storytelling
- ❌ Squads de carrosséis e capas — visuais (futura iteração)
- ❌ Modificar `linkedin-strategy.md`, `tone-of-voice.md`, `hook-structures.md`, `post-structure-linkedin.md`
- ❌ Modificar `step-09` (aprovação final)
- ❌ Refazer base de histórias — já feita e mergeada

---

## Estimativa

**Tamanho:** ~13 arquivos tocados (2 novos + 11 modificados)
**Esforço:** Médio — ~1-2 dias de @dev, paralelizável após HISTORIA-001

---

## Riscos

| Risco | Probabilidade | Mitigação |
|-------|---------------|-----------|
| Eva forçar classificação 🔴 em subpautas técnicas | Média | Critério conservador + 3 contraexemplos |
| Subagent retornar paráfrase em vez de fala literal | Baixa | Veto condition no step-04 |
| step-04-historia atrasar pipeline | Baixa | Skip automático em ⚫ (~50% das subpautas) |
| Modo 4 bloquear demais | Média | Bloqueio só se 🔴 + zero histórias (caso raro) |

---

## Referência Arquitetural

- `aiox-project/docs/architecture/HISTORIA-thiago-integration.md` — plano completo aprovado pela Aria

---

## Change Log

| Data | Versão | Descrição | Autor |
|------|--------|-----------|-------|
| 2026-04-30 | 1.0 | Épico criado a partir do plano arquitetural da Aria | River (@sm) |
