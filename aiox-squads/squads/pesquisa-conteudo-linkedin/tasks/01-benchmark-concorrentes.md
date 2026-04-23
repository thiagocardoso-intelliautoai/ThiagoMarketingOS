# Task: Benchmark de Concorrentes

> Step 01 do pipeline (Modo 2) — Pesquisador analisa top players gringos.

---

## Objetivo

Analisar os posts recentes dos concorrentes listados em `data/competitors.md`,
extrair frameworks e ângulos que funcionaram, e gerar ideias para o Armazém.

---

## Instruções

### 1. Selecionar Concorrentes por Tier

Consultar `data/competitors.md`:
- **Tier 1 (weekly):** Analisar TODOS os posts da semana
- **Tier 2 (quinzenal):** Analisar top 3 posts da quinzena
- **Tier 3 (mensal):** Verificar se teve algo excepcional

### 2. Analisar Cada Post Relevante

Para cada post de alta performance, preencher:

```
### Análise — [Nome do Concorrente] — [Data do Post]

- **Post:** [link ou resumo do conteúdo]
- **Métricas:** Likes: [X] | Comentários: [X] | Reposts: [X]
- **Framework do hook:** [qual estrutura usou e por que funcionou]
- **Ângulo identificado:** [qual perspectiva/insight o post trouxe]
- **Transferível pro Thiago?** [Sim/Não + justificativa]
- **Gera ideia para o Armazém?** [Sim/Não — se sim, registrar abaixo]
```

### 3. Identificar Padrões

Depois de analisar os posts individuais:
- Quais **temas** estão repetindo entre múltiplos concorrentes?
- Quais **formatos** estão performando melhor?
- Quais **ângulos** ninguém está explorando (oportunidade)?

### 4. Gerar Ideias para o Armazém

Para cada insight transferível, formatar como entrada de Armazém:

```
### Insight #[N] — "[Título curto]"
- **Fonte:** Benchmark [nome do concorrente] — [data]
- **Dado-chave:** [métrica ou informação principal do post original]
- **Por que importa pro ICP:** [1 frase conectando com a dor de quem quer usar IA corretamente]
- **Ângulo para post:** [como adaptar para o Thiago — framework, não copy]
- **Fonte de tese sugerida:** [Skills em Produção / Benchmark Real / Process Diagnostic / Falha Documentada + justificativa]
- **Contexto BR:** [como isso se aplica no mercado brasileiro B2B]
- **Contra-argumento:** [visão oposta, se houver — 1 frase]
- **Urgência:** 🔴 Urgente | 🟡 Relevante | 🟢 Pode esperar
```

---

## Regras

1. **Benchmark ≠ Imitação** — Extrair framework e ângulo, NUNCA copiar copy
2. **Filtrar pro contexto BR** — Dado gringo sem tradução pra realidade brasileira é meio-insight
3. **Priorizar alta performance** — Focar em posts que tiveram engajamento acima da média do perfil
4. **Max 5 análises detalhadas** — Qualidade > Quantidade

---

## Regra Extra: Lead Magnet

Se a análise gerar 4+ insights relevantes convergindo num tema, sugerir formato
**Lead Magnet** (consultar `data/lead-magnet-template.md`).

---

## Output

→ `output/research-report.md` com análises e insights formatados

## Próximo Passo

→ **step-02**: ⏸️ CHECKPOINT — Seleção e Decisão (Thiago escolhe qual vira post, resto vai pro armazém)
