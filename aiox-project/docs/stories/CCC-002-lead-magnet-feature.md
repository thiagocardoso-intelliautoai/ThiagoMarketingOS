# Story CCC-002 — Lead Magnet Feature no Content Command Center

**🏷️ ID:** `CCC-002`
**📐 Estimativa:** 3h
**🔗 Depende de:** PAUTAS-001 (coluna `is_lead_magnet` em subpautas deve existir antes desta story)
**🔗 Bloqueia:** —
**👤 Assignee:** Dev (Dex)
**🏷️ Labels:** `ccc`, `feature`, `supabase`, `ui`
**📊 Status:** `[x]` InReview

---

## Descrição

> Como **Thiago**, eu quero ver um badge "Lead Magnet" nas subpautas marcadas e nos posts derivados delas, e conseguir rastrear se o material do lead magnet já foi produzido — com um toggle simples no CCC e um campo para colar o link — para saber exatamente o que está bloqueando cada publicação.

## Problema Atual

Algumas subpautas são lead magnets (conteúdo que leva a um material externo: squad, vídeo aula, PDF). O CCC não distingue lead magnet de post normal: não há badge visível, não há estado de "material produzido" e não há campo para o link do material. Sem isso, o Thiago publica o post sem saber se o material prometido existe — ou atrasa a publicação sem visibilidade clara.

## Contexto Técnico

- CCC: Vanilla JS + Supabase, sem framework de frontend
- Arquivo principal de pautas: `content-command-center/js/pautas.js`
- Arquivo de posts: `content-command-center/js/posts.js` (ou equivalente — verificar)
- Data layer: `content-command-center/js/data.js`
- Schema autoritativo: `content-command-center/supabase/migrations/`
- `is_lead_magnet boolean` em subpautas: já criado pela migration da **PAUTAS-001** (dependência)

---

## Sub-tarefas

- [x] **2.1** Criar migration `20260430_lead_magnet_schema.sql`

```sql
-- Extensão em subpautas: checklist do material a produzir
ALTER TABLE subpautas
  ADD COLUMN IF NOT EXISTS lead_magnet_checklist text[] DEFAULT '{}';

-- Extensão em posts: rastreamento do material produzido
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS lead_magnet_status text
    CHECK (lead_magnet_status IN ('a_fazer', 'concluido')) DEFAULT 'a_fazer',
  ADD COLUMN IF NOT EXISTS lead_magnet_observation text,
  ADD COLUMN IF NOT EXISTS lead_magnet_updated_at timestamptz;
```

- [x] **2.2** Adicionar funções em `content-command-center/js/data.js`

```javascript
// Buscar subpauta com campos lead magnet
async function getSubpautaLeadMagnet(subpautaId) { ... }

// Atualizar status lead magnet de um post
async function updatePostLeadMagnet(postId, { lead_magnet_status, lead_magnet_observation }) {
  // upsert: status + observation + updated_at = now()
}
```

- [x] **2.3** Badge "Lead Magnet" no card de subpauta (`pautas.js`)

Na renderização de cada subpauta:
- Se `is_lead_magnet === true`: exibir badge `🎯 Lead Magnet` ao lado do título
- Ao hover/click no badge: exibir tooltip ou painel inline com o `lead_magnet_checklist`
- Exemplo de checklist (subpauta 1.3):
  - "Construir squad de diagnóstico + recomendação por perfil técnico"
  - "Gravar vídeo aula ensinando a usar o squad (iniciantes)"
  - "Publicar squad para acesso via link"

- [x] **2.4** Badge "Lead Magnet" na listagem de posts

Na listagem de posts do CCC:
- Se o post tem `is_lead_magnet` (via subpauta vinculada) ou `lead_magnet_status` definido:
  - Exibir badge `🎯` ao lado dos badges de "Urgente" / "Relevante"
  - Badge **vermelho** se `lead_magnet_status = 'a_fazer'`
  - Badge **verde** se `lead_magnet_status = 'concluido'`

- [x] **2.5** Seção "Material do Lead Magnet" no modal/detalhe do post

Dentro do modal ou painel de detalhe de post, se o post for lead magnet:

```
┌─────────────────────────────────────────┐
│ 🎯 Material do Lead Magnet              │
│                                         │
│  [A fazer]  ←→  [Já ✓]                 │
│  (vermelho)     (verde)                 │
│                                         │
│  Observação: [campo de texto livre]     │
│  Ex: https://link-do-material.com       │
└─────────────────────────────────────────┘
```

- Toggle muda `lead_magnet_status` no Supabase via `updatePostLeadMagnet()`
- Campo de observação só aparece após clicar em "Já ✓"
- Salva automaticamente ao sair do campo (onblur) ou ao pressionar Enter
- Atualiza `lead_magnet_updated_at = now()` a cada save

- [x] **2.6** Seed do checklist para subpauta 1.3

Após migration aplicada, rodar update direto no banco para a subpauta 1.3:

```sql
UPDATE subpautas
SET lead_magnet_checklist = ARRAY[
  'Construir squad de diagnóstico + recomendação por perfil técnico',
  'Gravar vídeo aula ensinando a usar o squad (iniciantes)',
  'Publicar squad para acesso via link'
]
WHERE titulo ILIKE '%automatizar seu processo comercial%';
```

- [ ] **2.7** Testar end-to-end — aguardando migration + browser test

1. Verificar badge na tela de subpautas (subpauta 1.3 deve ter badge + checklist)
2. Verificar badge na listagem de posts (vermelho por padrão)
3. Abrir post derivado de lead magnet → toggle para "Já" → inserir link de teste
4. Verificar que badge muda para verde
5. Recarregar página → verificar persistência

---

## Acceptance Criteria

- [ ] Migration aplicada: `subpautas` tem `lead_magnet_checklist`; `posts` tem `lead_magnet_status`, `lead_magnet_observation`, `lead_magnet_updated_at`
- [ ] Badge `🎯 Lead Magnet` aparece na tela de subpautas para subpautas com `is_lead_magnet = true`
- [ ] Hover/click no badge exibe o checklist da subpauta
- [ ] Badge aparece na listagem de posts com cor correta (vermelho/verde)
- [ ] Modal de post mostra seção "Material do Lead Magnet" com toggle e campo de observação
- [ ] Toggle salva no Supabase e badge atualiza sem recarregar página
- [ ] Subpauta 1.3 tem checklist com 3 itens corretos

## Definition of Done

✅ Migration aplicada  
✅ Badge visível e funcional em subpautas  
✅ Toggle + observação funcional em posts  
✅ Seed do checklist aplicado na subpauta 1.3  
✅ Testado end-to-end no browser  

---

## Notas Técnicas

### Vinculação post → subpauta

Para mostrar `is_lead_magnet` na listagem de posts, é necessário verificar se posts têm `subpauta_id` na tabela `posts`. Se não houver FK, a alternativa é usar `lead_magnet_status IS NOT NULL` como indicador de que o post é lead magnet (setado quando o post é criado a partir de uma subpauta lead magnet).

**Dev deve verificar o schema atual de `posts` antes de implementar** e adaptar a abordagem conforme o que existe.

### Não está no escopo

- Analytics de conversão do lead magnet
- Integração com ferramentas de captura de email
- Notificações automáticas ao mudar status
- Sistema de múltiplos checklists por post

---

## File List

- `[x]` `content-command-center/supabase/migrations/20260501_lead_magnet_schema.sql` — [NEW] schema + seed
- `[x]` `content-command-center/js/data.js` — [MODIFY] updatePostLeadMagnet(), getSubpautaLeadMagnet(), _mapPostFromDB fields
- `[x]` `content-command-center/js/pautas.js` — [MODIFY] badge + checklist inline
- `[x]` `content-command-center/js/render.js` — [MODIFY] badge na listagem + seção modal
- `[x]` `content-command-center/css/_pautas.css` — [MODIFY] badge-lm, lm-checklist styles
- `[x]` `content-command-center/css/_library.css` — [MODIFY] badge-lm-todo/done, lm-section styles

---

## Change Log

| Data | Agente | Ação |
|------|--------|------|
| 2026-04-30 | @sm (River) | Story criada — Draft |
| 2026-04-30 | @sm (River) | Nota: depende de PAUTAS-001 para coluna is_lead_magnet existir |
| 2026-05-01 | @dev (Dex) | Implementação completa — tasks 2.1-2.6 concluídas; 2.7 aguarda browser test |
| 2026-05-01 | @dev (Dex) | Migration: 20260501_lead_magnet_schema.sql (schema + seed subpauta 1.3) |
| 2026-05-01 | @dev (Dex) | Nota técnica: lead_magnet_status NULL por default (sem FK subpauta_id em posts) — seção LM sempre visível no modal com opt-in via "Marcar como Lead Magnet" |
