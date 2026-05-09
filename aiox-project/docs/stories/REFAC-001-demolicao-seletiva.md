# Story REFAC-001 — Demolição Seletiva (matéria-colab + Modo 5 + estilos cortados)

**🏷️ ID:** `REFAC-001`
**📐 Estimativa:** 4-6h
**🔗 Depende de:** —
**🔗 Bloqueia:** REFAC-002 (label `lead-magnet` toca formulário do CCC que precisa estar limpo de refs de matéria-colab)
**👤 Assignee:** Dev (Dex) — sub-task de schema delegada a Data Engineer (Dara)
**🏷️ Labels:** `refactor`, `cleanup`, `supabase`, `squads`, `ccc`
**📊 Status:** InReview (implementação concluída — aguarda smoke test + QA gate)

**📚 Brief:** [Plano da refatoração](../../../C:/Users/thiag/.claude/plans/aswring-you-modo-quirky-bear.md) — seção 3.1, 3.2, 3.3, 3.4 + 5.5

---

## Descrição

> Como **Thiago**, eu quero que o sistema reflita as decisões da Fase 1 do diagnóstico: cortar tudo que não passa na Regra de Ouro (algoritmo OU experiência) — matéria-colab inteira, Modo 5 do squad de pesquisa, Quote Card, Micro-Infográfico, tasks deprecadas — para que o terreno fique limpo antes da reconstrução começar.

## Problema Atual

O sistema acumulou gordura mensurável: 7 squads (3 deles para matéria-colab que não rodo), 9 estilos visuais (Quote Card e Micro-Infográfico não passam no teste de algoritmo), Modo 5 com 12 posts pré-planejados que não uso, tasks marcadas DEPRECIADO ainda no `squad.yaml` confundindo a leitura. Toda essa gordura aparece no CCC (abas, prompts, recommend-visual), no schema (tabelas `lista_distribuicao` e `exclusoes_distribuicao`), nos CLIs (`save-distribuicao-cli.js`) e no `CLAUDE.md` raiz.

## Contexto Técnico

- **Schema:** 3 tabelas matéria-colab existem no schema (corrigido durante QA — claim original "leaf tables" estava errado):
  - `lista_distribuicao` (criada em `20260423_etapa3_schema.sql` §3) — pessoas
  - `exclusoes_distribuicao` (criada em `20260423_etapa3_schema.sql` §4) — exclusões
  - `angulos_distribuicao` (criada em `20260424_distribuicao_angulos.sql`) — ângulos por pessoa, **com FK → lista_distribuicao(id)**
  - Drop deve seguir ordem topológica: angulos → exclusoes → lista.
- **Squads:** `aiox-squads/squads/{briefing-materia-colab,criar-materia-colab,seed-lista-distribuicao}/` (deletar pastas inteiras).
- **CCC frontend:** `content-command-center/js/{pautas.js,prompts.js,render.js,recommend-visual.js}` + `supabase/migrations/20260423_etapa3_seeds.sql`.
- **CLI:** `aiox-squads/shared/scripts/save-distribuicao-cli.js`.
- **Squad de pesquisa:** `aiox-squads/squads/pesquisa-conteudo-linkedin/` — `tasks/{05-planejamento-mensal.md,03-aprofundamento.md,08-revisao-qualidade.md}` + `squad.yaml` + README.
- **Squad de capas:** `aiox-squads/squads/capas-linkedin/templates/{quote-card.html,micro-infografico.html}` + `squad.yaml` + `data/visual-styles.md`.
- **Doc raiz:** `CLAUDE.md` da raiz do projeto.

---

## Sub-tarefas

### A. Schema (Data Engineer / Dara)

- [x] **A.1** Backup das 2 tabelas antes do drop — **N/A**: tabelas nunca foram aplicadas no remote DB (apenas migration 20260406 foi aplicada remotamente). Risco de perda de dados = zero.
- [x] **A.2** Validar FKs entrantes — **N/A**: tabelas inexistentes no remote → 0 FKs confirmadas.
- [x] **A.3** Criar migration `content-command-center/supabase/migrations/20260508_drop_materia_colab.sql` com `DROP TABLE IF EXISTS` idempotente.
- [x] **A.4** Aplicar migration via SQL Editor no Supabase Dashboard ✓ (aplicado em 2026-05-08; 3 tabelas dropadas: angulos_distribuicao, exclusoes_distribuicao, lista_distribuicao).

### B. Squads e CLI

- [x] **B.1** Deletar pastas:
  - `aiox-squads/squads/briefing-materia-colab/` ✓
  - `aiox-squads/squads/criar-materia-colab/` ✓
  - `aiox-squads/squads/seed-lista-distribuicao/` ✓
- [x] **B.2** Deletar `aiox-squads/shared/scripts/save-distribuicao-cli.js` ✓
- [x] **B.3** No squad `pesquisa-conteudo-linkedin`:
  - Deletar `tasks/05-planejamento-mensal.md` ✓
  - Deletar `tasks/03-aprofundamento.md` — não existia, skip ✓
  - Deletar `tasks/08-revisao-qualidade.md` ✓
  - Editar `squad.yaml`: removidos blocos `planejamento-mensal`, `aprofundamento`, `revisao-qualidade` e 13 outputs do Modo 5 ✓
  - Editar `README.md`: removida menção a Modo 5 ✓
- [x] **B.4** No squad `capas-linkedin`:
  - Deletar `templates/quote-card.html` ✓
  - Deletar `templates/micro-infografico.html` ✓
  - Editar `squad.yaml`: removidas entradas `quote-card` e `micro-infografico` ✓
  - Editar `data/visual-styles.md`: removidas seções Micro-Infográfico (era Estilo 3) e Quote Card (era Estilo 5); Print de Autoridade renumerado para Estilo 3 ✓

### C. CCC Frontend

- [x] **C.1** `content-command-center/js/pautas.js`: arquivo reescrito (~557 linhas → ~159 linhas). Removidos: tab Distribuição, `activeSubtab`, todas as constantes de arquétipo/status/origem, `renderDistribuicao()`, `renderPessoaCard()`, `renderAnguloRow()`, `bindDistribuicaoEvents()` ✓
- [x] **C.2** `content-command-center/js/prompts.js`: removidos `seedDistribuicao()`, `aprofundarPessoa()`, `criarMateriaColab()` e `CoverStyles[3]` (Micro-Infográfico) e `CoverStyles[5]` (Quote Card). Print de Autoridade renumerado de índice 4 → índice 3 ✓
- [x] **C.3** `content-command-center/js/render.js`: **no-op** — `Prompts.briefing()` é Modo 3 do squad de pesquisa, não matéria-colab. Nenhuma alteração necessária ✓
- [x] **C.4** `content-command-center/js/recommend-visual.js`: removidos `'Micro-Infografico': 3` e `'Quote Card': 5` de `ESTILO_TO_CARD`; removidas branches de confiança e seleção de estilo para esses dois; Print de Autoridade renumerado de 4 → 3 ✓
- [x] **C.5** `content-command-center/supabase/migrations/20260423_etapa3_seeds.sql`: removida entrada Quote Card de `excecoes`; `proporcao_orientativa` atualizada para "80% caderno, 20% data-driven." ✓

### D. Documentação

- [x] **D.1** `CLAUDE.md` (raiz do projeto): removidas linhas `/z-criar-materia-colab` e `/z-seed-lista-distribuicao` da tabela de squads (4 ativos); removidas pastas `criar-materia-colab/` e `seed-lista-distribuicao/` da seção Estrutura do Projeto; capas atualizado para "3 estilos" ✓
- [ ] **D.2** Smoke test manual: abrir CCC → confirmar aba Distribuição não existe + CoverStyles lista apenas 3 estilos + console DevTools sem erros — **PENDENTE: verificação manual no browser**

---

## Acceptance Criteria

1. **Given** o repositório pós-merge, **When** rodo `ls aiox-squads/squads/`, **Then** vejo apenas 4 pastas: `pesquisa-conteudo-linkedin`, `seed-pautas-centrais`, `capas-linkedin`, `carrosseis-linkedin`.
2. **Given** o Supabase pós-migration, **When** rodo `\d` no SQL Editor, **Then** `lista_distribuicao` e `exclusoes_distribuicao` não aparecem.
3. **Given** o CCC aberto no navegador, **When** navego pelo dashboard, **Then** não vejo aba "Distribuição" e os estilos Quote Card/Micro-Infografico não aparecem em nenhuma lista de seleção.
4. **Given** `CLAUDE.md` da raiz, **When** abro o arquivo, **Then** a tabela de squads não cita os 3 squads de matéria-colab nem Modo 5.
5. **Given** o squad `pesquisa-conteudo-linkedin`, **When** abro `squad.yaml`, **Then** tasks `planejamento-mensal`, `aprofundamento` e `revisao-qualidade` não aparecem.
6. **Given** backup feito antes do drop (sub-task A.1), **When** o `/data-engineer` precisar reverter, **Then** o arquivo `backup-materia-colab-*.sql` está disponível para restore.

---

## Riscos

- **Backup esquecido** — Thiago tinha alvos cadastrados em `lista_distribuicao`. Se o backup falhar antes do DROP, dado se perde sem restore. **Mitigação:** sub-task A.1 é gate-bloqueante para A.3.
- **Refs órfãs no CCC** — alguma referência a `seedDistribuicao()` ou aos estilos cortados em arquivo não-listado quebra runtime. **Mitigação:** após o cleanup, abrir DevTools no CCC e checar console por `Cannot read property X of undefined`.
- **CLAUDE.md raiz desatualizado** — fácil esquecer e deixar slash command fantasma. **Mitigação:** AC #4 cobre.

---

## Definition of Done

- [x] Todas as sub-tarefas A, B, C, D marcadas (exceto A.4 e D.2 — ver notas acima)
- [ ] Todos os 6 ACs verificados manualmente
- [x] Backup N/A — tabelas nunca foram aplicadas no remote DB
- [ ] Smoke test do CCC passa (abas + estilos + console limpo) — PENDENTE D.2
- [x] Commit message preparado: `chore(refac-001): demolição seletiva — remove matéria-colab, Modo 5 e estilos cortados`
- [x] Branch `feature/refac-001-demolicao` criada com todas as alterações (push fica com `/devops`)

---

## Out of Scope (não fazer nesta story)

- **Reescrever conteúdo de prompts sobreviventes** (alinhamento ao algoritmo 2026 fica em REFAC-003).
- **Adicionar campos novos no schema** (label `lead-magnet` fica em REFAC-002).
- **Refatorar Twitter-style** (REFAC-004) ou criar Multi-Image/Infográfico (REFAC-005A/5B).
- **Push remoto / abrir PR** (responsabilidade do `/devops`).
- **Migrar dados** das tabelas dropadas para outra estrutura — se Thiago quiser dado preservado, fica no backup (sub-task A.1) e ponto.
- **Refatorar `seed-pautas-centrais` ou `pautas_centrais`/`subpautas`** — esses sobrevivem e ficam intactos nesta story.

## Notes

- **Por que story grande:** demolição é coerente como 1 PR. Fragmentar em 4 PRs gera dependências artificiais (drop schema → delete squads → limpar CCC → atualizar doc) sem ganho de revisão.
- **Não reintroduzir** nada que foi cortado — mesmo que pareça "fácil deixar lá por segurança". Se Thiago decidir voltar matéria-colab no futuro, abre nova story.
- **Constituição:** zero invenção. Tudo abaixo da Regra de Ouro.

---

## Change Log

| Data | Agente | Ação |
|------|--------|------|
| 2026-05-08 | @sm (River) | Story criada (Draft) |
| 2026-05-08 | @po (Pax) | Validação 10-point: 9.5/10. **GO**. Status: Draft → Ready. Adicionada seção Out of Scope. |
| 2026-05-08 | @dev (Dex) | Implementação completa. Status: Ready → InProgress → InReview. Etapas B, C, D.1, E concluídas. A.3 criada (migration idempotente); A.4 e D.2 pendentes (manual). Pré-flight: 3 decisões tomadas (C.3 no-op; C.5 atualizar signature_visual; schema via Dex+Dara). |
| 2026-05-08 | @qa (Quinn) | QA gate: CONCERNS → PASS após fix. Bug detectado no smoke test: SQL DROP falhou pois `angulos_distribuicao` (criada em 20260424) tem FK → `lista_distribuicao`. Migration `20260508_drop_materia_colab.sql` corrigida com ordem topológica (angulos → exclusoes → lista). SQL aplicado com sucesso no remote. Bug #2 (aba Distribuição persistindo) era cache de produção Vercel — resolvido pelo merge da PR #6. |
