# Story REFAC-004 — Squads Visuais V2 (Twitter-style refeito + Editorial Clean auditado)

**🏷️ ID:** `REFAC-004`
**📐 Estimativa:** 6-8h (auditoria 2-3h + impl 4-5h)
**🔗 Depende de:** —
**🔗 Bloqueia:** —
**👤 Assignee:** UX Design Expert (Uma) — auditoria; Dev (Dex) — impl
**🏷️ Labels:** `refactor`, `design`, `templates`, `squads`, `dry`
**📊 Status:** Ready (validada por @po — sem dependências, paralelizável)

**📚 Brief:** [Plano da refatoração](../../../C:/Users/thiag/.claude/plans/aswring-you-modo-quirky-bear.md) — seção 3.6 + 3.7 + 5.4 + 5.8.1

---

## Descrição

> Como **Thiago**, eu quero o Twitter-style refeito do jeito que sempre quis (slide 1 = print REAL de algo da web ou de pessoa conhecida; quando não tem print, pula pro próximo) e quero o Editorial Clean auditado por design (Uma) com lente dupla de fundamentos visuais + retenção pelo algoritmo, para que os 2 estilos visuais que mais uso no carrossel parem de ser genéricos e funcionem como assinatura.

## Problema Atual

### Twitter-style (estado atual diagnosticado):
- Template `templates/twitter-style-base.html` é **simulação HTML/CSS** (não print real).
- Squad **não tem task** de web search por print autêntico.
- Todo conteúdo é gerado in-house — placeholder de print fica vazio ou recebe imagem genérica.
- `data/output-examples.md` indica **intenção** de print real mas nunca foi implementado.

### Editorial Clean:
- `templates/editorial-clean-base.html` usa fundo claro `#F4F4F5`, Inter bold (56px/800 hero, 36px/500 body), barra lateral 5px Teal `#14B8A6`, alinhado à esquerda.
- **Não existe** checklist visual específico do estilo (review-checklist genérico só tem seções para Twitter-style e Pessoa-style).
- **Não existe** auditoria de design garantindo que o estilo entregue retenção (§3.1 dwell time, §3.4 click-through floor 35%).

### DRY ausente:
- `aiox-squads/squads/capas-linkedin/tasks/obter-print-autoridade.md` é único hoje. Carrosseis precisa do mesmo, mas duplicar gera divergência.

## Contexto Técnico

### Decisão (Aria, plan §5.4): SHARED TASKS

Mover `obter-print-autoridade.md` para `aiox-squads/shared/tasks/` (convenção `shared/` já existe para scripts e data). Ambos squads referenciam via `../../shared/tasks/obter-print-autoridade.md`.

### Decisão (Aria, plan §5.8.1): TEMPLATE COM 2 LAYOUTS

`templates/twitter-style-base.html` ganha 2 layouts no mesmo arquivo:
- `<!-- LAYOUT: with-print -->` — slide 1 = layout image-fill com URL do print real
- `<!-- LAYOUT: no-print -->` — slide 1 = texto puro estilo tweet (conteúdo migra do que seria slide 2)

A task `obter-print-autoridade` retorna **path/URL** ou **null**. Designer escolhe o layout conforme o resultado.

### Decisão (Aria, plan §3.7): EDITORIAL CLEAN VAI PARA UMA

Story dedicada para `/ux-design-expert (Uma)` auditar com lente dupla:
- **Fundamentos de design:** tipografia, espaçamento, contraste, hierarquia.
- **Retenção pelo algoritmo:** dwell time (§3.1), document specs (§5.2), click-through floor 35% (§3.4).
- Output: `aiox-project/docs/auditoria-editorial-clean.md` + `aiox-squads/squads/carrosseis-linkedin/checklists/editorial-clean-checklist.md`.

### Arquivos-chave

- **Shared (novo):** `aiox-squads/shared/tasks/obter-print-autoridade.md` (mover de capas-linkedin)
- **Squad capas:** `squad.yaml` (atualizar ref da task), `tasks/obter-print-autoridade.md` (deletar após mover)
- **Squad carrosseis:**
  - `aiox-squads/squads/carrosseis-linkedin/squad.yaml` (referenciar shared task)
  - `aiox-squads/squads/carrosseis-linkedin/agents/{copywriter.md, designer.md}`
  - `aiox-squads/squads/carrosseis-linkedin/templates/twitter-style-base.html` (refazer com 2 layouts)
  - `aiox-squads/squads/carrosseis-linkedin/templates/editorial-clean-base.html` (aplicar recomendações da Uma)
  - `aiox-squads/squads/carrosseis-linkedin/data/visual-styles.md`
  - `aiox-squads/squads/carrosseis-linkedin/checklists/review-checklist.md`
  - `aiox-squads/squads/carrosseis-linkedin/checklists/editorial-clean-checklist.md` (novo)
- **Doc:** `aiox-project/docs/auditoria-editorial-clean.md` (novo)

---

## Sub-tarefas

### A. Mover `obter-print-autoridade` para shared (Dex)

- [ ] **A.1** Criar diretório `aiox-squads/shared/tasks/` se não existir.
- [ ] **A.2** Mover `aiox-squads/squads/capas-linkedin/tasks/obter-print-autoridade.md` → `aiox-squads/shared/tasks/obter-print-autoridade.md`.
- [ ] **A.3** Editar `aiox-squads/squads/capas-linkedin/squad.yaml`:
  - Atualizar referência da task para `../../shared/tasks/obter-print-autoridade.md`.
- [ ] **A.4** Verificar/garantir que a task continua sendo resolvida pelo workflow do squad de capas após o move (smoke test: rodar squad de capas em modo Print de Autoridade).

### B. Refazer Twitter-style (Dex)

- [ ] **B.1** Editar `aiox-squads/squads/carrosseis-linkedin/squad.yaml`:
  - Adicionar referência à task: `../../shared/tasks/obter-print-autoridade.md`.
- [ ] **B.2** Refatorar `templates/twitter-style-base.html` — incluir 2 layouts marcados:
  ```html
  <!-- LAYOUT: with-print -->
  <!-- Slide 1 = print real (image-fill) com hero text por cima -->
  ...HTML do layout com print...
  <!-- /LAYOUT -->

  <!-- LAYOUT: no-print -->
  <!-- Slide 1 = texto puro estilo tweet, fundo escuro, header com avatar -->
  ...HTML do layout sem print...
  <!-- /LAYOUT -->
  ```
  - Layout `with-print`: container `.authority-print` recebe `<img src="[URL_DO_PRINT]">` que ocupa ~70% do slide; hero text reduzido (32px) para acomodar imagem.
  - Layout `no-print`: header (avatar + nome + @) + corpo do tweet em fonte grande (52-58px), fundo escuro (#0F1419 ou similar), sem imagem.
- [ ] **B.3** Editar `agents/designer.md`:
  - Após o copywriter + busca de print, designer lê o resultado de `obter-print-autoridade`:
    - Se `path/URL` retornado → usar **layout with-print**.
    - Se `null` (sem print encontrado/aprovado) → usar **layout no-print**, conteúdo do que seria slide 2 sobe pra slide 1.
- [ ] **B.4** Editar `agents/copywriter.md`:
  - Twitter-style: ao gerar copy, indicar quando há slide 1 com print vs quando o slide 1 vira texto-tweet (ajusta hierarquia de slides conforme retorno da task).
- [ ] **B.5** Editar `data/visual-styles.md`:
  - Documentar fluxo "print-first, fallback-text" do Twitter-style.
  - Diferenciar layouts (with-print vs no-print) com exemplo de cada.
- [ ] **B.6** Editar `checklists/review-checklist.md`:
  - Adicionar gate para Twitter-style: se slide 1 = print, validar autenticidade da fonte (URL pública, citação correta, sem deepfake/manipulação).
  - Se slide 1 = no-print, validar que copy do tweet tem hook forte e o conteúdo do "ex-slide 2" foi promovido sem perda.

### C. Auditoria do Editorial Clean (Uma)

- [ ] **C.1** **/ux-design-expert (Uma)** lê:
  - `aiox-squads/squads/carrosseis-linkedin/templates/editorial-clean-base.html`
  - `aiox-squads/squads/carrosseis-linkedin/data/visual-styles.md` (seção Editorial Clean)
  - `linkedin-algorithm-2026-reference.md` §3 (sinais), §5.2 (document specs), §3.4 (click-through floor 35%)
- [ ] **C.2** Uma produz `aiox-project/docs/auditoria-editorial-clean.md` com:
  - **Diagnóstico** — pontos fortes e fracos do estilo atual (tipografia, espaçamento, contraste, hierarquia).
  - **Recomendações** específicas: ajustes em fonte/tamanho/espaçamento/contraste/uso de barra accent.
  - **Variantes para casos de borda:** slide com muito texto, slide com dado numérico, slide com citação, slide de fechamento.
  - **Lente algoritmo:** como cada recomendação contribui pra dwell time / click-through floor / save rate.

### D. Aplicar recomendações + checklist específico (Dex)

- [ ] **D.1** Editar `templates/editorial-clean-base.html` aplicando recomendações da auditoria (Uma especifica diff por linha no doc).
- [ ] **D.2** Atualizar `data/visual-styles.md` (seção Editorial Clean) com as variantes documentadas.
- [ ] **D.3** Criar `aiox-squads/squads/carrosseis-linkedin/checklists/editorial-clean-checklist.md` — checklist específico do estilo, validado por Uma na auditoria. Itens prováveis (Uma define os definitivos):
  - Tipografia: Inter bold 800 para hero, 500 para body? Tamanhos seguem grid?
  - Espaçamento: whitespace ≥ 40% do slide? Margens consistentes?
  - Contraste: texto charcoal `#18181B` em fundo `#F4F4F5` atinge 4.5:1?
  - Barra accent Teal: presente em slides com dado/citação? Ausente em slides puramente textuais?
  - Hierarquia visual: 1 elemento principal por slide?
- [ ] **D.4** Editar `checklists/review-checklist.md` (genérico) — adicionar referência ao checklist específico do Editorial Clean.

---

## Acceptance Criteria

1. **Given** `aiox-squads/shared/tasks/obter-print-autoridade.md` existe, **When** rodo o squad de capas em modo Print de Autoridade, **Then** workflow encontra a task e executa normalmente (sem regressão).

2. **Given** `aiox-squads/shared/tasks/obter-print-autoridade.md` existe, **When** rodo o squad de carrosseis em modo Twitter-style, **Then** o Designer chama a task e recebe path/URL ou null.

3. **Given** `templates/twitter-style-base.html` pós-refactor, **When** abro, **Then** vejo os 2 layouts (`with-print` e `no-print`) marcados por comentário.

4. **Given** Twitter-style com print real disponível, **When** o Designer renderiza o slide 1, **Then** o slide 1 tem o print em image-fill com hero text por cima.

5. **Given** Twitter-style sem print disponível (task retornou null), **When** o Designer renderiza o slide 1, **Then** o slide 1 vira texto-tweet puro (header + corpo) e o conteúdo do que seria slide 2 sobe pra slide 1.

6. **Given** `aiox-project/docs/auditoria-editorial-clean.md` entregue por Uma, **When** abro, **Then** vejo: diagnóstico, recomendações específicas com diff por linha, variantes para casos de borda, lente do algoritmo aplicada.

7. **Given** `templates/editorial-clean-base.html` pós-aplicação das recomendações, **When** rendo um slide de teste, **Then** o resultado visual reflete as recomendações da Uma (validação por comparação com auditoria).

8. **Given** `aiox-squads/squads/carrosseis-linkedin/checklists/editorial-clean-checklist.md` criado, **When** abro, **Then** vejo checklist específico do estilo (não o genérico).

9. **Given** `data/visual-styles.md` pós-edit, **When** abro a seção Twitter-style, **Then** o fluxo "print-first, fallback-text" está documentado com exemplo de cada layout.

10. **Given** o checklist de review pós-edit, **When** abro, **Then** o gate de Twitter-style valida autenticidade da fonte quando há print, e valida promoção de conteúdo quando não há.

---

## Riscos

- **Move quebra workflow do squad de capas** — se a referência ao `../../shared/tasks/...` não resolver, capas-linkedin para de funcionar. **Mitigação:** sub-task A.4 é smoke test obrigatório.
- **Auditoria da Uma fica acadêmica** — recomendações genéricas tipo "use mais whitespace" sem diff prático. **Mitigação:** AC #6 exige "diff por linha no doc". Doc pequeno e acionável.
- **Layout no-print do Twitter-style fica feio** — primeira iteração pode ter hierarquia ruim. **Mitigação:** validação visual com Thiago antes de marcar Done.
- **Task de print autoridade não existe ainda em formato shared** — o move pode revelar dependências hardcoded. **Mitigação:** verificar imports/refs antes do move (sub-task A.1 inclui grep de `obter-print-autoridade`).

---

## Definition of Done

- [ ] Sub-tarefas A, B, C, D todas marcadas
- [ ] 10 ACs verificados
- [ ] Auditoria do Editorial Clean entregue por Uma e mergeada com aprovação dela
- [ ] Smoke test: rodar 1 post no Twitter-style com print + 1 sem print → ambos resultam em slide 1 coerente
- [ ] Smoke test: rodar 1 post no Editorial Clean pós-recomendações → resultado visualmente alinhado com auditoria
- [ ] Branch local `feature/refac-004-visuais-v2`, mergeada localmente, push fica com `/devops`
- [ ] Commits citam §3.1, §3.4, §5.2 do `linkedin-algorithm-2026-reference.md` onde aplicável

---

## Out of Scope (não fazer nesta story)

- **Auditoria visual dos outros 3 estilos de carrossel** (Twitter-style, Data-Driven, Notebook Raw) — só Editorial Clean entra.
- **Refatorar Twitter-style além do print-first** — não mudar paleta/tipografia, só refazer o slide 1 conforme intenção original do Thiago.
- **Web search ao vivo no LinkedIn** — `obter-print-autoridade` mantém os 3 caminhos atuais (upload manual / EXA automático / EXA curado).
- **Criar template engine** (Handlebars/Mustache) — refactor é via comentários HTML + instrução no agente.
- **Auto-aprovar prints de fontes externas** — autenticidade é gate humano, não automatizado.
- **Migrar checklists antigos** — só adicionar `editorial-clean-checklist.md` novo + referenciar no genérico.

## Notes

- **Esta story tem 2 agentes executores** — Uma faz a auditoria primeiro (sub-task C), Dex aplica (D) depois. Sub-tarefas A e B (Dex sozinho) podem rodar em paralelo com C.
- **Templates não viram template engine** — o refactor para 2 layouts é via comentários no HTML + instrução no agente (plan §5.3). Sem Handlebars/Mustache.
- **Não criar agente novo** — Designer existente lê path/URL e escolhe layout. Não vira "DesignerComPrint" e "DesignerSemPrint".
- **Print de autoridade é tema sensível** — autenticidade da fonte é gate (AC #10). Sem deepfake, sem citação fora de contexto.

---

## Change Log

| Data | Agente | Ação |
|------|--------|------|
| 2026-05-08 | @sm (River) | Story criada (Draft) |
| 2026-05-08 | @po (Pax) | Validação 10-point: 9/10. **GO**. Status: Draft → Ready. Adicionada seção Out of Scope. Story tem 2 executores (Uma + Dex) — coordenar internamente. |
