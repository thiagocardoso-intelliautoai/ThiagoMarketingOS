# Task: Pesquisar Alvos para Matéria-Colab

> Step 01 do pipeline — Pesquisar candidatos, aplicar gate da lente e filtrar exclusões.

---

## Metadata
- **Step:** step-01-pesquisar-alvos
- **Agent:** pesquisador-alvos (Paulo Prospector)
- **Input:** direção do Thiago (ex: "pesquisar no segmento X" ou "pesquisar livremente")
- **Output:** `output/candidatos-pesquisados.md`

---

## Context Loading

Carregar antes de executar:
- `data/linkedin-strategy.md` — Lente, bandeiras, ICP, mecânica de distribuição
- `data/exclusions.md` — Arquétipos vetados + nomes já na lista
- `data/gate-rules.md` — Regras do gate da lente com exemplos
- `output/lista-distribuicao.md` — Lista ativa (para evitar duplicatas)
- `agents/pesquisador-alvos.md` — Persona do Paulo Prospector

---

## Instruções

### 1. Definir Escopo da Pesquisa

Perguntar ao Thiago (se não informado):
- Segmento preferencial? (ex: "agências de IA", "consultorias B2B", "SaaS", "aberto")
- Prioridade? (expandir fora da bolha Winning / reforçar dentro / ambos)

### 2. Pesquisar Candidatos

Usar `web_search` e `web_fetch` para:
- Pesquisar profissionais relevantes no LinkedIn e web
- Analisar posts recentes (últimos 30 dias)
- Identificar cases públicos que eles defendem
- Mapear rede (quem segue, quem comenta, que tipo de audiência)

### 3. Aplicar Gate da Lente

Para cada candidato, tentar formular 1-2 títulos de matéria pela lente do Thiago:

```
Teste do Gate:
❓ "Consigo formular o título da matéria pela lente 'Built, not prompted'?"

✅ Exemplo que PASSA:
"Como [Fulano] estrutura diagnóstico de processo antes de propor IA
— e por que 90% das agências fazem o contrário"

❌ Exemplo que NÃO PASSA:
"[Fulano] fala sobre o futuro da IA nos negócios"
(genérico, sem lente, qualquer um escreveria)
```

### 4. Filtrar Exclusões

Verificar em `data/exclusions.md`:
- [ ] Não é arquétipo vetado (guru de prompt, influencer genérico, acadêmico puro)
- [ ] Não está na lista ativa (`output/lista-distribuicao.md`)
- [ ] Não é pessoa que o Thiago já descartou anteriormente

### 5. Montar Ficha do Candidato

Para cada candidato que passou no gate:

```
## Candidato: [nome]
- **Função:** [cargo/empresa — 1 linha]
- **Rede relevante:** [que tipo de audiência a pessoa tem — por que importa pro ICP]
- **Últimos posts relevantes:** [2-3 posts recentes que mostram a tese da pessoa]
- **Cases públicos:** [1-2 cases que ela defende publicamente]
- **Gate test:** ✅ Passou
  - **Título 1:** "[título formulado pela lente]"
  - **Título 2:** "[alternativa]"
- **Expectativa de engajamento:**
  - Comentário: [provável / possível / incerto]
  - Repost: [provável / possível / incerto]
- **Expande bolha?** [sim/não — por que]
- **Observação:** [qualquer contexto adicional relevante]
```

---

## Output Format

```
# Candidatos Pesquisados — [data]

## Escopo: [segmento pesquisado]
## Total analisados: [N]
## Passaram no gate: [N]
## Descartados: [N]

---

## Candidato 1: [nome]
[ficha completa]

## Candidato 2: [nome]
[ficha completa]

---

## Descartados (com motivo)
| Nome | Motivo |
|------|--------|
| [nome] | [arquétipo vetado / não passou no gate / já na lista] |
```

---

## Veto Conditions

Rejeitar e refazer se:
1. ❌ Candidato sem gate test (título não formulado)
2. ❌ Candidato é arquétipo de exclusão
3. ❌ Candidato já está na lista ativa
4. ❌ Informações inventadas (não públicas/verificáveis)
5. ❌ Todos os candidatos são da bolha Winning (sem expansão)

---

## Quality Criteria

- [ ] Cada candidato tem ficha completa
- [ ] Gate test com título formulado para todos que passaram
- [ ] Exclusões verificadas e descartados com motivo
- [ ] Pelo menos 1 candidato expande pra fora da bolha
- [ ] Dados baseados em fontes públicas
- [ ] Expectativa de engajamento classificada

---

## Próximo Passo

→ **step-02**: ⏸️ CHECKPOINT — Thiago revisa candidatos e aprova quais entram na lista
