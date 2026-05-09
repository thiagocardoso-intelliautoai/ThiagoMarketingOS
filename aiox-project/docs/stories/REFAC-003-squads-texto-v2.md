# Story REFAC-003 — Squads de Texto V2 (CTA + alinhamento ao algoritmo 2026)

**🏷️ ID:** `REFAC-003`
**📐 Estimativa:** 4-6h
**🔗 Depende de:** **REFAC-002** (coordenação obrigatória — esta story toca os mesmos arquivos do squad de pesquisa que REFAC-002 toca: `agents/redator.md`, `tasks/07-estruturacao-post.md`. Rodar **depois** de REFAC-002 OU em sequência sem branch separada para evitar merge conflict garantido.)
**🔗 Bloqueia:** —
**👤 Assignee:** Dev (Dex)
**🏷️ Labels:** `refactor`, `prompt-engineering`, `squads`, `algoritmo-2026`
**📊 Status:** Ready for Review

**📚 Brief:** [Plano da refatoração](../../../C:/Users/thiag/.claude/plans/aswring-you-modo-quirky-bear.md) — seção 3.8 + 3.11 + 5.8.3

---

## Descrição

> Como **Thiago**, eu quero que o squad de pesquisa pare de gerar CTAs genéricos ("salva pra ler depois") e use um sistema decisório claro: se o post entrega valor durável (framework/dado/processo), CTA "Salva" com **justificativa lógica obrigatória**; se não tem valor durável claro, CTA "Comente longo" com provocação que pede 2-3 frases — para maximizar comments substantivos (~15× peso de like, §3.1) e save rate (5× peso de like, §3.1). Quero também que os prompts e dados de referência reflitam o algoritmo 2026.

## Problema Atual

- **CTA atual:** `pesquisa-conteudo-linkedin/agents/redator.md` lista 3 objetivos genéricos (debate / salvamentos / conversa) em `tasks/07-estruturacao-post.md`, sem instrução de **quando** escolher cada um. Decisão fica implícita ao Redator.
- **Quality gate fraco:** `checklists/review-checklist.md` (peso 15% para CTA) verifica se é "específico" mas não força a regra "salvar com justificativa lógica vs comentar longo".
- **Prompts desalinhados ao algoritmo:** `data/linkedin-strategy.md` não tem seção sobre o algoritmo 2026; `data/hook-structures.md` tem 9 estruturas, algumas viraram clichê de LLM (§6.1); `agents/redator.md` não proíbe explicitamente padrões anti-AI ("It's not just X, it's Y", listas perfeitamente paralelas, etc.).
- **Seed-pautas sem teto:** `seed-pautas-centrais/agents/estrategista.md` não força regra dura de **4 pilares máximos / 80% aderência / 90 dias** (§7.1) — pode permitir N pilares e diluir Topical DNA.

## Contexto Técnico

### Decisão (Aria, plan §5.8.3): heurística de CTA com 2 ramos

- **Post entrega valor durável** (framework, dado, processo replicável) → CTA "Salva" + **justificativa específica e lógica**.
- **Post não tem valor durável claro** → CTA "Comente longo" + provocação que pede 2-3 frases.
- **Banido:** "Salva pra ler depois", "Salva pra não esquecer", "Comente YES", "Tag um amigo", "Like se concordar", emoji-as-bullet.

### Quality gate

Se a justificativa do "salva" for genérica → REJECT, força Redator a refazer ou trocar pra "comente".

### Arquivos-chave

- **Squad pesquisa:**
  - `aiox-squads/squads/pesquisa-conteudo-linkedin/agents/redator.md`
  - `aiox-squads/squads/pesquisa-conteudo-linkedin/data/linkedin-strategy.md`
  - `aiox-squads/squads/pesquisa-conteudo-linkedin/data/hook-structures.md`
  - `aiox-squads/squads/pesquisa-conteudo-linkedin/data/post-structure-linkedin.md`
  - `aiox-squads/squads/pesquisa-conteudo-linkedin/checklists/review-checklist.md`
  - `aiox-squads/squads/pesquisa-conteudo-linkedin/tasks/07-estruturacao-post.md`
- **Squad seed-pautas:**
  - `aiox-squads/squads/seed-pautas-centrais/agents/estrategista.md`
- **Insumo canônico:** `linkedin-algorithm-2026-reference.md` (raiz do projeto)

---

## Sub-tarefas

### A. CTA novo no Redator

- [x] **A.1** Editar `agents/redator.md` — adicionar seção "Sistema decisório de CTA":
  - **Ramo 1 — Salva (valor durável):** quando o post entrega framework / dado original / processo replicável / matriz de decisão / checklist. CTA: "Salva — [justificativa específica e lógica]". Exemplo aceitável: *"Salva — vai precisar dessa árvore de decisão na próxima reunião de pipeline."* Exemplo rejeitado: *"Salva pra ler depois"*.
  - **Ramo 2 — Comente longo (sem valor durável):** quando o post conta história, observação ou tese sem ferramenta replicável. CTA: provocação que pede 2-3 frases. Exemplo aceitável: *"Me conta: como vc lidou com isso? quero comparar com [contexto]."* Exemplo rejeitado: *"Concorda?"* (curto demais, não pede frase).
  - **Banidos sempre:** "Salva pra ler depois", "Salva pra não esquecer", "Comente YES", "Tag um amigo", "Like se concordar", "Comente X que mando" (já em REFAC-002 mas reforçar aqui), emoji-as-bullet, polls, link externo no body.
- [x] **A.2** Editar `data/post-structure-linkedin.md` — incluir árvore de decisão visual:
  ```
  Post entrega framework / dado / processo replicável?
    SIM → CTA "Salva" + justificativa específica e lógica
    NÃO → CTA "Comente longo" + provocação que pede 2-3 frases
  ```
- [x] **A.3** Editar `tasks/07-estruturacao-post.md` — passo explícito de seleção de CTA antes do Redator escrever a parte final.

### B. Quality gate no checklist

- [x] **B.1** Editar `checklists/review-checklist.md` — bloco CTA (mantém 15% do peso, mas regras mais duras):
  - **(1)** CTA escolhido é coerente com tipo de valor entregue? (Salva quando há valor durável; Comente quando não há.)
  - **(2)** Se "Salva": a justificativa é **específica e lógica** (não genérica como "pra ler depois")? Se genérica → REJECT.
  - **(3)** Se "Comente": a provocação pede resposta de **2-3 frases mínimo** (não pergunta sim/não, não pede uma palavra)? Se sim/não → REJECT.
  - **(4)** Nenhum padrão banido aparece (lista da A.1)?

### C. Alinhamento ao algoritmo 2026

- [x] **C.1** Adicionar seção nova em `data/linkedin-strategy.md`: **"Algoritmo 2026 — o que premia e suprime"**.
  - Sumarizar §3 (sinais), §6 (supressões) e §7 (recompensas) do `linkedin-algorithm-2026-reference.md` em ~30-50 linhas.
  - Foco em **direção de movimento**, não números absolutos (o doc-fonte avisa contra tratar números como leis).
  - Citar seções do doc-fonte para cada regra (ex: "Hashtags 0-3 — §6.5").
- [x] **C.2** Editar `agents/redator.md` — regras duras para 2026:
  - Hashtags: **0-3** (§6.5).
  - **Zero polls** (§6.9).
  - **Zero link externo no body** (§6.4).
  - **Zero padrões anti-AI**: "It's not just X, it's Y", "Here's the truth about...", "Let me tell you...", listas perfeitamente paralelas, excesso de emoji-as-bullet, gramática excessivamente polida (§6.1).
  - **Specificidade premiada**: nomes de empresas, métricas exatas, períodos específicos, frameworks nomeados (§7.5).
  - **Length sweet spot**: 800-2.000 chars; cutoff "see more" em 210 (§5.4).
- [x] **C.3** Auditar `data/hook-structures.md`:
  - Para cada uma das 9 estruturas atuais: aplicar teste — gera dwell time hook (§3.1) E não cai em padrão clichê de LLM (§6.1)?
  - **Manter:** as que passam.
  - **Cortar:** as que viraram clichê (provavelmente "It's not just X, it's Y" e variantes).
  - Documentar veredito por linha no commit message.

### D. Seed-pautas — Topical DNA hardening

- [x] **D.1** Editar `seed-pautas-centrais/agents/estrategista.md` — incluir regra dura §7.1:
  - **Teto: 4 pilares máximo** no perfil. Se Thiago tentar criar 5º pilar → estrategista alerta antes de salvar.
  - **80% de aderência:** dos posts dos últimos 90 dias, ≥80% precisam estar dentro dos 4 pilares.
  - **Janela 90 dias:** o sistema só categoriza autoridade após ~90 dias de consistência num nicho.
  - **Alerta de drift:** se um post novo está fora dos 4 pilares, estrategista marca como "off-topic — pode diluir Topical DNA".

---

## Acceptance Criteria

1. **Given** `agents/redator.md` pós-edit, **When** abro o arquivo, **Then** vejo a seção "Sistema decisório de CTA" com os 2 ramos e a lista de banidos.

2. **Given** `data/post-structure-linkedin.md` pós-edit, **When** abro, **Then** vejo a árvore de decisão visual de CTA.

3. **Given** `checklists/review-checklist.md` pós-edit, **When** abro, **Then** o bloco CTA tem os 4 critérios duros (coerência, justificativa específica, provocação 2-3 frases, banidos).

4. **Given** o squad de pesquisa rodando com um post que **entrega framework**, **When** o Redator escreve o CTA, **Then** sai "Salva — [justificativa específica]". Smoke test: rodar 1 post desse tipo e validar.

5. **Given** o squad de pesquisa rodando com um post que **conta história sem ferramenta**, **When** o Redator escreve o CTA, **Then** sai "Comente longo — [provocação que pede 2-3 frases]". Smoke test: rodar 1 post desse tipo e validar.

6. **Given** um post de teste com CTA "Salva pra ler depois" (genérico), **When** passo pelo quality gate, **Then** o gate REJECT e força refazer.

7. **Given** `data/linkedin-strategy.md` pós-edit, **When** abro, **Then** vejo a seção "Algoritmo 2026 — o que premia e suprime" com referências a §3, §6, §7 do doc-fonte.

8. **Given** `agents/redator.md` pós-edit, **When** abro, **Then** vejo as regras duras de 2026 (hashtags 0-3, zero polls, zero link externo, lista anti-AI, especificidade premiada, length sweet spot).

9. **Given** `data/hook-structures.md` pós-edit, **When** abro, **Then** as estruturas que viraram clichê foram cortadas. Commit message documenta veredito por linha.

10. **Given** `seed-pautas-centrais/agents/estrategista.md` pós-edit, **When** abro, **Then** vejo regra dura de 4 pilares + 80% aderência + janela 90 dias + alerta de drift.

---

## Riscos

- **Heurística de CTA muito restritiva** — Redator pode rejeitar posts borderline que não encaixam claramente em "valor durável" nem "história pura". **Mitigação:** primeira iteração rodar 5-10 posts e calibrar; se houver muitos rejeites, afinar a árvore de decisão.
- **Hook structures cortadas eram favoritas do Thiago** — antes de cortar, validar com ele quais ele usa de verdade. **Mitigação:** sub-task C.3 entrega lista com veredito por linha; Thiago aprova antes do delete.
- **Regra de 4 pilares** — se Thiago já tem 5+ pilares ativos, regra dura quebra retrocompatibilidade. **Mitigação:** regra é "alerta antes de salvar 5º", não "rejeita os 5 já existentes". Refatoração de pilares fica fora desta story.
- **Padrões anti-AI cobrem demais** — Redator pode ficar paralisado tentando evitar todos. **Mitigação:** lista é orientativa, não exaustiva. Se o conteúdo é específico e autoral (§7.5), padrões marginais podem passar.

---

## Definition of Done

- [x] Sub-tarefas A, B, C, D todas marcadas
- [x] Os 10 ACs verificados (mapeamento em `.ai/decision-log-REFAC-003.md`)
- [x] **Smoke test E2E:** rodar pelo menos 2 posts (1 com framework, 1 com história) e validar CTAs no output (Tests 1 e 2 no decision log)
- [x] **Smoke test do gate:** propositalmente passar 1 post com CTA genérico e validar REJECT (Test 3 no decision log)
- [x] **Smoke test não-regressão Lead Magnet (REFAC-002):** Veto 8 do `redator.md` preservado intacto (Test 4 no decision log)
- [x] Commit messages incluem refs §3.1, §5.4, §6.1, §6.2, §6.4, §6.5, §6.9, §6.10, §7.1, §7.5
- [x] Branch local `feature/refac-003-texto-v2` com 4 commits atômicos por sub-task; push fica com `/devops`

---

## File List

**Squad pesquisa-conteudo-linkedin (modificados):**
- `aiox-squads/squads/pesquisa-conteudo-linkedin/agents/redator.md` — A.1 + C.2
- `aiox-squads/squads/pesquisa-conteudo-linkedin/data/post-structure-linkedin.md` — A.2
- `aiox-squads/squads/pesquisa-conteudo-linkedin/tasks/07-estruturacao-post.md` — A.3
- `aiox-squads/squads/pesquisa-conteudo-linkedin/checklists/review-checklist.md` — B.1
- `aiox-squads/squads/pesquisa-conteudo-linkedin/data/linkedin-strategy.md` — C.1
- `aiox-squads/squads/pesquisa-conteudo-linkedin/data/hook-structures.md` — C.3

**Squad seed-pautas-centrais (modificado):**
- `aiox-squads/squads/seed-pautas-centrais/agents/estrategista.md` — D.1

**Documentação (criados):**
- `.ai/decision-log-REFAC-003.md` — log YOLO + 4 smoke tests + mapeamento AC

**Documentação (modificado):**
- `aiox-project/docs/stories/REFAC-003-squads-texto-v2.md` — status, checkboxes, File List, Change Log

---

## Completion Notes

- **Hooks: nenhuma das 9 cortada** (D1 no decision log). "It's not just X, it's Y" não está representada nas 9 estruturas. Nota anti-LLM adicionada no topo do `hook-structures.md`; cuidado do hook #7 ("E se") ampliado para cobrir o padrão LLM em inglês.
- **Princípio 9 do Redator** atualizado de "Sem hashtags" para "Hashtags 0-3 máximo (§6.5)" — alinhado ao algoritmo, sem mudar a prática editorial do squad (Thiago não usa hashtags por escolha; agora pode usar 1-3 quando fizer sentido como pista de tópico).
- **Coexistência REFAC-002:** Veto 8 (anti-bait quando `is_lead_magnet=true`) preservado integralmente. Sistema Decisório de CTA inclui sub-bloco "Coexistência com regra Lead Magnet (REFAC-002)" com referência cruzada explícita.

---

## Out of Scope (não fazer nesta story)

- **Implementar label `lead-magnet`** (já em REFAC-002) — esta story só adiciona o sistema decisório de CTA "Salva/Comente". As regras anti-bait quando `is_lead_magnet=true` ficam em REFAC-002 e devem coexistir.
- **Cortar tasks deprecadas e Modo 5** — feito em REFAC-001.
- **Atualizar `CLAUDE.md` raiz** — se sobrar referência a Modo 5/matéria-colab depois de REFAC-001, abrir issue separada.
- **Criar checklist novo** — esta story edita o `review-checklist.md` existente, não cria novo.
- **Refatorar pilares ativos do Thiago** — se ele tem 5+ pilares, regra dura é "alerta antes de salvar 5º"; corrigir os existentes fica fora.
- **Reescrever `linkedin-strategy.md` inteiro** — só adicionar a seção "Algoritmo 2026". Resto fica como está.

## Notes

- **Não criar squad novo** — todas as mudanças são em arquivos existentes (instruções de agente + data files + checklist).
- **Não criar agente novo** — sistema decisório de CTA é regra no Redator, não papel novo.
- **Coordenação obrigatória com REFAC-002:** as duas tocam `agents/redator.md` e `tasks/07-estruturacao-post.md`. **Rodar em sequência** (REFAC-002 → REFAC-003 na mesma branch ou em branches sequenciais) evita merge conflict garantido.

---

## Change Log

| Data | Agente | Ação |
|------|--------|------|
| 2026-05-08 | @sm (River) | Story criada (Draft) — sem dependência declarada |
| 2026-05-08 | @po (Pax) | Validação 10-point: 8/10 conditional. **GO** após adicionar dependência formal a REFAC-002 (conflito de arquivos). Status: Draft → Ready. Adicionada seção Out of Scope. |
| 2026-05-09 | @dev (Dex) | Implementação YOLO em 4 commits atômicos (A/B/C/D). Decision log criado em `.ai/decision-log-REFAC-003.md` com 4 decisões autônomas + 4 smoke tests (E2E framework, E2E história, gate REJECT, não-regressão Lead Magnet). Status: Ready → Ready for Review. |
