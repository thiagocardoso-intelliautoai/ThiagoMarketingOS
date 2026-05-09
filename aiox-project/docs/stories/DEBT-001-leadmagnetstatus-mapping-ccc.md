# DEBT-001 — `leadMagnetStatus` ausente em `_mapPostToDB` no CCC

**🏷️ Tipo:** Tech Debt
**📐 Estimativa:** 30min
**🔗 Origem:** Detectado durante implementação da REFAC-002 (Phase E exploration)
**🏷️ Labels:** `tech-debt`, `ccc`, `bug-leve`, `lead-magnet-workflow`
**📊 Status:** Backlog
**👤 Suggested Assignee:** Dev (Dex)

---

## Descrição

Em `content-command-center/js/data.js`, a função `_mapPostToDB(post)` (linhas 159-186) mapeia campos JS → snake_case para upsert no Supabase, mas **não inclui** os campos de **workflow lead-magnet** (`lead_magnet_status`, `lead_magnet_observation`, `lead_magnet_updated_at`) que existem na tabela `posts` desde a migration `20260501_lead_magnet_schema.sql`.

A leitura inversa (`_mapPostFromDB`, linhas 126-128) tem os campos mapeados corretamente. O assimetria significa que:

- **Read:** posts já gravados com `lead_magnet_status='a_fazer'` aparecem corretamente no CCC.
- **Write (insert):** posts criados via `addPost()` no CCC nunca persistem o status — sempre vai como `null` na tabela.
- **Write (update):** posts editados via `updatePost()` **conseguem** atualizar (porque o `fieldMap` em `updatePost` inclui `leadMagnetStatus` linhas 273-274).

O caminho de update está OK. O insert está parcialmente quebrado.

## Por que ficou fora da REFAC-002

A REFAC-002 trata da **marcação semântica** (`is_lead_magnet`/`lead_magnet_resource`/`cta_arte`) — esses 3 SIM foram adicionados ao `_mapPostToDB`. Os campos de **workflow** são responsabilidade da story original CCC-002 (lead-magnet feature) e não foram tocados para evitar ampliar escopo.

## Sub-tarefas

- [ ] Adicionar `lead_magnet_status: post.leadMagnetStatus || null` em `_mapPostToDB` (data.js:~183)
- [ ] Adicionar `lead_magnet_observation: post.leadMagnetObservation || null` em `_mapPostToDB`
- [ ] **NÃO** mapear `lead_magnet_updated_at` na escrita — deixar trigger/server gerenciar
- [ ] Validar com smoke test: criar post novo via CCC, marcar lead-magnet "a_fazer", recarregar página, conferir que voltou status correto

## Acceptance Criteria

1. **Given** post novo criado via "Novo Post" no CCC com `leadMagnetStatus='a_fazer'`, **When** consulto `posts` no Supabase, **Then** vejo o status persistido.
2. **Given** comportamento atual com `null`, **When** aplicar fix, **Then** posts antigos não são afetados (trigger/default mantém compatibilidade).

## Riscos

- Baixo — mudança de 2 linhas em mapping object. Sem efeito colateral em campos existentes.
