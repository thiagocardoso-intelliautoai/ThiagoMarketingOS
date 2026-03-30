# Story SUPABASE-003 — Refatoração do Data Layer (data.js → Supabase SDK)

**🏷️ ID:** `SUPABASE-003`
**📐 Estimativa:** 2h
**🔗 Depende de:** Stories 001, 002
**🔗 Bloqueia:** Story 004
**👤 Assignee:** Dev Frontend
**🏷️ Labels:** `frontend`, `refactor`, `core`
**📊 Status:** `[x]` Done

---

## Descrição

> Como **usuário do CCC**, eu quero que os **posts carreguem do Supabase em vez do localStorage**, para que os dados estejam seguros na nuvem e acessíveis de qualquer browser.

## Contexto Técnico

- **Arquivo principal:** `content-command-center/js/data.js` — 236 linhas
- **Arquitetura atual:** `localStorage` como persistência primária + `inbox.json` como import pipeline
- **Supabase JS SDK via CDN ESM:** `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm`
- **O CCC é uma SPA pura** — HTML + JS modules, sem bundler, sem Node.js no frontend
- **Credenciais:** Anon key em `aiox-squads/squads/capas-linkedin/.env`
- **API URL:** `https://mvryaxohnbftupocdlqa.supabase.co`

---

## Sub-tarefas

- [x] **3.1** Criar `content-command-center/js/supabase.js` [NOVO]

```javascript
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://mvryaxohnbftupocdlqa.supabase.co';
const SUPABASE_ANON_KEY = '...'; // copiar do .env

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function getPublicUrl(path) {
  const { data } = supabase.storage.from('content-assets').getPublicUrl(path);
  return data.publicUrl;
}
```

> **Nota:** A anon key vai hardcoded no JS pois é um app local (localhost:5500). Não vai para produção pública. Usar ESM import direto do CDN — o CCC não tem bundler.

- [x] **3.2** Refatorar `data.js` — substituir `localStorage` por chamadas ao Supabase

**Tabela de refatoração (manter a mesma API pública do DataStore):**

| Método | Antes | Depois |
|--------|-------|--------|
| `init()` | `localStorage.getItem` + `fetch seed.json` | `supabase.from('posts').select('*, covers(*), carousels(*, carousel_slides(*))')` |
| `getPosts()` | `return this._data.posts` | Retorno do cache local (preenchido no init) |
| `getPostById(id)` | `find` no array local | `find` no cache local (já tem covers/carousels via JOIN) |
| `addPost(post)` | `unshift` + `localStorage.setItem` | `supabase.from('posts').insert(...)` + atualizar cache |
| `updatePost(id, updates)` | `Object.assign` + `localStorage.setItem` | `supabase.from('posts').update(...).eq('id', id)` + atualizar cache |
| `deletePost(id)` | `splice` + `localStorage.setItem` | `supabase.from('posts').delete().eq('id', id)` + remover do cache |
| `processInbox()` | `fetch inbox.json` + merge | **ELIMINAR** — retornar `{ imported: 0, updated: 0 }` |
| `filterPosts()` | Filtro no array | **Manter igual** — filtro client-side no cache |
| `exportJSON()` | Blob + download | **Manter** como backup — exporta do cache |
| `importJSON()` | FileReader + parse | **Adaptar** — ler JSON e fazer batch insert no Supabase |

> **REGRA CRÍTICA:** A interface pública do `DataStore` (nomes dos métodos, parâmetros, retornos) deve manter compatibilidade para que `render.js` funcione sem mudanças nesta story.

- [x] **3.3** Refatorar `init()` para carregar dados com JOINs do Supabase, com fallback para localStorage se offline

- [x] **3.4** Criar helper `_mapPostFromDB(row)` — converte snake_case do Postgres para camelCase do JS. Incluir:
  - Mapeamento de todos os campos do post
  - Inclusão dos dados de `covers` e `carousels` vindos do JOIN
  - Montagem do campo `derivations` para backward-compat com render.js:
    ```javascript
    derivations: {
      cover: row.covers ? { slug: row.covers.slug, coverPath: row.covers.image_url, style: row.covers.style } : null,
      carousel: row.carousels ? { style: row.carousels.visual_style, slidesCount: row.carousels.slide_count, pdfPath: row.carousels.pdf_url } : null
    }
    ```

- [x] **3.5** Criar helper `_mapPostToDB(post)` — converte camelCase para snake_case para inserts

- [x] **3.6** Atualizar `addPost()` para inserir no Supabase e atualizar cache

- [x] **3.7** Atualizar `updatePost()` para `supabase.from('posts').update().eq('id', id)`

- [x] **3.8** Atualizar `deletePost()` para `supabase.from('posts').delete().eq('id', id)` (cascade cuida de covers/carousels)

- [x] **3.9** Transformar `processInbox()` em no-op: `return { imported: 0, updated: 0 };`

- [x] **3.10** Atualizar `app.js` — remover chamada a `processInbox()`:

```diff
  async function init() {
    await DataStore.init();
-   const result = await DataStore.processInbox();
    const badge = document.getElementById('library-badge');
    if (badge) badge.textContent = DataStore.getPosts().length;
```

- [x] **3.11** Testar que a Biblioteca carrega posts do Supabase — abrir `localhost:5500/#biblioteca`

---

## Acceptance Criteria

- [x] Posts carregam do Supabase ao abrir o CCC (não do localStorage)
- [x] Adicionar post via formulário → salva no Supabase (verificar no Dashboard)
- [x] Excluir post → remove do Supabase (verificar no Dashboard)
- [x] Filtros continuam funcionando (pilar, status, urgência, tipo)
- [x] Busca por texto continua funcionando
- [x] Export JSON ainda funciona como backup
- [x] Cada post retornado tem dados de `covers` e `carousels` (via JOIN)
- [x] Se Supabase estiver offline, fallback para localStorage funciona

## Definition of Done

✅ CCC carrega 100% dos dados do Supabase
✅ CRUD funcional (criar, ler, atualizar, excluir)
✅ Nenhuma regressão nos filtros e busca
✅ Campo `derivations` montado para backward-compat

## File List

- `[x]` `content-command-center/js/supabase.js` — [NEW]
- `[x]` `content-command-center/js/data.js` — [MODIFY] refatoração completa
- `[x]` `content-command-center/js/app.js` — [MODIFY] remover processInbox
