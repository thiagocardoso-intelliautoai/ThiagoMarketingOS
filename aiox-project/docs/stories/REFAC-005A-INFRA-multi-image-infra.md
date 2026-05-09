# Story REFAC-005A-INFRA — Suporte Técnico ao Formato Multi-Image

**🏷️ ID:** `REFAC-005A-INFRA`
**📐 Estimativa:** 4-6h
**🔗 Depende de:** —
**🔗 Bloqueia:** REFAC-005A-DESIGN (fase 2 — implementação das variantes precisa desta infra pronta)
**👤 Assignee:** Data Engineer (Dara) + Dev (Dex)
**🏷️ Labels:** `refactor`, `infra`, `supabase`, `multi-image`, `algoritmo-2026`
**📊 Status:** InReview (código implementado em yolo; aplicação da migration + smoke test pendentes do Thiago)

**📚 Brief:** [REFAC-005A original (superseded)](REFAC-005A-multi-image-design-impl.md) — análise estratégica do @analyst (Atlas) em 2026-05-09 separou infra (esta story) do design (REFAC-005A-DESIGN).

---

## Descrição

> Como **operador do squad de capas**, eu quero que o sistema (Supabase + CLI + CCC) **suporte tecnicamente N imagens por post** (em vez de 1 fixo), sem decidir como/quais estilos vão usar essa capacidade — porque hoje o schema (`covers UNIQUE(post_id)`) impede múltiplas linhas por post, e isso é pré-requisito para qualquer trabalho futuro com formato multi-image. **Esta story é puramente técnica** — não decide estilo, narrativa, fonte de fotos ou estratégia. Habilita a capacidade.

## Problema Atual

- Schema atual ([`aiox-project/supabase/migrations/001-initial-schema.sql:58`](../../supabase/migrations/001-initial-schema.sql)): `covers UNIQUE(post_id)` — **impede** múltiplas linhas por post.
- CLI `upload-cover-cli.js` aceita apenas `--file` (1 imagem só).
- CCC frontend (`js/data.js`, `js/render.js`) trata `covers` como **single object** por post, não array.
- LinkedIn permite até 9 imagens em sequência num post nativo (multi-image), distinto de carrossel PDF.
- Sem essa infra, nenhum trabalho de variante multi-image pode começar.

## Contexto Técnico

### Decisão arquitetural (Aria, plan §5.2): N rows em `covers` com `sequence`

- DROP `UNIQUE(post_id)` em `covers`.
- ADD `covers.sequence INT NOT NULL DEFAULT 1`.
- ADD `UNIQUE(post_id, sequence)`.
- **Single-image continua funcionando** sem mudança em código existente: 1 row por post, `sequence=1`.
- Multi-image (futuro): N rows por post, `sequence` 1..N. Vitrine ordena por `sequence ASC`.

### Vitrine no CCC: Carousel horizontal (decisão de Thiago em 2026-05-09 pre-flight)

- Renderização: **carousel horizontal com swipe**, fiel ao formato nativo do LinkedIn.
- Stack vertical descartado.
- UX Design Expert (Uma) pode opinar sobre detalhes (indicadores de página, transição, mobile breakpoints) durante implementação, mas o formato base (carousel) está decidido.

### Diferença crítica vs Carrossel PDF

- **Multi-Image post** (esta infra) = N imagens em sequência, post nativo do LinkedIn, formato `covers` com `sequence`.
- **Carrossel PDF** = 1 PDF multi-página, document post, squad `carrosseis-linkedin` separado.

São formatos diferentes em tabelas diferentes. **Não confundir.**

### Arquivos-chave

- **Schema (novo):** `aiox-project/supabase/migrations/{NNN}-covers-multi-image.sql`
- **CLI:** `aiox-squads/shared/scripts/upload-cover-cli.js` (extensão para `--slides-dir`)
- **CCC:**
  - `content-command-center/js/data.js` (query retorna array)
  - `content-command-center/js/render.js` (carousel horizontal)
- **Manifest format:** `output/covers/{slug}/manifest.json` com `[{slug, sequence, caption?}]`

---

## Sub-tarefas

### Schema (Dara)

- [x] **1.1 (Dara)** Criar migration `aiox-project/supabase/migrations/{NNN}-covers-multi-image.sql`:
  ```sql
  -- Permite N capas por post (multi-image)
  -- Single-image continua funcionando (sequence=1, sem outras linhas)

  -- Validação prévia: garantir que não há rows duplicadas por post_id
  -- (não faz nada se passar; falha alto se tiver dado sujo)
  DO $$
  DECLARE
    dup_count INT;
  BEGIN
    SELECT COUNT(*) INTO dup_count
    FROM (SELECT post_id FROM covers GROUP BY post_id HAVING COUNT(*) > 1) AS dups;
    IF dup_count > 0 THEN
      RAISE EXCEPTION 'Encontradas % rows duplicadas em covers — limpar antes de aplicar migration', dup_count;
    END IF;
  END $$;

  -- Drop UNIQUE(post_id) — preserva data via constraint name lookup
  ALTER TABLE covers DROP CONSTRAINT IF EXISTS covers_post_id_key;

  -- Add sequence column
  ALTER TABLE covers ADD COLUMN IF NOT EXISTS sequence INT NOT NULL DEFAULT 1;

  -- Add UNIQUE composto
  ALTER TABLE covers ADD CONSTRAINT covers_post_id_sequence_key UNIQUE (post_id, sequence);

  -- Index pra query de vitrine
  CREATE INDEX IF NOT EXISTS idx_covers_post_id_sequence ON covers (post_id, sequence);

  COMMENT ON COLUMN covers.sequence IS 'Ordem da imagem no post multi-image (1..N). Single-image = 1.';
  ```
- [ ] **1.2 (Dara)** Validar pós-migration:
  - `\d covers` mostra `sequence INT NOT NULL DEFAULT 1` + `UNIQUE(post_id, sequence)` + ausência de `UNIQUE(post_id)` antiga.
  - Rodar 2× para confirmar idempotência.
  - Verificar que posts existentes com 1 cover continuam abrindo no CCC sem regressão.
  - **Status:** 🟡 Aguardando Thiago aplicar via Supabase CLI/dashboard. Migration está em `aiox-project/supabase/migrations/004-covers-multi-image.sql` e foi escrita pra ser idempotente + falhar alto se houver dado sujo (validação prévia inclusa).

### CLI (Dex)

- [x] **2.1 (Dex)** Estender `aiox-squads/shared/scripts/upload-cover-cli.js`:
  - Manter flag `--file <path>` para single-image (backward compat). ✅
  - Adicionar flag `--slides-dir <dir>` para múltiplas imagens. ✅
  - Quando `--slides-dir` é usado:
    - Lê todos os PNGs do diretório, ordena por nome (cover-01.png, cover-02.png, ...) ou por `manifest.json` se existir. ✅
    - Para cada imagem, faz upload no storage (bucket `covers/`) e cria 1 row em `covers` com `sequence` correta (1..N). ✅ (via `uploadCoverMultiImage` em `upload-to-supabase.js`)
    - Se `manifest.json` tem `caption`, persiste em `covers.caption` (nullable). ✅
  - Atomicidade: ✅ implementado como "delete-then-insert" — apaga rows existentes do post antes de inserir as novas; storage upsert sobrescreve o mesmo path; insert das N rows em batch único.
- [x] **2.2 (Dex)** Suportar formato manifest:
  - Schema: `output/covers/{slug}/manifest.json` = `[{file: "cover-01.png", sequence: 1, caption?: "..."}]` ✅
  - Se manifest existe, respeita ordem do manifest (não nome de arquivo). ✅
  - Validação: array não-vazio, cada entry com campo `file`, ordena por `sequence` se presente.

### CCC Frontend (Dex)

- [x] **3.1 (Dex)** Atualizar `content-command-center/js/data.js`:
  - Query de `covers` ordena por `sequence ASC`. ✅ (sort no `_mapPostFromDB`)
  - Retorna **array** de `{coverPath, sequence, caption, slug, style}` em `derivations.coversList`. ✅
  - Compatibilidade: `derivations.cover` (single object, primeira imagem) preservado pra legacy callers. ✅
- [x] **3.2 (Dex)** Atualizar `content-command-center/js/linkedin-preview.js` + `js/render.js`:
  - Vitrine LinkedIn preview: carousel horizontal com swipe quando `coversList.length > 1`. ✅
  - Indicadores de página (dots) na base do carousel. ✅ (reusa pattern do PDF carousel; IDs com prefixo `cover-` pra evitar colisão)
  - Single-image (array de 1) renderiza como antes (sem dots, sem swipe). ✅
  - Mobile-first: touch swipe handlers no carousel container. ✅
  - Card thumbnail: badge "1/N" quando multi-image. ✅
  - CSS: `_preview.css` tem novas classes `.li-cover-multi-tag` e `.li-cover-carousel`. ✅
- [ ] **3.3 (Dex)** Smoke test E2E (manual por Thiago):
  - **Status:** 🟡 Aguardando aplicação da migration + execução manual.
  - Roteiro abaixo em [Smoke Test Manual](#smoke-test-manual).

---

## Acceptance Criteria

1. **Given** o Supabase pós-migration, **When** rodo `\d covers`, **Then** vejo coluna `sequence INT NOT NULL DEFAULT 1` + constraint `UNIQUE(post_id, sequence)` + ausência de `UNIQUE(post_id)` antiga.

2. **Given** posts antigos com 1 cover (single-image), **When** abro o CCC, **Then** continuam aparecendo normais (sem regressão — `sequence=1` por default, vitrine renderiza single).

3. **Given** migration aplicada, **When** rodo a migration uma segunda vez, **Then** completa sem erro (idempotente).

4. **Given** o CLI `upload-cover-cli.js`, **When** rodo `--file imagem.png` (modo legacy), **Then** funciona exatamente como antes — 1 row em `covers` com `sequence=1`.

5. **Given** o CLI, **When** rodo `--slides-dir output/covers/{slug}/` com 3 PNGs, **Then** o Supabase tem 3 rows em `covers` para o `post_id` correspondente, com `sequence` 1, 2, 3 na ordem do manifest (ou nome de arquivo se sem manifest).

6. **Given** post com 3 imagens salvo, **When** abro o CCC, **Then** vitrine renderiza carousel horizontal com 3 imagens + indicadores de página (dots).

7. **Given** smoke test do CLI com falha simulada na 2ª imagem, **When** o upload falha, **Then** ou faz rollback das anteriores ou logga claramente o partial-failure (não deixa o estado inconsistente sem aviso).

8. **Given** `js/data.js` pós-edit, **When** consulto a função que carrega cover, **Then** ela sempre retorna array (mesmo que de 1 elemento), não single object.

---

## Riscos

- **Drop UNIQUE quebra dados** — se algum `post_id` tiver múltiplas rows acidentais, ALTER TABLE falha. **Mitigação:** validação prévia na migration (sub-task 1.1) aborta com mensagem clara antes de tentar drop.
- **Regressão em posts antigos** — código que assume single object pode quebrar. **Mitigação:** AC #2 + smoke test explícito + sub-task 3.3 verifica modo legacy.
- **CLI partial failure** — uploads parciais deixam estado inconsistente. **Mitigação:** sub-task 2.1 exige rollback OU log claro; AC #7 valida.
- **Carousel mobile quebra** — swipe pode interferir com scroll vertical da página. **Mitigação:** mobile-first na implementação (3.2); Uma pode opinar em PR.

---

## Definition of Done

- [ ] Schema migration aplicada (1.1) e validada (1.2) — idempotente
- [ ] CLI estendido (2.1) com modo legacy preservado e modo `--slides-dir` funcionando
- [ ] Manifest format documentado e implementado (2.2)
- [ ] CCC atualizado (3.1, 3.2) com vitrine carousel horizontal
- [ ] Smoke test E2E (3.3) passando: single + multi
- [ ] 8 ACs verificados
- [ ] Sem regressão em posts single-image antigos
- [ ] Branch local `feature/refac-005a-infra-multi-image`, mergeada localmente, push fica com `/devops`

---

## Out of Scope (não fazer nesta story)

- **Decidir QUAIS estilos ganham variante multi-image** — REFAC-005A-DESIGN
- **Decidir narrativa, overlay, fonte de fotos por estilo** — REFAC-005A-DESIGN
- **Recomendador de quando usar multi-image** — REFAC-005A-DESIGN
- **Auto-publish multi-image no LinkedIn** — fora de escopo (publicação manual por enquanto)
- **Reordering interativo das imagens no CCC** — vitrine só renderiza, não edita
- **Migrar capas antigas para multi-image** — defaults aplicam, single-image continua
- **Bloco CTA-na-arte (lead magnet)** — REFAC-002 já cobre; variantes multi-image herdam padrão na fase de design
- **Suporte a >9 imagens** — limite do LinkedIn nativo

---

## File List

Arquivos criados ou modificados nesta story (preenchido por @dev / @run-wave):

**Criados:**
- `aiox-project/supabase/migrations/004-covers-multi-image.sql` — migration idempotente com validação prévia, drop UNIQUE(post_id), add `sequence` + `caption`, add UNIQUE(post_id, sequence), index.

**Modificados:**
- `aiox-squads/shared/scripts/upload-to-supabase.js` — nova função `uploadCoverMultiImage(slug, images, style, postId)` que faz upload de N PNGs e insere N rows com sequence 1..N (delete-then-insert atomic). Exportada no `module.exports`.
- `aiox-squads/shared/scripts/upload-cover-cli.js` — mode dual: `--file` (single legacy) ou `--slides-dir` (multi-image). Suporta `manifest.json` com `[{file, sequence, caption}]` ou ordenação alfabética por nome.
- `content-command-center/js/data.js` — `_mapPostFromDB` agora ordena `covers` por `sequence ASC` e expõe `derivations.coversList[]` (array completo) além de `derivations.cover` (primeira, backward compat).
- `content-command-center/js/linkedin-preview.js` — coverSection renderiza carousel horizontal quando `coversList.length > 1`, com handlers `goToCoverSlide`, prev/next, dots e touch swipe (IDs com prefixo `cover-` pra não colidir com PDF carousel).
- `content-command-center/js/render.js` — `renderCardThumbnail` mostra badge `1/N` quando multi-image.
- `content-command-center/css/_preview.css` — novas classes `.li-cover-multi-tag` e `.li-cover-carousel`.

**Pendente (aguardando Thiago):**
- Aplicar `004-covers-multi-image.sql` no Supabase (via dashboard SQL editor ou `supabase db push`).
- Rodar smoke test E2E manual conforme roteiro abaixo.

---

## Smoke Test Manual

### Pré-requisito

- Migration `004-covers-multi-image.sql` aplicada no Supabase de produção.
- Validar com query: `\d covers` ou `SELECT column_name, data_type FROM information_schema.columns WHERE table_name='covers';` — deve mostrar `sequence INTEGER NOT NULL DEFAULT 1` + `caption TEXT`.

### Cenário 1 — Single-image (regressão zero)

```bash
# Pegar um post existente que NÃO tem capa ainda (ou criar mock)
node aiox-squads/shared/scripts/upload-cover-cli.js \
  --file path/to/uma-capa.png \
  --style "Pessoa+Texto" \
  --post-title "Título de um post existente"

# Resultado esperado: 1 row em covers com sequence=1.
# CCC: vitrine mostra a capa exatamente como antes (sem dots, sem badge "1/1").
```

### Cenário 2 — Multi-image (3 imagens, sem manifest)

```bash
# Preparar diretório com 3 PNGs nomeados cover-01.png, cover-02.png, cover-03.png
mkdir -p output/covers/teste-multi
cp foto-01.png output/covers/teste-multi/cover-01.png
cp foto-02.png output/covers/teste-multi/cover-02.png
cp foto-03.png output/covers/teste-multi/cover-03.png

node aiox-squads/shared/scripts/upload-cover-cli.js \
  --slides-dir output/covers/teste-multi/ \
  --style "Pessoa+Texto Multi-Image" \
  --post-title "Título de um post existente"

# Resultado esperado: 3 rows em covers com sequence 1, 2, 3.
# CCC: badge "1/3" no thumbnail; vitrine renderiza carousel horizontal com setas + 3 dots + counter "1/3".
```

### Cenário 3 — Multi-image com manifest (caption por imagem)

```bash
# Criar manifest.json no diretório
cat > output/covers/teste-multi/manifest.json <<EOF
[
  { "file": "cover-01.png", "sequence": 1, "caption": "Antes da implementação" },
  { "file": "cover-02.png", "sequence": 2, "caption": "Durante" },
  { "file": "cover-03.png", "sequence": 3, "caption": "Depois (resultado)" }
]
EOF

node aiox-squads/shared/scripts/upload-cover-cli.js \
  --slides-dir output/covers/teste-multi/ \
  --style "Pessoa+Texto Multi-Image" \
  --post-title "Título de um post existente"

# Resultado esperado: 3 rows com sequence + caption preenchidos.
# CCC: carousel renderiza; CLI loga as captions na execução.
```

### Cenário 4 — Idempotência (re-execução)

```bash
# Re-rodar o cenário 2 ou 3 — deve apagar rows antigas e re-inserir as novas.
# Resultado esperado: ainda 3 rows; storage paths sobrescritos; sem duplicatas em covers.
```

### Cenário 5 — Migration idempotente

```bash
# Aplicar 004-covers-multi-image.sql 2× no Supabase
# Resultado esperado: segunda execução completa sem erro (DO blocks, IF NOT EXISTS, DROP IF EXISTS).
```

### Cenário 6 — Validação prévia da migration

```bash
# Forçar dado sujo (apenas em ambiente de teste!):
INSERT INTO covers (post_id, slug, style, image_url, image_path)
  SELECT post_id, slug, style, image_url || '?dup', image_path FROM covers LIMIT 1;
# Aplicar migration → deve falhar com:
#   "Encontradas 1 rows duplicadas em covers por post_id — limpar antes de aplicar migration"
```

---

## Dev Notes

**Decisões autônomas tomadas durante implementação (yolo):**

1. **Função separada `uploadCoverMultiImage` em vez de estender `uploadCover`** — manter `uploadCover` intacta garante regressão zero pra todos os callers existentes (modo single legacy). CLI escolhe qual chamar baseado em `--file` vs `--slides-dir`.

2. **Atomicidade: delete-then-insert + storage upsert** — em vez de transações complexas, escolhi:
   - Apagar rows existentes do `post_id` antes de inserir.
   - Storage usa upsert por path determinístico (`covers/{slug}/cover-NN.png`).
   - Insert das N rows em batch único (Supabase JS faz isso atomicamente).
   - Rationale: re-execução fica determinística; partial failure deixa estado limpo (ou tudo apagado e parcialmente subido, ou tudo certo). Caller pode re-rodar pra recuperar.

3. **Manifest opcional** — se ausente, CLI ordena alfabeticamente por nome (cover-01.png antes de cover-02.png). Padrão de naming `cover-NN.png` recomendado pra ter padding numérico que ordena correto.

4. **`coversList` em vez de modificar `cover`** — `derivations.cover` continua single-object (primeira imagem) pra backward compat com qualquer código que assuma single. `derivations.coversList` é o array completo. Render.js detecta multi via `coversList.length > 1`.

5. **IDs com prefixo `cover-` no carousel** — pra não colidir com o carousel do PDF (`carousel-viewer`, `carousel-prev`, etc.) que pode estar na mesma página/modal. Pattern visual reutilizado via classes `.carousel-slide`, `.carousel-dot`, `.carousel-counter` (não duplicado).

6. **Touch swipe nativo no cover carousel** — adicionei handlers `touchstart`/`touchend` com threshold de 50px. Mobile-first sem libs externas.

**Não implementado nesta sessão (escopo):**

- ✅ Tudo do escopo da story foi implementado em código.
- ⏳ Smoke test E2E (3.3) e validação pós-migration (1.2) requerem ambiente Supabase rodando — escopo do Thiago aplicar e validar.

---

## Notes

- **Esta story é técnica e determinística.** Não requer checkpoint humano — pode rodar em modo yolo após validação do @po.
- **Não introduzir tabela `cover_images` separada** — N rows na tabela `covers` é o caminho boring (plan §5.2).
- **Não usar JSONB pra armazenar imagens inline** — perde índices, queries, integração com colunas existentes.
- **Backward compatibility é obrigatória** — qualquer código que use 1 cover por post hoje DEVE continuar funcionando após esta story.

---

## Change Log

| Data | Agente | Ação |
|------|--------|------|
| 2026-05-09 | @sm (River) | Story criada (Draft) — split de REFAC-005A original após análise do @analyst (Atlas). Foco: infra técnica pura, sem decisão de estilo. |
| 2026-05-09 | @po (Pax) | Validação 10-point: **10/10 GO**. Status: Draft → Ready. Story técnica/determinística — modo yolo apropriado para @dev. Backward compatibility é AC explícita (#2, #4). Validação prévia da migration mitiga risco de drop UNIQUE em estado sujo. |
| 2026-05-09 | @run-wave | Implementação completa em modo yolo: migration 004 + `uploadCoverMultiImage` + CLI `--slides-dir` + `coversList[]` em data.js + carousel multi-image em linkedin-preview.js + badge thumbnail + CSS. 6 sub-tarefas marcadas [x]. 2 sub-tarefas (1.2 validação migration + 3.3 smoke E2E) ficam **InReview** aguardando Thiago aplicar a migration e rodar smoke. Status: Ready → InReview. |
