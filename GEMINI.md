# Synkra AIOX - Gemini CLI Configuration

Você está operando no ecossistema **Synkra AIOX**, um sistema orquestrado por IA para desenvolvimento Full Stack.

## Core Mandates

1. **Constitution:** Siga rigorosamente a Constitution em `aiox-project/.aiox-core/constitution.md`.
2. **Story-Driven Development:** Todo desenvolvimento começa com uma story em `aiox-project/docs/stories/`.
3. **CLI First:** Priorize interfaces de linha de comando e automação.
4. **No Invention:** Não invente requisitos fora dos artefatos existentes (Stories, PRDs, Architecture).

## Sistema de Agentes (AIOX)

Os agentes são a base da operação. Eles possuem personas e escopos específicos.

### Ativação de Agentes
Embora o Gemini CLI use o sistema padrão, recomendamos seguir as personas definidas em:
- `aiox-project/.aiox-core/development/agents/*.md`

### Comandos de Agentes (Simulados via Instruções)
Use o prefixo `*` para intenções específicas de agentes:
- `*help` - Listar comandos/capacidades do agente ativo.
- `*create-story` - Iniciar o fluxo de criação de uma nova story.
- `*task {nome}` - Executar uma task técnica específica.
- `*exit` - Finalizar o escopo do agente atual.

## Estrutura do Projeto (Map)

- **AIOX Core:** `aiox-project/.aiox-core/`
- **Stories:** `aiox-project/docs/stories/`
- **Squads:** `aiox-squads/squads/`
- **Content Center:** `content-command-center/`

## Qualidade e Verificação

Antes de concluir qualquer tarefa:
1. Execute `npm run lint` (se aplicável ao subprojeto).
2. Execute `npm run typecheck`.
3. Execute `npm test`.
4. Atualize o checklist da story em `aiox-project/docs/stories/`.

## Integração Gemini

- **Configurações:** `.gemini/settings.json`
- **Hooks:** `.gemini/hooks/` (SessionStart, BeforeAgent, etc.)
- **Comandos:** `.gemini/commands/*.toml` (Acesse via slash commands se suportado pelo seu cliente, ou siga as definições nos arquivos).

Sempre que houver mudanças na estrutura de agentes, sincronize:
- `npm run sync:ide:gemini` (dentro de aiox-project)

---
*AIOX Gemini Configuration v3.0*
