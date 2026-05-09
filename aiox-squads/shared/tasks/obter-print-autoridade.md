# Task: Obter Print de Autoridade

> Task executada pelo agente **Dani Design** quando o operador escolhe o estilo 4 (Print de Autoridade).
> Tem prioridade sobre `tasks/create-cover.md` para este estilo — o print precisa existir e ser aprovado pelo operador ANTES do render.

---

## Contexto

O estilo "Print de Autoridade" precisa de um screenshot de uma fonte externa (tweet, post no LinkedIn, manchete de notícia) para servir como prova social do tema sobre o qual o Thiago vai opinar. Esta task elimina a necessidade do operador sair do fluxo do squad para procurar o print manualmente.

A task oferece **3 caminhos** ao operador, todos com **checkpoint humano obrigatório** antes de prosseguir para o render.

---

## Inputs

| Input | Origem | Descrição |
|-------|--------|-----------|
| `tema` | post de texto finalizado (step-01) | Tópico/assunto do post — usado como query semântica para o EXA |
| `slug` | post de texto finalizado (step-01) | Identificador kebab-case do output (ex: `ia-em-vendas-b2b-2026-04-30`) |
| `output/cover-input.md` | step-01 | Para reler tema/título caso necessário |

## Outputs

| Output | Path | Descrição |
|--------|------|-----------|
| Print PNG | `output/prints/<slug>/print.png` | Screenshot final aprovado pelo operador |
| Metadata | `output/prints/<slug>/metadata.json` | URL origem, autor, domínio, captured_at, hash, atribuição formatada |
| Cache atualizado | `output/prints/index.json` | Adiciona entrada nova ao array `captures` |
| Sinal para renderer | retorno textual | Path do print + string de atribuição (`via @autor` ou `Fonte: domínio`) |

---

## MCPs utilizados

| MCP | Função | Quando |
|-----|--------|--------|
| `mcp__docker-gateway__web_search_exa` | Busca semântica de URLs por tema | Opções 2 e 3 |
| Playwright MCP (instalado globalmente em `~/.claude.json`) | Abre URL e captura screenshot | Opções 1 (se URL), 2, 3 |

---

## Domínios aceitos no filtro EXA

Apenas estes domínios são considerados como candidatos relevantes (white-list para reduzir ruído e respeitar fontes públicas):

**Redes sociais públicas:**
- `twitter.com`, `x.com`
- `linkedin.com`

**Imprensa BR (negócios/tech):**
- `g1.globo.com`, `valor.globo.com`, `folha.uol.com.br`, `estadao.com.br`
- `exame.com`, `infomoney.com.br`, `e.com.br`
- `oglobo.globo.com`, `cnnbrasil.com.br`

**Imprensa internacional (negócios/tech):**
- `reuters.com`, `bloomberg.com`, `ft.com`
- `nytimes.com`, `wsj.com`, `economist.com`
- `techcrunch.com`, `theverge.com`

> Resultados em domínios fora desta lista devem ser descartados antes de mostrar ao operador.
> Se o operador quiser usar uma fonte fora da lista, deve usar **Opção 1 (upload manual)**.

---

## Steps

### 1. Apresentar opções numeradas ao operador

```
Estilo escolhido: 🖼️  Print de Autoridade

Como você quer obter o print?

  1. Eu envio o print  (path local OU URL pública)
  2. Buscar na web    (EXA descobre + Playwright captura — 1 candidato)
  3. Sugerir 2-3 prints relevantes ao tema (EXA + você escolhe)

Tema do post: <tema>
Sua escolha (1/2/3):
```

Aguardar resposta numérica do operador.

---

### 2. Branch por escolha

#### Opção 1 — Upload manual

1. Perguntar:
   ```
   Cole o caminho LOCAL (ex: C:\Users\...\print.png)
   OU a URL pública do post (ex: https://twitter.com/usuario/status/12345)
   ```
2. Detectar tipo:
   - Se começa com `http://` ou `https://` → tratar como URL → ir para sub-step 2.b
   - Caso contrário → tratar como path local → ir para sub-step 2.a

   **2.a — Path local:**
   - Criar pasta `output/prints/<slug>/` se não existir
   - Copiar arquivo para `output/prints/<slug>/print.png`
   - Calcular SHA-256 do conteúdo do arquivo → `hash`
   - Pedir ao operador: nome do autor (ex: `@usuario`) e fonte (ex: `twitter.com` ou nome do veículo)
   - Construir `metadata.json` com `{ url_origem: null, autor, dominio, captured_at, hash, source: "manual-upload" }`

   **2.b — URL pública:**
   - Canonicalizar URL: lowercase host, remover query strings de tracking (`utm_*`, `fbclid`, `gclid`, `mc_cid`, `ref`)
   - Verificar cache em `output/prints/index.json` — se hash da URL canonicalizada já existe e arquivo `path_local` existe, REUTILIZAR (pular captura)
   - Caso contrário, chamar Playwright (ver §3 abaixo) para capturar screenshot
   - Extrair autor/domínio da URL (ver §4 abaixo) e construir `metadata.json`

3. Continuar para step 3 (salvar e atualizar cache).

---

#### Opção 2 — Busca automática (1 candidato)

1. Construir query EXA:
   ```
   query = `${tema} (site:twitter.com OR site:x.com OR site:linkedin.com OR site:g1.globo.com OR site:valor.globo.com OR site:exame.com OR site:reuters.com OR site:bloomberg.com)`
   numResults = 5
   ```
2. Chamar `mcp__docker-gateway__web_search_exa` com a query.
3. Filtrar resultados pelos domínios da white-list (§"Domínios aceitos").
4. Pegar **1º resultado válido**. Mostrar ao operador:
   ```
   Candidato encontrado:
     URL:     <url>
     Título:  <título>
     Autor:   <autor extraído>
     Fonte:   <domínio>
     Trecho:  <snippet de 2 linhas se disponível>

   [A]provar e capturar  /  [P]róximo candidato  /  [M]anual (volta ao menu)
   ```
5. Branch:
   - **A**: chama Playwright (ver §3) → vai para step 3
   - **P**: pega próximo resultado válido da lista, repete checkpoint. Se acabarem candidatos: avisa e volta ao menu da Opção 1.
   - **M**: volta ao menu inicial (step 1).

---

#### Opção 3 — Sugestão curada (3 candidatos)

1. Mesma query EXA da Opção 2, mas `numResults = 10` (para ter folga após filtro).
2. Filtrar e pegar **top 3** resultados válidos.
3. Apresentar:
   ```
   3 candidatos encontrados:

     1. <título>           @<autor>     [<domínio>]
        <url>

     2. <título>           @<autor>     [<domínio>]
        <url>

     3. <título>           @<autor>     [<domínio>]
        <url>

   Escolha o número (1/2/3) ou [N]enhum (volta ao menu):
   ```
4. Operador escolhe número → chama Playwright para o escolhido (ver §3) → step 3.
5. Se **N** → volta ao menu inicial.

---

### 3. Captura via Playwright

> Usado pelas Opções 1.b, 2 e 3 quando a fonte é uma URL.

1. Abrir a URL no Playwright MCP com:
   - **Viewport:** 1280×800 (padrão para tweets/posts/manchetes)
   - **Wait:** até `networkidle` (máx 15s)
2. Tirar screenshot da área visível (`fullPage: false`) — assim captura apenas o post visível, não a timeline inteira.
3. Salvar PNG em `output/prints/<slug>/print.png`.
4. Calcular SHA-256 do arquivo → `hash`.

#### Tratamento de falha

Se a captura falhar (timeout, login wall, erro 403/429, página em branco):

```
⚠️  Não consegui capturar o print desta URL.
Possíveis causas:
  - Login wall (Twitter/X frequentemente exige login)
  - Página com proteção anti-bot
  - URL inválida ou removida

Opções:
  [M] Cole o print manualmente (volta para Opção 1)
  [P] Tentar próximo candidato  (apenas se veio das Opções 2/3)
  [C] Cancelar
```

- **M** → volta para Opção 1 com URL pré-preenchida (operador pode adaptar para path local após baixar com extensão de browser).
- **P** → próximo candidato da lista EXA.
- **C** → aborta a task; operador deve relançar o squad ou escolher outro estilo.

---

### 4. Extrair autor e domínio

Heurísticas baseadas no domínio:

| Domínio | Autor | Atribuição final |
|---------|-------|------------------|
| `twitter.com`, `x.com` | `@<handle>` extraído da URL `…/<handle>/status/…` | `via @<handle>` |
| `linkedin.com` | `@<handle>` extraído de `linkedin.com/in/<handle>/…` ou nome do post `linkedin.com/posts/<handle>_…` | `via @<handle>` |
| `g1.globo.com`, `valor.globo.com`, `folha.uol.com.br`, etc. (imprensa) | nome do veículo | `Fonte: <Nome do Veículo>` |

Se a heurística falhar (ex: URL com formato atípico), pedir ao operador para confirmar autor/fonte antes de salvar.

---

### 5. Salvar metadata

Escrever `output/prints/<slug>/metadata.json`:

```json
{
  "url_origem": "https://twitter.com/usuario/status/12345",
  "url_canonica": "https://twitter.com/usuario/status/12345",
  "path_local": "output/prints/<slug>/print.png",
  "autor": "@usuario",
  "dominio": "twitter.com",
  "captured_at": "2026-04-30T14:32:00Z",
  "hash": "sha256:<64-hex-chars>",
  "atribuicao": "via @usuario",
  "source": "exa-curated"
}
```

Campo `source` aceita: `manual-upload`, `manual-url`, `exa-auto`, `exa-curated`, `cache-hit`.

---

### 6. Atualizar cache `output/prints/index.json`

1. Ler `output/prints/index.json` (criar se não existir com `{ "version": 1, "captures": [] }`).
2. Verificar se `hash` ou `url_canonica` já existe em `captures[]`. Se sim e `path_local` aponta para arquivo existente → não duplica entrada (apenas reaproveita).
3. Caso novo, append:
   ```json
   {
     "url_origem": "<url>",
     "path_local": "output/prints/<slug>/print.png",
     "autor": "@usuario",
     "dominio": "twitter.com",
     "captured_at": "2026-04-30T14:32:00Z",
     "hash": "sha256:..."
   }
   ```
4. Escrever JSON com indentação de 2 espaços.

---

### 7. Checkpoint humano (obrigatório)

Antes de prosseguir para o render, mostrar preview ao operador:

```
✅ Print obtido:
   Arquivo:     output/prints/<slug>/print.png
   Atribuição:  via @usuario   (twitter.com)
   Capturado:   2026-04-30 14:32 UTC

[A]provar e prosseguir para o render
[R]efazer (volta ao menu de opções)
```

- **A** → retorna controle para o workflow (próximo step: `step-03-create-cover`).
- **R** → volta ao step 1.

---

### 8. Retorno para o renderer

A task entrega ao designer (step `create-cover`):

- **`print_path`**: `output/prints/<slug>/print.png`
- **`atribuicao`**: string já formatada (`via @usuario` ou `Fonte: <Veículo>`)
- **`metadata_path`**: `output/prints/<slug>/metadata.json`

O renderer do estilo 4 (template `print-autoridade.html` ou `tasks/create-cover.md`) lê `metadata.json` e popula automaticamente o campo "Atribuição" do card.

---

## Anti-Patterns

❌ **Pular o checkpoint humano** — operador é o curador final, fair use depende disso.
❌ **Capturar URL fora da white-list sem aprovação humana** — risco TOS/copyright.
❌ **Reutilizar print do cache sem mostrar preview** — operador precisa saber o que está sendo usado.
❌ **Salvar PNG fora de `output/prints/<slug>/`** — quebra organização e o renderer.
❌ **Persistir credenciais ou cookies do Playwright** — captura é stateless por design.

## Quality Criteria

- [ ] Operador sempre vê preview antes de aprovar
- [ ] Atribuição é gerada automaticamente e fica visível no card
- [ ] Cache evita re-captura de URLs comuns
- [ ] Falha do Playwright sempre oferece fallback (Opção 1 manual)
- [ ] `metadata.json` está sempre presente junto do PNG
- [ ] Cache `index.json` é atualizado a cada captura nova

---

## Integration

- **Reads from:** `output/cover-input.md` (tema, slug, estilo)
- **Writes to:**
  - `output/prints/<slug>/print.png`
  - `output/prints/<slug>/metadata.json`
  - `output/prints/index.json` (cache append)
- **Calls:**
  - `mcp__docker-gateway__web_search_exa` (Opções 2 e 3)
  - Playwright MCP (Opções 1.b, 2, 3)
- **Triggers next:** `step-03-create-cover` (apenas após aprovação humana)
