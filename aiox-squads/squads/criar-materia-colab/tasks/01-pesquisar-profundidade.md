# Task: Pesquisar Pessoa em Profundidade

> Step 01 do pipeline — Pesquisa aprofundada além do que o seed entregou.

---

## Metadata
- **Step:** step-01-pesquisar-profundidade
- **Agent:** investigador-materia (Ivan Investigador)
- **Input:** nome da pessoa + ângulo completo + input livre do Thiago (opcional)
- **Output:** `output/dossie-{slug}.md`

---

## Context Loading

Carregar antes de executar:
- `data/linkedin-strategy.md` — Lente, mecânica de distribuição, lacuna
- `data/formato-materia-colab.md` — O que é e o que NÃO é matéria-colab
- `data/atomos-estrategicos.md` — 6 átomos estratégicos (pra saber o que procurar)
- `agents/investigador-materia.md` — Persona do Ivan

---

## Instruções

### 1. Absorver Input

Do checkpoint anterior (step-00):
- **Nome da pessoa:** [nome completo]
- **Ângulo aprovado:**
  - Arquétipo: [classificação]
  - Título pela lente: "[título]"
  - Evidências: [lista do seed]
  - Risco: [declaração se houver]
- **Input livre do Thiago:** [direção opcional — ex: "foca no case X", "usa tom mais duro"]

### 2. Pesquisar Além do Seed

O seed-lista-distribuicao já trouxe dados básicos. Ivan vai mais fundo:

#### Posts Recentes (últimos 30 dias — PRIORIDADE)
- Identificar 5+ posts relevantes no LinkedIn
- Extrair trechos literais (entre aspas) com URL ou data
- Notar mudanças de posicionamento recente
- Mapear o que ela está defendendo AGORA, não há 6 meses

#### Cases Documentados
- 2-3 cases que a pessoa documenta publicamente
- Resultados mencionados (números, métricas, transformações)
- Como ela enquadra esses cases (vocabulário, ângulo dela)
- Fontes: posts, artigos, podcasts, eventos

#### Entrevistas e Artigos
- Participações em podcasts, webinars, painéis
- Artigos publicados (Medium, blog pessoal, portais)
- Trechos literais relevantes pra tese do ângulo

#### Contexto de Mercado
- O que está acontecendo no setor dessa pessoa agora
- Movimentos recentes (contratações, lançamentos, pivots)
- Como o contexto de mercado conecta com o ângulo

#### Contradições e Tensões
- Diferença entre o que a pessoa diz e faz (se visível publicamente)
- Posições que ela defende que contradizem o consenso
- Tensões que enriquecem a tese do ângulo

### 3. Mapear Convergência/Divergência com Lente

- Onde a pessoa converge com "Built, not prompted"?
- Onde diverge?
- Qual é o posicionamento GAP (dentro vs fora)?
  - A pessoa opera de dentro (como o Thiago) ou de fora (consultoria)?

### 4. Validar Evidências do Ângulo

As evidências que vieram do seed são suficientes?
- Se sim: expandir com contexto e citações adicionais
- Se não: buscar evidências mais fortes que sustentem o ângulo

### 5. Marcar Lacunas

Se não encontrou informação suficiente sobre aspecto relevante:
`[dados insuficientes: motivo]`

---

## Output Format

```
# Dossiê Aprofundado — [Nome]

## Ângulo de Referência
- **Arquétipo:** [do input]
- **Título pela lente:** "[do input]"
- **Risco declarado:** [do input]

## Input do Thiago
[reproduzir input livre se houver — ou "Nenhum"]

## Bio Expandida
- **Cargo:** [atual]
- **Empresa:** [nome, contexto breve]
- **Trajetória:** [5-7 marcos, 1 linha cada]
- **Posicionamento público:** [1-2 frases — o que essa pessoa defende]

## Convergência/Divergência com Lente
- **Converge em:** [onde conecta com "Built, not prompted"]
- **Diverge em:** [onde não conecta, se houver]
- **Gap dentro/fora:** [opera de dentro ou de fora?]

## Posts Recentes (últimos 30 dias)

### Post 1 — [data]
**Trecho:** "[citação literal]"
**Tema:** [1 frase]
**Relevância pro ângulo:** [1 frase]
**Fonte:** [URL]

### Post 2 — [data]
...

[5+ posts]

## Cases Públicos

### Case 1: [nome/título]
- **Contexto:** [2-3 linhas]
- **Resultado:** [números/métricas]
- **Citação:** "[frase literal]"
- **Fonte:** [URL]
- **Conexão com ângulo:** [1 frase]

## Entrevistas/Artigos Relevantes

### [Título] — [data]
**Trecho:** "[citação literal]"
**Fonte:** [URL]

## Contradições e Tensões
- [contradições visíveis publicamente, se houver]

## Contexto de Mercado
- [o que está acontecendo no setor que afeta essa pessoa/ângulo]

## Evidências Expandidas para o Ângulo
1. [evidência — com fonte]
2. [evidência — com fonte]
3. [evidência — com fonte]

## Lacunas
- [aspectos onde dados foram insuficientes]
```

---

## Veto Conditions

Rejeitar e refazer se:
1. ❌ Citação inventada (não verificável)
2. ❌ Menos de 3 posts recentes encontrados
3. ❌ Bio incompleta (sem cargo ou empresa atual)
4. ❌ Nenhuma evidência que sustente o ângulo
5. ❌ Dossiê sugere contatar a pessoa

---

## Quality Criteria

- [ ] Bio completa com cargo, empresa, trajetória expandida
- [ ] 5+ posts com trechos literais e fontes
- [ ] 2-3 cases documentados com resultados
- [ ] Convergência/divergência com lente mapeada
- [ ] Gap dentro/fora identificado
- [ ] Evidências do ângulo expandidas e verificáveis
- [ ] Lacunas marcadas explicitamente
- [ ] Input do Thiago reproduzido (se houve)

---

## Próximo Passo

→ **step-02**: Rita Estratégista-Editorial formula a tese e monta o esqueleto narrativo (tese-primeiro) com base neste dossiê
