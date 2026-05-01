# Visual Recommender — Plano de Arquitetura

> **Autor:** Aria (Architect)
> **Data:** 2026-04-30
> **Origem:** Pesquisa do Atlas (Analyst) consolidada em handoff `analyst-to-architect-2026-04-30`
> **Decisão do operador:** Manter os 9 nomes de estilo originais. Clareza vem de (a) sugestão estratégica automática emitida pelos squads + CCC; (b) descrição "vence quando / perde quando" visível no momento da escolha manual.
> **Status:** Plano aprovado para virar 3 stories executáveis pelo `/sm`.

---

## 1. Visão Holística

Três frentes complementares, **independentes para implementação** mas integradas no produto final:

```
┌─────────────────────────────────────────────────────────────────────┐
│                       Fluxo do Operador                              │
│                                                                      │
│  Squad gera post  ──►  Squad emite recommendVisual + razão           │
│                              │                                       │
│                              ▼                                       │
│              Post salvo no DB (com sugestão como metadata)           │
│                              │                                       │
│                              ▼                                       │
│        CCC mostra cards de estilo COMO HOJE — só que o card          │
│        recomendado ganha ESTRELINHA + 1 linha de motivo              │
│        Operador olha, identifica a estrela, copia o prompt           │
│        (sem banner, sem botão de aceitar, mesmo fluxo manual)        │
│                              │                                       │
│                              ▼                                       │
│      Squad capa/carrossel executa com estilo escolhido               │
│                              │                                       │
│           ┌──────────────────┴─────────────────┐                     │
│           ▼ (se Print de Autoridade)           ▼ (outros 8 estilos)  │
│  Squad oferece 3 opções para o print:    Pipeline tradicional        │
│  1. Upload manual                                                    │
│  2. EXA → Playwright captura                                         │
│  3. Sugestão curada (EXA + 2-3 opções)                               │
└─────────────────────────────────────────────────────────────────────┘
```

**Decisões arquiteturais-chave:**
1. A sugestão **nasce no squad** (no momento em que o post é criado, com contexto fresco) e é **exibida no CCC** (com fallback de cálculo client-side se o squad não emitiu). Isso resolve o requisito do operador "os squads já passarem com a sugestão de forma estratégica" sem acoplar o CCC a uma chamada síncrona.
2. **UX minimalista** — a sugestão é apenas uma marcação visual sutil no card existente (estrelinha + borda destacada + 1 linha de motivo). Sem banner separado, sem botão "aceitar/override", sem pré-seleção. O operador continua copiando o prompt manualmente como hoje — a estrelinha apenas indica qual prompt copiar.

**Princípio de complexidade progressiva:**
- V1 (escopo deste plano): sugestão como string de metadata + render no CCC + descrições nos cards
- V2 (futuro): coluna estruturada no DB (`recommended_format`, `recommended_style`) + analytics de aceitação/override + ML para ajuste fino

---

## 2. Story 1 — Descrições por Estilo (vence quando / perde quando)

### 2.1 Goal

Adicionar a cada um dos 9 estilos visuais um par `vence_quando` / `perde_quando` em **prosa curta** (1-2 frases cada), exibido como tooltip ao passar o mouse no card de seleção e documentado no `visual-styles.md` de cada squad.

### 2.2 Acceptance Criteria

- [ ] Em `content-command-center/js/prompts.js`, cada label de `estiloLabels` em `carrossel()` e `capa()` recebe um terceiro campo `descricao` com objeto `{ vence_quando, perde_quando }`.
- [ ] Em `content-command-center/js/render.js`, os cards do style selector exibem tooltip ao hover com as duas frases (CSS em `linkedin-preview.css` ou novo `style-card.css`).
- [ ] `aiox-squads/squads/capas-linkedin/data/visual-styles.md` ganha sessão **"Perde Quando"** abaixo de **"Quando Usar"** em cada um dos 5 estilos.
- [ ] `aiox-squads/squads/carrosseis-linkedin/data/visual-styles.md` ganha o mesmo nos 4 estilos.
- [ ] Conteúdo da descrição validado contra a árvore de decisão (ver §3.4) — não pode haver contradição entre o que a sugestão automática diz e o que o tooltip diz.
- [ ] Zero impacto em posts já salvos (sem migration, sem novos campos no DB).

### 2.3 Conteúdo a aplicar

Texto base extraído da pesquisa do Atlas. Cada estilo ganha duas frases curtas:

**Capas:**

| Estilo | Vence quando | Perde quando |
|---|---|---|
| Rascunho no Papel | Conteúdo é visualizável em 3-5 blocos (framework, fluxo, comparação) e o tom permite informalidade | Conteúdo é puramente verbal (frase) ou puramente numérico (1 dado) |
| Pessoa + Texto | Post é sobre uma cena específica (palestra, cliente, setup) e existe foto adequada no banco | Tema é abstrato/conceitual sem cena real para ancorar |
| Micro-Infográfico | Post inteiro orbita 1 dado quantitativo verificável com fonte citada | Tem ≥2 dados centrais (vai Data-Driven carrossel) ou nenhum dado |
| Print de Autoridade | Reação curta a algo público (tweet, headline) cabe em 1-2 parágrafos | Não tem print real, ou reação precisa de desenvolvimento longo |
| Quote Card | Existe UMA frase central falsificável que vira screenshot por si só | A força do post está no desenvolvimento, não numa frase isolada |

**Carrosséis:**

| Estilo | Vence quando | Perde quando |
|---|---|---|
| Notebook Raw | Conteúdo tem arco pessoal/opinativo (mito, reflexão, framework pessoal) e tom é informal/cru | É matéria-colab (precisa premium) ou tem dados centrais (vai Data-Driven) |
| Editorial Clean | Matéria-colab, framework denso/educacional, tutorial formal, tom premium-neutro | Tom é provocativo/pessoal (vai Notebook Raw) |
| Data-Driven | Há ≥2 números comparativos e a narrativa É sobre os dados (benchmark, ROI, antes/depois) | Só 1 número (vai Micro-Infográfico capa) ou não há dados centrais |
| Twitter-Style | Há print real + reação tem desenvolvimento em ≥3 etapas/argumentos | Sem print disponível, ou reação cabe em 1 frame (vai Print de Autoridade capa) |

### 2.4 Files a modificar

- [content-command-center/js/prompts.js](../../../content-command-center/js/prompts.js:81-114) — estender `estiloLabels` com objeto `{ label, descricao: { vence_quando, perde_quando } }`. Manter compatibilidade com chamadas existentes via getter ou string default.
- [content-command-center/js/render.js](../../../content-command-center/js/render.js) — área do style-selector (~linhas 600-740): cada `.style-card` ganha `data-vence` e `data-perde` + CSS de tooltip.
- [content-command-center/css/](../../../content-command-center/css/) — novo `style-card-tooltip.css` ou injeção no CSS existente.
- [aiox-squads/squads/capas-linkedin/data/visual-styles.md](../../../aiox-squads/squads/capas-linkedin/data/visual-styles.md) — adicionar bloco "Perde Quando" em cada estilo.
- [aiox-squads/squads/carrosseis-linkedin/data/visual-styles.md](../../../aiox-squads/squads/carrosseis-linkedin/data/visual-styles.md) — idem.

### 2.5 Trade-off

Tooltip CSS-only vs. componente JS:
- **CSS-only** (recomendado): zero JS extra, performance máxima, acessibilidade via `title` attribute como fallback.
- **JS** (descartado): overkill para 1-2 frases.

### 2.6 Estimativa

S (Small) — ~2-3h. Cosmético, sem risco arquitetural.

---

## 3. Story 2 — Sistema de Recomendação Automática

### 3.1 Goal

Implementar `recommendVisual(post)` que, a partir dos sinais já existentes no post (`fonteTese`, `framework`, `hookText`, `body`, `hookStructure`), retorna `{ formato, estilo, confianca, motivo }`. A função vive em duas camadas:

1. **No squad** — emite a sugestão no `post-final.md` ao gerar o post (campo de metadata)
2. **No CCC** — fallback que recalcula client-side se a sugestão não veio do squad, e exibe hint visual no preview

### 3.2 Acceptance Criteria

- [ ] Função pura `recommendVisual(post): { formato, estilo, confianca, motivo }` em [content-command-center/js/recommend-visual.js](../../../content-command-center/js/recommend-visual.js) (novo arquivo).
- [ ] [content-command-center/js/render.js](../../../content-command-center/js/render.js) chama `recommendVisual(post)` e adiciona classe CSS `style-card-recommended` no card correspondente. Card recomendado mostra:
  - ⭐ ícone no canto superior direito
  - Borda destacada (cor accent — Teal)
  - 1 linha de texto pequena no rodapé do card: *"Sugestão para esse post — &lt;motivo curto&gt;"*
  - **NÃO há banner separado, NÃO há botão "aceitar", NÃO há pré-seleção** — o operador continua copiando o prompt manualmente. A estrelinha só indica qual.
- [ ] ~30 linhas de CSS no estilo do CCC (incremento em arquivo existente, não criar novo): `.style-card-recommended` com borda Teal, badge ⭐, e `.recommend-reason` para a frase do motivo.
- [ ] Squad de pesquisa ([aiox-squads/squads/pesquisa-conteudo-linkedin/tasks/07-estruturacao-post.md](../../../aiox-squads/squads/pesquisa-conteudo-linkedin/tasks/07-estruturacao-post.md)) e squad de matéria-colab ([aiox-squads/squads/criar-materia-colab/](../../../aiox-squads/squads/criar-materia-colab/)) emitem campo `Sugestão Visual:` no `## Metadata` do post-final.md no formato `<formato>/<estilo>` com motivo em parêntese curto.
- [ ] [aiox-squads/shared/scripts/save-post-cli.js](../../../aiox-squads/shared/scripts/save-post-cli.js) extrai a sugestão e salva em campo `recommended_visual` na tabela `posts` (text livre, sem enum) — **única** mudança no DB no V1.
- [ ] Testes unitários para `recommendVisual()` cobrindo: PAS curto → Capa Rascunho; Lista densa → Carrossel Notebook; Benchmark com 2+ números → Carrossel Data-Driven; frase ultra falsificável → Capa Quote Card; Storytelling com foto → Capa Pessoa+Texto.
- [ ] Confiança visível como cor da borda: alta = Teal sólido; média = Teal com 60% opacity; baixa = neutra com aviso *"baixa confiança — escolha manualmente"*.

### 3.3 Sinais (extracção)

| Sinal | Origem | Como deriva |
|---|---|---|
| `framework` | post.framework | Direto (PAS / Contraste / Storytelling / Lista / Declaração+Defesa) |
| `fonte_tese` | post.fonteTese | Direto (Skills / Benchmark / Process Diagnostic / Falha) |
| `char_count` | post.body | `post.body.length` |
| `dados_quant` | post.body | Regex multi: `/\d+%/`, `/R\$\s?\d+/`, `/\d+x\b/`, `/\d+\s*(?:min|h|seg|dias?)\b/`, `/(?:de|from)\s+\d+\s+(?:para|to)\s+\d+/` — count >= 2 → comparativo |
| `tem_etapas` | post.body | Regex: `/^\s*\d+[\.\)]\s/m` count ≥3 OU markers `/passo \d/i` ≥3 |
| `frase_falsificavel` | post.hookText / post.body | Heurística: hookText curto (<140 chars) + tem termo contraintuitivo (`/não|nunca|verdade|mito|errado/i`) — sinaliza candidato a Quote Card |
| `tem_print` | (V1: input opcional do usuário) | Pergunta no preview ou metadata do squad |
| `tem_foto_contextual` | (V1: input opcional do usuário) | Idem |

### 3.4 Árvore de decisão

Pseudo-código completo (a ser implementado em `recommend-visual.js`):

```javascript
function recommendVisual(post) {
  const sig = extractSignals(post);
  const motivos = [];

  // ─── Decisão 1: Capa OU Carrossel ──────────────────────────────
  let formato;
  if (sig.tem_etapas >= 3) {
    formato = 'carrossel'; motivos.push('tem ≥3 etapas sequenciais');
  } else if (sig.dados_quant_comparativos >= 2) {
    formato = 'carrossel'; motivos.push('múltiplos dados comparativos');
  } else if (sig.char_count > 1100 &&
             ['Lista','Declaração+Defesa'].includes(sig.framework)) {
    formato = 'carrossel'; motivos.push('framework denso > 1100 chars');
  } else if (sig.framework === 'Storytelling' && sig.char_count > 1000) {
    formato = 'carrossel'; motivos.push('storytelling com arco longo');
  } else if (sig.frase_falsificavel || sig.dados_quant === 1 ||
             sig.char_count <= 800) {
    formato = 'capa'; motivos.push('mensagem unitária');
  } else {
    formato = 'capa'; motivos.push('default — CTR maior na thumbnail');
  }

  // ─── Decisão 2: Qual estilo ────────────────────────────────────
  let estilo;
  if (formato === 'carrossel') {
    if (sig.dados_quant_comparativos >= 2 && sig.fonte_tese === 'Benchmark Real')
      estilo = 'Data-Driven';
    else if (sig.tem_print && sig.char_count > 800)
      estilo = 'Twitter-Style';
    else if (post.fonte === 'materia-colab' || sig.tom === 'educacional_premium')
      estilo = 'Editorial Clean';
    else if (['Falha Documentada','Skills em Produção','Process Diagnostic']
             .includes(sig.fonte_tese))
      estilo = 'Notebook Raw';
    else
      estilo = 'Editorial Clean'; // fallback versátil
  } else { // capa
    if (sig.frase_falsificavel && sig.char_count <= 600)
      estilo = 'Quote Card';
    else if (sig.dados_quant === 1)
      estilo = 'Micro-Infográfico';
    else if (sig.tem_print)
      estilo = 'Print de Autoridade';
    else if (sig.tem_foto_contextual && sig.framework === 'Storytelling')
      estilo = 'Pessoa + Texto';
    else
      estilo = 'Rascunho no Papel'; // default — visualizável + humanizado
  }

  // ─── Confiança (heurística simples) ────────────────────────────
  const confianca = calcConfidence(sig, formato, estilo);
  // alta: sinais fortes e não ambíguos; média: 1 ramo dominante; baixa: empate

  return {
    formato,
    estilo,
    confianca,  // 'alta' | 'media' | 'baixa'
    motivo: motivos.join('; ')
  };
}
```

### 3.5 Integração com squads (emissão pelo squad)

O squad de redação acrescenta no `post-final.md`:

```markdown
## Metadata
- **Pilar ACRE:** ... (legacy)
- **Fonte de Tese:** Skills em Produção
- **Tema:** ...
- **Framework:** Lista
- **Hook:** ...
- **Sugestão Visual:** carrossel/Notebook Raw (lista de 5 pontos com tom pessoal)
```

`save-post-cli.js` lê essa linha e popula `posts.recommended_visual = "carrossel/Notebook Raw"` no Supabase. CCC lê esse campo e, se vazio, recalcula via `recommendVisual()`.

### 3.6 Files a modificar/criar

**Novos:**
- `content-command-center/js/recommend-visual.js` — função pura `recommendVisual(post)` + `extractSignals(post)` + tabela de motivos

**Modificados:**
- `content-command-center/js/render.js` — chama `recommendVisual` e aplica classe CSS `style-card-recommended` no card certo (~30 linhas adicionadas)
- `content-command-center/css/` — incremento em arquivo de estilo existente (NÃO criar novo): `.style-card-recommended` (borda Teal + badge ⭐) e `.recommend-reason` (linha do motivo)
- `content-command-center/js/data.js` — campo `recommendedVisual` no parse de row e no save
- `aiox-squads/shared/scripts/save-post-cli.js` — extrair `Sugestão Visual:` do markdown
- `aiox-squads/squads/pesquisa-conteudo-linkedin/tasks/07-estruturacao-post.md` — passo final emite a sugestão
- `aiox-squads/squads/pesquisa-conteudo-linkedin/data/post-structure-linkedin.md` — adicionar campo no template obrigatório
- `aiox-squads/squads/criar-materia-colab/` — equivalente

**Mudança no DB (mínima):**
- Tabela `posts`: adicionar coluna `recommended_visual TEXT NULL`. Sem enum, sem constraint, sem migration de posts antigos. ⇒ delegar a `/data-engineer` para script SQL.

### 3.7 Trade-offs

1. **Squad emite vs CCC calcula:**
   - **Decisão:** ambos. Squad emite na criação (contexto fresco, motivo explicado em prosa). CCC recalcula como fallback.
   - **Por quê:** sem fallback, posts antigos ou squads não atualizados ficam sem sugestão.

2. **Heurística vs LLM:**
   - **V1:** heurística determinística (regex + conditionals). Custo zero, latência zero, debugável.
   - **V2:** se taxa de override for alta (>40%), considerar fine-tuning por LLM com `body` completo.

3. **Confiança como label vs número:**
   - **Decisão:** label (`alta`/`media`/`baixa`). UX mais limpa que "73%".

### 3.8 Estimativa

S/M — ~3-4h. Função + UI minimalista (estrelinha) + integração squad + 1 coluna no DB. Reduzido vs versão original (era 6-8h com banner + botão de aceitar).

---

## 4. Story 3 — Capa "Print de Autoridade": Fluxo de Obtenção

### 4.1 Goal

Hoje o squad capa-linkedin assume que o operador já tem o print pronto. A nova versão oferece 3 caminhos: upload manual, busca via EXA, ou curadoria de prints sugeridos pelo squad — com checkpoint humano antes do render.

### 4.2 Acceptance Criteria

- [ ] No squad capa-linkedin, ao escolher estilo `Print de Autoridade`, o `designer` agent abre **checkpoint novo** com 3 opções numeradas:
  1. **Upload manual** — operador fornece path de arquivo local OU URL pública
  2. **Buscar na web** — designer usa EXA para descobrir + Playwright para capturar UM print específico
  3. **Sugerir 2-3 prints** — designer faz busca curada e apresenta candidatos com URL + thumbnail + contexto
- [ ] Para opções 2/3, integração com EXA via docker-gateway (`mcp__docker-gateway__web_search_exa`) e Playwright (capture screenshot da URL).
- [ ] Print obtido é salvo em `aiox-squads/squads/capas-linkedin/output/prints/<slug>/` com metadados (URL fonte, autor, data captura).
- [ ] Checkpoint humano: operador valida o print escolhido antes do render HTML — não há render automático.
- [ ] Atribuição automática no card final: "via @<autor>" ou "Fonte: <domínio>".
- [ ] Aviso explícito sobre uso responsável (TOS) no markdown do squad — operador é o curador final.
- [ ] Cache opcional `aiox-squads/squads/capas-linkedin/output/prints/index.json` para evitar re-captura de URLs já vistas.
- [ ] Sem mudança no DB — prints vivem no filesystem do squad, atrelados ao output da capa.

### 4.3 Fluxo detalhado

```
Operador escolhe estilo "Print de Autoridade"
  │
  ▼
Designer agent: "Como obter o print?"
  1. Eu tenho o print (path/URL)
  2. Buscar na web (EXA)
  3. Sugerir 2-3 prints relevantes ao tema
  │
  ├─► Opção 1: operador fornece path OU URL
  │       │
  │       ├─ Path: copia para output/prints/<slug>/
  │       └─ URL: Playwright capture → output/prints/<slug>/
  │
  ├─► Opção 2: EXA web_search (query do tema do post)
  │       → 1º resultado relevante (tweet/notícia/post público)
  │       → Playwright captura screenshot da URL
  │       → checkpoint: operador valida ou pede outro
  │
  └─► Opção 3: EXA web_search → top 3 candidatos
          → Designer mostra: "1) <título> @<autor> [thumb]"
                              "2) ..."
                              "3) ..."
          → Operador escolhe número
          → Playwright captura
  │
  ▼
Print salvo em output/prints/<slug>/print.png + metadata.json
  │
  ▼
Designer renderiza HTML com print incluído
  │
  ▼
Render normal do estilo Print de Autoridade
```

### 4.4 Files a modificar

- [aiox-squads/squads/capas-linkedin/agents/designer.md](../../../aiox-squads/squads/capas-linkedin/agents/designer.md) — adicionar seção "Fluxo de obtenção de print" para o estilo 4.
- [aiox-squads/squads/capas-linkedin/data/visual-styles.md](../../../aiox-squads/squads/capas-linkedin/data/visual-styles.md) — atualizar §"Pipeline de Criação" do estilo 4 (Print de Autoridade).
- [aiox-squads/squads/capas-linkedin/workflows/workflow.yaml](../../../aiox-squads/squads/capas-linkedin/workflows/workflow.yaml) — novo step `obter-print` antes de `gerar-capa`, com `type: checkpoint`.
- Novo: `aiox-squads/squads/capas-linkedin/tasks/obter-print-autoridade.md` — task executável com os 3 caminhos.
- Novo: `aiox-squads/squads/capas-linkedin/output/prints/.gitkeep` — diretório de output.

### 4.5 Trade-offs

1. **EXA vs Apify vs Playwright direto:**
   - **EXA**: descobre URLs relevantes (busca semântica) → barato, rápido
   - **Apify**: scraping específico de Twitter/LinkedIn (Actors dedicados) → melhor qualidade em redes sociais
   - **Playwright**: captura visual de qualquer URL → necessário para gerar a imagem final
   - **Decisão V1:** EXA (descoberta) + Playwright (captura). Apify fica para V2 se Playwright tiver problemas com sites com bot detection.

2. **Cache de prints:**
   - Operador pode comentar a mesma notícia em posts diferentes. Cache local evita re-captura.
   - **Decisão V1:** cache simples em JSON (`output/prints/index.json` com `{ url, path, captured_at, hash }`).

3. **TOS / Copyright:**
   - Posts públicos no LinkedIn/Twitter podem ser citados (fair use), mas sempre com atribuição.
   - **Decisão:** operador é responsável final. Squad apenas captura + atribui automaticamente; não publica sem checkpoint humano.

4. **Detecção automática de print necessário:**
   - Atualmente o operador escolhe o estilo. **Não detectar** automaticamente "esse post pede print" — fora do escopo desta story (poderia entrar como sinal em recommendVisual V2).

### 4.6 Estimativa

M (Medium) — ~5-7h. Lógica de squad + integração MCP (EXA + Playwright) + UI de seleção + cache.

### 4.7 Risco

- **Médio:** Playwright já está no projeto (MCP global), mas captura de tweets pode falhar se Twitter exigir login. Mitigação: opção 1 (upload manual) é fallback robusto.
- **Baixo:** EXA pode retornar resultados irrelevantes; mitigação é a opção 3 (3 candidatos + escolha humana).

---

## 5. Plano de Execução (ordem recomendada)

| Ordem | Story | Justificativa |
|---|---|---|
| 1ª | **Story 1** — Descrições (~2-3h) | Cosmético, baixo risco, libera valor imediato (tooltip "vence/perde quando" no card) |
| 2ª | **Story 2** — Recommender (~3-4h) | Estrelinha + 1 linha de motivo no card recomendado. Constrói em cima da Story 1 (motivo usa o vocabulário "vence/perde") |
| 3ª | **Story 3** — Print de Autoridade (~5-7h) | Independente das anteriores. Integração com EXA (descoberta) + Playwright (captura) — operador autorizou ambas (ferramentas já instaladas via MCP) |

**Tempo total estimado:** ~10-14h (vs ~16h da versão original, antes da simplificação da UX da Story 2).

**Dependência única entre stories:** Story 2 referencia o vocabulário ("vence quando / perde quando") que a Story 1 cristaliza nos visual-styles.md. Outras dependências = nenhuma.

---

## 6. Decisões de Boundaries (delegação)

| Decisão | Owner | Por quê |
|---|---|---|
| Adicionar coluna `recommended_visual` em `posts` | `/data-engineer` (Dara) | Schema design é exclusivo dela (per agent-authority) |
| Criar 3 stories no `docs/stories/` | `/sm` (River) | Story creation é exclusivo |
| Validar stories | `/po` (Pax) | Validation é exclusivo |
| Implementar | `/dev` (Dex) | Implementation |
| Code review automático | CodeRabbit | Pré-commit + Pré-PR |
| QA Gate | `/qa` (Quinn) | 7 quality checks |
| Push e PR | `/devops` (Gage) | Exclusivo |

---

## 7. Decisões de Default (operador autorizou Aria a assumir)

Operador decidiu que Aria assume os defaults recomendados nas 4 questões abertas. Decisões consolidadas:

1. **Detecção de `tem_print` / `tem_foto_contextual`:** ✅ checkbox simples no preview do CCC ("este post tem print de autoridade?" / "tem foto contextual disponível?"). Mais previsível que heurística por palavras-chave.

2. **Confidence display:** ✅ visível sempre via cor da borda do card recomendado:
   - **Alta** — borda Teal sólida + estrela ⭐
   - **Média** — borda Teal 60% opacity
   - **Baixa** — borda neutra + label *"baixa confiança — escolha manualmente"*

3. **Cache de prints (Story 3):** ✅ permanente em `output/prints/index.json` com `captured_at` visível no metadata. Operador decide reuso.

4. **Source of truth das descrições (Story 1):** ✅ markdown nos `visual-styles.md` dos squads + build step ou parsing on-demand para alimentar o CCC. Operador edita o markdown sem tocar em JS.

---

## 8. Próximos Comandos

```
/sm *create-story  → cria 3 stories baseadas neste plano
/po *validate-story-draft  → para cada story criada
/data-engineer  → adiciona coluna recommended_visual (delegação Story 2)
/dev *develop-story  → implementação
/qa *qa-gate  → quality gate
/devops *push  → push final
```

---

— Aria, arquitetando o futuro 🏗️
