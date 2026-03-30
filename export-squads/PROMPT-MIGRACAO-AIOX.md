# Prompt de Migração para AIOX

> **Instruções:** Copie o conteúdo abaixo (entre as linhas `---`) e cole no AIOX como prompt inicial, junto com o arquivo `MIGRATION-GUIDE.md` e a pasta `export-squads/` completa.

---

## 📋 CONTEXTO + INSTRUÇÃO DE MIGRAÇÃO

Estou migrando 2 squads de conteúdo do framework Opensquad para o AIOX. Preciso que você recrie esses squads seguindo 100% a arquitetura AIOX (squad.yaml, agents/, tasks/, workflows/, templates/, checklists/, data/, config/).

Todos os arquivos originais estarão anexados. A inteligência (personas, regras, tom de voz, pipelines, dados de pesquisa) já está pronta — você precisa **reestruturar** para o formato AIOX, não reinventar o conteúdo.

---

### 🏢 QUEM SOMOS

**Winning Sales** — Consultoria de vendas B2B (winningsales.com.br).
- **Thiago Cardoso** (Head de Automação e IA) publica no LinkedIn como posicionamento pessoal
- Sistema 3E: Estratégia + Estrutura + Equipe, testado em 30+ empresas desde 2020
- Produtos: WS Acceleration, WS Demand, WS Academy, Certificação Gratuita em Gestão de Vendas B2B
- ICP: Gerentes, Diretores e VPs de Vendas B2B em empresas de tecnologia/SaaS/startups BR
- Tom: Direto, Anti-Guru, Técnico Acessível, Vulnerabilidade Estratégica, Linguagem Coloquial BR
- Anti-patterns de linguagem: nunca "game changer", "sinergia", "fórmula mágica", "hack", "disruptivo", "mindset". Nunca emojis 🔥🚀💪

O arquivo completo de brand context está em `shared/brand-context/company.md`.

---

### 📦 O QUE ESTOU MIGRANDO (2 Squads)

#### SQUAD 1: `pesquisa-conteudo-linkedin`
**Objetivo:** Pesquisar tendências → gerar ideias → escrever posts LinkedIn prontos para publicar.

**3 Agentes (personas completas nos `.agent.md`):**
1. **Pedro Pesquisa 🔍** (`pesquisador.agent.md`) — Pesquisa fontes, identifica tendências, gera ideias estruturadas
2. **Ricardo Redator ✍️** (`redator.agent.md`) — Escreve posts seguindo estrutura hook/corpo/CTA + tom de voz
3. **Rafael Revisor 📋** (`revisor.agent.md`) — Revisa qualidade, tom, aderência a guidelines, aprova ou veta

**Pipeline original (9 steps, 4 checkpoints):**
```
Step 1: Pesquisador pesquisa fontes (online + base interna)
Step 2: Pesquisador gera ideias com hooks sugeridos
Step 3: CHECKPOINT → User escolhe ideia(s) do armazém
Step 4: Redator cria rascunho do post
Step 5: CHECKPOINT → User pode dar feedback
Step 6: Revisor revisa (se rejeita, volta pro Redator)
Step 7: CHECKPOINT → User aprova versão final
Step 8: Post final salvo em output/
Step 9: Ideias não usadas vão pro armazém
```

**Dados de conhecimento (em `pipeline/data/`):**
- `tone-of-voice.md` — Tom de voz com vocabulário permitido/proibido, emojis, teste de tom
- `hook-structures.md` — 6 frameworks de hook (Question, Contrarian, Data, Story, Pain, Bold)
- `post-structure-linkedin.md` — Estrutura completa: hook + corpo + CTA + formatação
- `linkedin-strategy.md` — Estratégia de pilares ACRE (Autoridade, Conexão, Resultado, Educação)
- `competitors.md` — Análise de concorrentes e diferenciação
- `research-sources.md` — Fontes de pesquisa categorizadas por tipo
- `lead-magnet-template.md` — Template de lead magnet para CTAs

**Artefato especial: Armazém de Ideias** (`output/armazem/ideias.md`)
Banco persistente de ideias geradas pelo pesquisador. Cada ideia tem: origem, tema, hook, formato, pilar ACRE, urgência, status. Ideias não usadas ficam para próximas rodadas.

---

#### SQUAD 2: `carrosseis-linkedin`
**Objetivo:** Criar carrosséis visuais para LinkedIn (copy + design + renderização HTML→PNG).

**3 Agentes (personas + tasks dedicadas):**
1. **Copywriter** (`copywriter.agent.md`) — Gera ângulos e cria copy slide-by-slide
   - Tasks: `generate-angles.md`, `create-carousel-copy.md`
2. **Designer** (`designer.agent.md`) — Cria slides HTML estilizados + renderiza PNG
   - Tasks: `design-pessoa-style.md`, `design-twitter-style.md`, `render-slides.md`
3. **Reviewer** (`reviewer.agent.md`) — Revisa copy + design, aprova ou veta
   - Tasks: `review.md`

**Dados de conhecimento (em `pipeline/data/`):**
- `anti-patterns.md` — O que NÃO fazer em carrosséis
- `domain-framework.md` — Framework de domínio para carrosséis
- `linkedin-strategy.md` — Estratégia LinkedIn específica para carrosséis
- `output-examples.md` — Exemplos de output esperado
- `quality-criteria.md` — Critérios de qualidade para aprovação

**Assets fixos:**
- `assets/profile-photo.png` — Foto do perfil para slides
- `assets/photos/` — 4 fotos adicionais

**Output renderizado:**
- `output/slides/` — Slides HTML + PNG renderizados (6 slides por carrossel)
- `output/carousel-copy.md` — Copy do carrossel
- `output/render-slides.js` — Script de renderização

---

### 🔗 RECURSOS COMPARTILHADOS (em `shared/`)

1. **`shared/brand-context/company.md`** — Contexto da empresa (ICP, tom, produtos, keywords)
2. **`shared/brand-context/preferences.md`** — Preferências do user
3. **`shared/best-practices/`** — 23 guias de formato (linkedin-post.md, copywriting.md, etc.)
4. **`shared/skills/`** — 8 skills customizadas (apify, canva, image-creator, instagram-publisher, etc.)

---

### 🎯 O QUE FAZER AGORA

1. **Leia todos os arquivos anexados** — especialmente os `.agent.md`, `pipeline.yaml`, e `pipeline/data/`
2. **Crie 2 squads AIOX** seguindo a estrutura oficial:
   ```
   squads/pesquisa-conteudo-linkedin/
   ├── squad.yaml           # Manifest com components declaration
   ├── README.md
   ├── agents/              # Migre as 3 personas como .md
   ├── tasks/               # Converta os pipeline steps para TASK-FORMAT-SPEC-V1
   ├── workflows/           # Converta o pipeline.yaml para workflow AIOX
   ├── data/                # Copie os data files (tom, hooks, strategy, etc.)
   ├── templates/           # Templates de output (post, armazém)
   └── checklists/          # Critérios de revisão como checklists
   ```
   ```
   squads/carrosseis-linkedin/
   ├── squad.yaml
   ├── README.md
   ├── agents/              # 3 agentes com tasks integradas
   ├── tasks/               # Tasks específicas (generate-angles, render-slides, etc.)
   ├── workflows/           # Workflow de criação de carrossel
   ├── data/                # Anti-patterns, quality-criteria, etc.
   ├── templates/           # Templates HTML de slides
   ├── checklists/          # Review checklist
   └── scripts/             # render-slides.js
   ```
3. **Mantenha a inteligência original** — personas completas, tom de voz, vocabulário permitido/proibido, frameworks de hook, pilares ACRE, anti-patterns
4. **Adapte livremente a estrutura** para o que faz sentido no AIOX — você sabe melhor que eu como organizar config, workflows, e tasks no formato AIOX
5. **Compartilhe o brand context** entre os 2 squads (config.extends ou referência)

### ⚠️ REGRAS CRÍTICAS
- NÃO simplifique as personas dos agentes — elas têm nuances construídas com teste real
- NÃO remova o armazém de ideias — é o diferencial do squad 1
- NÃO ignore o tom de voz — ele é a alma do conteúdo (vocabulário permitido E proibido)
- Os checkpoints (human-in-the-loop) DEVEM existir no workflow AIOX

---

Comece pelo Squad 1 (`pesquisa-conteudo-linkedin`). Depois o Squad 2.
