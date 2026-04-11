# Story SUPABASE-007 — Testes End-to-End e Validação Final

**🏷️ ID:** `SUPABASE-007`
**📐 Estimativa:** 1h
**🔗 Depende de:** Stories 005, 006 (todas anteriores)
**👤 Assignee:** QA / Dev
**🏷️ Labels:** `testing`, `validation`, `final`
**📊 Status:** `[ ]` To Do

---

## Descrição

> Como **dono do produto**, eu quero que todos os cenários críticos sejam **testados de ponta a ponta**, para que eu tenha confiança de que posso usar o sistema em produção.

---

## Checklist de Testes

### Frontend — Thiago Marketing OS

- [ ] **7.1** Abrir `localhost:5500/#biblioteca` → posts carregam do Supabase
- [ ] **7.2** Filtrar por pilar (Alcance) → só posts com pilar A aparecem
- [ ] **7.3** Filtrar por tipo (Carrossel) → só posts com carrossel aparecem
- [ ] **7.4** Filtrar por tipo (Capa) → só posts com capa aparecem
- [ ] **7.5** Buscar por "pipeline" → só posts com pipeline no título/tema aparecem
- [ ] **7.6** Clicar "Ver Post" em post com **capa** → imagem PNG renderiza
- [ ] **7.7** Clicar "Baixar Capa" → PNG baixa no computador
- [ ] **7.8** Clicar "Ver Post" em post com **carrossel** → slides navegáveis aparecem
- [ ] **7.9** Navegar com setas ‹ › → slide muda, counter atualiza, dot atualiza
- [ ] **7.10** Clicar "Baixar PDF" → PDF baixa no computador
- [ ] **7.11** Clicar "Copiar Post" → texto copiado, toast aparece
- [ ] **7.12** Clicar "Ver Post" em post **sem mídia** → só texto aparece (sem erros)
- [ ] **7.13** Criar novo post via formulário → aparece na lista e no Supabase
- [ ] **7.14** Excluir post → some da lista e do Supabase (e cover/carrossel junto – cascade)
- [ ] **7.15** Clicar "Exportar" → JSON baixa com dados atuais

### Dashboard

- [ ] **7.16** Dashboard continua funcionando (modos de pesquisa, prompts)
- [ ] **7.17** Badge da Biblioteca mostra count correto

### Scripts de Squad

- [ ] **7.18** Rodar `save-post-cli.js` com um post de teste → aparece no CCC
- [ ] **7.19** Rodar `upload-cover-cli.js` com um PNG de teste → aparece no preview
- [ ] **7.20** Rodar `upload-carousel-cli.js` com slides de teste → carrossel navegável no preview

### Edge Cases

- [ ] **7.21** Desconectar internet → CCC abre com cache localStorage (fallback)
- [ ] **7.22** Post com título com caracteres especiais (acentos, &, ") → slug gerado corretamente
- [ ] **7.23** Upload de imagem grande (>2MB) → funciona sem timeout

---

## Acceptance Criteria

- [ ] 100% dos testes acima passaram (23/23)
- [ ] Zero `console.error` no browser
- [ ] Zero regressões em funcionalidades existentes

## Definition of Done

✅ Todos os 23 testes passaram
✅ Sistema em uso real pelo Thiago

## Evidências Necessárias

- [ ] Screenshot da Biblioteca mostrando thumbnails de capas
- [ ] Screenshot do modal "Ver Post" com imagem da capa renderizada
- [ ] Screenshot do modal "Ver Post" com carrossel navegável
- [ ] Screenshot do botão "Baixar Capa" funcionando
- [ ] Log do terminal mostrando CLIs rodando com sucesso
