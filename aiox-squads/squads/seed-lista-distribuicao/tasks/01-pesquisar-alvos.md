# Task: Pesquisar Alvos para Matéria-Colab

> Step 01 do pipeline — Pesquisar candidatos, aplicar gate da lente (com ângulos) e filtrar exclusões.

---

## Metadata
- **Step:** step-01-pesquisar-alvos
- **Agent:** pesquisador-alvos (Paulo Prospector)
- **Input:** direção do Thiago (ex: "pesquisar no segmento X", "pesquisar livremente", "quero só ângulos de tipo Y")
- **Output:** `output/candidatos-pesquisados.md`

---

## Context Loading

Carregar antes de executar:
- `data/linkedin-strategy.md` — Lente, bandeiras, ICP, mecânica de distribuição
- `data/exclusions.md` — Arquétipos vetados + nomes já na lista
- `data/gate-rules.md` — Regras do gate da lente, arquétipos de matéria, regras de quantidade
- `output/lista-distribuicao.md` — Lista ativa (para evitar duplicatas)
- `agents/pesquisador-alvos.md` — Persona do Paulo Prospector
- `templates/candidato-template.md` — Formato de output por candidato

---

## Instruções

### 1. Definir Escopo da Pesquisa

Perguntar ao Thiago (se não informado):
- Segmento preferencial? (ex: "agências de IA", "consultorias B2B", "SaaS", "aberto")
- Prioridade? (expandir fora da bolha Winning / reforçar dentro / ambos)

### 2. Respeitar Direção do Thiago

Se o Thiago deu direção explícita sobre ângulos, respeitá-la:
- Ex: "quero explorar ângulo X sobre essa pessoa" → focar nesse ângulo
- Ex: "me traz só 1 ângulo de arquétipo 'contra o consenso'" → não forçar os 4 arquétipos
- Ex: "foca em falha documentada" → priorizar esse tipo de evidência

**Direção do Thiago tem precedência sobre o default.** Não completar com ângulos não pedidos se a direção foi específica.

Se o Thiago não deu direção → default: gerar quantos ângulos distintos a pesquisa pública permitir com qualidade.

### 3. Pesquisar Candidatos

Usar `web_search` e `web_fetch` para:
- Pesquisar profissionais relevantes no LinkedIn e web
- Analisar posts recentes (últimos 30 dias)
- Identificar cases públicos que eles defendem
- Mapear rede (quem segue, quem comenta, que tipo de audiência)

### 4. Aplicar Gate da Lente (Ângulos)

Para cada candidato, formular **ângulos distintos** pela lente do Thiago:

```
Teste do Gate:
❓ "Consigo formular ângulos distintos pela lente 'Built, not prompted'?"

Para CADA ângulo, preciso de:
1. Arquétipo da matéria (quando aplicável — ver gate-rules.md)
2. Título formulado pela lente
3. Evidências específicas DAQUELE ângulo (1-3 itens públicos)
4. Risco do ângulo (1 linha — sensibilidade se houver)
```

**Regras de quantidade de ângulos:**
- Default: gerar quantos a pesquisa pública permitir com qualidade
- Se só 1 tem substância → entregar 1. Melhor 1 forte que 3 frouxos
- Gate mínimo: 1 ângulo pela lente. Se a pessoa não rende nem 1, não serve
- Ângulo fora dos 4 arquétipos → incluir como "misto/outro" com justificativa

**Distinção crítica:**
- ✅ Ângulo distinto = tese diferente, evidências diferentes, leitura diferente
- ❌ Título alternativo = mesma tese, outra formulação (NÃO fazer isso)

### 5. Filtrar Exclusões

Verificar em `data/exclusions.md`:
- [ ] Não é arquétipo vetado (guru de prompt, influencer genérico, acadêmico puro)
- [ ] Não está na lista ativa (`output/lista-distribuicao.md`)
- [ ] Não é pessoa que o Thiago já descartou anteriormente

### 6. Montar Ficha do Candidato

Para cada candidato que passou no gate, usar o formato de `templates/candidato-template.md`:

```
## Candidato: [nome]

### Dados da Pessoa
- **Função:** [cargo/empresa — 1 linha]
- **Rede relevante:** [que tipo de audiência a pessoa tem — por que importa pro ICP]
- **Últimos posts relevantes:**
  1. [título/resumo do post — data]
  2. [título/resumo do post — data]
- **Cases públicos:** [1-2 cases que ela defende publicamente]
- **Expectativa de engajamento:** (atributo da pessoa — independe do ângulo)
  - Comentário: [provável / possível / incerto]
  - Repost: [provável / possível / incerto]
- **Expande bolha?** [sim/não — por que]
- **Observação:** [contexto adicional]

### Gate Test: ✅ Passou ([N] ângulos formulados)

#### Ângulo 1
- **Arquétipo:** [classificação — ver gate-rules.md]
- **Título pela lente:** "[título]"
- **Evidências específicas deste ângulo:**
  1. [evidência que sustenta ESTE ângulo]
  2. [evidência adicional se houver]
- **Risco:** [1 linha — ou "Nenhum identificado"]

#### Ângulo 2
(repetir se houver mais ângulos com substância)
```

---

## Output Format

```
# Candidatos Pesquisados — [data]

## Escopo: [segmento pesquisado]
## Direção do Thiago: [reproduzir direção se houve — ou "default: pesquisa livre"]
## Total analisados: [N]
## Passaram no gate: [N] (total de [N] ângulos)
## Descartados: [N]

---

## Candidato 1: [nome]
[ficha completa com ângulos]

## Candidato 2: [nome]
[ficha completa com ângulos]

---

## Descartados (com motivo)
| Nome | Motivo |
|------|--------|
| [nome] | [arquétipo vetado / não passou no gate / já na lista] |
```

---

## Veto Conditions

Rejeitar e refazer se:
1. ❌ Candidato sem gate test (nenhum ângulo formulado)
2. ❌ Candidato é arquétipo de exclusão
3. ❌ Candidato já está na lista ativa
4. ❌ Informações inventadas (não públicas/verificáveis)
5. ❌ Todos os candidatos são da bolha Winning (sem expansão)
6. ❌ Ângulo sem evidências específicas (evidências genéricas sobre a pessoa não contam)
7. ❌ "Ângulos" são títulos alternativos disfarçados (mesma tese reformulada)

---

## Quality Criteria

- [ ] Cada candidato tem ficha completa com ângulos
- [ ] Cada ângulo tem arquétipo + título + evidências específicas + risco
- [ ] Ângulos são distintos entre si (teses diferentes, não reformulações)
- [ ] Exclusões verificadas e descartados com motivo
- [ ] Pelo menos 1 candidato expande pra fora da bolha
- [ ] Dados baseados em fontes públicas
- [ ] Expectativa de engajamento classificada (nível pessoa, não ângulo)
- [ ] Direção do Thiago respeitada (se houve)

---

## Próximo Passo

→ **step-02**: ⏸️ CHECKPOINT — Thiago revisa candidatos e ângulos, aprova quais entram na lista
