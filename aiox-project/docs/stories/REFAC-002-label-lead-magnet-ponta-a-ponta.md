# Story REFAC-002 — Label `lead-magnet` Ponta a Ponta

**🏷️ ID:** `REFAC-002`
**📐 Estimativa:** 8-12h
**🔗 Depende de:** REFAC-001 (CCC precisa estar limpo de refs de matéria-colab antes de ganhar formulário novo de lead-magnet)
**🔗 Bloqueia:** —
**👤 Assignee:** Dev (Dex) + Data Engineer (Dara) na sub-task de schema
**🏷️ Labels:** `refactor`, `feature`, `supabase`, `squads`, `ccc`, `cli`, `algoritmo-2026`
**📊 Status:** Ready for Review (implementação @dev — pendente smoke test E2E manual + CodeRabbit)

**📚 Brief:** [Plano da refatoração](../../../C:/Users/thiag/.claude/plans/aswring-you-modo-quirky-bear.md) — seção 3.5 + 5.1 + 5.3 + 5.6 + 5.7 + 5.8.4

---

## Descrição

> Como **Thiago**, eu quero marcar um post como lead magnet no momento de criar o prompt no CCC (com o recurso e o CTA-na-arte), para que o squad de pesquisa NÃO mencione o recurso no body (defesa contra §6.2 do algoritmo) e os squads de capas/carrosseis injetem o CTA dentro da arte automaticamente — sem que eu precise lembrar de configurar isso peça por peça.

## Problema Atual

Hoje:
- O CCC não tem campo de "lead magnet" no formulário de criação de post.
- O Redator do squad de pesquisa não tem regra dura sobre lead magnet — pode mencionar o recurso no body, gerando engagement bait detectável (§6.2).
- Os squads de capas e carrosseis recebem só o post como input — não sabem se é lead magnet → não injetam CTA-na-arte → CTA acaba indo no texto (= bait) ou não acontece.
- Schema do Supabase tem campos de **workflow** (`lead_magnet_status`, `lead_magnet_observation`, `lead_magnet_updated_at` da migration `20260501_lead_magnet_schema.sql`) mas não tem campos **semânticos** ("este post É lead magnet" + recurso + CTA-na-arte).

## Contexto Técnico

### Decisão arquitetural (Aria, plan §5.1): COEXISTIR

Os campos existentes (`lead_magnet_status`/`lead_magnet_observation`/`lead_magnet_updated_at`) tratam **workflow de produção** do material. Os novos tratam **marcação semântica** do post. Os dois conceitos coexistem sem refatorar — `is_lead_magnet=true` indica "este post É lead magnet"; `lead_magnet_status` indica "o material está a_fazer | concluido".

### Decisão (Aria, plan §5.3): UM ARQUIVO POR ESTILO

Templates HTML são lidos por agentes Designer como REFERÊNCIA (não há template engine). Cada template ganha bloco CTA documentado com comentário `<!-- CTA-BLOCK: render only when is_lead_magnet=true -->`. Designer remove o bloco se `is_lead_magnet=false`.

### Decisão (Aria, plan §5.6): ENTRADA NO CCC + FALLBACK NO STEP 0

Caminho A (preferencial): formulário do CCC tem checkbox + 2 campos → embute front-matter no prompt.
Caminho B (fallback): se prompt vem sem metadata → Step 0 do squad pergunta.

### Arquivos-chave

- **Schema:** `content-command-center/supabase/migrations/{YYYYMMDD}_lead_magnet_semantics.sql` (novo)
- **Squad pesquisa:** `aiox-squads/squads/pesquisa-conteudo-linkedin/{tasks/00-selecao-modo.md, agents/redator.md, templates/post-template.md, data/lead-magnet-template.md}`
- **Squad capas:** `aiox-squads/squads/capas-linkedin/{agents/designer.md, templates/pessoa-texto.html, templates/print-autoridade.html, templates/rascunho-papel.md}` + `data/visual-styles.md`
- **Squad carrosseis:** `aiox-squads/squads/carrosseis-linkedin/{agents/copywriter.md, templates/twitter-style-base.html, templates/editorial-clean-base.html, templates/data-driven-base.html, templates/notebook-raw-base.html}`
- **CCC:** `content-command-center/js/{render.js, prompts.js, data.js}`
- **CLI:** `aiox-squads/shared/scripts/save-post-cli.js`

---

## Sub-tarefas

### A. Schema (Data Engineer / Dara)

- [x] **A.1** Criar migration `content-command-center/supabase/migrations/{YYYYMMDD}_lead_magnet_semantics.sql`:
  ```sql
  -- Marcação semântica de "este post É lead magnet" + recurso + CTA-na-arte
  -- Coexiste com lead_magnet_status (workflow tracking) da 20260501_lead_magnet_schema.sql
  ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_lead_magnet boolean DEFAULT false;
  ALTER TABLE posts ADD COLUMN IF NOT EXISTS lead_magnet_resource text NULL;
  ALTER TABLE posts ADD COLUMN IF NOT EXISTS cta_arte text NULL;

  COMMENT ON COLUMN posts.is_lead_magnet IS 'Este post é lead magnet (semântica). Workflow status fica em lead_magnet_status.';
  COMMENT ON COLUMN posts.lead_magnet_resource IS 'Nome do recurso entregue (ex: "framework de prospecção em 5 etapas").';
  COMMENT ON COLUMN posts.cta_arte IS 'Texto do CTA injetado na arte (capa/carrossel) quando is_lead_magnet=true.';

  CREATE INDEX IF NOT EXISTS idx_posts_is_lead_magnet ON posts(is_lead_magnet) WHERE is_lead_magnet = true;
  ```
- [ ] **A.2** Aplicar migration via Dashboard Supabase SQL Editor (ver Notas — CLI ausente, projeto fora da conta MCP). Pendente Thiago.
- [ ] **A.3** Validar idempotência rodando 2× — segunda execução não deve falhar. Pendente Thiago.

### B. Squad de Pesquisa (Dex)

- [x] **B.1** `tasks/00-selecao-modo.md` — adicionar detecção de front-matter:
  - Se prompt entra com `is_lead_magnet: true|false` no header YAML → pula pergunta.
  - Senão → pergunta: "Este post é lead magnet? (s/N) Se sim, qual o recurso? Qual o CTA-na-arte?"
- [x] **B.2** `agents/redator.md` — adicionar **regra dura** quando `is_lead_magnet=true`:
  - ZERO menção ao `lead_magnet_resource` no body do post.
  - ZERO link externo no body.
  - ZERO "Comente X que mando", "Tag um amigo", "Like se concordar" (engagement bait — §6.2).
  - O CTA do texto vai para o sistema decisório (Salva/Comente — definido na REFAC-003, mas a regra anti-bait já vale agora).
  - Hashtags 0-3 (§6.5).
- [x] **B.3** `templates/post-template.md` — incluir front-matter YAML obrigatório:
  ```yaml
  ---
  title: "..."
  pillar: A
  is_lead_magnet: false       # ou true
  lead_magnet_resource: null  # ou "framework de prospecção em 5 etapas"
  cta_arte: null              # ou "Comente FRAMEWORK pra receber na DM"
  ---
  ```
- [x] **B.4** Reescrever `data/lead-magnet-template.md` segundo §6.10 do algoritmo:
  - Composição limpa: asset entregue **dentro do post** (document) OU via **inbound** (DM, perfil, newsletter).
  - **NUNCA** link externo no body.
  - **NUNCA** "Comente X que mando" no texto.
  - Coerência semântica entre topical DNA do Thiago e o recurso (operador-builder oferecendo framework técnico → coerente).

### C. Squad de Capas (Dex)

- [x] **C.1** `agents/designer.md` — adicionar regra de leitura do front-matter:
  - Designer abre o post final → lê YAML do header → se `is_lead_magnet=true`, mantém o bloco `<!-- CTA-BLOCK -->` no template e interpola `cta_arte`.
  - Se `is_lead_magnet=false`, **remove o bloco** antes de renderizar o HTML final.
- [x] **C.2** Adicionar bloco CTA documentado nos 3 templates sobreviventes:
  - `templates/pessoa-texto.html`
  - `templates/print-autoridade.html`
  - `templates/rascunho-papel.md`
  - Posicionamento: faixa inferior 60-80px sobre gradient escuro, fonte Inter 24-28px peso 600, cor branca, padding lateral 40px. **Não** ocupa mais que 10% da altura da imagem.
  - Comentário marcador: `<!-- CTA-BLOCK: render only when is_lead_magnet=true; interpolate {{ cta_arte }} -->`
- [x] **C.3** `data/visual-styles.md` — documentar posicionamento do CTA-na-arte por estilo + regra do bloco.

### D. Squad de Carrosseis (Dex)

- [x] **D.1** `agents/copywriter.md` — regra: se `is_lead_magnet=true`, gerar slide final com `cta_arte`. Se `false`, slide final segue padrão atual (sem CTA bait).
- [x] **D.2** Adicionar bloco slide-final com CTA documentado em:
  - `templates/twitter-style-base.html`
  - `templates/editorial-clean-base.html`
  - `templates/data-driven-base.html`
  - `templates/notebook-raw-base.html`
  - Marcador: `<!-- CTA-SLIDE: render only when is_lead_magnet=true -->`

### E. CCC Frontend (Dex)

- [x] **E.1** `js/render.js` — formulário "Novo post" + `expandModePanel` (modos 3 e 4):
  - Adicionar checkbox **"É lead magnet?"** no fluxo de criação.
  - Se marcado, mostrar 2 campos texto: **"Recurso"** e **"CTA na arte"**.
  - Validação: se checkbox marcado, ambos os campos são obrigatórios.
- [x] **E.2** `js/prompts.js` — gerador de prompt:
  - Embutir front-matter YAML no header do prompt via `buildLeadMagnetFrontMatter()`.
  - SEMPRE inclui `is_lead_magnet: true|false` (presença do bloco sinaliza prompt-do-CCC; squad pula Step 0.5 manual).
- [x] **E.3** `js/data.js` — query e write:
  - `_mapPostFromDB` e `_mapPostToDB` mapeiam os 3 campos novos (defaults seguros).
  - `updatePost()` fieldMap aceita `isLeadMagnet`, `leadMagnetResource`, `ctaArte` (edit retroativo via modal).
- [x] **E.4** Vitrine: badge **"📌 Lead Magnet"** (`.lm-chip--semantic`) ao lado dos badges existentes quando `isLeadMagnet=true`. Tooltip mostra `leadMagnetResource`. Coexiste com `lm-chip--pending`/`--done` de workflow status.

### F. CLI (Dex)

- [x] **F.1** `aiox-squads/shared/scripts/save-post-cli.js` — adicionar flags:
  - `--is-lead-magnet` (boolean flag)
  - `--lead-magnet-resource <text>`
  - `--cta-arte <text>`
- [x] **F.2** `parseFrontMatter()` extrai bloco YAML do topo do `output/post-final.md`. CLI passa os 3 campos para `savePost()` (upload-to-supabase.js); upsert idempotente por slug. Precedência: flag CLI > front-matter > default false/null. Workflow doc `.agent/workflows/z-pesquisa-conteudo-linkedin.md` atualizado com convenção e exemplos de override.

---

## Acceptance Criteria

1. **Given** o Supabase pós-migration, **When** rodo `\d posts`, **Then** vejo as 3 colunas novas (`is_lead_magnet`, `lead_magnet_resource`, `cta_arte`) com defaults corretos. Posts antigos têm `is_lead_magnet=false` automaticamente.

2. **Given** o CCC aberto, **When** crio um post novo marcando o checkbox lead magnet, **Then** o prompt gerado contém `is_lead_magnet: true` no front-matter + os 2 campos preenchidos.

3. **Given** o squad de pesquisa rodando com prompt marcando `is_lead_magnet: true`, **When** o Step 0 detecta o front-matter, **Then** **NÃO pergunta** as 3 coisas — pula direto pro Modo selecionado.

4. **Given** o Redator escrevendo o post final em modo lead magnet, **When** o post é entregue, **Then**: (a) o `lead_magnet_resource` NÃO aparece no body, (b) NÃO há link externo, (c) NÃO há padrões de bait do §6.2, (d) o front-matter no `output/post-final.md` tem os 3 campos preenchidos.

5. **Given** o squad de capas recebendo o post final em modo lead magnet, **When** o Designer renderiza, **Then** a capa final tem o `cta_arte` na faixa inferior conforme `data/visual-styles.md`.

6. **Given** o squad de capas recebendo post **NÃO** lead magnet, **When** o Designer renderiza, **Then** a capa final **NÃO tem** o bloco CTA (foi removido antes da render).

7. **Given** o squad de carrosseis em modo lead magnet, **When** os slides são gerados, **Then** o último slide tem `cta_arte`. Se não é lead magnet, o último slide segue padrão atual.

8. **Given** o post salvo via `save-post-cli.js --is-lead-magnet --lead-magnet-resource "..." --cta-arte "..."`, **When** abro o CCC, **Then** vejo o badge "📌 Lead Magnet" no card e o tooltip com o nome do recurso.

9. **Given** posts antigos sem lead magnet, **When** abro o CCC, **Then** continuam aparecendo normais (sem badge, sem quebrar UI).

10. **Given** prompt rodando manualmente sem metadata (fallback Caminho B), **When** o squad chega no Step 0, **Then** **pergunta** as 3 coisas e o fluxo continua.

---

## Riscos

- **Migration não-idempotente** — se `IF NOT EXISTS` for esquecido, segunda execução falha. **Mitigação:** AC #1 + sub-task A.3.
- **Designer ignora o front-matter** — se a regra em `agents/designer.md` for ambígua, Designer pode gerar capa sem CTA mesmo em lead magnet. **Mitigação:** AC #5/#6 cobrem; smoke test manual obrigatório.
- **Redator vaza o `lead_magnet_resource` no body** — viés natural de "explicar o que tá oferecendo". **Mitigação:** AC #4 + quality gate em `checklists/review-checklist.md` (rejeita se body cita recurso).
- **Bloco CTA fica feio** — primeira iteração pode ter posicionamento ruim. **Mitigação:** validação visual com Thiago antes de marcar Done. Estilo CTA também herda da auditoria do Editorial Clean (REFAC-004).
- **Regressão em posts antigos** — query da vitrine pode quebrar se não tratar `is_lead_magnet=null`. **Mitigação:** default `false` na migration + AC #9.

---

## Definition of Done

- [ ] Sub-tarefas A, B, C, D, E, F todas marcadas
- [ ] Os 10 ACs verificados manualmente (smoke test E2E completo)
- [ ] Migration aplicada e idempotente
- [ ] Posts antigos continuam renderizando no CCC sem regressão
- [ ] Pelo menos 1 post de teste rodado **end-to-end** com `is_lead_magnet=true`: prompt CCC → squad pesquisa → squad capa → save no DB → badge na vitrine
- [ ] Pelo menos 1 post de teste rodado com `is_lead_magnet=false` para confirmar fallback
- [ ] Branch local `feature/refac-002-lead-magnet`, mergeada para `main` localmente, push fica com `/devops`
- [ ] Commits citam §6.2/§6.10 do `linkedin-algorithm-2026-reference.md` onde aplicável

---

## Out of Scope (não fazer nesta story)

- **Refatorar sistema de CTA "Salva/Comente"** — isso é REFAC-003. Aqui só implementamos a regra anti-bait quando `is_lead_magnet=true`.
- **Refazer Twitter-style** (REFAC-004).
- **Criar Multi-Image ou Infográfico** (REFAC-005A/5B). O bloco-CTA nesses templates futuros fica nas próprias stories (segue padrão estabelecido aqui).
- **Auto-publish do post no LinkedIn** — fora de escopo (post nativo manual).
- **Retro-marcação de posts antigos** — defaults aplicam, sem migração de dados.
- **Renomear `lead_magnet_status` → `lead_magnet_workflow_status`** — opcional (plan §5.1). `/data-engineer` decide; se ficar como está, sem problema.
- **Quality gate semântico do CTA-na-arte** (validar se o texto não é bait) — fica em iteração futura se necessário.

## Notes

- **Este é o coração funcional do refactor.** Toca squad de pesquisa, squad de capas, squad de carrosseis, CCC e CLI. Foi consolidada em 1 story porque fragmentar quebraria o ponta-a-ponta.
- **Não introduzir** abstração para "variante com/sem CTA" — é if no template, não sistema parametrizado (regra explícita do plano §7.3).
- **Não migrar** dados antigos. Posts existentes ficam com defaults.
- **Schema sem `template_variant`** — variante é decisão interna do squad, não vaza pro CCC (plan §5.8.4).

---

## Change Log

| Data | Agente | Ação |
|------|--------|------|
| 2026-05-08 | @sm (River) | Story criada (Draft) |
| 2026-05-08 | @po (Pax) | Validação 10-point: 10/10. **GO**. Status: Draft → Ready. Bloqueada por REFAC-001. Adicionada seção Out of Scope. |
| 2026-05-08 | @dev (Dex) | Implementação YOLO completa (6 fases A-F, 6 commits atômicos). Status: Ready → Ready for Review. Branch `feature/refac-002-lead-magnet`. Migration aguarda aplicação manual no Dashboard. Smoke test E2E pendente Thiago. |

---

## Dev Agent Record

### Agent Model Used
Claude Opus 4.7 (1M context) — modo YOLO autonomous

### Debug Log References
- `.ai/decision-log-REFAC-002.md` — todas as decisões autônomas registradas com rationale

### Completion Notes
- **Branch base correction (D1):** ramificada de `feature/refac-001-demolicao` em vez de main, pois REFAC-001 tem 3 commits ainda não mergeados (ec4944f, bb2c010, 86f5b2a). Quando REFAC-001 mergear para main, REFAC-002 mergeará por cima sem conflito.
- **Migration aplicação manual (D2):** Supabase CLI ausente no PATH local. MCP Supabase tem 3 projects (Votador, winning-sales-aios, Winning Sales AI), mas o CCC live aponta para `mvryaxohnbftupocdlqa` — outro account. Migration fica como SQL pronto no diretório de migrations seguindo a convenção do projeto (cabeçalho "Run this in Supabase SQL Editor"). Thiago aplica via Dashboard.
- **CodeRabbit ausente em WSL:** binário não instalado em `~/.local/bin/coderabbit`. Self-healing graceful degradation. Smoke test E2E manual obrigatório antes de marcar Done.
- **Issues fora-de-escopo identificadas (não corrigidas, registradas para tech debt separado):**
  1. `leadMagnetStatus` mapeado em `_mapPostFromDB` (data.js:126) mas ausente em `_mapPostToDB` (159-186). Posts criados via CCC nunca persistem o status de workflow lead-magnet.
  2. Class `lm-chip--pending`/`lm-chip--done` em render.js:331-332 OK; falta nada agora — porém, ATENÇÃO: o badge `.lm-chip--semantic` adicionado nesta story usa nome consistente.
- **Smoke test funcional realizado:** node syntax check em prompts.js, data.js, render.js, save-post-cli.js, upload-to-supabase.js (todos OK). Round-trip `buildLeadMagnetFrontMatter` ↔ `parseFrontMatter` validado com sample real (front-matter consistente lido de volta sem perda).
- **Smoke test E2E pendente Thiago:** os 15 passos da seção Verification do plano. Especialmente: aplicar migration, criar post via CCC marcando lead-magnet, rodar squad de pesquisa para confirmar Step 0.0 detecta YAML, rodar squad de capas para confirmar bloco CTA presente, rodar squad de carrosseis para confirmar slide N+1 final, validar badge na vitrine.

### File List

**Schema (criado):**
- `content-command-center/supabase/migrations/20260509_lead_magnet_semantics.sql`

**Squad de Pesquisa (modificado):**
- `aiox-squads/squads/pesquisa-conteudo-linkedin/tasks/00-selecao-modo.md`
- `aiox-squads/squads/pesquisa-conteudo-linkedin/agents/redator.md`
- `aiox-squads/squads/pesquisa-conteudo-linkedin/templates/post-template.md`
- `aiox-squads/squads/pesquisa-conteudo-linkedin/data/lead-magnet-template.md`

**Squad de Capas (modificado):**
- `aiox-squads/squads/capas-linkedin/agents/designer.md`
- `aiox-squads/squads/capas-linkedin/templates/pessoa-texto.html`
- `aiox-squads/squads/capas-linkedin/templates/print-autoridade.html`
- `aiox-squads/squads/capas-linkedin/templates/rascunho-papel.md`
- `aiox-squads/squads/capas-linkedin/data/visual-styles.md`

**Squad de Carrosseis (modificado):**
- `aiox-squads/squads/carrosseis-linkedin/agents/copywriter.md`
- `aiox-squads/squads/carrosseis-linkedin/templates/twitter-style-base.html`
- `aiox-squads/squads/carrosseis-linkedin/templates/editorial-clean-base.html`
- `aiox-squads/squads/carrosseis-linkedin/templates/data-driven-base.html`
- `aiox-squads/squads/carrosseis-linkedin/templates/notebook-raw-base.html`

**CCC frontend (modificado):**
- `content-command-center/js/render.js`
- `content-command-center/js/prompts.js`
- `content-command-center/js/data.js`
- `content-command-center/css/_library.css`

**CLI (modificado):**
- `aiox-squads/shared/scripts/save-post-cli.js`
- `aiox-squads/shared/scripts/upload-to-supabase.js`
- `.agent/workflows/z-pesquisa-conteudo-linkedin.md`

**Decision log (criado):**
- `.ai/decision-log-REFAC-002.md`
