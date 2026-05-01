# Story VISUAL-003 — Capa "Print de Autoridade": Fluxo de Obtenção do Print

**🏷️ ID:** `VISUAL-003`
**📐 Estimativa:** 5-7h
**🔗 Depende de:** —
**🔗 Bloqueia:** —
**👤 Assignee:** Dev (Squads + MCP integration)
**🏷️ Labels:** `squads`, `capas-linkedin`, `MCP`, `EXA`, `Playwright`
**📊 Status:** `[ ]` Ready

**📚 Referência arquitetural:** [VISUAL-RECOMMENDER-PLAN.md §4](../architecture/VISUAL-RECOMMENDER-PLAN.md)

---

## Descrição

> Como **operador de conteúdo**, quando eu escolho o estilo "Print de Autoridade" para uma capa, eu quero que o squad me ofereça 3 caminhos para obter o print (upload manual / busca automática via EXA / sugestão de 2-3 candidatos curados), para que eu não precise mais sair do fluxo do squad para encontrar o print manualmente no Twitter/LinkedIn.

Hoje o squad capa-linkedin estilo 4 ("Print de Autoridade") assume que o operador já tem o print pronto como asset local. Esta story adiciona um checkpoint humano novo antes do render, com 3 opções de obtenção, integrando EXA (descoberta) e Playwright (captura visual) — ambos já disponíveis via Docker MCP.

## Contexto Técnico

- **Squad afetado:** `aiox-squads/squads/capas-linkedin/` (apenas estilo 4)
- **MCPs envolvidos:**
  - **EXA** (`mcp__docker-gateway__web_search_exa`) — busca semântica de URLs relevantes ao tema
  - **Playwright** (já instalado globalmente em `~/.claude.json`) — captura screenshot de URLs
- **Sem mudança no DB** — prints vivem no filesystem do squad, atrelados ao output da capa
- **Cache opcional** em `output/prints/index.json` para evitar re-captura
- **Atribuição automática:** "via @&lt;autor&gt;" ou "Fonte: &lt;domínio&gt;" no card final
- **Aviso TOS:** operador é o curador final — squad apenas captura + atribui automaticamente

---

## Sub-tarefas

### 3.1 — Nova task `obter-print-autoridade.md`

- [ ] **3.1.1** Criar [aiox-squads/squads/capas-linkedin/tasks/obter-print-autoridade.md](../../../aiox-squads/squads/capas-linkedin/tasks/obter-print-autoridade.md) (NOVO) com workflow:

```markdown
# Task: Obter Print de Autoridade

## Inputs
- `tema` (do post)
- `slug` (identificador do output)

## Steps

1. Designer apresenta opções numeradas ao operador:
   1. Eu envio o print (path local OU URL pública)
   2. Buscar na web (EXA descobre + Playwright captura)
   3. Sugerir 2-3 prints relevantes ao tema (EXA + curadoria humana)

2. Branch por escolha:

   ### Opção 1 — Upload manual
   - Pergunta path/URL
   - Se path: copia para `output/prints/<slug>/print.png`
   - Se URL: chama Playwright para capturar screenshot
   - Salva metadata: `{ url_origem, autor, captured_at, hash }`

   ### Opção 2 — Busca automática
   - Chama `mcp__docker-gateway__web_search_exa` com `query: tema + "tweet OR linkedin OR notícia"`
   - Pega o 1º resultado relevante (filtra por domínio: twitter.com, linkedin.com, news sites)
   - Mostra ao operador: URL + título + autor + thumbnail (se disponível)
   - **Checkpoint humano:** operador valida ou pede outro
   - Se aprovado: Playwright captura screenshot da URL
   - Se rejeitado: oferece próximo resultado ou volta ao menu

   ### Opção 3 — Sugestão curada
   - Chama EXA com mesma query
   - Pega top 3 resultados
   - Apresenta numbered list:
     1. <título>  @<autor>  [<domínio>]
     2. <título>  @<autor>  [<domínio>]
     3. <título>  @<autor>  [<domínio>]
   - Operador escolhe número
   - Playwright captura screenshot do escolhido

3. Salvar print em `output/prints/<slug>/print.png` + `metadata.json`
4. Atualizar cache em `output/prints/index.json` (URL → path local + captured_at + hash)
5. Retornar path do print + atribuição formatada para o renderer
```

### 3.2 — Atualizar agent designer

- [ ] **3.2.1** Em [aiox-squads/squads/capas-linkedin/agents/designer.md](../../../aiox-squads/squads/capas-linkedin/agents/designer.md), adicionar seção "Fluxo de obtenção de print" referenciando a nova task. Designer agora consulta `obter-print-autoridade.md` quando o estilo escolhido for "Print de Autoridade".

### 3.3 — Atualizar `visual-styles.md` (estilo 4)

- [ ] **3.3.1** Em [aiox-squads/squads/capas-linkedin/data/visual-styles.md](../../../aiox-squads/squads/capas-linkedin/data/visual-styles.md), atualizar §"Pipeline de Criação" do estilo 4 (Print de Autoridade):

```markdown
### Pipeline de Criação (Print de Autoridade)
1. Operador escolhe estilo 4
2. Designer chama task `obter-print-autoridade` (3 caminhos: upload / EXA / curadoria)
3. Checkpoint humano valida o print escolhido
4. Designer renderiza HTML 1080×1350 com print + texto da opinião
5. Puppeteer → PNG
6. Upload Supabase via `upload-cover-cli.js`
```

### 3.4 — Atualizar workflow.yaml

- [ ] **3.4.1** Em [aiox-squads/squads/capas-linkedin/workflows/workflow.yaml](../../../aiox-squads/squads/capas-linkedin/workflows/workflow.yaml), inserir step novo antes de `gerar-capa`:

```yaml
- id: obter-print
  type: checkpoint
  condition: estilo == 4  # Print de Autoridade
  task: tasks/obter-print-autoridade.md
  description: "Obter print de autoridade (upload / EXA / curadoria)"
  human_approval_required: true
```

### 3.5 — Diretório de output e cache

- [ ] **3.5.1** Criar `aiox-squads/squads/capas-linkedin/output/prints/.gitkeep` (NOVO)
- [ ] **3.5.2** Criar template `output/prints/index.json` inicial:

```json
{
  "version": 1,
  "captures": []
}
```

Estrutura de cada entrada do cache:
```json
{
  "url_origem": "https://twitter.com/usuario/status/12345",
  "path_local": "output/prints/post-slug-2026-04-30/print.png",
  "autor": "@usuario",
  "dominio": "twitter.com",
  "captured_at": "2026-04-30T14:32:00Z",
  "hash": "sha256:..."
}
```

### 3.6 — Integração EXA (busca)

- [ ] **3.6.1** Designer agent usa `mcp__docker-gateway__web_search_exa` com query construída a partir do tema do post + filtros (`site:twitter.com OR site:linkedin.com OR site:news`).
- [ ] **3.6.2** Filtrar resultados que não sejam de redes sociais públicas / sites de notícias relevantes.
- [ ] **3.6.3** Limitar a 3 candidatos para opção curada; pegar 1 candidato para opção 2 (com fallback automático para próximo se operador rejeitar).

### 3.7 — Integração Playwright (captura)

- [ ] **3.7.1** Designer agent usa Playwright MCP (já instalado) para abrir a URL e capturar screenshot de área visível (viewport 1280×800 padrão para tweets/posts).
- [ ] **3.7.2** Salvar PNG em `output/prints/<slug>/print.png` com nome determinístico.
- [ ] **3.7.3** Tratamento de falha: se Playwright não conseguir renderizar (ex: login wall do Twitter), oferecer fallback "Cole o print manualmente" (volta para opção 1).

### 3.8 — Atribuição automática no card

- [ ] **3.8.1** Renderer existente do estilo 4 lê `metadata.json` do print e popula automaticamente o campo "Atribuição" no HTML: `via @<autor>` (se Twitter/LinkedIn) ou `Fonte: <dominio>` (se site de notícias).

### 3.9 — Documentação operacional

- [ ] **3.9.1** Atualizar [aiox-squads/squads/capas-linkedin/README.md](../../../aiox-squads/squads/capas-linkedin/README.md) com nota sobre TOS / fair use:

```markdown
## ⚠️ Uso Responsável de Prints

Esta squad pode capturar screenshots de posts públicos (Twitter, LinkedIn, notícias) via EXA + Playwright. **O operador é o curador final** — verifica se o uso está dentro de fair use (citação com atribuição, comentário editorial sobre conteúdo público).

- Sempre incluir atribuição (`via @autor` ou `Fonte: domínio`)
- Não capturar conteúdo claramente privado ou behind login wall
- Se a rede social bloquear o scraping (ex: Twitter sem login), usar opção 1 (upload manual)
```

---

## Acceptance Criteria

- [ ] Squad capa-linkedin estilo 4 abre checkpoint novo com 3 opções numeradas
- [ ] Opção 1 (upload manual) aceita path local OU URL pública e copia/captura corretamente
- [ ] Opção 2 (busca EXA + 1º resultado) chama EXA, mostra candidato, valida com operador, captura via Playwright
- [ ] Opção 3 (3 candidatos curados) chama EXA, apresenta numbered list, captura escolhido via Playwright
- [ ] Print salvo em `output/prints/<slug>/print.png` + `metadata.json` com URL origem, autor, domínio, captured_at, hash
- [ ] Cache `output/prints/index.json` é atualizado a cada captura nova
- [ ] Cache evita re-captura quando URL já capturada anteriormente (verifica hash)
- [ ] Atribuição automática no card: "via @autor" para redes sociais, "Fonte: domínio" para notícias
- [ ] Fallback funcional: se Playwright falhar, oferece volta para opção 1 (upload manual)
- [ ] Aviso TOS visível no README da squad
- [ ] Sem mudança no DB Supabase
- [ ] Workflow.yaml inclui novo step `obter-print` com `type: checkpoint` e `human_approval_required: true`
- [ ] Designer agent não procede para render sem checkpoint humano de aprovação do print

## Definition of Done

✅ Operador escolhe estilo "Print de Autoridade" e tem 3 caminhos claros para obter o print
✅ Não precisa sair do fluxo do squad para buscar print manualmente
✅ Cache local evita re-capturar URLs comuns
✅ Atribuição automática garante uso responsável

## File List

**Novos:**
- `[ ]` `aiox-squads/squads/capas-linkedin/tasks/obter-print-autoridade.md`
- `[ ]` `aiox-squads/squads/capas-linkedin/output/prints/.gitkeep`
- `[ ]` `aiox-squads/squads/capas-linkedin/output/prints/index.json` (template inicial)

**Modificados:**
- `[ ]` `aiox-squads/squads/capas-linkedin/agents/designer.md` — referenciar nova task
- `[ ]` `aiox-squads/squads/capas-linkedin/data/visual-styles.md` — pipeline atualizado do estilo 4
- `[ ]` `aiox-squads/squads/capas-linkedin/workflows/workflow.yaml` — novo step `obter-print`
- `[ ]` `aiox-squads/squads/capas-linkedin/README.md` — aviso TOS

---

## Risk Assessment

| Risco | Severidade | Mitigação |
|---|---|---|
| Playwright falha em capturar Twitter (login wall) | Médio | Fallback para opção 1 (upload manual); operador pode usar extensão de browser para baixar e fornecer path |
| EXA retorna resultados irrelevantes | Baixo | Opção 3 (3 candidatos) com escolha humana cobre o caso |
| TOS / copyright em redes sociais | Médio | Aviso explícito no README; operador é curador final; atribuição automática |
| Cache cresce indefinidamente | Baixo | V2 pode adicionar TTL ou limite de tamanho — V1 cache permanente é aceitável |

---

## Change Log

- 2026-04-30 — Story criada por @sm (River) com base no plano arquitetural [VISUAL-RECOMMENDER-PLAN.md §4](../architecture/VISUAL-RECOMMENDER-PLAN.md)
- 2026-04-30 — @po (Pax) validou via `*validate-story-draft`. Score 9/10 → **GO**. Status: Draft → Ready. Maior nota das 3 stories — Risk Assessment formal presente, escopo claro, fallback robusto (opção 1 manual cobre caso de Playwright falhar).
