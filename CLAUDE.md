# Marketing OS — Claude Code

Sistema de produção de conteúdo LinkedIn para Thiago C.Lima / Winning Sales.
Plataforma: Content Command Center (web) + Squads (Claude Code CLI).

---

## Squads de Conteúdo (Slash Commands)

Squads são pipelines de produção ativados via slash command. Cada um carrega agentes especializados, dados de referência e segue um workflow com checkpoints de aprovação humana.

| Comando | Squad | O que faz |
|---------|-------|-----------|
| `/z-pesquisa-conteudo-linkedin` | Pesquisa & Post | Pesquisa → hooks → post final texto |
| `/z-carrosseis-linkedin` | Carrosséis | Post aprovado → carrossel visual (4 estilos) |
| `/z-capas-linkedin` | Capas | Post aprovado → capa visual (5 estilos) |
| `/z-criar-materia-colab` | Matéria-Colab | Ângulo aprovado → matéria completa |
| `/z-seed-lista-distribuicao` | Seed Distribuição | Pesquisa e mantém lista de alvos para matéria-colab |
| `/z-seed-pautas-centrais` | Seed Pautas | Gera e mantém pautas centrais e subpautas |

**Como usar:** `/z-pesquisa-conteudo-linkedin` ou cole o prompt gerado pelo Content Command Center (já vem formatado).

### Modo de operação dos squads

Ao receber um slash command de squad:
1. Leia o `squad.yaml` referenciado nas instruções do comando
2. Carregue os perfis dos agentes listados em `agents/`
3. Carregue os dados de referência em `data/`
4. Siga o pipeline — pare nos checkpoints (`type: checkpoint`) para aprovação
5. No step final, execute o CLI do Supabase para persistir o output

### CLI de Persistência (Supabase)

```bash
# Salvar post
node aiox-squads/shared/scripts/save-post-cli.js --title "TITULO" --file PATH --pillar A --review-score 85

# Upload carrossel
node aiox-squads/shared/scripts/upload-carousel-cli.js --slug "SLUG" --slides-dir output/slides/SLUG/ --style "ESTILO" --post-title "TITULO"

# Upload capa
node aiox-squads/shared/scripts/upload-cover-cli.js --slug "SLUG" --file output/covers/SLUG/cover.png --style "ESTILO" --post-title "TITULO"
```

---

## Agentes AIOX (Desenvolvimento do Sistema)

Para trabalhar no código do Marketing OS, ative um agente AIOX:

| Comando | Agente | Papel |
|---------|--------|-------|
| `/aiox-master` | Aiox-master | Orquestrador — usa quando não sabe qual agente chamar |
| `/dev` | Dex | Implementação de código (stories, features, bugs) |
| `/qa` | Quinn | Testes e qualidade |
| `/architect` | Aria | Arquitetura e design técnico |
| `/pm` | Morgan | Product Management, épicos |
| `/po` | Pax | Product Owner, validação de stories |
| `/sm` | River | Scrum Master, criação de stories |
| `/analyst` | Alex | Pesquisa e análise |
| `/data-engineer` | Dara | Banco de dados, Supabase, migrations |
| `/ux-design-expert` | Uma | UX/UI design |
| `/devops` | Gage | git push, PRs, MCP (operações exclusivas) |
| `/squad-creator` | — | Cria novos squads de conteúdo |

**Sintaxe de comando:** prefixo `*` (ex: `*help`, `*create-story`, `*exit`)
**Regras de autoridade:** `aiox-project/.claude/rules/agent-authority.md`

---

## Estrutura do Projeto

```
.claude/commands/     ← Slash commands (squads + agentes) — você está aqui
aiox-squads/squads/   ← Squad definitions (squad.yaml, agents/, data/, tasks/, templates/)
  pesquisa-conteudo-linkedin/
  carrosseis-linkedin/
  capas-linkedin/
  criar-materia-colab/
  seed-lista-distribuicao/
  seed-pautas-centrais/
aiox-squads/shared/scripts/  ← CLIs de persistência no Supabase
content-command-center/      ← Dashboard web (Vanilla JS + Supabase)
aiox-project/                ← Framework AIOX (agentes, rules, stories)
  .antigravity/agents/       ← Definições dos agentes AIOX
  .claude/rules/             ← Regras do Claude Code (agent-authority, workflow, etc.)
  docs/stories/              ← Stories de desenvolvimento
```

---

## Fluxo Principal de Trabalho

**Produção de conteúdo:**
```
Content Command Center (web) → gera prompt → cola no Claude Code
→ Squad executa pipeline → output salvo via CLI → aparece no CCC
```

**Desenvolvimento do sistema:**
```
/sm *create-story → /po *validate-story → /dev *develop → /qa *qa-gate → /devops *push
```

---

## Regras Globais

- Leia `aiox-project/.claude/CLAUDE.md` para regras do framework AIOX
- Nunca modifique `aiox-project/.aiox-core/core/` ou `aiox-project/.aiox-core/constitution.md`
- `git push` e `gh pr create` são exclusivos do agente `/devops`
- Todo desenvolvimento começa com uma story em `aiox-project/docs/stories/`
- CLIs do Supabase são idempotentes — pode rodar múltiplas vezes sem duplicar dados
