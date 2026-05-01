# Architecture Plan — Integração `historia-thiago` nos Squads de Conteúdo

**Author:** Aria (Architect)
**Date:** 2026-04-30
**Status:** ✅ Aprovado pelo Thiago — pronto para handoff @sm
**Branch:** `claude/amazing-gates-7f5fe8`

---

## 📌 Resumo Executivo

Integrar o subagent `historia-thiago` (já criado em `.claude/agents/`) nos squads de conteúdo do Marketing OS, com critério explícito de relevância narrativa para evitar uso forçado de histórias em subpautas técnicas/factuais.

**Squads impactados:**
1. `seed-pautas-centrais` — Eva passa a classificar cada subpauta com `narrativa-relevance` (🔴/🟡/⚫)
2. `pesquisa-conteudo-linkedin` — Modos 3 e 4 ganham `step-04-historia` que invoca o subagent

**Resultado esperado:** posts com fala literal autêntica do Thiago quando faz sentido; matéria-prima puramente externa quando o tema é técnico/factual. Storytelling autêntico vira ativo arquitetural, não ornamento.

---

## 🎯 Contexto e Motivação

### Problema atual
- Posts gerados pelo squad `pesquisa-conteudo-linkedin` se baseiam apenas em pesquisa externa
- Hooks e bodies sem ancoragem em experiência real perdem força
- LinkedIn em 2026 valoriza voz autêntica > conteúdo factual genérico
- Thiago grava vídeos mensais com 10+ horas de transcrições — esse ativo não estava sendo aproveitado em produção

### Solução
- Subagent dedicado `historia-thiago` consulta base estruturada em `historia-thiago/`
- Critério prévio (`narrativa-relevance`) decide se vale chamar o subagent
- Hook nasce com fala literal quando há história aderente
- Body usa fala literal de forma adaptada ao framework escolhido

### Por que NÃO foi feito antes
- Sem critério, integrar = forçar história em tudo (degrada qualidade técnica)
- Sem subagent, ler todas as histórias inflaria contexto a cada execução de squad
- Ambas as peças dependem de base estruturada de histórias (criada nesta branch)

---

## 🏛️ Decisões Arquiteturais Consolidadas

| Decisão | Resolução | Justificativa |
|---------|-----------|---------------|
| Posição do step de história | Novo `step-04-historia` entre step-02 e step-05 | Atende Modos 3 e 4 simultaneamente (convergem em step-02) |
| Comportamento sem aderência exata | Opção C — sugere histórias adjacentes | Não-bloqueante + transparente |
| Modo 4 quando 🔴 sem história | Bloqueia, volta ao step-02 | Modo 4 sem ativo emocional = post fraco |
| Hooks (step-05) | ≥1 dos 3 hooks com fala literal se há história | Variedade preservada, ativo oferecido |
| Post final (step-07) | Uso da história adapta ao framework escolhido | Storytelling expande, PAS usa em agitação, etc. |
| Critério prévio | 4 sinais → 3 níveis (🔴/🟡/⚫) | Eva classifica antes; subagent auto-classifica em Modo 4 avulso |
| Local do critério | `historia-thiago/criterio-narrativa-relevance.md` | Single source of truth ao lado das histórias |
| Quem invoca subagent | Squad principal via Task tool | Subagent roda em contexto isolado (~3-5k tokens vs ~30-50k inline) |

---

## 📐 Os 4 Sinais e os 3 Níveis de Relevância Narrativa

### Sinal 1 — Verbo pessoal no hook embrionário
- ✅ Forte: `aprendi`, `errei`, `descobri`, `fechei`, `perdi`, `tentei`, `consegui`, `vendi`, `passei`
- ✅ Possessivos: `meu primeiro X`, `quando eu tinha Y`
- ❌ Ausência: `"70% das empresas..."`, `"5 passos para..."`

### Sinal 2 — Fonte de tese da subpauta
| Fonte | Probabilidade |
|-------|---------------|
| Falha Documentada | 🔴 Alta |
| Process Diagnostic Anônimo | 🟡 Média |
| Skills em Produção | 🟢 Baixa |
| Benchmark Real | ⚫ Quase nula |

### Sinal 3 — Tipo de proposição
- ✅ Experiencial / Observacional pessoal / Conceitual com âncora pessoal
- ❌ Factual puro / Conceitual puro / Tutorial

### Sinal 4 — Marcadores temporais/sociais
- ✅ Idade, período, pessoas reais nomeadas
- ❌ Vago: `recentemente`, `as empresas`

### Os 3 níveis
- **🔴 ALTA:** ≥2 sinais positivos fortes — busca obrigatória
- **🟡 MÉDIA:** sinais mistos — busca exploratória
- **⚫ NULA:** factual/técnico/tutorial — skip, economiza tokens

---

## 🗂️ Arquitetura de Pipeline

### Squad `pesquisa-conteudo-linkedin` v2.1

```
Modo 3 (briefing on-demand):
step-00 → step-01-briefing → step-02 → [NOVO] step-04-historia → step-05 → step-06 → step-07 → step-09

Modo 4 (post direto):
step-00 → step-02 (armazém/ideia avulsa) → [NOVO] step-04-historia → step-05 → step-06 → step-07 → step-09
```

### Comportamento do `step-04-historia`

```
Recebe ideia-aprovada (com OU sem narrativa-relevance)

  Se narrativa-relevance == ⚫ nula:
    → Output: "não-narrativa", segue sem chamar subagent

  Se SEM classificação (Modo 4 avulso):
    → Subagent auto-classifica primeiro
    → Se classificou ⚫: skip
    → Se 🟡/🔴: busca

  Se 🔴/🟡:
    → Invoca subagent via Task tool
    → Subagent retorna 0-3 histórias

  Tratamento do retorno:
    Caso A (1+ histórias aderentes):
      → output/historia-relevante.md com falas literais
      → step-05 e step-07 consomem

    Caso B (0 aderentes mas N adjacentes — Opção C):
      → Apresenta sugestões no step-06
      → Thiago decide

    Caso C (0 nada):
      Modo 3 → segue com aviso
      Modo 4 + 🔴 → BLOQUEIA, volta ao step-02
```

---

## 📦 Sugestão de Decomposição em Épico + Stories

### Épico: `HISTORIA` — Integração `historia-thiago` nos Squads

**Tamanho estimado:** ~13 arquivos tocados (2 novos + 11 modificados)
**Esforço estimado:** Médio — ~1-2 dias de @dev, mas paralelizável em algumas stories

**Stories sugeridas (4 stories sequenciais):**

---

#### 📝 Story HISTORIA-001 — Critério de Narrativa-Relevance (Foundation)

**Goal:** Criar documento único `criterio-narrativa-relevance.md` que serve como single source of truth para classificação.

**Arquivos:**
- ✨ NOVO: `historia-thiago/criterio-narrativa-relevance.md`

**Conteúdo do arquivo:**
- Os 4 sinais (verbo pessoal, fonte de tese, tipo de proposição, marcadores)
- Os 3 níveis (🔴/🟡/⚫) com critérios objetivos
- Regra de tie-break (verbo pessoal explícito > fonte de tese)
- Mínimo 3 exemplos por nível baseados em histórias já catalogadas
- 3 contraexemplos (subpautas que NÃO devem puxar história)
- Tabela de decisão rápida: matriz fonte-de-tese × tipo-de-proposição → nível default

**Acceptance Criteria:**
1. Arquivo criado em `historia-thiago/criterio-narrativa-relevance.md`
2. Os 4 sinais explicitamente descritos com exemplos positivos e negativos
3. Os 3 níveis com critérios automatizáveis (não subjetivos)
4. ≥9 exemplos totais (3 por nível) baseados em subpautas reais
5. Tabela de decisão rápida presente
6. Documento conservador por design — em dúvida, classifica ⚫

**Definition of Done:**
- [ ] Arquivo escrito e revisado
- [ ] Exemplos validados contra histórias em `jornada-profissional.md` e `evolucao-pessoal.md`
- [ ] Linkado no `_index.md` da pasta `historia-thiago/`

**Dependências:** nenhuma (foundation story)
**Bloqueia:** HISTORIA-002, HISTORIA-003

---

#### 🤖 Story HISTORIA-002 — Subagent com Auto-classificação e Opção C

**Goal:** Atualizar subagent `historia-thiago` para auto-classificar ideias avulsas (Modo 4) e implementar comportamento de "sugestão adjacente" quando não há aderência exata.

**Arquivos:**
- 🔧 MODIFICAR: `.claude/agents/historia-thiago.md`

**Mudanças:**
1. Adicionar seção "Auto-classificação (Modo 4 ideia avulsa)"
2. Adicionar seção "Comportamento quando 0 histórias aderentes (Opção C)"
3. Adicionar formato YAML padronizado de retorno em `output/historia-relevante.md`
4. Documentar como subagent lê `criterio-narrativa-relevance.md`

**Acceptance Criteria:**
1. Subagent auto-classifica quando query não vem com nível
2. Subagent busca tags adjacentes quando busca direta retorna 0
3. Output sempre em formato YAML padronizado (status + classificacao_aplicada + historias[] + sugestao_redator)
4. Não inventa nem força história quando 0 aderentes mesmo após busca adjacente

**Definition of Done:**
- [ ] `.claude/agents/historia-thiago.md` atualizado
- [ ] Teste manual: query sem classificação faz auto-classificação
- [ ] Teste manual: query sobre tema sem história gera sugestão adjacente

**Dependências:** HISTORIA-001 (precisa do critério)
**Bloqueia:** HISTORIA-003, HISTORIA-004

---

#### 🌱 Story HISTORIA-003 — Eva Classifica Subpautas

**Goal:** Squad `seed-pautas-centrais` passa a classificar cada subpauta com `narrativa-relevance` no momento da geração.

**Arquivos:**
- 🔧 MODIFICAR: `aiox-squads/squads/seed-pautas-centrais/templates/subpauta-template.md`
- 🔧 MODIFICAR: `aiox-squads/squads/seed-pautas-centrais/tasks/02-gerar-subpautas.md`
- 🔧 MODIFICAR: `aiox-squads/squads/seed-pautas-centrais/tasks/01-inicializacao.md`
- 🔧 MODIFICAR: `aiox-squads/squads/seed-pautas-centrais/agents/estrategista.md`
- 🔧 MODIFICAR: `aiox-squads/squads/seed-pautas-centrais/squad.yaml`

**Mudanças por arquivo:**

**subpauta-template.md:**
- Adicionar 2 campos novos no template: `Narrativa-relevance` e `Justificativa-narrativa`

**tasks/02-gerar-subpautas.md:**
- Adicionar `criterio-narrativa-relevance.md` ao Context Loading
- Adicionar passo 3.5 "Classificar Narrativa-Relevance" entre os passos 3 e 4 atuais
- Adicionar veto condition #6: subpauta sem campo `narrativa-relevance`
- Adicionar quality criteria: distribuição realista de níveis

**tasks/01-inicializacao.md:**
- Mesmo tratamento — subpautas embrionárias geradas precisam ser classificadas

**agents/estrategista.md:**
- Adicionar competência "Classificação de Narrativa-Relevance"

**squad.yaml:**
- Referenciar `criterio-narrativa-relevance.md` em `data:` (cross-squad path)

**Acceptance Criteria:**
1. Toda nova subpauta gerada tem campos `narrativa-relevance` + `justificativa-narrativa`
2. Eva consulta `criterio-narrativa-relevance.md` antes de classificar
3. Distribuição em batch real é realista (não 100% 🔴)
4. Veto bloqueia geração sem classificação

**Definition of Done:**
- [ ] Todos os 5 arquivos atualizados
- [ ] Teste manual: rodar `/z-seed-pautas-centrais` Modo 2 → ver subpautas classificadas
- [ ] Validação: pelo menos 1 ⚫ em batch realista
- [ ] Justificativa coerente com classificação

**Dependências:** HISTORIA-001, HISTORIA-002
**Bloqueia:** HISTORIA-004

---

#### 🚀 Story HISTORIA-004 — Step-04-Historia no Squad de Post

**Goal:** Squad `pesquisa-conteudo-linkedin` ganha novo step que invoca subagent + Redator passa a consumir história nos hooks e no post final.

**Arquivos:**
- ✨ NOVO: `aiox-squads/squads/pesquisa-conteudo-linkedin/tasks/04-buscar-historia.md`
- 🔧 MODIFICAR: `aiox-squads/squads/pesquisa-conteudo-linkedin/workflows/workflow.yaml`
- 🔧 MODIFICAR: `aiox-squads/squads/pesquisa-conteudo-linkedin/tasks/05-criacao-hooks.md`
- 🔧 MODIFICAR: `aiox-squads/squads/pesquisa-conteudo-linkedin/tasks/07-estruturacao-post.md`
- 🔧 MODIFICAR: `aiox-squads/squads/pesquisa-conteudo-linkedin/squad.yaml`
- 🔧 MODIFICAR: `.claude/commands/z-pesquisa-conteudo-linkedin.md`

**Mudanças:**

**04-buscar-historia.md (NOVO):**
- Pré-condição: classificar se vier sem (Modo 4 avulso)
- Passos: verificar classificação → invocar subagent → tratar retorno (3 casos)
- Veto conditions específicas (paráfrase em vez de literal, sem origem, mais de 3 histórias)
- Output: `output/historia-relevante.md` em formato YAML padrão

**workflow.yaml:**
- Inserir step-04-historia entre step-02 e step-05
- Atualizar resumo de modos no comentário final
- Configurar `on_block` quando 🔴 + 0 histórias + Modo 4

**05-criacao-hooks.md:**
- Step 1 lê history.md além da ideia
- Regra: ≥1 dos 3 hooks usa fala literal quando há história
- Marcação obrigatória: hook X usa fala da história Y

**07-estruturacao-post.md:**
- Step 1 lê history.md + hook escolhido
- Novo passo 2.5 "Decidir uso da história no body" com matriz framework × uso
- Veto #7: zero falas literais incorporadas quando recebida história

**z-pesquisa-conteudo-linkedin.md (slash command):**
- Atualizar tabelas de Modo 3 e 4 com novo step
- Atualizar contagem total: 7→8 (modos 1/2/3) e 6→7 (modo 4)

**squad.yaml:**
- Registrar nova task `buscar-historia`
- Registrar subagent externo `historia-thiago` com path

**Acceptance Criteria:**
1. step-04-historia executa em todos os modos 1/2/3/4
2. Skip automático quando ⚫ nula
3. Bloqueio funcional quando 🔴 + 0 histórias + Modo 4
4. Hooks gerados em step-05 marcam qual usa qual história
5. Body em step-07 contém fala literal em quotes (verificável por grep)
6. Veto conditions ativadas quando regras violadas

**Definition of Done:**
- [ ] Todos os 6 arquivos criados/atualizados
- [ ] **Teste 1:** Modo 3 com tema 🔴 → fluxo completo com fala literal no post final
- [ ] **Teste 2:** Modo 3 com tema ⚫ → skip subagent, fluxo segue
- [ ] **Teste 3:** Modo 4 com ideia avulsa → auto-classificação + busca
- [ ] **Teste 4:** Modo 4 + 🔴 + 0 histórias → bloqueio com volta ao step-02
- [ ] **Teste 5:** história adjacente apenas → sugestão apresentada no step-06
- [ ] Score de qualidade do post final ≥ 80% (mantém qualidade existente)

**Dependências:** HISTORIA-001, HISTORIA-002, HISTORIA-003

---

## 🎬 Ordem de Execução

```
HISTORIA-001 (critério)
    ↓
HISTORIA-002 (subagent atualizado)
    ↓
HISTORIA-003 (Eva classifica) ─┐
                                ├─→ HISTORIA-004 (step-04 + redator)
HISTORIA-002 ──────────────────┘
```

**Crítico:** HISTORIA-001 é foundation absoluta. Tudo que vier depois consome o critério dela.
**Paralelizável:** HISTORIA-002 e HISTORIA-003 podem ser feitas em paralelo após HISTORIA-001 estar pronta.

---

## ⚠️ Riscos e Mitigações

| Risco | Probabilidade | Mitigação |
|-------|---------------|-----------|
| Eva forçar classificação 🔴 em subpautas técnicas | Média | Critério explicitamente conservador + 3 contraexemplos no documento |
| Subagent retornar paráfrase em vez de fala literal | Baixa | Veto condition no step-04 + regras explícitas no agent |
| step-04-historia atrasar pipeline | Baixa | Skip automático em ⚫ (~50% das subpautas) |
| Modo 4 bloquear demais | Média | Bloqueio só se 🔴 + zero histórias (caso raro) — Thiago pode reclassificar |
| Cross-squad reference quebrar | Baixa | Paths relativos consistentes (`../../../historia-thiago/`) |
| Histórias datarem (Thiago muda, banco fica obsoleto) | Alta (longo prazo) | Atualização mensal já prevista no handoff inicial |

---

## 🚫 Fora de Escopo (consciente)

- ❌ Squad `criar-materia-colab` — usa lista de distribuição, sem componente narrativo direto. Futura iteração.
- ❌ Squad `seed-lista-distribuicao` — pesquisa de targets, sem storytelling.
- ❌ Squads de carrosséis e capas — visuais. Histórias podem alimentar visuals em iteração futura, fora deste épico.
- ❌ Modificar `linkedin-strategy.md`, `tone-of-voice.md`, `hook-structures.md`, `post-structure-linkedin.md` — esses dados continuam intactos. História ENRIQUECE, não substitui.
- ❌ Modificar `step-09` (aprovação final) — se o post chegou aqui, está OK.
- ❌ Refazer base de histórias — já feita nesta branch (4 arquivos + index + subagent + 60 histórias estruturadas).

---

## 📚 Referências

**Base de histórias (criada nesta branch — branch `claude/amazing-gates-7f5fe8`):**
- `historia-thiago/_index.md` — mapa de busca
- `historia-thiago/jornada-profissional.md` — 27 histórias profissionais
- `historia-thiago/evolucao-pessoal.md` — 13 histórias pessoais
- `historia-thiago/pessoas-marcantes.md` — 18 perfis
- `historia-thiago/momentos-marcantes.md` — catálogo cruzado por arquetipo

**Subagent existente:**
- `.claude/agents/historia-thiago.md` — subagent dedicado (ainda sem auto-classificação — escopo da HISTORIA-002)

**Squads que serão modificados:**
- `aiox-squads/squads/seed-pautas-centrais/` (HISTORIA-003)
- `aiox-squads/squads/pesquisa-conteudo-linkedin/` (HISTORIA-004)

**Slash commands afetados:**
- `.claude/commands/z-pesquisa-conteudo-linkedin.md` (HISTORIA-004)
- `.claude/commands/z-seed-pautas-centrais.md` (não modificado — squad.yaml é autoritativo)

---

## 🤝 Handoff para @sm (River)

**Próximo passo:** ativar `/sm` e usar este documento como input para:

1. **Criar épico:** `*create-epic` com prefixo `HISTORIA`
2. **Criar 4 stories sequenciais:** HISTORIA-001 → HISTORIA-002 → HISTORIA-003 → HISTORIA-004
3. **Cada story herda:** Acceptance Criteria + Definition of Done + Dependencies já definidos acima
4. **Sugestão para River:** dada a sequencialidade rígida, criar as 4 stories juntas mas marcar HISTORIA-002/003/004 como `Status: Blocked` até HISTORIA-001 ter sido validada por @po

**Validação prévia recomendada antes de @dev começar:**
- @po valida HISTORIA-001 (critério é foundation, erro aqui contamina todas)
- @po valida HISTORIA-002 separadamente (subagent é peça crítica de qualidade)

---

## 📝 Notas de Implementação para @dev

Quando @dev executar:

1. **Branch:** seguir na branch atual `claude/amazing-gates-7f5fe8` ou criar feature branch por story
2. **Validação ponta-a-ponta:** os 5 testes da Fase 5 do plano original viram parte do DoD da HISTORIA-004
3. **Rollback fácil:** mudanças são todas em markdown/YAML — reverter por arquivo é trivial
4. **Sem breaking changes:** os squads continuam funcionando se step-04-historia falhar (degrada para fluxo atual sem história)
5. **Performance:** subagent isolado custa ~3-5k tokens por execução; skip de ⚫ economiza esses tokens

---

— Aria, arquitetando o futuro 🏗️
