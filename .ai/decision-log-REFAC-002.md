# Decision Log — REFAC-002 (Label `lead-magnet` Ponta a Ponta)

**Story:** `aiox-project/docs/stories/REFAC-002-label-lead-magnet-ponta-a-ponta.md`
**Branch:** `feature/refac-002-lead-magnet`
**Base commit:** `ec4944f` (HEAD of `feature/refac-001-demolicao`)
**Modo:** YOLO autonomous
**Início:** 2026-05-08

---

## Decisões Autônomas

### D1 — Branch base (course correction)
**Decision:** Ramificar de `feature/refac-001-demolicao` em vez de `main`.
**Reason:** Plano original assumia REFAC-001 mergeada para main, mas `git log main..feature/refac-001-demolicao` mostra 3 commits pendentes (ec4944f, bb2c010, 86f5b2a). Story REFAC-002 declara dependência explícita de REFAC-001 (CCC precisa estar limpo de matéria-colab antes da feature de lead-magnet).
**Alternative considered:** Merger REFAC-001 → main primeiro, depois ramificar. Rejeitado: amplia escopo (precisa @devops para push/merge); ramificar direto preserva dependência sem operações remotas.
**Impact:** Quando REFAC-001 mergear para main, REFAC-002 será mergeada por cima sem conflitos.

---

### D2 — Aplicação da migration (sub-task A.2/A.3)
**Decision:** Migration ficará como SQL pronto. Thiago aplica manualmente via Supabase Dashboard SQL Editor.
**Reason:**
- Supabase CLI ausente no PATH local (Windows).
- O Supabase MCP que tenho acesso lista 3 projects (Votador, winning-sales-aios, Winning Sales AI) — NENHUM corresponde ao project ref `mvryaxohnbftupocdlqa` usado pelo CCC (visto em `content-command-center/js/config.js:10`). Aplicar via MCP iria pro DB errado.
- Convenção já estabelecida: migrations 20260430/20260501/20260508 trazem header "Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)" — aplicação manual é o padrão do projeto.
**Impact:** ACs #1 (colunas presentes) e sub-task A.3 (idempotência rodando 2×) ficam como passos manuais para Thiago no smoke test E2E. Documentado nos comentários da própria migration e no relatório de Completion Notes da story.

---

### D3 — CodeRabbit ausente em WSL
**Decision:** Marcar Ready for Review sem CodeRabbit pre-commit, dependendo apenas de syntax check Node.js + smoke test funcional.
**Reason:** `~/.local/bin/coderabbit` não instalado em WSL (Ubuntu). A configuração do agent.dev (linhas 296-372 em dev.md) descreve self-healing mas o binário não está presente. Per spec: "code intelligence is always optional. Graceful degradation."
**Mitigation:** Smoke test E2E manual obrigatório antes de marcar Done. Se CodeRabbit detectar CRITICAL após instalação, abrir story de fix.

---

## Files Modificados

**Schema (criado):**
- `content-command-center/supabase/migrations/20260509_lead_magnet_semantics.sql`

**Squad de Pesquisa:**
- `aiox-squads/squads/pesquisa-conteudo-linkedin/tasks/00-selecao-modo.md`
- `aiox-squads/squads/pesquisa-conteudo-linkedin/agents/redator.md`
- `aiox-squads/squads/pesquisa-conteudo-linkedin/templates/post-template.md`
- `aiox-squads/squads/pesquisa-conteudo-linkedin/data/lead-magnet-template.md`

**Squad de Capas:**
- `aiox-squads/squads/capas-linkedin/agents/designer.md`
- `aiox-squads/squads/capas-linkedin/templates/pessoa-texto.html`
- `aiox-squads/squads/capas-linkedin/templates/print-autoridade.html`
- `aiox-squads/squads/capas-linkedin/templates/rascunho-papel.md`
- `aiox-squads/squads/capas-linkedin/data/visual-styles.md`

**Squad de Carrosseis:**
- `aiox-squads/squads/carrosseis-linkedin/agents/copywriter.md`
- `aiox-squads/squads/carrosseis-linkedin/templates/twitter-style-base.html`
- `aiox-squads/squads/carrosseis-linkedin/templates/editorial-clean-base.html`
- `aiox-squads/squads/carrosseis-linkedin/templates/data-driven-base.html`
- `aiox-squads/squads/carrosseis-linkedin/templates/notebook-raw-base.html`

**CCC frontend:**
- `content-command-center/js/render.js`
- `content-command-center/js/prompts.js`
- `content-command-center/js/data.js`
- `content-command-center/css/_library.css`

**CLI:**
- `aiox-squads/shared/scripts/save-post-cli.js`
- `aiox-squads/shared/scripts/upload-to-supabase.js`
- `.agent/workflows/z-pesquisa-conteudo-linkedin.md`

**Story (atualizada):**
- `aiox-project/docs/stories/REFAC-002-label-lead-magnet-ponta-a-ponta.md`

---

## Tests Executados

| Teste | Resultado |
|-------|-----------|
| `node --check prompts.js` | ✅ OK |
| `node --check data.js` | ✅ OK |
| `node --check render.js` | ✅ OK |
| `node --check save-post-cli.js` | ✅ OK |
| `node --check upload-to-supabase.js` | ✅ OK |
| `buildLeadMagnetFrontMatter({})` retorna YAML válido | ✅ default false |
| `buildLeadMagnetFrontMatter({isLeadMagnet:true,...})` | ✅ valores escapados via JSON.stringify |
| `parseFrontMatter()` round-trip com sample | ✅ 3 campos lidos corretamente |
| `parseFrontMatter()` sem front-matter | ✅ retorna {} (graceful) |

## Smoke Test E2E (PENDENTE THIAGO)

Os 15 passos da seção Verification do plano não foram executados — exigem:
- Aplicar migration via Dashboard Supabase
- Servidor CCC rodando + browser
- Squad sessions reais

A `.ai/decision-log-REFAC-002.md` documenta tudo. Story em status Ready for Review.

