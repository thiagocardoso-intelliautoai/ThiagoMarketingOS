# Story ASSETS-004 — Atualizar Documentação dos Squads

**🏷️ ID:** `ASSETS-004`
**📐 Estimativa:** 1h
**🔗 Depende de:** ASSETS-002
**🔗 Bloqueia:** Stories 006
**👤 Assignee:** Dev (Docs)
**🏷️ Labels:** `docs`, `squads`, `refactor`
**📊 Status:** `[x]` Ready for Review

---

## Descrição

> Como **agente designer**, eu quero que toda a documentação do squad de capas e carrosséis referencie o Supabase em vez de pastas locais, para que eu saiba usar as novas ferramentas CLI para selecionar e buscar fotos.

## Contexto Técnico

- 8 arquivos de documentação do squad referenciam `assets/papers/`, `assets/photos/` e `profile-photo.png` em hardcoded paths
- Após esta story, o agente usará `list-source-photos-cli.js` para descobrir fotos disponíveis e `--image-url` para passá-las
- Manter referências a fallback local para a fase de transição

---

## Sub-tarefas

### Squad Capas-LinkedIn

- [x] **4.1** Modificar `visual-styles.md`
  - Substituir referências a `assets/papers/` por: `node shared/scripts/list-source-photos-cli.js --category papers`
  - Substituir referências a `assets/photos/` por: `node shared/scripts/list-source-photos-cli.js --category photos`
  - Manter tabela de cenários, mas indicar que metadados vêm do banco
  - Adicionar nota: _"Source of truth: Supabase. Fallback: assets/ local"_

- [x] **4.2** Modificar `rascunho-papel.md`
  - Step 2: "Selecionar foto via `list-source-photos-cli.js --category papers`"
  - Step 4: Exemplo com `--image-url` flag em vez de `--image` path local
  - Manter pipeline de verificação inalterado

- [x] **4.3** Modificar `pessoa-texto.html`
  - Template: trocar `src="assets/photos/[FOTO_SELECIONADA]"` por `src="[URL_SUPABASE]"`
  - O designer preenche a URL pública retornada pelo `list-source-photos-cli.js`
  - Profile photo: trocar `src="profile-photo.png"` por URL Supabase (com note de fallback)

- [x] **4.4** Modificar `create-cover.md`
  - Atualizar Context Loading para referenciar Supabase em vez de caminhos locais
  - Atualizar instruções por estilo para usar CLIs de listagem
  - Rascunho no Papel: `--image-url` em vez de `--image`
  - Pessoa + Texto: URL Supabase direta no HTML

- [x] **4.5** Modificar `squad.yaml`
  - Seção `assets:` atualizada para indicar Supabase como source of truth:
    ```yaml
    assets:
      source: supabase  # content-assets/source-photos/
      fallback: local    # assets/ (fase de transição)
      cli: shared/scripts/list-source-photos-cli.js
    ```

- [x] **4.6** Modificar `designer.md`
  - Atualizar "Reads from" para indicar Supabase
  - Adicionar instrução sobre uso dos CLIs para listar fotos
  - Instruir uso de `--image-url` no generate-cover-pro.js

- [x] **4.7** Modificar `quality-criteria.md`
  - Trocar checklist item de "Foto do banco `assets/photos/`" para "Foto do banco Supabase (`source_photos`)"

### Squad Carrosséis-LinkedIn

- [x] **4.8** Modificar `create-slides.md` (carrosseis-linkedin)
  - Atualizar referência a `assets/photos/` para Supabase
  - Mesma abordagem: `list-source-photos-cli.js --category photos`

---

## Acceptance Criteria

- [x] Nenhum arquivo de documentação do squad referencia caminhos locais como primário
- [x] Todos os 8 arquivos mencionam Supabase como source of truth
- [x] Todos incluem nota de fallback local
- [x] Referências a CLIs usam paths corretos (`shared/scripts/...`)
- [x] Exemplos de uso com `--image-url` estão presentes em rascunho-papel.md e create-cover.md

## Definition of Done

✅ 8 arquivos de documentação atualizados
✅ Zero referência a paths locais como primário (apenas fallback)
✅ Agente designer pode seguir as instruções e gerar capas usando Supabase

## File List

- `[x]` `aiox-squads/squads/capas-linkedin/data/visual-styles.md`
- `[x]` `aiox-squads/squads/capas-linkedin/templates/rascunho-papel.md`
- `[x]` `aiox-squads/squads/capas-linkedin/templates/pessoa-texto.html`
- `[x]` `aiox-squads/squads/capas-linkedin/tasks/create-cover.md`
- `[x]` `aiox-squads/squads/capas-linkedin/squad.yaml`
- `[x]` `aiox-squads/squads/capas-linkedin/agents/designer.md`
- `[x]` `aiox-squads/squads/capas-linkedin/data/quality-criteria.md`
- `[x]` `aiox-squads/squads/carrosseis-linkedin/tasks/create-slides.md`
