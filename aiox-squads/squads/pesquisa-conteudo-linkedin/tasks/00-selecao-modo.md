# Step 00: Modo de Operação

> Checkpoint humano — Thiago escolhe como operar nesta execução.

---

## Step 0.0 — Detecção de Front-Matter (REFAC-002)

**Antes** de mostrar o checkpoint de modo, examinar o prompt de entrada. Se o prompt **começa** com um bloco YAML delimitado por `---`, fazer parse:

```yaml
---
is_lead_magnet: true | false
lead_magnet_resource: "..."
cta_arte: "..."
---
```

- Se `is_lead_magnet` estiver presente (mesmo `false`): **registrar os 3 valores no estado da sessão** e PULAR o Step 0.5 abaixo. Os squads de capa/carrossel vão ler o mesmo front-matter no `output/post-final.md` final.
- Se `is_lead_magnet` for `true`: o Redator (step-07) aplica a **Veto Condition #8** (regra anti-bait §6.2/§6.10).
- Se NENHUM front-matter foi enviado: prosseguir para Step 0.5 (caminho B — fallback manual).

---

## Step 0.5 — Lead Magnet (Fallback Manual)

> Só executar se Step 0.0 não encontrou front-matter no prompt de entrada (Caminho B do plano).

Pergunta ao Thiago, em sequência:

1. **"Este post é lead magnet? (s/N)"**
2. Se resposta = `s`:
   - "Qual o **recurso** entregue? (ex: 'framework de prospecção em 5 etapas')"
   - "Qual o **CTA na arte**? (ex: 'Comente FRAMEWORK pra receber na DM' — texto que vai dentro da capa/carrossel, NUNCA no body do post)"
3. Se resposta = `n` (default): registrar `is_lead_magnet=false`, `lead_magnet_resource=null`, `cta_arte=null` e seguir.

Os 3 valores são gravados no estado da sessão e propagados:
- Para o **Redator** (regra anti-bait quando `is_lead_magnet=true`)
- Para o front-matter do `output/post-final.md` final (consumido por capas/carrosseis e CLI)

---

## Checkpoint

Bem-vindo ao squad **Pesquisa e Conteúdo LinkedIn**! 🔍

Escolha como quer operar hoje:

### Modos de Operação

1. **Pesquisa Semanal** — Varrer fontes Tier 1/2/3 e trazer os top insights da semana (Modo 1)
2. **Benchmark de Concorrentes** — Analisar o que os top players gringos estão publicando (Modo 2)
3. **Briefing On-Demand** — Você dá um tema, o Pesquisador pesquisa a fundo e gera ideias (Modo 3)
4. **Escrever Post Direto** — Já tem a ideia. Pula pesquisa e vai direto pra hooks + post + revisão (Modo 4)

Responda com o número (1, 2, 3 ou 4).

**Modo:**

---

## Regras de Fluxo

| Modo | Próximo Step | Descrição |
|------|-------------|-----------|
| 1 | step-01 (Pesquisa Semanal) | Pesquisador varre fontes Tier 1/2/3 |
| 2 | step-01 (Benchmark) | Pesquisador analisa concorrentes |
| 3 | step-01 (Briefing) | Pesquisador pesquisa tema fornecido |
| 4 | step-04 (Armazém de Ideias) | Pula direto para seleção de ideia / hooks |

> **Nota:** Se escolher modo 1, 2 ou 3, os insights passam pelo Armazém de Ideias antes de virar post.
> Se escolher modo 4, vai direto para o Redator no step-05.
