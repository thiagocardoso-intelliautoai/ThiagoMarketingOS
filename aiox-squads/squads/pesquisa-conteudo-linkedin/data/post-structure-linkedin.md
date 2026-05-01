# Estrutura de Post LinkedIn — Guia de Formatação

> Regras de formatação e estrutura para posts de texto no LinkedIn em 2025/2026.
> Otimizado para dwell time, algoritmo e engajamento orgânico.

---

## Anatomia do Post Perfeito

```
┌─────────────────────────────────────────────┐
│ HOOK (≤ 210 chars)                          │ ← Para o scroll
│ Linha 1 — impacto máximo                    │
│ Linha 2 — complemento que gera curiosidade  │
├─────────────────────────────────────────────┤
│                                             │ ← Espaço (respirar)
├─────────────────────────────────────────────┤
│ BODY — Bloco 1                              │ ← Contexto / Problema
│ Max 2 linhas por parágrafo                  │
│                                             │ ← Espaço
│ BODY — Bloco 2                              │ ← Desenvolvimento / Dado
│ Max 2 linhas por parágrafo                  │
│                                             │ ← Espaço
│ BODY — Bloco 3 (se necessário)              │ ← Exemplo / Prova
│ Max 2 linhas por parágrafo                  │
├─────────────────────────────────────────────┤
│                                             │ ← Espaço
├─────────────────────────────────────────────┤
│ INSIGHT / TAKEAWAY                          │ ← A pepita de ouro
│ 1-2 linhas — a frase que fica na cabeça     │
├─────────────────────────────────────────────┤
│                                             │ ← Espaço
├─────────────────────────────────────────────┤
│ CTA                                         │ ← Pergunta ou ação
│ Gera conversa, não venda                    │
└─────────────────────────────────────────────┘
```

> ⚠️ **Sem hashtags** — Pesquisa atualizada (2026) mostra que hashtags não impactam alcance no LinkedIn. O algoritmo usa NLP semântico para categorizar conteúdo pelo texto da caption.

---

## Regras de Formatação

### Limites Críticos

| Regra | Limite | Por quê |
|-------|--------|---------|
| Hook | ≤ 210 chars | Preview antes do "ver mais" |
| Post total | ≤ 1.300 chars | Posts curtos performam melhor |
| Parágrafo | Max 2 linhas | Scannability no mobile |
| Ideia central | 1 por post | Rule of 1 — foco total |
| Hashtags | ❌ Não usar | Sem impacto no alcance (2026) — algoritmo usa NLP |

### Espaço Branco

- **Entre cada bloco**: 1 linha em branco obrigatória
- **Nunca 3+ blocos sem espaço**: O olho precisa descansar
- **Mobile first**: 60%+ lê no celular. Parede de texto = scroll down pass

### Pontuação como Ritmo

- **Ponto final**: Encerra pensamento. Ritmo staccato
- **Travessão (—)**: Pausa dramática, complemento inesperado
- **Reticências (...)**: Com moderação. Max 1 por post
- **Enter**: É pontuação. Cada quebra de linha é intencional

---

## Frameworks de Estrutura

### PAS (Problem → Agitate → Solution)
Melhor para: temas com dor clara do ICP
```
Hook: [Problema]
Body: [Agitar a dor — mostrar consequência]
Insight: [Solução/sistema que resolve]
CTA: [Pergunta sobre a dor]
```

### Contraste (Antes ↔ Depois)
Melhor para: transformações, resultados, evoluções
```
Hook: [Situação antes]
Body: [O que mudou e como]
Insight: [Resultado depois — com dados]
CTA: [Você já fez essa transição?]
```

### Storytelling (Eu + Lição)
Melhor para: vulnerabilidade estratégica, conexão emocional
```
Hook: [Eu fiz/errei/descobri...]
Body: [A história — curta e direta]
Insight: [O aprendizado — transferível pro leitor]
CTA: [Você já passou por isso?]
```

### Lista (Número + Itens)
Melhor para: posts educacionais, dicas práticas
```
Hook: [X coisas que...]
Body: [Itens numerados, 1 linha cada]
Insight: [Qual é a mais importante]
CTA: [Qual você adicionaria?]
```

### Declaração + Defesa
Melhor para: posicionamento, opinião forte
```
Hook: [Opinião contrária ao senso comum]
Body: [3 argumentos que sustentam]
Insight: [Síntese da posição]
CTA: [Concorda ou discorda?]
```

---

## Tipos de CTA por Objetivo

| Objetivo | Tipo de CTA | Exemplo |
|----------|-------------|---------|
| Engajamento | Pergunta aberta | "Você já passou por isso?" |
| Debate | Pergunta polarizadora | "Concorda ou estou viajando?" |
| Salvamentos | Promessa de valor | "Salva esse post pra usar na próxima reunião." |
| Comentários | Pedido específico | "Me conta: qual é o maior gargalo do seu time?" |
| ⚠️ NUNCA | Venda direta | ~~"Link na bio"~~, ~~"Compre agora"~~ |

---

---

## 🛠️ Formato Técnico Obrigatório (Integração)

> **CRÍTICO:** Para que o post seja salvo corretamente no banco de dados (Content Command Center), o arquivo `post-final.md` DEVE seguir rigorosamente esta estrutura de headers:

```markdown
# [TÍTULO DO POST]

## Metadata
- **Pilar ACRE:** [A, C, R ou E] ([Nome do Pilar])
- **Tema:** [Tema Curto]
- **Framework:** [Nome do Framework]
- **Hook:** [Tipo do Hook]
- **Sugestão Visual:** [formato/Estilo (motivo curto)]

### Post

[O TEXTO DO POST COMEÇA AQUI]
[HOOK...]

[BODY...]

[CTA...]

### Revisão
**TOTAL** **[Score]%**
```

**Por que isso é obrigatório?**
O script de salvamento (`save-post-cli.js`) usa esses headers (`## Metadata`, `### Post`, `### Revisão`) como delimitadores. Sem eles, o corpo do post e o score não são extraídos para a plataforma.

### Campo `Sugestão Visual` (VISUAL-002)

Linha obrigatória que orienta o operador (e a UI do CCC) sobre qual formato/estilo visual usar para esse post específico.

**Formato:** `<formato>/<Estilo> (<motivo curto>)`

**Valores válidos:**
- `formato`: `capa` ou `carrossel`
- `Estilo` (capa): `Rascunho no Papel` · `Pessoa + Texto` · `Micro-Infografico` · `Print de Autoridade` · `Quote Card`
- `Estilo` (carrossel): `Twitter-Style` · `Editorial Clean` · `Data-Driven` · `Notebook Raw`

**Exemplos:**
- `carrossel/Notebook Raw (lista de 5 etapas com tom pessoal)`
- `capa/Quote Card (frase falsificável forte)`
- `carrossel/Data-Driven (benchmark com dados comparativos)`
- `capa/Rascunho no Papel (default — visualizável humanizado)`

**Como decidir** (árvore de decisão simplificada):

1. **Carrossel ganha quando:** ≥3 etapas sequenciais, ≥2 dados comparativos, framework denso > 1100 chars, storytelling com arco longo
2. **Capa ganha quando:** mensagem unitária (manifesto, dado único, reação curta, história de 1 cena), char_count ≤ 800, ou empate (CTR maior na thumbnail)
3. **Estilo:** segue os "vence quando" documentados em `aiox-squads/squads/{capas,carrosseis}-linkedin/data/visual-styles.md`

Se a sugestão não puder ser determinada com confiança, omitir a linha — o CCC calcula client-side via `recommendVisual()` como fallback.

