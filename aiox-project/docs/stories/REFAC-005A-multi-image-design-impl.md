# Story REFAC-005A — Multi-Image Autoral (Design + Implementação)

> **⚠️ SUPERSEDED em 2026-05-09 por @sm (River) após análise estratégica do @analyst (Atlas).**
>
> **Motivo:** "Multi-Image" foi escopado como estilo novo, mas é apenas um formato (envelope de 1 → N imagens). Os estilos do squad são definidos por proposição estratégica + visual + fonte de asset, não por quantidade. A fonte das imagens (autoral / pesquisa / IA) é o eixo crítico do algoritmo (§6.7 — só "3+ imagens autorais" reverte penalidade) e ficou subdimensionada nesta story.
>
> **Substituída por duas stories independentes:**
> - **[REFAC-005A-INFRA](REFAC-005A-INFRA-multi-image-infra.md)** — suporte técnico ao formato (schema, CLI, vitrine CCC). Sem decisão de estilo. Sem checkpoint humano.
> - **[REFAC-005A-DESIGN](REFAC-005A-DESIGN-multi-image-variantes.md)** — design das variantes multi-image dos estilos existentes (Pessoa+Texto, Print de Autoridade, etc.) com proposição estratégica + fonte de fotos definida por variante. Com checkpoint humano duro.
>
> **Esta story permanece arquivada como referência histórica. NÃO executar.**

---

**🏷️ ID:** `REFAC-005A`
**📐 Estimativa:** 4-6h design + 8-12h impl (total 12-18h, com gate humano duro entre os dois)
**🔗 Depende de:** —
**🔗 Bloqueia:** —
**👤 Assignee:**
- **Fase 1 (design):** Squad Creator + Thiago (checkpoint humano DURO)
- **Fase 2 (impl):** Data Engineer (Dara) + Dev (Dex)
- **Sub-fase UX:** UX Design Expert (Uma) opina sobre vitrine antes da impl
**🏷️ Labels:** `refactor`, `feature`, `design`, `squad-creator`, `supabase`, `algoritmo-2026`, `checkpoint-humano`, `superseded`
**📊 Status:** Superseded (substituída por REFAC-005A-INFRA + REFAC-005A-DESIGN em 2026-05-09)

**📚 Brief:** [Plano da refatoração](../../../C:/Users/thiag/.claude/plans/aswring-you-modo-quirky-bear.md) — seção 3.9 + 5.2 + 5.8.2

---

## Descrição

> Como **Thiago** com base atual de ~1.000 conexões (faixa onde imagem autoral domina — §5.0 do algoritmo), eu quero um estilo novo de capa **Multi-Image Autoral** (3-9 imagens em sequência, post nativo multi-image do LinkedIn — não carrossel PDF) para reverter a penalidade de single-image (§6.7) e maximizar engagement (multi-image: 6.6% engagement, líder em likes — §5.1). Antes de codar, quero o **squad-creator** desenhar comigo o formato (quantas imagens, narrativa, overlay, fonte de fotos), e só então o time implementa.

## Problema Atual

- Squad de capas hoje gera **sempre 1 imagem só** por post.
- LinkedIn permite até 9 imagens em sequência num post nativo (multi-image), distinto de carrossel PDF.
- §6.7 do algoritmo: single-image stock genérico tem penalidade ~30% — **multi-image (3+ imagens autorais) reverte essa penalidade**.
- §5.1: multi-image tem 6.6% engagement, líder em likes especificamente.
- Schema atual (`aiox-project/supabase/migrations/001-initial-schema.sql:58`): `covers UNIQUE(post_id)` — restrição que **impede** múltiplas linhas por post.

## Contexto Técnico

### Decisão (Aria, plan §5.2): N rows em `covers` com `sequence`

- DROP `UNIQUE(post_id)` em `covers`.
- ADD `covers.sequence INT NOT NULL DEFAULT 1`.
- ADD `UNIQUE(post_id, sequence)`.
- Single-image continua funcionando: 1 row por post, `sequence=1`. **Sem mudança em código existente.**
- Multi-image: 3-9 rows por post, `sequence` 1..N. Vitrine ordena por `sequence ASC`.

### Decisão (Aria, plan §5.8.2): CHECKPOINT HUMANO DURO

Stories de design entregam **artefato de design** (não código). Status só vai pra "Done" após Thiago aprovar **explicitamente** o doc. Stories de impl não saem de Draft até o checkpoint passar.

### Diferença crítica

- **Multi-Image post** (esta story) = 3-9 imagens em sequência, post nativo.
- **Carrossel PDF** = 1 PDF multi-página, document post (squad de carrosseis-linkedin existente).

São formatos diferentes. Multi-Image vive no squad de **capas**, não no de carrosseis.

### Arquivos-chave

- **Doc de design (novo):** `aiox-project/docs/design-multi-image.md`
- **Schema:** `aiox-project/supabase/migrations/{NNN}-covers-multi-image.sql` (novo)
- **Squad capas:** extensões em `squad.yaml`, `agents/designer.md`, novo template `templates/multi-image-base.html` (formato definido na fase de design)
- **CCC:** `js/data.js`, `js/render.js` (vitrine ordena por sequence + UI carousel/stack)
- **CCC prompts:** `js/prompts.js` — adicionar Multi-Image em `CoverStyles`

---

## Sub-tarefas

### Fase 1 — Design (Squad Creator + Thiago)

- [ ] **1.1** `/squad-creator` lê o brief desta story + plano da refatoração + `linkedin-algorithm-2026-reference.md` (§5.0, §5.1, §6.7).
- [ ] **1.2** `/squad-creator` produz `aiox-project/docs/design-multi-image.md` com decisões:
  - **Quantas imagens:** 3-5 ou 5-9? (LinkedIn permite até 9.) Trade-off: mais imagens = mais peso visual mas mais tempo de produção.
  - **Tipo de narrativa:**
    - (a) Sequência temporal (antes/durante/depois)
    - (b) Ângulos diferentes do mesmo evento/cena
    - (c) Momentos distintos que provam um ponto
    - (d) Outra
  - **Overlay de texto:** todas as imagens com texto, ou só primeira? Onde mora? Estilo herda de Pessoa+Texto?
  - **Seleção de fotos:** Supabase `source_photos` com categoria nova (`multi-image`)? Mantém categorias existentes? Como agrupar 3-9 fotos coerentes?
  - **Manifest de ordem:** JSON com `[{slug, sequence, caption}]` ou inferido pelo nome de arquivo?
  - **Publicação no LinkedIn:** post nativo multi-image (não PDF). Se vier integração de auto-publish no futuro, qual API usar?
  - **Tempo de produção esperado** vs single-image (referência para REFAC-002 e workflow do squad).
  - **Referências visuais** que Thiago aprova como assinatura.
- [ ] **1.3** **CHECKPOINT HUMANO DURO** — Thiago revisa `design-multi-image.md`, comenta diff/aprova, **assina explicitamente** ("aprovado por Thiago em [data]"). Status da fase 1 = "Done" só com a assinatura.
- [ ] **1.4** **/ux-design-expert (Uma)** opina sobre **vitrine multi-image no CCC**:
  - Renderiza como **carousel UI** (swipe horizontal) ou **stack vertical** (todas as imagens visíveis)?
  - Reordering pelo usuário no CCC: necessário ou pode ficar fixo pela `sequence`?
  - Output: parágrafo no `design-multi-image.md` com a recomendação e justificativa.

### Fase 2 — Implementação (Data Engineer + Dev) — só começa após 1.3 assinada

- [ ] **2.1 (Dara)** Criar migration `aiox-project/supabase/migrations/{NNN}-covers-multi-image.sql`:
  ```sql
  -- Permite N capas por post (multi-image)
  -- Single-image continua funcionando (sequence=1, sem outras linhas)

  -- Drop UNIQUE(post_id) — preserva data via constraint name lookup
  ALTER TABLE covers DROP CONSTRAINT IF EXISTS covers_post_id_key;

  -- Add sequence
  ALTER TABLE covers ADD COLUMN IF NOT EXISTS sequence INT NOT NULL DEFAULT 1;

  -- Add UNIQUE composto
  ALTER TABLE covers ADD CONSTRAINT covers_post_id_sequence_key UNIQUE (post_id, sequence);

  COMMENT ON COLUMN covers.sequence IS 'Ordem da imagem no post multi-image (1..N). Single-image = 1.';
  ```
  - Validar com `\d covers` no Supabase: aparece `sequence INT NOT NULL DEFAULT 1` + `UNIQUE(post_id, sequence)`.
  - Testar idempotência rodando 2×.
- [ ] **2.2 (Dex)** Implementar workflow do estilo Multi-Image no squad de capas conforme decisões da fase 1:
  - Adicionar entrada em `aiox-squads/squads/capas-linkedin/squad.yaml` (templates).
  - Criar `templates/multi-image-base.html` (formato conforme design aprovado).
  - Estender `agents/designer.md` para gerar N imagens em sequência (loop ou batch — decisão técnica do Dex), salvar em `output/covers/{slug}/cover-01.png`, `cover-02.png`, etc.
  - Estender `data/visual-styles.md` com descrição do estilo (referenciando o doc de design).
  - Manifest JSON em `output/covers/{slug}/manifest.json` com `[{slug, sequence, caption}]`.
- [ ] **2.3 (Dex)** Atualizar CLI `aiox-squads/shared/scripts/upload-cover-cli.js`:
  - Aceitar `--slides-dir <dir>` para múltiplas imagens (similar ao upload-carousel-cli, mas como `covers` rows).
  - Para cada imagem do diretório, criar 1 row em `covers` com `sequence` correta.
- [ ] **2.4 (Dex)** Atualizar CCC frontend:
  - `js/data.js`: query de `covers` ordena por `sequence ASC` e devolve **array** (não single object).
  - `js/render.js`: vitrine renderiza N imagens conforme decisão de Uma (carousel ou stack).
  - `js/prompts.js`: adicionar entrada **Multi-Image** em `CoverStyles` com índice próximo (3 ou 5 — vagas dos cortados).
  - `js/recommend-visual.js`: adicionar lógica de quando recomendar Multi-Image (ex: quando o post menciona ≥3 momentos/cenas/exemplos).
- [ ] **2.5 (Dex)** Suportar `is_lead_magnet=true` no Multi-Image:
  - Designer lê front-matter; se lead magnet, **apenas a última imagem** ganha bloco CTA-na-arte com `cta_arte` (igual aos outros estilos da REFAC-002).
  - Documentar no `data/visual-styles.md`.

---

## Acceptance Criteria

### Fase 1 — Design

1. **Given** o `/squad-creator` invocado, **When** entrega `aiox-project/docs/design-multi-image.md`, **Then** o doc cobre todas as 7 decisões da sub-task 1.2 (quantas imagens, narrativa, overlay, fotos, manifest, publicação, tempo).

2. **Given** o doc de design, **When** Thiago revisa, **Then** existe linha "✅ Aprovado por Thiago em [YYYY-MM-DD]" no fim do doc. **Sem essa linha, fase 2 fica BLOQUEADA.**

3. **Given** Uma opinou, **When** abro o doc, **Then** vejo a recomendação dela sobre vitrine (carousel vs stack) com justificativa.

### Fase 2 — Implementação

4. **Given** o Supabase pós-migration, **When** rodo `\d covers`, **Then** vejo coluna `sequence INT NOT NULL DEFAULT 1` + constraint `UNIQUE(post_id, sequence)` + ausência de `UNIQUE(post_id)` antiga.

5. **Given** posts antigos com 1 cover (single-image), **When** abro o CCC, **Then** continuam aparecendo normais (sem regressão — defaults aplicam, `sequence=1`).

6. **Given** o squad de capas em modo Multi-Image, **When** rodo com input válido, **Then** o squad entrega N (3-9) PNGs em `output/covers/{slug}/` + manifest JSON com sequence.

7. **Given** o upload via CLI, **When** rodo `upload-cover-cli.js --slides-dir output/covers/{slug}/`, **Then** o Supabase tem N rows em `covers` para o `post_id` correspondente, com `sequence` 1..N.

8. **Given** post com Multi-Image salvo, **When** abro o CCC, **Then** a vitrine renderiza as N imagens em ordem (carousel ou stack conforme Uma decidir).

9. **Given** Multi-Image com `is_lead_magnet=true`, **When** o squad gera as imagens, **Then** apenas a última imagem tem o bloco CTA-na-arte com `cta_arte`.

10. **Given** Multi-Image com `is_lead_magnet=false`, **When** o squad gera as imagens, **Then** **nenhuma imagem** tem bloco CTA (variantes do template removem o bloco antes da render).

---

## Riscos

- **Design da fase 1 fica vago** — Thiago aprova doc sem decisões concretas. **Mitigação:** AC #1 exige cobrir 7 decisões específicas; AC #2 exige assinatura explícita.
- **Drop UNIQUE quebra dados** — se algum `post_id` tiver múltiplas rows acidentais, ALTER TABLE falha. **Mitigação:** validar com `SELECT post_id, COUNT(*) FROM covers GROUP BY post_id HAVING COUNT(*) > 1` antes da migration. Default 1 e novo UNIQUE composto previnem futuros conflitos.
- **Vitrine multi-image no CCC fica complicada** — UX de carousel pode quebrar mobile. **Mitigação:** Uma decide carousel vs stack na fase 1. Stack vertical é fallback simples.
- **Auto-publish multi-image não existe** — LinkedIn API pode exigir endpoint diferente. **Mitigação:** fora de escopo desta story (só geração + persistência); publicação via post nativo manual por enquanto. Doc de design aborda como **trabalho futuro**.
- **Single-image stock pode aparecer em Multi-Image** — se Thiago não tiver 3+ fotos autorais, time gera fotos genéricas e perde o ponto. **Mitigação:** doc de design define gate "fonte de fotos" (Supabase autoral); se gate falha, squad rejeita e sugere outro estilo.

---

## Definition of Done

- [ ] Fase 1 completa (1.1, 1.2, 1.3, 1.4) com **assinatura explícita** do Thiago no doc
- [ ] Fase 2 completa (2.1 a 2.5)
- [ ] 10 ACs verificados
- [ ] Smoke test E2E: criar 1 post Multi-Image (fase 2) → squad gera 3-5 PNGs → upload → vitrine renderiza → Thiago vê preview
- [ ] Smoke test de regressão: 1 post single-image antigo continua aparecendo normal
- [ ] Migration aplicada e idempotente
- [ ] Branch local `feature/refac-005a-multi-image`, mergeada localmente, push fica com `/devops`
- [ ] Commits citam §5.0, §5.1, §6.7 onde aplicável

---

## Out of Scope (não fazer nesta story)

- **Auto-publish do post multi-image no LinkedIn** — só geração + persistência. Publicação manual (LinkedIn API multi-image fica em iteração futura).
- **Reordering interativo das imagens no CCC pelo usuário** — se Uma decidir "fixo pela sequence", reorder fica fora.
- **Criar Infográfico** — REFAC-005B.
- **Criar tabela `cover_images`** ou usar JSONB — N rows em `covers` com `sequence` é o caminho.
- **Suportar mais de 9 imagens** — limite do LinkedIn nativo.
- **Migrar capas antigas para Multi-Image** — defaults aplicam, single-image continua.
- **Quality gate automatizado de "fonte de fotos é autoral"** — gate humano via doc de design.

## Notes

- **Esta story só sai de Draft após o checkpoint da fase 1.** Status fica em **`Design`** (sub-status custom, ou `Draft` com nota) até Thiago assinar.
- **Não combinar com REFAC-005B (Infográfico)** — checkpoints humanos são independentes. Thiago pode aprovar Multi-Image sem ter visto Infográfico.
- **Não introduzir tabela `cover_images`** — N rows na tabela `covers` é o caminho boring (plan §5.2).
- **Não usar JSONB** para multi-image — perde índices, queries, integração com colunas existentes.
- **Post nativo multi-image vs Carrossel PDF** — não confundir. Multi-Image vive em capas, não em carrosseis.

---

## Change Log

| Data | Agente | Ação |
|------|--------|------|
| 2026-05-08 | @sm (River) | Story criada (Draft) |
| 2026-05-08 | @po (Pax) | Validação 10-point: 10/10. **GO**. Status: Draft → Ready. **Atenção:** fase 2 só começa após Thiago assinar `design-multi-image.md` (gate humano duro no AC #2). Adicionada seção Out of Scope. |
| 2026-05-09 | @sm (River) | **SUPERSEDED** após análise do @analyst (Atlas). Confusão entre formato (envelope) e estilo (proposição). Quebrada em REFAC-005A-INFRA (técnico, sem checkpoint) + REFAC-005A-DESIGN (variantes dos estilos existentes, com checkpoint). Status: Ready → Superseded. |
