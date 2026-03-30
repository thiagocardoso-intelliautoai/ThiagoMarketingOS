---
type: agent
agent: pesquisador
outputFile: squads/pesquisa-conteudo-linkedin/output/armazem/ideias.md
---

# Step 04: Salvar no Armazém de Ideias

## Instrução

Salvar os insights aprovados no Armazém de Ideias em formato padronizado.

### Formato de cada ideia no armazém:

```
---

### [YYYY-MM-DD] — [Título curto da ideia]

- **Origem:** Pesquisa Semanal | Benchmark | On-Demand | Ideia própria
- **Fonte:** [fonte + data]
- **Tema:** [IA em vendas | Gestão comercial | Automação | etc.]
- **Pilar ACRE:** A | C | R | E
- **Ângulo sugerido:** [como virar post — 1-2 frases]
- **Hook rascunho:** [ideia de hook, se tiver]
- **Usado?:** [ ] Não | [x] Sim — [data + link do post]
```

### Regras

1. Append no arquivo existente (nunca sobrescrever ideias anteriores)
2. Ordem cronológica reversa (mais recente no topo)
3. Classificar por pilar ACRE para facilitar planejamento editorial
4. Marcar como "Usado" quando a ideia virar post publicado

## Output
Ideias adicionadas ao `output/armazem/ideias.md`
