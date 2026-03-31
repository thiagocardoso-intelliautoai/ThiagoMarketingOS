# Story HARDENING-003 — Consolidar Dependências + README + Limpeza

**🏷️ ID:** `HARDENING-003`
**📐 Estimativa:** 1.5h
**🔗 Depende de:** HARDENING-001
**🔗 Bloqueia:** Nenhuma
**👤 Assignee:** Dev
**🏷️ Labels:** `devops`, `documentação`, `cleanup`, `DX`
**📊 Status:** `[x]` Ready for Review
**📋 Origem:** Auditoria Arquitetural (Aria, 2026-03-30)
**🚨 Prioridade:** Importante — melhora DX e elimina duplicação

---

## Descrição

> Como **desenvolvedor ou contribuidor**, eu quero um README na raiz que explique como o projeto funciona, dependências consolidadas em npm workspaces (sem node_modules triplicado), e artefatos legados removidos, para que eu possa clonar o repo e estar produtivo em 5 minutos.

## Contexto Técnico

Problemas identificados na auditoria:

| Problema | Impacto |
|--|--|
| **Sem README na raiz** | Quem clona o repo não sabe por onde começar |
| **3 node_modules** separados (raiz, aiox-squads, capas, carrosseis) | ~150MB duplicados, `npm install` 3x |
| **Diretório `export-squads/`** legado | Confusão sobre qual é a versão atual dos squads |
| **Diretório `Aqui mano, exporta aquii/`** | Diretório informal no workspace |
| **AGENTS.md referencia dirs inexistentes** | `bin/`, `packages/`, `tests/` — cria confusão |
| **CCC README desatualizado** | Não menciona Supabase, Settings Drawer |
| **Discrepância de versão** | `.env.example` diz 2.2.0, config diz 2.1.0 |

---

## Sub-tarefas

### 3.1 — Criar README na raiz do workspace

- [x] **3.1.1** Criar `Criação de conteúdo/README.md`:

```markdown
# Thiago Marketing OS

Sistema de produção de conteúdo LinkedIn com squads de IA — pesquisa, texto, capas e carrosséis.

## 🏗️ Arquitetura

```
├── content-command-center/   # Dashboard SPA (HTML/CSS/JS + Supabase)
├── aiox-squads/              # Squads de conteúdo (3 pipelines)
│   ├── pesquisa-conteudo/    # Pesquisa + texto LinkedIn
│   ├── capas-linkedin/       # Capas visuais (5 estilos)
│   └── carrosseis-linkedin/  # Carrosséis (4 estilos)
├── aiox-project/             # Framework de governança (Synkra AIOX)
│   ├── docs/stories/         # Stories de desenvolvimento
│   └── supabase/migrations/  # Schema do banco
└── .agents/workflows/        # Workflows para Antigravity
```

## 🚀 Quick Start

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar Supabase
```bash
cp aiox-project/.env.example aiox-project/.env
# Preencher SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
```

### 3. Abrir o Dashboard
```bash
cd content-command-center
npx serve .
# Abrir http://localhost:3000
```

## 📋 Como criar conteúdo

1. Abrir o **Content Command Center** no browser
2. Selecionar o **modo de pesquisa** (1-5) no Dashboard
3. **Copiar o prompt** gerado
4. **Colar no Antigravity** (ativa o squad correspondente)
5. Seguir os **checkpoints humanos** do squad (aprovar hooks, post)
6. Post salvo automaticamente no **Supabase**
7. **Gerar capa/carrossel** na Biblioteca do CCC

## 🔧 Stacks

| Componente | Tecnologia |
|--|--|
| Dashboard | Vanilla JS (ES Modules), CSS, Supabase CDN |
| Rendering | Node.js, Playwright (HTML → PNG) |
| Database | Supabase (PostgreSQL + Storage) |
| Squads | YAML config + Markdown agents |
| CI/CD | GitHub Actions (em construção) |

## 📚 Documentação

- [Constitution](aiox-project/.aiox-core/constitution.md) — Princípios do projeto
- [Architecture: Rendering Engine](aiox-project/docs/architecture/CCC-RENDERING-ENGINE.md) — Design do motor de rendering
- [Stories](aiox-project/docs/stories/) — Backlog de desenvolvimento
```

---

### 3.2 — Consolidar dependências com npm workspaces

- [x] **3.2.1** Atualizar `Criação de conteúdo/package.json` (raiz) para usar workspaces:

```json
{
  "name": "thiago-marketing-os",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "aiox-squads",
    "aiox-squads/squads/capas-linkedin",
    "aiox-squads/squads/carrosseis-linkedin"
  ],
  "dependencies": {
    "@supabase/supabase-js": "^2.100.1",
    "playwright": "^1.58.2"
  }
}
```

- [x] **3.2.2** Deletar `node_modules` dos 3 sub-projetos:

```powershell
Remove-Item -Recurse -Force "aiox-squads\node_modules"
Remove-Item -Recurse -Force "aiox-squads\squads\capas-linkedin\node_modules"
Remove-Item -Recurse -Force "aiox-squads\squads\carrosseis-linkedin\node_modules"
```

- [x] **3.2.3** Rodar `npm install` na raiz — npm criará um node_modules hoisted único

- [x] **3.2.4** Testar que os CLIs dos squads ainda funcionam:

```powershell
node aiox-squads/shared/scripts/list-source-photos-cli.js --help
```

---

### 3.3 — Limpar artefatos legados

- [x] **3.3.1** Deletar o diretório `export-squads/`:

```powershell
Remove-Item -Recurse -Force "export-squads"
```

> **Justificativa:** O conteúdo de `export-squads/` é o formato antigo (Opensquad) pré-migração. Todos os squads já foram migrados para `aiox-squads/`. O `MIGRATION-GUIDE.md` é informativo mas histórico.

- [x] **3.3.2** Deletar ou renomear o diretório informal:

```powershell
Remove-Item -Recurse -Force "Aqui mano, exporta aquii"
```

> Se tiver conteúdo útil dentro, mover para local adequado primeiro.

- [x] **3.3.3** Remover tasks depreciadas dos squads:

```powershell
# Verificar conteúdo antes de deletar
Get-Content "aiox-squads\squads\pesquisa-conteudo-linkedin\tasks\03-aprofundamento.md" -Head 5
Get-Content "aiox-squads\squads\pesquisa-conteudo-linkedin\tasks\08-revisao-qualidade.md" -Head 5
```

Se confirmado que estão marcadas como `⚠️ DEPRECIADO`, deletar:

```powershell
Remove-Item "aiox-squads\squads\pesquisa-conteudo-linkedin\tasks\03-aprofundamento.md"
Remove-Item "aiox-squads\squads\pesquisa-conteudo-linkedin\tasks\08-revisao-qualidade.md"
```

> **Nota Dev:** `03-aprofundamento.md` deletado (confirmado DEPRECIADO). `08-revisao-qualidade.md` **mantido** — não possui marcação DEPRECIADO, é task ativa (Step 08 do pipeline).

---

### 3.4 — Corrigir AGENTS.md (Project Map desatualizado)

- [x] **3.4.1** Em `aiox-project/AGENTS.md`, atualizar o bloco `Project Map` (linhas 23-31):

**DE:**
```markdown
## Project Map

- Core framework: `.aiox-core/`
- CLI entrypoints: `bin/`
- Shared packages: `packages/`
- Tests: `tests/`
- Docs: `docs/`
```

**PARA:**
```markdown
## Project Map

- Core framework: `.aiox-core/`
- Stories: `docs/stories/`
- Architecture docs: `docs/architecture/`
- Supabase migrations: `supabase/migrations/`
- Dashboard: `../content-command-center/`
- Squads: `../aiox-squads/squads/`
```

---

### 3.5 — Atualizar CCC README

- [x] **3.5.1** Em `content-command-center/README.md`, adicionar seção Supabase:

Após a seção `## Persistência`, adicionar:

```markdown
## Supabase Integration

Dados são armazenados no Supabase (PostgreSQL + Storage):
- **Tabelas:** `posts`, `covers`, `carousels`, `carousel_slides`, `source_photos`
- **Storage:** Bucket `content-assets` (capas, carrosséis, fotos de referência)
- **Fallback:** Se o Supabase estiver offline, o CCC funciona com localStorage

### Settings Drawer

Acessível via ícone ⚙️ no header:
- **Banco de Imagens** — CRUD de fotos de referência (Supabase Storage)
- *Em breve:* Perfil LinkedIn, Estilos de Capa, Conexão Supabase
```

---

### 3.6 — Corrigir discrepância de versão

- [x] **3.6.1** Em `aiox-project/.env.example`, alinhar versão:

**DE:**
```
AIOX_VERSION=2.2.0
```

**PARA:**
```
AIOX_VERSION=2.1.0
```

---

### 3.7 — Commit consolidado

- [x] **3.7.1** Commit de tudo:

```powershell
git add -A
git commit -m "chore: consolidate deps, add README, cleanup legacy artifacts [HARDENING-003]"
```

---

## Acceptance Criteria

- [x] `README.md` existe na raiz com Quick Start funcional
- [x] `npm install` na raiz instala dependências de todos os sub-projetos
- [x] Apenas 1 `node_modules` na raiz (zero duplicação)
- [x] `export-squads/` removido
- [x] `Aqui mano, exporta aquii/` removido
- [x] AGENTS.md Project Map aponta para diretórios que existem
- [x] CCC README menciona Supabase e Settings Drawer
- [x] CLIs dos squads continuam funcionando após workspace consolidation

## Definition of Done

✅ README na raiz com onboarding em 5 minutos
✅ npm workspaces eliminando duplicação
✅ Zero artefato legado no workspace
✅ Documentação atualizada e consistente

## File List

- `[x]` `README.md` — **NOVO** — README raiz do workspace
- `[x]` `package.json` — atualizado com workspaces
- `[x]` `aiox-project/AGENTS.md` — corrigido Project Map
- `[x]` `content-command-center/README.md` — atualizado com Supabase
- `[x]` `aiox-project/.env.example` — versão corrigida
- `[x]` `export-squads/` — **DELETADO**
- `[x]` `Aqui mano, exporta aquii/` — **DELETADO**
- `[x]` `aiox-squads/squads/pesquisa-conteudo-linkedin/tasks/03-aprofundamento.md` — **DELETADO** (depreciado)
- `[—]` `aiox-squads/squads/pesquisa-conteudo-linkedin/tasks/08-revisao-qualidade.md` — **MANTIDO** (não está depreciado, task ativa)
