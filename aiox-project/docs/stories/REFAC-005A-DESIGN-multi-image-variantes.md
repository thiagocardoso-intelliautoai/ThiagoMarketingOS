# Story REFAC-005A-DESIGN — Variantes Multi-Image dos Estilos Existentes

**🏷️ ID:** `REFAC-005A-DESIGN`
**📐 Estimativa:** 4-6h design + 6-10h impl (total 10-16h, com gate humano duro entre os dois)
**🔗 Depende de:** REFAC-005A-INFRA (fase 2 só começa com infra pronta)
**🔗 Bloqueia:** —
**👤 Assignee:**
- **Fase 1 (design):** Squad Creator + Thiago (checkpoint humano DURO) + UX Design Expert (Uma)
- **Fase 2 (impl):** Dev (Dex)
**🏷️ Labels:** `refactor`, `feature`, `design`, `squad-creator`, `multi-image`, `algoritmo-2026`, `checkpoint-humano`
**📊 Status:** **Deferred** (decisão estratégica em 2026-05-09: NÃO implementar variantes agora. Padrão de produção atual do Thiago não justifica o investimento. Doc de decisão completo: [`design-multi-image-variantes.md`](../design-multi-image-variantes.md). Gate de reabertura documentado lá.)

**📚 Brief:** [REFAC-005A original (superseded)](REFAC-005A-multi-image-design-impl.md) — análise estratégica do @analyst (Atlas) em 2026-05-09. Esta story trata APENAS de design + impl das variantes; infra técnica está em [REFAC-005A-INFRA](REFAC-005A-INFRA-multi-image-infra.md).

---

## Descrição

> Como **Thiago** (~1.000 conexões, faixa onde imagem autoral domina — §5.0 do algoritmo), eu quero saber **quais dos meus estilos existentes ganham uma variante multi-image** (ex: "Pessoa+Texto Multi-Image"), com **proposição estratégica + fonte de fotos + range de N + critério de quando usar** definidos por variante. Multi-image não é estilo — é modificador de estilo. Antes de codar, quero o **squad-creator** + Uma desenharem comigo quais variantes valem a pena, ancoradas em proposições reais.

## Problema Atual

- A REFAC-005A original tratou "Multi-Image" como estilo novo. Erro categórico — multi-image é envelope de formato, não proposição estratégica/visual.
- Algoritmo §6.7 deixa claro: **só "3+ imagens autorais"** revertem a penalidade do single-image. Stock multi-image ou IA genérica multi-image **perdem** o ponto.
- Sem definir **fonte de fotos por variante**, qualquer trabalho de multi-image vira lottery: às vezes acerta autoral, às vezes tropeça em stock genérico.
- Os estilos atuais (Pessoa+Texto, Print de Autoridade, Rascunho no Papel) têm proposições claras. Algumas combinam bem com multi-image; outras não.

## Contexto Técnico

### Decisão estratégica (Atlas, 2026-05-09): variantes em vez de estilo novo

Multi-image é tratado como **modificador** de estilo existente, não estilo separado. Cada variante tem:
- **Proposição estratégica** (que ponto comprovar com sequência de imagens vs imagem única)
- **Fonte de fotos** (autoral exclusivo / misto autoral+pesquisa / IA aceitável — gate explícito)
- **Range de N** (quantidade ideal pra esta variante específica)
- **Critério de quando recomendar** (heurística pro `recommend-visual.js`)

### Decisão de checkpoint (Aria, plan §5.8.2): CHECKPOINT HUMANO DURO

Doc de design entregue antes da impl. Thiago assina explicitamente. Fase 2 só começa após assinatura.

### Hipóteses iniciais (a validar com squad-creator + Thiago)

| Estilo existente | Variante multi-image faz sentido? | Hipótese de proposição |
|------------------|----------------------------------|----------------------|
| **Pessoa+Texto** | **Sim, candidato forte** | Jornada/transformação narrada por fotos autorais do Thiago em sequência (3-5 fotos do mesmo evento ou processo). Fonte: autoral exclusivo. |
| **Print de Autoridade** | **Talvez** | Prints encadeados (ex: 3 prints da mesma conversa, ou de 3 conversas diferentes que provam o mesmo ponto). Fonte: prints reais autorais. |
| **Rascunho no Papel** | **Provavelmente não** | 1 rascunho já carrega o ponto; sequência dilui. Mas pode ser "rascunho + foto da implementação" (2-3 imagens). A validar. |

Decisão final fica no doc de design.

### Decisões pré-execução já capturadas com Thiago (2026-05-09)

- **Vitrine no CCC:** carousel horizontal com swipe (decidido na infra story)
- **Overlay de texto:** apenas na primeira imagem (capa) — demais são fotos limpas
- **Range de N:** seguir recomendação do algoritmo (algoritmo diz "3+", sem teto explícito; squad-creator define range por variante baseado em produção realista do Thiago)
- **Tipo de narrativa:** squad-creator decide caso a caso, por variante e por post

### Arquivos-chave

- **Doc de design (novo):** `aiox-project/docs/design-multi-image-variantes.md`
- **Squad capas:**
  - `aiox-squads/squads/capas-linkedin/squad.yaml` — adicionar entradas das variantes aprovadas
  - `aiox-squads/squads/capas-linkedin/templates/{variante}-multi-base.html` (1 template por variante aprovada)
  - `aiox-squads/squads/capas-linkedin/agents/designer.md` — extender pra gerar N imagens
  - `aiox-squads/squads/capas-linkedin/data/visual-styles.md` — descrição de cada variante
- **CCC:**
  - `content-command-center/js/prompts.js` — adicionar variantes em `CoverStyles`
  - `content-command-center/js/recommend-visual.js` — heurística por variante

---

## Sub-tarefas

### Fase 1 — Design (Squad Creator + Thiago + Uma)

- [ ] **1.1** `/squad-creator` lê: brief desta story + REFAC-005A original (referência histórica) + `linkedin-algorithm-2026-reference.md` (§5.0, §5.1, §6.7) + `aiox-squads/squads/capas-linkedin/data/visual-styles.md` (proposições atuais).

- [ ] **1.2** `/squad-creator` produz `aiox-project/docs/design-multi-image-variantes.md` cobrindo:

  **Para cada estilo existente** (Pessoa+Texto, Print de Autoridade, Rascunho no Papel):
  - **Faz sentido em multi-image?** Sim / Não / Condicional. Justificar com base em proposição.
  - Se **sim** ou **condicional**, definir a variante:
    - **Nome da variante:** ex: "Pessoa+Texto Multi-Image"
    - **Proposição estratégica:** que tipo de post pede esta variante (ex: jornada, transformação, processo, série de exemplos)
    - **Fonte de fotos:** autoral exclusivo / misto / IA permitida — com gate explícito (ex: "se Thiago não tem 3 fotos autorais do evento, squad rejeita e sugere variante single")
    - **Range de N:** quantidade ideal (ex: 3-5)
    - **Narrativa típica:** sequência temporal, ângulos diferentes, momentos distintos, ou outra
    - **Overlay de texto:** apenas primeira (decisão pré-aprovada) — confirmar ou ajustar por variante
    - **Tempo de produção esperado** vs single-image equivalente
    - **Critério heurístico de recomendação:** como o `recommend-visual.js` decide oferecer esta variante

  **Decisões transversais:**
  - **Manifest JSON**: schema final (já antecipado em REFAC-005A-INFRA, mas refinar campos como `caption` por variante)
  - **Bloco CTA-na-arte (lead magnet)**: aplicar como REFAC-002 — apenas última imagem do multi-image ganha CTA. Confirmar por variante.
  - **Auto-publish no LinkedIn**: fora de escopo desta story (manual). Doc menciona como trabalho futuro.

- [ ] **1.3** **Uma (UX Design Expert)** opina sobre carousel:
  - Affordance de swipe no desktop (mouse drag? scroll horizontal? botões prev/next?)
  - Indicadores de página (dots, contador "1/3", thumbnails)
  - Comportamento mobile (swipe nativo + impedir scroll vertical durante swipe horizontal)
  - Output: parágrafo no `design-multi-image-variantes.md` com recomendação e justificativa.

- [ ] **1.4** **CHECKPOINT HUMANO DURO** — Thiago revisa `design-multi-image-variantes.md`, comenta diff/aprova, **assina explicitamente** ("✅ Aprovado por Thiago em [YYYY-MM-DD]"). Status da fase 1 = "Done" só com a assinatura.

### Fase 2 — Implementação (Dev) — só começa após 1.4 assinada E REFAC-005A-INFRA Done

- [ ] **2.1 (Dex)** Para cada variante aprovada na fase 1, criar `aiox-squads/squads/capas-linkedin/templates/{variante-slug}-multi-base.html`:
  - Estende template single-image equivalente (ex: `pessoa-texto-base.html` → `pessoa-texto-multi-base.html`)
  - Diferenças: posição do bloco texto (apenas na primeira imagem do batch), espaço para N variantes
  - Bloco CTA-na-arte conforme REFAC-002 (apenas última imagem renderiza CTA)

- [ ] **2.2 (Dex)** Atualizar `aiox-squads/squads/capas-linkedin/squad.yaml`:
  - Adicionar 1 entrada por variante aprovada na seção `templates`
  - Marcar como `multi: true` (campo novo) pra Designer saber gerar N imagens

- [ ] **2.3 (Dex)** Estender `aiox-squads/squads/capas-linkedin/agents/designer.md`:
  - Suporte a variantes multi-image: ler `multi: true` no template, gerar N imagens em loop
  - Aplicar overlay de texto apenas na primeira imagem
  - Aplicar bloco CTA apenas na última imagem (se `is_lead_magnet=true`)
  - Salvar em `output/covers/{slug}/cover-01.png`, `cover-02.png`, etc.
  - Gerar `manifest.json` com `[{file, sequence, caption}]`
  - **Gate de fonte de fotos:** se variante exige autoral e Thiago não tem fotos autorais suficientes, designer **rejeita** e sugere variante single equivalente

- [ ] **2.4 (Dex)** Atualizar `aiox-squads/squads/capas-linkedin/data/visual-styles.md`:
  - Para cada variante aprovada: descrição, proposição estratégica, fonte de fotos, range de N, critério de quando usar (referenciando o doc de design)

- [ ] **2.5 (Dex)** Atualizar CCC:
  - `js/prompts.js`: adicionar entradas das variantes em `CoverStyles`
  - `js/recommend-visual.js`: implementar heurística de recomendação por variante (definida na fase 1 — ex: variante multi-image só recomendada se post menciona ≥3 momentos/cenas/exemplos)

- [ ] **2.6 (Dex)** Smoke test E2E por variante aprovada:
  - Criar 1 post fit pra cada variante → squad gera N PNGs → upload via `upload-cover-cli.js --slides-dir` → CCC mostra carousel
  - Smoke test de gate de fonte: criar post sem fotos autorais suficientes → squad rejeita com mensagem clara

---

## Acceptance Criteria

### Fase 1 — Design

1. **Given** `/squad-creator` invocado, **When** entrega `aiox-project/docs/design-multi-image-variantes.md`, **Then** o doc cobre **cada estilo existente** (Pessoa+Texto, Print de Autoridade, Rascunho no Papel) com decisão **Sim/Não/Condicional**.

2. **Given** o doc, **When** abro a seção de uma variante aprovada, **Then** vejo todos os 7 campos preenchidos (proposição, fonte de fotos, range, narrativa, overlay, tempo, critério heurístico).

3. **Given** o doc, **When** abro a seção "Fonte de fotos" de cada variante, **Then** existe gate explícito (ex: "rejeita se <3 fotos autorais") — não fica em "preferencialmente autoral".

4. **Given** Uma opinou, **When** abro o doc, **Then** existe parágrafo dela sobre affordances de carousel (swipe desktop, indicadores, mobile).

5. **Given** o doc final, **When** Thiago revisa, **Then** existe linha "✅ Aprovado por Thiago em [YYYY-MM-DD]" no fim. **Sem essa linha, fase 2 fica BLOQUEADA.**

### Fase 2 — Implementação

6. **Given** REFAC-005A-INFRA está Done, **When** começo fase 2, **Then** infra funciona (single-image legacy ok, schema com `sequence` aplicado).

7. **Given** templates criados (2.1) para cada variante aprovada, **When** abro, **Then** template estende o single equivalente e tem suporte a N imagens com overlay apenas na primeira.

8. **Given** designer estendido (2.3), **When** rodo squad com input fit pra variante, **Then** entrega N PNGs em `output/covers/{slug}/` + manifest.json + bloco CTA apenas na última (se lead magnet).

9. **Given** designer com gate de fonte ativo, **When** rodo variante autoral-exclusivo sem fotos autorais, **Then** designer **rejeita** com mensagem clara sugerindo variante single.

10. **Given** CCC pós-edit, **When** abro formulário de novo post, **Then** variantes aprovadas aparecem como opção em `CoverStyles`.

11. **Given** `recommend-visual.js`, **When** crio post compatível com variante (ex: post sobre processo com 3+ etapas), **Then** variante multi-image aparece como recomendação.

12. **Given** smoke test E2E por variante, **When** rodo o pipeline completo, **Then** post fit → N imagens → upload → vitrine carousel renderiza ordem correta + dots.

---

## Riscos

- **Squad-creator entrega doc genérico** ("todas as variantes fazem sentido", sem proposição clara). **Mitigação:** AC #1 exige decisão **Sim/Não/Condicional** por estilo; AC #3 exige gate explícito de fonte; Thiago rejeita doc vago.
- **Variantes demais aprovadas** — escopo explode (3 variantes × 2.1 a 2.6 = muito trabalho). **Mitigação:** doc de design tem que justificar cada variante; recomendação implícita = começar com 1 ou 2 variantes (Pessoa+Texto Multi-Image como mais óbvia).
- **Gate de fonte de fotos quebra produção** — se Thiago não tem fotos suficientes pra variantes autorais, squad rejeita demais. **Mitigação:** Thiago assina o doc com plena consciência do gate; se ficar inviável, Thiago pode pedir variante "misto" no doc.
- **Carousel UX mobile quebra** — swipe horizontal pode interferir scroll vertical. **Mitigação:** Uma define affordance na fase 1; smoke test mobile na fase 2.
- **Conflito com REFAC-005A-INFRA não pronta** — fase 2 começa cedo demais. **Mitigação:** dependência explícita; AC #6 valida.

---

## Definition of Done

- [ ] Fase 1 completa (1.1 a 1.4) com **assinatura explícita** do Thiago no doc
- [ ] Fase 2 completa (2.1 a 2.6) para **todas as variantes aprovadas** na fase 1
- [ ] 12 ACs verificados
- [ ] Smoke test E2E de cada variante: post fit → N PNGs → upload → carousel
- [ ] Smoke test de gate de fonte de fotos: rejeita quando deve, aceita quando deve
- [ ] Smoke test do recomendador: variante só aparece em posts compatíveis com critério heurístico
- [ ] Branch local `feature/refac-005a-design-variantes`, mergeada localmente, push fica com `/devops`
- [ ] Commits citam §5.0, §5.1, §6.7 onde aplicável

---

## Out of Scope (não fazer nesta story)

- **Suporte técnico ao formato multi-image** — REFAC-005A-INFRA
- **Auto-publish do post multi-image no LinkedIn** — só geração + persistência + visualização CCC
- **Reordering interativo das imagens no CCC pelo usuário** — vitrine só renderiza
- **Criar Infográfico** — REFAC-005B
- **Criar variantes que não foram aprovadas explicitamente** no doc de design da fase 1
- **Tabela `cover_images`** ou JSONB pra imagens — N rows em `covers` é o caminho (definido em REFAC-005A-INFRA)
- **>9 imagens** — limite do LinkedIn nativo
- **Migrar capas antigas para multi-image** — defaults aplicam, single-image continua

---

## Notes

- **Esta story só sai de Draft após o checkpoint da fase 1.** Status fica em **`Design`** (sub-status custom) ou Draft com nota explícita até Thiago assinar.
- **Multi-image NÃO é estilo** — é modificador de estilo existente. Cada variante herda proposição/visual do estilo base.
- **Gate de fonte de fotos é INEGOCIÁVEL** — sem ele, variantes multi-image autoral viram lottery e perdem o ponto do algoritmo §6.7.
- **Não criar tabela nova no Supabase** — schema feito em REFAC-005A-INFRA.
- **Hipóteses fortes (a validar):** Pessoa+Texto Multi-Image é candidato óbvio. Print de Autoridade Multi-Image é candidato condicional. Rascunho no Papel Multi-Image é fraco.

---

## Decisões Confirmadas (pré-execução)
<!-- Preenchido por /run-wave em 2026-05-09 -->

Decisões estratégicas do Thiago capturadas antes de soltar o squad-creator na fase 1. Squad-creator deve **respeitar** estas decisões e produzir o doc de design coerente com elas (não re-perguntar).

- **Vitrine no Content Command Center** → Carousel horizontal com swipe (fiel ao formato nativo do LinkedIn). Stack vertical descartado. Uma (UX) detalha affordances (dots, swipe desktop, mobile).
- **Overlay de texto nas imagens** → Apenas na primeira imagem (capa). Demais são fotos limpas. Squad-creator pode confirmar/ajustar por variante mas o default é "primeira-only".
- **Range de N (quantidade de imagens)** → Seguir recomendação do algoritmo (§6.7: "3+ imagens autorais" reverte penalidade; sem teto explícito além do limite LinkedIn de 9). Squad-creator define range específico **por variante** baseado em produção realista do Thiago — não fixar número global.
- **Tipo de narrativa** → Squad-creator decide caso a caso, por variante e por post (sequência temporal / ângulos diferentes / momentos distintos). Não fixar narrativa global.

**Origem:** pre-flight 2026-05-09 + análise estratégica @analyst (Atlas).

---

## Change Log

| Data | Agente | Ação |
|------|--------|------|
| 2026-05-09 | @sm (River) | Story criada (Draft) — split de REFAC-005A original após análise do @analyst (Atlas). Foco: design + impl das variantes multi-image dos estilos existentes. Pré-decisões de Thiago capturadas (carousel horizontal, overlay só na primeira). Depende de REFAC-005A-INFRA. |
| 2026-05-09 | @po (Pax) | Validação 10-point: **10/10 GO**. Status: Draft → Ready. **Atenção:** fase 2 só começa após (a) Thiago assinar `design-multi-image-variantes.md` (gate humano duro AC #5), (b) REFAC-005A-INFRA estar Done (AC #6), e (c) doc cumprir decisão Sim/Não/Condicional por estilo (AC #1) com gate explícito de fonte de fotos (AC #3). Hipóteses iniciais tabeladas equilibram liberdade do squad-creator com guard-rails. |
| 2026-05-09 | @run-wave | Decisões pré-execução normalizadas em seção canônica (`## Decisões Confirmadas (pré-execução)`). 4 decisões consolidadas: vitrine carousel, overlay primeira, range por variante, narrativa caso a caso. |
| 2026-05-09 | @squad-creator (Craft) | Sessão de análise de viabilidade com Thiago. Conclusão: padrão de produção atual NÃO justifica nenhuma variante: Pessoa+Texto Multi-Image (Thiago raramente tem 3-5 fotos autorais coerentes); Print Multi-Image (compounding evidence muito raro); Rascunho não fit por design. **Status: Ready → Deferred.** Doc de decisão escrito em `aiox-project/docs/design-multi-image-variantes.md` com gate de reabertura documentado. REFAC-005A-INFRA Done permanece valendo como capacidade dormente. |
