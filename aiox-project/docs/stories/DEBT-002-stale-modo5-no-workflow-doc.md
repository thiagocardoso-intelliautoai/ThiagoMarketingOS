# DEBT-002 — Workflow doc do squad pesquisa ainda referencia Modo 5 demolido

**🏷️ Tipo:** Tech Debt (Documentação stale)
**📐 Estimativa:** 15min
**🔗 Origem:** Detectado durante REFAC-002 (Phase F edição do workflow doc)
**🏷️ Labels:** `tech-debt`, `docs`, `refac-001-leftover`
**📊 Status:** Backlog
**👤 Suggested Assignee:** Dev (Dex)

---

## Descrição

O arquivo `.agent/workflows/z-pesquisa-conteudo-linkedin.md` ainda lista **"Modo 5 — Planejamento Mensal"** na tabela de modos de operação (linha 32) e tem uma seção dedicada explicando o pipeline (linhas 59-68).

A REFAC-001 (commit `86f5b2a — chore(refac-001): demolição seletiva — remove matéria-colab, Modo 5 e estilos cortados`) removeu o Modo 5 do squad de pesquisa. A documentação não foi atualizada na demolição.

## Sub-tarefas

- [ ] Remover linha 32 (linha do Modo 5 da tabela de modos)
- [ ] Remover seção "Modo 5 → Planejamento Mensal (12 Posts de uma vez)" (linhas 59-68)
- [ ] Atualizar nota da seção "Output" (linha 92) — remover referência a `output/planejamento-mensal/`
- [ ] Conferir se outros workflow docs (`.agent/workflows/*.md`) também citam Modo 5

## Acceptance Criteria

1. **Given** o workflow doc atualizado, **When** lê a tabela de modos, **Then** vejo apenas Modos 1-4.
2. **Given** grep `Modo 5` em `.agent/workflows/`, **When** rodo busca, **Then** retorna zero matches.

## Riscos

- Mínimo — só doc, sem código.

## Notas

Originalmente seria parte da REFAC-001, mas o doc foi um leftover. Resolver junto com qualquer próxima visita ao squad de pesquisa.
