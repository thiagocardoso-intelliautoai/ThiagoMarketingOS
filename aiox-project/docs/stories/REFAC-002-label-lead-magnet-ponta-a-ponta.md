# Story REFAC-002 — Label `lead-magnet` Ponta a Ponta

**🏷️ ID:** `REFAC-002`
**📐 Estimativa:** 8-12h
**🔗 Depende de:** REFAC-001 (CCC precisa estar limpo de refs de matéria-colab antes de ganhar formulário novo de lead-magnet)
**🔗 Bloqueia:** —
**👤 Assignee:** Dev (Dex) + Data Engineer (Dara) na sub-task de schema
**🏷️ Labels:** `refactor`, `feature`, `supabase`, `squads`, `ccc`, `cli`, `algoritmo-2026`
**📊 Status:** Ready (validada por @po — bloqueada por REFAC-001)

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

- [ ] **A.1** Criar migration `content-command-center/supabase/migrations/{YYYYMMDD}_lead_magnet_semantics.sql`:
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
- [ ] **A.2** Aplicar migration via `supabase db push`.
- [ ] **A.3** Validar idempotência rodando 2× — segunda execução não deve falhar.

### B. Squad de Pesquisa (Dex)

- [ ] **B.1** `tasks/00-selecao-modo.md` — adicionar detecção de front-matter:
  - Se prompt entra com `is_lead_magnet: true|false` no header YAML → pula pergunta.
  - Senão → pergunta: "Este post é lead magnet? (s/N) Se sim, qual o recurso? Qual o CTA-na-arte?"
- [ ] **B.2** `agents/redator.md` — adicionar **regra dura** quando `is_lead_magnet=true`:
  - ZERO menção ao `lead_magnet_resource` no body do post.
  - ZERO link externo no body.
  - ZERO "Comente X que mando", "Tag um amigo", "Like se concordar" (engagement bait — §6.2).
  - O CTA do texto vai para o sistema decisório (Salva/Comente — definido na REFAC-003, mas a regra anti-bait já vale agora).
  - Hashtags 0-3 (§6.5).
- [ ] **B.3** `templates/post-template.md` — incluir front-matter YAML obrigatório:
  ```yaml
  ---
  title: "..."
  pillar: A
  is_lead_magnet: false       # ou true
  lead_magnet_resource: null  # ou "framework de prospecção em 5 etapas"
  cta_arte: null              # ou "Comente FRAMEWORK pra receber na DM"
  ---
  ```
- [ ] **B.4** Reescrever `data/lead-magnet-template.md` segundo §6.10 do algoritmo:
  - Composição limpa: asset entregue **dentro do post** (document) OU via **inbound** (DM, perfil, newsletter).
  - **NUNCA** link externo no body.
  - **NUNCA** "Comente X que mando" no texto.
  - Coerência semântica entre topical DNA do Thiago e o recurso (operador-builder oferecendo framework técnico → coerente).

### C. Squad de Capas (Dex)

- [ ] **C.1** `agents/designer.md` — adicionar regra de leitura do front-matter:
  - Designer abre o post final → lê YAML do header → se `is_lead_magnet=true`, mantém o bloco `<!-- CTA-BLOCK -->` no template e interpola `cta_arte`.
  - Se `is_lead_magnet=false`, **remove o bloco** antes de renderizar o HTML final.
- [ ] **C.2** Adicionar bloco CTA documentado nos 3 templates sobreviventes:
  - `templates/pessoa-texto.html`
  - `templates/print-autoridade.html`
  - `templates/rascunho-papel.md`
  - Posicionamento: faixa inferior 60-80px sobre gradient escuro, fonte Inter 24-28px peso 600, cor branca, padding lateral 40px. **Não** ocupa mais que 10% da altura da imagem.
  - Comentário marcador: `<!-- CTA-BLOCK: render only when is_lead_magnet=true; interpolate {{ cta_arte }} -->`
- [ ] **C.3** `data/visual-styles.md` — documentar posicionamento do CTA-na-arte por estilo + regra do bloco.

### D. Squad de Carrosseis (Dex)

- [ ] **D.1** `agents/copywriter.md` — regra: se `is_lead_magnet=true`, gerar slide final com `cta_arte`. Se `false`, slide final segue padrão atual (sem CTA bait).
- [ ] **D.2** Adicionar bloco slide-final com CTA documentado em:
  - `templates/twitter-style-base.html`
  - `templates/editorial-clean-base.html`
  - `templates/data-driven-base.html`
  - `templates/notebook-raw-base.html`
  - Marcador: `<!-- CTA-SLIDE: render only when is_lead_magnet=true -->`

### E. CCC Frontend (Dex)

- [ ] **E.1** `js/render.js` — formulário "Novo post":
  - Adicionar checkbox **"É lead magnet?"** no fluxo de criação.
  - Se marcado, mostrar 2 campos texto: **"Recurso"** (ex: "framework de prospecção em 5 etapas") e **"CTA na arte"** (placeholder: "Comente FRAMEWORK pra receber na DM").
  - Validação: se checkbox marcado, ambos os campos são obrigatórios.
- [ ] **E.2** `js/prompts.js` — gerador de prompt:
  - Embutir front-matter YAML no header do prompt:
    ```
    ---
    is_lead_magnet: true
    lead_magnet_resource: "..."
    cta_arte: "..."
    ---
    ```
  - Se `is_lead_magnet=false`, embutir explicitamente `is_lead_magnet: false` (não omitir — assim o Step 0 do squad sabe que veio do CCC e pula a pergunta).
- [ ] **E.3** `js/data.js` — query e write:
  - Atualizar query de posts para incluir `is_lead_magnet, lead_magnet_resource, cta_arte`.
  - Atualizar formulário de edit para permitir mudar esses campos pós-criação (UX feature — Thiago pode marcar post antigo retroativamente).
- [ ] **E.4** Vitrine: badge **"📌 Lead Magnet"** ao lado dos badges existentes (urgência) quando `is_lead_magnet=true`. Hover/tooltip mostra o `lead_magnet_resource`.

### F. CLI (Dex)

- [ ] **F.1** `aiox-squads/shared/scripts/save-post-cli.js` — adicionar flags:
  - `--is-lead-magnet` (boolean flag)
  - `--lead-magnet-resource <text>`
  - `--cta-arte <text>`
- [ ] **F.2** Quando o squad terminar e rodar `save-post-cli`, ele lê o front-matter do `output/post-final.md` e passa as 3 flags. CLI faz upsert no `posts` com os 3 campos.

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
