# Handoff — Etapa 3: UI, Banco e Sessão Estratégia

> Documento de transição para a próxima sessão. Leia inteiro antes de propor qualquer coisa.
> Este handoff é sobre **código** — UI, banco, esquema SQL, JavaScript. As etapas 0-2 (estratégia + squads Antigravity) estão concluídas.

---

## 0. Estado exato do repositório

**Repo:** `thiagocardoso-intelliautoai/ThiagoMarketingOS`
**Branch:** `main`
**Último commit:** `fa178c5` (feat(squads): Etapa 2 — 3 novos squads criados)
**Histórico recente:**
```
fa178c5 feat(squads): Etapa 2 — 3 novos squads criados
0a2a64d refactor(squads): Etapa 1 completa — capas + carrosseis aligned with v2, ACRE fully purged
1c4788a refactor(squad): Etapa 1 — align squad with v2 strategy atoms, remove ACRE
5d6197a feat: Etapa 0 — copilot context + atoms decomposition + handoff update
ad4fd52 feat: add elon-thiago-zueira.png to source photos bank
```

**Workspace local:** `c:\antigravity-projetos\Thiago-Marketing-OS`
**Deploy:** `https://thiagomarketingos.vercel.app` (auto-deploy via Vercel)

---

## 1. Quem é o Thiago — leia antes de tudo

- Head de Automação e IA na Winning Sales (consultoria de vendas brasileira). 19 anos.
- Português brasileiro, estilo casual e direto.
- **Prefere ser desafiado, não validado.** Pushes back em explicações superficiais.
- **Corta overengineering sem cerimônia.** Seja sucinto — só proponha o que move ponteiro real.
- Construtor. Já tem plataforma rodando em produção, já usa Claude Code, já opera squads no Antigravity. **Não trate como iniciante.**

**Tom sugerido:** direto, opinativo, calibrado. Marque claramente o que você sabe (certeza), o que você supõe (hipótese), e o que você não sabe.

---

## 2. O que JÁ FOI FEITO (Etapas 0-2) — não refazer

### Etapa 0 — Decomposição em Átomos ✅
- 5 docs estratégicos (`copilot/estrategia/`) decompostos em 18 átomos
- Salvos em `copilot/atomos/atoms.yaml` (369 linhas, YAML, arquivo único)
- Revisados e aprovados pelo Thiago
- **Átomos são a fonte de verdade** — docs originais ficam como referência histórica

### Etapa 1 — Atualizar Squads Existentes ✅
3 squads refatorados (zero ACRE, zero Carlos Oliveira):
- `pesquisa-conteudo-linkedin` — ICP atualizado, 4 fontes de tese, lente, tone-of-voice expandido
- `capas-linkedin` — visual styles, review checklist, agents: lente em vez de ACRE
- `carrosseis-linkedin` — copywriter, designer, reviewer, output-examples: fontes de tese

**Nota:** Referências a ACRE ainda existem em arquivos `output/` (posts históricos já gerados). São artifacts — **NÃO alterar**.

### Etapa 2 — Criar 3 Squads Novos ✅
31 arquivos criados, todos seguindo 12 padrões de qualidade dos squads em produção:

| Squad | Agentes | Pipeline | Arquivos |
|-------|---------|----------|----------|
| `seed-pautas-centrais` | Eva Estratégia | 2 modos: inicialização (4 pautas + 12 subpautas) / geração semanal | 10 |
| `seed-lista-distribuicao` | Paulo Prospector | pesquisar → aprovar → atualizar lista (4 nomes iniciais reais) | 10 |
| `briefing-materia-colab` | Petra Perfil + Bruno Briefing | input → pesquisar perfil → montar briefing → review → aprovar | 11 |

**QA da Etapa 2:** 6 dimensões verificadas, GATE: PASS. Zero ACRE em arquivos estruturais. Zero "entrevista" como ação positiva (17 proteções proibitivas no briefing-materia-colab).

---

## 3. Arquitetura do projeto — mapa de diretórios relevantes

```
ThiagoMarketingOS/
├── content-command-center/      ← PLATAFORMA WEB (seu foco na Etapa 3)
│   ├── index.html               ← SPA entry point
│   ├── css/                     ← Estilos
│   ├── js/
│   │   ├── app.js               ← Entry + router
│   │   ├── render.js            ← DOM rendering (804 linhas — arquivo principal)
│   │   ├── state.js             ← Mode definitions + PILLAR_CONFIG ⚠️ TEM ACRE
│   │   ├── data.js              ← CRUD Supabase + localStorage fallback
│   │   ├── prompts.js           ← Gerador de prompts parametrizados
│   │   ├── settings.js          ← Configurações
│   │   ├── linkedin-publish.js  ← Integração LinkedIn API
│   │   ├── linkedin-preview.js  ← Preview de posts
│   │   ├── supabase.js          ← Client Supabase
│   │   └── [outros utilitários]
│   ├── supabase/
│   │   ├── migrations/          ← 5 migrations existentes
│   │   │   ├── 20260406_linkedin_tables.sql
│   │   │   ├── 20260410_add_schedule_support.sql
│   │   │   ├── 20260411_post_analytics.sql
│   │   │   ├── 20260411_setup_cron_publish.sql
│   │   │   └── 20260420_fix_post_analytics_rls.sql
│   │   └── functions/           ← Edge functions
│   └── vercel.json              ← Deploy config
│
├── aiox-squads/                 ← SQUADS ANTIGRAVITY (Etapas 1-2 — FEITO)
│   ├── squads/
│   │   ├── pesquisa-conteudo-linkedin/   ← ✅ Refatorado
│   │   ├── capas-linkedin/               ← ✅ Refatorado
│   │   ├── carrosseis-linkedin/          ← ✅ Refatorado
│   │   ├── seed-pautas-centrais/         ← ✅ Criado (Etapa 2)
│   │   ├── seed-lista-distribuicao/      ← ✅ Criado (Etapa 2)
│   │   └── briefing-materia-colab/       ← ✅ Criado (Etapa 2)
│   └── data/                    ← Dados compartilhados entre squads
│
├── copilot/                     ← CONTEXTO ESTRATÉGICO (temporário)
│   ├── handoff.md               ← Handoff original completo (413 linhas)
│   ├── handoff-etapa3.md        ← ESTE DOCUMENTO
│   ├── estrategia/              ← 5 docs base (referência histórica)
│   ├── atomos/
│   │   └── atoms.yaml           ← 18 ÁTOMOS — FONTE DE VERDADE (369 linhas)
│   └── referencias/
│
├── aiox-project/                ← Config Antigravity
│   ├── .antigravity/agents/     ← Agentes do framework (qa.md, dev.md, etc.)
│   └── .env                     ← Variáveis de ambiente
│
└── .agents/workflows/           ← Workflows de ativação de squads
```

---

## 4. Stack técnica e schema atual do banco

### Stack
- **Frontend:** Vanilla JS, HTML, CSS (SPA sem framework)
- **Backend:** Supabase (Postgres + Edge Functions + Storage)
- **Deploy:** Vercel (auto-deploy da branch main)
- **API:** LinkedIn API oficial integrada (OAuth, publishing, analytics)

### Schema atual do banco (Supabase)

```sql
-- Tabelas existentes:
oauth_states (id, state, created_at, expires_at)
linkedin_tokens (id, user_id, access_token, person_urn, display_name, profile_picture_url, expires_at, ...)
scheduled_posts (id, post_content, post_type, media_url, media_filename, scheduled_at, status, linkedin_post_urn, ...)
posts (id, ..., post_urn) -- schema completo visível em data.js._mapPostFromDB()
post_analytics (id, post_id FK→posts, post_urn, impressions, reactions, comments, reshares, members_reached, ...)
covers (...) -- relacionada a posts
carousels (...) -- relacionada a posts
carousel_slides (...) -- relacionada a carousels
```

**Tabelas que NÃO existem ainda e precisam ser criadas na Etapa 3:**
- `pautas_centrais` (id, nome, fonte_tese, descricao, ordem, created_at, updated_at)
- `subpautas` (id, pauta_central_id FK, titulo, angulo, hook_embrionario, materia_prima, urgencia, status, created_at)
- `lista_distribuicao` (id, nome, funcao, rede_relevante, titulo_com_lente, expectativa, expande_bolha, status, created_at)
- `exclusoes_distribuicao` (id, tipo, nome_ou_arquetipo, motivo, created_at)
- `atomos_estrategicos` (id, chave, valor_yaml, updated_at) — ou schema por átomo individual
- **Coluna `pauta_central_id` na tabela `posts`** — label FK para conectar post à pauta

---

## 5. O que a Etapa 3 deve fazer — escopo completo

### 5.1 Tab 1 — Pautas (NOVA, dentro de Create)

**Subaba Distribuição:**
- Lista persistente: nome + título da matéria pela lente, editáveis inline
- Botão "Gerar mais sugestões" → gera prompt → Antigravity → lista volta ao banco
- Blacklist dinâmica injetada no prompt: pessoas já na lista + arquétipos vetados
- Clicar no nome → gera prompt do squad Briefing Matéria-Colab

**Subaba Pautas Centrais:**
- Vista hierárquica com drill-down: Pauta Central → Subpautas
- Cada Pauta mostra: contador de uso + tempo desde último post
- Seed squad gera Pautas/Subpautas
- Edição inline persiste no banco
- Clicar numa Subpauta → prompt parametrizando Escrever Post Direto

### 5.2 Tab 2 — Posts (Create existente, refinado)

**Cards que ficam:**
- Briefing On-Demand (pesquisa profunda, não passa por Subpauta)
- Escrever Post Direto (aceita input opcional de Subpauta ou Pessoa de Distribuição)

**Cards que saem:**
- Pesquisa Semanal (modo 1) → migra pra Tab 1
- Benchmark Concorrentes (modo 2) → migra pra Tab 1
- Planejamento Mensal (modo 5) → **EXCLUÍDO completamente**

### 5.3 Tab 3 — Conteúdos (existente, expandido)

- Filtro adicional por Pauta Central
- **Radar de ICP** — tabela por Pauta Central: total interações / top 5 cargos / profile activity atribuída
- Via API Member Post Analytics já integrada

### 5.4 Sessão "Estratégia" (nova)

Espaço na plataforma pra editar átomos estratégicos:
- Cada átomo = cartão/campo visual distinto
- Edição escreve direto no banco
- Squads passam a ler do banco na próxima geração
- Layout guiado pela unidade do átomo, não por cópia dos 5 docs

### 5.5 Mecanismo do label `pauta_central`

**Determinístico, via código, sem depender de squad:**
- Clique em Subpauta/Pessoa → plataforma seta label + gera ID único embutido no prompt
- Antigravity salva post passando ID
- Plataforma faz merge via ID
- Squad não precisa saber da label

---

## 6. Armadilhas técnicas — CUIDADO

### ⚠️ ACRE no código da plataforma (AINDA EXISTE)

O `state.js` ainda tem:
```js
export const PILLAR_CONFIG = {
  A: { label: 'Alcance', cssClass: 'badge-autoridade' },
  C: { label: 'Credibilidade', cssClass: 'badge-conexao' },
  R: { label: 'Retorno', cssClass: 'badge-resultado' },
  E: { label: 'Engajamento', cssClass: 'badge-engajamento' },
};
```
E o `render.js` usa `PILLAR_CONFIG` pra badges na biblioteca de posts.
**Ação:** Remover PILLAR_CONFIG e substituir por classificação por fonte de tese (Skills em Produção / Benchmark Real / Process Diagnostic / Falha Documentada).

### ⚠️ Modo 5 (Planejamento Mensal) ainda existe no state.js

```js
5: {
  name: 'Planejamento Mensal',
  desc: '12 posts de uma vez — plano tático de 4 semanas (DTC + ACRE)',
  featured: true,
  badge: '12 posts'
}
```
**Ação:** Remover modo 5 completamente. Referência a "DTC + ACRE" é duplamente obsoleta.

### ⚠️ Coluna `pillar` na tabela `posts`

Posts existentes no banco provavelmente têm campo `pillar` com valores A/C/R/E.
**Ação:** Deprecar campo (não deletar dados antigos). Adicionar campo `fonte_tese` e `pauta_central_id`.

### ⚠️ `prompts.js` pode estar hardcoded com ACRE

O gerador de prompts pode incluir referências a pilares ACRE no system prompt.
**Ação:** Verificar e substituir por átomos corretos.

---

## 7. Decisões JÁ TOMADAS — NÃO relitigar

1. ACRE eliminado — pilares A/C/R/E não existem mais na estratégia
2. ICP "Carlos Oliveira" eliminado — substituído por hipótese de ICP aberta
3. Planejamento Mensal excluído — não volta
4. Átomos como camada única no banco (NÃO docs narrativos + átomos)
5. Formato matéria-colab: jornalismo sem entrevista, sem reunião, sem contrapartida
6. Visual matéria-colab: SEMPRE Editorial Clean (caderno NUNCA)
7. Squad consome átomos do banco, não de arquivos locais (pós Etapa 3)
8. Pauta Central é estrutural (Thiago decide), Subpauta é tática (squad sugere)
9. Lista de distribuição inicial: 4 nomes reais (Victor Baggio, Ivan Nunes, Coutinho, Rafael Faria)
10. Gate da lente: "consigo formular título pela minha lente?" — inegociável

**Ver lista completa de decisões descartadas na seção 8 do handoff original (`copilot/handoff.md` linhas 266-282).**

---

## 8. Fonte de verdade dos átomos

**Arquivo:** `copilot/atomos/atoms.yaml` (369 linhas)

18 átomos decompostos:
```
brand_lens, flag_anchor, flag_sub, icp_hypothesis, content_sources,
content_rules, audience_levels, signature_visual,
reach_mechanic, reach_quality_rule,
distribution_mechanic, distribution_gate, distribution_subject_profile,
distribution_exclusions, distribution_initial_list,
positioning_gap, positioning_voice_patterns, positioning_not_gap
```

**Squad × átomos consumidos:**

| Squad | Átomos |
|-------|--------|
| Pesquisa Semanal (migra Tab 1) | brand_lens, flag_anchor, flag_sub, content_sources, content_rules, reach_mechanic, reach_quality_rule, positioning_gap, positioning_voice_patterns |
| Benchmark Concorrentes (migra Tab 1) | brand_lens, flag_anchor, flag_sub, content_sources, content_rules, positioning_gap, positioning_voice_patterns |
| Briefing On-Demand (fica Tab 2) | brand_lens, flag_anchor, flag_sub, content_rules, audience_levels, positioning_gap, positioning_voice_patterns |
| Escrever Post Direto (fica Tab 2) | brand_lens, content_rules, audience_levels, signature_visual, reach_quality_rule, positioning_gap, positioning_voice_patterns |
| Seed Pautas Centrais (novo) | brand_lens, flag_anchor, flag_sub, content_sources, content_rules, positioning_gap |
| Seed Lista Distribuição (novo) | brand_lens, distribution_mechanic, distribution_gate, distribution_subject_profile, distribution_exclusions, positioning_gap |
| Briefing Matéria-Colab (novo) | brand_lens, distribution_mechanic, distribution_gate, signature_visual (parcial), positioning_gap |

---

## 9. Handoff original completo

O handoff original (413 linhas) fica em `copilot/handoff.md`. Contém contexto estratégico completo, as seções 1-11 detalhadas, e a lista de decisões descartadas. **Leia se precisar de contexto mais profundo sobre qualquer decisão.**

---

## 10. Primeiro passo concreto

1. Confirme que leu este handoff + `copilot/handoff.md` + `copilot/atomos/atoms.yaml`
2. Examine o código real: `content-command-center/js/state.js`, `render.js`, `data.js`, `prompts.js`
3. **Proponha plano de implementação** para a Etapa 3, priorizando:
   - Schema SQL primeiro (tabelas novas + coluna `pauta_central_id` em posts)
   - Tab 1 Pautas (nova UI)
   - Remoção de ACRE e Planejamento Mensal do código
   - Sessão Estratégia
4. Espere aprovação do Thiago antes de implementar

**Não proponha nada fora deste escopo sem argumento novo.**
**Quando `copilot/` migrar pro banco, a pasta pode ser arquivada.**

---

**Fim do handoff. Boa sorte.**
