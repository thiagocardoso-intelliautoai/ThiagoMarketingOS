# Story ASSETS-006 — Teste E2E: Pipeline Completo com Supabase

**🏷️ ID:** `ASSETS-006`
**📐 Estimativa:** 1h
**🔗 Depende de:** ASSETS-001, 002, 003, 004, 005
**👤 Assignee:** QA / Dev
**🏷️ Labels:** `testing`, `e2e`, `validation`, `squad`
**📊 Status:** `[ ]` To Do

---

## Descrição

> Como **gestor de conteúdo**, eu quero validar que o pipeline completo de geração de capas funciona end-to-end com o Supabase como source of truth, para ter confiança de que a migração está estável e sem regressões.

## Contexto Técnico

- Stories 001-005 devem estar completas
- Testa o fluxo completo: UI → CLI → generate-cover-pro → render-cover → upload final
- Inclui teste de fallback local (simula offline)

---

## Sub-tarefas

### Testes CLI

- [ ] **6.1** Executar `list-source-photos-cli.js --category papers` — verificar 6 fotos listadas
- [ ] **6.2** Executar `list-source-photos-cli.js --category photos` — verificar 11 fotos listadas
- [ ] **6.3** Executar `generate-cover-pro.js --image-url "<url_paper_01>" --slug test-e2e --prompt "Teste E2E"` — verificar PNG gerado

### Testes UI (CCC)

- [ ] **6.4** Abrir `localhost:5500/#ativos` — verificar galeria carrega com 18+ fotos
- [ ] **6.5** Click em category tab "Papéis" — verificar filtro funciona
- [ ] **6.6** Upload de nova imagem via drag & drop — verificar toast + card aparece
- [ ] **6.7** Click em card → lightbox com metadados — verificar imagem full-size
- [ ] **6.8** Click "Copiar URL" — verificar clipboard tem URL Supabase válida
- [ ] **6.9** Delete da foto de teste — verificar remoção do Storage + tabela + card desaparece
- [ ] **6.10** Validar badge no header atualiza contagem

### Testes Pipeline Squad

- [ ] **6.11** Executar squad de capas estilo **Rascunho no Papel** usando URL Supabase
  - Verificar: agente usa `list-source-photos-cli.js` para selecionar foto
  - Verificar: `generate-cover-pro.js --image-url` gera PNG
  - Verificar: `render-cover.js` detecta URL remota e não tenta copiar assets locais

- [ ] **6.12** Executar squad de capas estilo **Pessoa + Texto** usando URL Supabase
  - Verificar: template HTML usa URL Supabase no `src`
  - Verificar: `render-cover.js` renderiza PNG com imagens carregadas via `https://`
  - Verificar: nenhuma imagem quebrada detectada

### Teste de Fallback

- [ ] **6.13** Simular offline (desconectar rede) — verificar que squad funciona com assets locais
  - `generate-cover-pro.js --image assets/papers/paper-01.jpg` → deve funcionar
  - `render-cover.js` com paths locais → deve funcionar
  - CCC → deve exibir fallback localStorage

---

## Acceptance Criteria

- [ ] Pipeline "Rascunho no Papel" gera capa PNG com foto do Supabase
- [ ] Pipeline "Pessoa + Texto" gera capa PNG com foto do Supabase
- [ ] UI de galeria (`#ativos`) tem CRUD funcional
- [ ] Fallback local funciona quando Supabase está offline
- [ ] Zero imagens quebradas em todos os renders
- [ ] Nenhum erro no console durante toda a execução

## Definition of Done

✅ Todos os 13 testes passam
✅ Capas geradas via Supabase têm qualidade idêntica às geradas localmente
✅ Screenshot comparativo: capa local vs. capa Supabase sem diferenças visuais
✅ Migração validada end-to-end

## Notas

> Este é o "smoke test" final da migração. Após esta story ser concluída e validada, as pastas locais `assets/papers/`, `assets/photos/` e `profile-photo.png` podem ser mantidas como fallback read-only ou eventualmente removidas.
