# Story REFAC-005B — Estilo Infográfico (Design + Implementação)

**🏷️ ID:** `REFAC-005B`
**📐 Estimativa:** 3-5h design + 5-8h impl (total 8-13h, com gate humano duro entre os dois)
**🔗 Depende de:** —
**🔗 Bloqueia:** —
**👤 Assignee:**
- **Fase 1 (design):** Squad Creator + Thiago (checkpoint humano DURO)
- **Fase 2 (impl):** Dev (Dex)
**🏷️ Labels:** `refactor`, `feature`, `design`, `squad-creator`, `algoritmo-2026`, `checkpoint-humano`
**📊 Status:** Ready (validada por @po — sem dependências; impl bloqueada por checkpoint humano duro na fase 1)

**📚 Brief:** [Plano da refatoração](../../../C:/Users/thiag/.claude/plans/aswring-you-modo-quirky-bear.md) — seção 3.10 + 5.8.2

---

## Descrição

> Como **Thiago**, eu quero um estilo novo de capa **Infográfico** (single-page denso ou multi-data) — porque hoje o que mais gera engajamento é post com infográfico (pessoa passa tempo lendo = dwell time §3.1 alto + saves §7.5 quando há especificidade premiada). Antes de codar, quero o **squad-creator** desenhar comigo qual tipologia dá mais resultado estrategicamente, e só então o time implementa o template.

## Problema Atual

- Squad de capas tem 5 estilos (vão pra 3 após REFAC-001: Rascunho no Papel, Pessoa+Texto, Print de Autoridade).
- **Falta** um estilo dedicado a Infográfico — formato com maior afinidade ao algoritmo 2026 para contas <5K conexões:
  - §5.0: imagem autoral domina <5K (Infográfico autoral encaixa).
  - §3.1: dwell time é o sinal forte (Infográfico denso retém leitor).
  - §7.5: especificidade premiada (dados, números, frameworks nomeados) gera 3-4× reach.
- Micro-Infográfico (cortado em REFAC-001) era estilo light/genérico — não substitui um Infográfico estratégico.

## Contexto Técnico

### Decisão (Aria, plan §5.8.2): CHECKPOINT HUMANO DURO

Igual REFAC-005A: doc de design entregue antes da impl, Thiago assina explicitamente, fase 2 só começa após assinatura.

### Schema sem mudança DDL

`covers.style` é TEXT agnóstico — adicionar Infográfico não exige migration. Só adicionar entrada em `prompts.js` do CCC.

### Diferença vs Micro-Infográfico (cortado)

- **Micro-Infográfico (cortado):** "UM dado/métrica/insight visualizado de forma limpa" — risco de virar single-image stock genérico.
- **Infográfico (novo):** denso, multi-data ou processo passo a passo, peso visual próprio do Thiago, assinatura coerente com Pessoa+Texto. **Não é** Micro-Infográfico requentado.

### Arquivos-chave

- **Doc de design (novo):** `aiox-project/docs/design-infografico.md`
- **Squad capas:**
  - `squad.yaml` — adicionar template
  - `templates/infografico-base.html` (novo, formato conforme design)
  - `agents/designer.md` — extender para suportar Infográfico
  - `data/visual-styles.md` — descrição do estilo
- **CCC:**
  - `js/prompts.js` — adicionar **Infográfico** em `CoverStyles`
  - `js/recommend-visual.js` — lógica de quando recomendar

---

## Sub-tarefas

### Fase 1 — Design (Squad Creator + Thiago)

- [ ] **1.1** `/squad-creator` lê o brief desta story + plano da refatoração + `linkedin-algorithm-2026-reference.md` (§3.1 dwell time, §5.0 imagem autoral, §7.5 especificidade premiada).
- [ ] **1.2** `/squad-creator` produz `aiox-project/docs/design-infografico.md` com decisões:
  - **Tipologia principal:** uma das opções:
    - (a) **Single-page denso** — 1 imagem com muita info estruturada (matriz 2×2, processo passo a passo, mapa mental)
    - (b) **Multi-data layout** — números grandes + ícones + barras (similar Data-Driven do carrossel mas em 1 imagem só)
    - (c) **Híbrido** — combina elementos
    - Definir qual será o **primeiro** Infográfico (pode ser a + b futuramente, mas começar com 1).
  - **Peso visual:**
    - Tamanho de fonte do título (icon + número grande?)
    - Hierarquia visual (1 elemento principal por slide?)
    - Uso de cor (palette herda de Pessoa+Texto/Editorial Clean ou paleta nova?)
    - Ícones (icon set específico, biblioteca?)
  - **Referências de estilo** que Thiago aprova como inspiração (pode citar perfis externos, Behance, etc.).
  - **Assinatura visual do Thiago:** cores e tipografia coerentes com os outros estilos sobreviventes (Pessoa+Texto, Print de Autoridade).
  - **Tempo de produção esperado** vs outros estilos (referência para quando recomendar Infográfico).
  - **Critério de quando usar:**
    - Que tipo de post é fit? (post com framework? com dado? com checklist?)
    - Que tipo NÃO é fit? (post puramente narrativo?)
- [ ] **1.3** **CHECKPOINT HUMANO DURO** — Thiago revisa `design-infografico.md`, comenta diff/aprova, **assina explicitamente** ("aprovado por Thiago em [data]"). Status da fase 1 = "Done" só com assinatura.

### Fase 2 — Implementação (Dev) — só começa após 1.3 assinada

- [ ] **2.1** Criar `aiox-squads/squads/capas-linkedin/templates/infografico-base.html` conforme design aprovado:
  - Formato exato (single-page denso ou multi-data) definido na fase 1.
  - Padrões herdados de Pessoa+Texto onde fizer sentido (cores, tipografia base).
  - Bloco CTA-na-arte documentado (`<!-- CTA-BLOCK: render only when is_lead_magnet=true -->`) seguindo padrão da REFAC-002.
- [ ] **2.2** Editar `aiox-squads/squads/capas-linkedin/squad.yaml`:
  - Adicionar entrada `infografico` na seção `templates`.
- [ ] **2.3** Estender `agents/designer.md`:
  - Suporte ao estilo Infográfico — instruções específicas conforme tipologia decidida.
  - Critério de quando usar (herdado da fase 1).
- [ ] **2.4** Atualizar `data/visual-styles.md`:
  - Descrição do estilo Infográfico (referenciando o doc de design).
  - Critério de quando usar.
  - Posicionamento do CTA-na-arte (bloco-CTA conforme REFAC-002).
- [ ] **2.5** Atualizar CCC:
  - `js/prompts.js`: adicionar entrada **Infográfico** em `CoverStyles` (índice próximo — vagas dos cortados Quote Card e Micro-Infográfico).
  - `js/recommend-visual.js`: adicionar lógica — recomendar Infográfico quando o post tem framework/dado/processo replicável (similar ao critério de "Salva" da REFAC-003).

---

## Acceptance Criteria

### Fase 1 — Design

1. **Given** `/squad-creator` invocado, **When** entrega `aiox-project/docs/design-infografico.md`, **Then** o doc cobre todas as 5 decisões da sub-task 1.2 (tipologia, peso visual, referências, assinatura, tempo, quando usar).

2. **Given** o doc de design, **When** Thiago revisa, **Then** existe linha "✅ Aprovado por Thiago em [YYYY-MM-DD]" no fim do doc. **Sem essa linha, fase 2 fica BLOQUEADA.**

3. **Given** o doc, **When** abro a seção "Tipologia", **Then** uma das 3 opções (a/b/c) está marcada como escolha primária. Se for híbrido, a primeira variante a implementar está identificada.

### Fase 2 — Implementação

4. **Given** `templates/infografico-base.html` criado, **When** abro, **Then** o template reflete a tipologia decidida na fase 1 (validável por comparação com o doc).

5. **Given** o squad de capas em modo Infográfico, **When** rodo com input fit (post com framework/dado), **Then** o squad entrega 1 PNG em `output/covers/{slug}/cover.png` com layout do estilo.

6. **Given** Infográfico com `is_lead_magnet=true`, **When** o squad gera a imagem, **Then** a imagem tem o bloco CTA-na-arte com `cta_arte` (faixa inferior conforme REFAC-002).

7. **Given** Infográfico com `is_lead_magnet=false`, **When** o squad gera a imagem, **Then** o bloco CTA não aparece (removido pelo Designer).

8. **Given** o CCC pós-edit, **When** abro o formulário de novo post, **Then** **Infográfico** aparece como opção em `CoverStyles`.

9. **Given** o `recommend-visual.js`, **When** crio post com framework/dado/processo, **Then** Infográfico aparece como recomendação (junto com outros estilos compatíveis).

10. **Given** `data/visual-styles.md` pós-edit, **When** abro a seção Infográfico, **Then** vejo: descrição, critério de quando usar, posicionamento do CTA, referência ao doc de design.

---

## Riscos

- **Design vira "Micro-Infográfico v2"** — squad-creator entrega tipologia genérica que não se diferencia do que foi cortado. **Mitigação:** AC #1 exige cobrir 5 decisões específicas + critério de quando usar. Thiago rejeita se for genérico.
- **Tipologia muito ambiciosa** — tentar fazer matriz 2×2 + multi-data + híbrido ao mesmo tempo. **Mitigação:** AC #3 exige escolher **uma** tipologia primária pra começar.
- **Recomendador empurra Infográfico demais** — toda story com qualquer dado vira Infográfico. **Mitigação:** sub-task 2.5 define critério estrito (framework/dado/processo replicável). Validação manual com Thiago em 5-10 posts antes de declarar Done.
- **Conflito visual com outros estilos** — Infográfico denso pode parecer "cluttered" comparado a Pessoa+Texto limpo. **Mitigação:** decisão de assinatura visual na fase 1 (cores e tipografia coerentes); doc de design valida isso antes de codar.

---

## Definition of Done

- [ ] Fase 1 completa (1.1, 1.2, 1.3) com **assinatura explícita** do Thiago no doc
- [ ] Fase 2 completa (2.1 a 2.5)
- [ ] 10 ACs verificados
- [ ] Smoke test E2E: criar 1 post fit (com framework) em modo Infográfico → squad gera PNG → upload → CCC mostra
- [ ] Smoke test do recomendador: criar post puramente narrativo → Infográfico **não** aparece como recomendação
- [ ] Branch local `feature/refac-005b-infografico`, mergeada localmente, push fica com `/devops`
- [ ] Commits citam §3.1, §5.0, §7.5 onde aplicável

---

## Out of Scope (não fazer nesta story)

- **Implementar mais de uma tipologia simultaneamente** — escolher 1 (single-page denso, multi-data, ou híbrido) e começar. Se Thiago quiser variantes, abrir nova story depois.
- **Adicionar biblioteca de ícones nova ao projeto** — se design especifica icon set, validar disponibilidade antes; se precisar instalar lib nova, abrir issue separada.
- **Refatorar paleta visual do squad de capas** — Infográfico herda assinatura existente.
- **Criar Multi-Image** — REFAC-005A.
- **Auto-classificar posts entre estilos** — recomendador é heurístico (sub-task 2.5), não ML.
- **Criar tabela nova no Supabase** — `covers.style` é TEXT agnóstico, sem DDL nova.
- **Migrar Micro-Infográfico para Infográfico** — Micro foi cortado em REFAC-001, sem migração.

## Notes

- **Story independente da REFAC-005A.** Checkpoints humanos são separados. Thiago pode aprovar Infográfico sem ter visto Multi-Image.
- **Status fica em "Design"** (ou Draft com nota) até checkpoint da fase 1 passar.
- **Não vire "Micro-Infográfico v2"** — Micro foi cortado por virar single-image stock genérico. Infográfico tem que ser denso, autoral, com peso visual próprio do Thiago.
- **Não introduzir biblioteca de ícones nova** sem justificativa — se o doc de design especifica icon set, validar antes que existe asset disponível ou se precisa entrar em outra story.
- **Não criar agente novo** — Designer existente extende para suportar a tipologia.

---

## Decisões Confirmadas (pré-execução)
<!-- Preenchido por /run-wave em 2026-05-09 -->

Decisões estratégicas do Thiago capturadas antes de soltar o squad-creator na fase 1. Squad-creator deve **respeitar** estas decisões e produzir o doc de design coerente com elas (não re-perguntar).

- **Tipologia primária** → **Single-page denso** (1 imagem com muita info estruturada — matriz 2×2, processo passo a passo, mapa mental). Foco em dwell time §3.1: leitor para pra ler. **Importante:** Thiago **não quer achismo** sobre formato dentro da tipologia — squad-creator deve **pesquisar formatos de infográfico que comprovadamente retêm e geram engajamento** (referências reais, dados de Socialinsider/AuthoredUp/van der Blom, exemplos de perfis que performam) antes de propor o formato específico (matriz vs processo vs mapa mental vs outro). Pesquisa fica no doc de design como justificativa. Multi-data layout e híbrido ficam como variantes futuras (stories separadas se Thiago quiser).
- **Paleta de cores** → **Herda dos estilos existentes** (Pessoa+Texto, Print de Autoridade). Coerência visual máxima entre estilos do squad. Brand-book Winning Sales descartado como paleta primária; expandir paleta com variações descartado.
- **Tipografia** → **Mesma de Pessoa+Texto / Print de Autoridade**. Coerência 100% com squad existente. Squad-creator pode propor variantes de tamanho/peso (ex: headline maior pra dar peso a dados) mas a família tipográfica base é fixada.

**Origem:** pre-flight 2026-05-09.

**Implicação prática para o squad-creator:** o foco da pesquisa de fase 1 desloca de "qual paleta/tipografia usar" (já fixados) para "qual formato de single-page denso comprova que retém e engaja". Doc de design fica menor mas mais defensável.

---

## Change Log

| Data | Agente | Ação |
|------|--------|------|
| 2026-05-08 | @sm (River) | Story criada (Draft) |
| 2026-05-08 | @po (Pax) | Validação 10-point: 10/10. **GO**. Status: Draft → Ready. **Atenção:** fase 2 só começa após Thiago assinar `design-infografico.md` (gate humano duro no AC #2). Adicionada seção Out of Scope. |
| 2026-05-09 | @run-wave | Decisões pré-execução capturadas via `/run-wave 0 --preflight-only`: tipologia=single-page denso (com pesquisa obrigatória de formatos), paleta=herda existente, tipografia=mesma de Pessoa+Texto. |
