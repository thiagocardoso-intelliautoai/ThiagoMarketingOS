# Task: Montar Briefing da Matéria-Colab

> Step 02 do pipeline — Transformar dossiê de perfil em briefing completo.

---

## Metadata
- **Step:** step-02-montar-briefing
- **Agent:** redator-briefing (Bruno Briefing)
- **Input:** `output/perfil-{slug}.md` + título-com-lente
- **Output:** `output/briefing-{slug}.md`

---

## Context Loading

Carregar antes de executar:
- `output/perfil-{slug}.md` — Dossiê da pessoa (pesquisa da Petra)
- `data/linkedin-strategy.md` — Lente, bandeiras, mecânica de distribuição
- `data/formato-materia-colab.md` — Regras do formato
- `templates/briefing-template.md` — Template do briefing
- `agents/redator-briefing.md` — Persona do Bruno Briefing

---

## Instruções

### 1. Absorver Dossiê + Título

Ler o dossiê da Petra e o título-com-lente recebido. Identificar:
- O arco narrativo natural da pessoa (trajetória → case → resultado)
- Os pontos de convergência com a lente do Thiago
- As citações mais fortes pra usar como lastro

### 2. Montar Estrutura de Matéria (3-5 seções)

Criar 3-5 seções que formem arco narrativo coerente:

```
Seção 1: Abertura — Contexto da pessoa + por que importa (gancho)
Seção 2: Case/Processo — O que ela fez/faz que conecta com a lente
Seção 3: Dados/Resultado — Números, métricas, prova tangível
Seção 4: Lente Thiago — Conexão explícita com "Built, not prompted"
Seção 5: Fechamento — Insight/takeaway + bridge pro DM
```

Para cada seção, incluir:
- **Frase-chave sugerida** (headline da seção)
- **Conteúdo resumido** (2-3 bullets do que abordar)
- **Citação/dado de lastro** (se disponível)

### 3. Criar Headlines Alternativas

2-3 variações do título da matéria. Todas devem:
- Passar no gate da lente ("Built, not prompted")
- Ter ≤ 210 chars (testável como hook)
- Ser específicas (não genéricas)

### 4. Criar Ganchos de DM

2-3 variações de mensagem curta para enviar ao alvo após publicação.
Objetivo: provocar comentário ou repost, não pedir permissão.

Regras:
- ≤ 280 chars cada variação
- Tom direto, sem bajulação
- Mostrar que a matéria existe, não pedir aprovação
- Provocar reação genuína

### 5. Indicar Formato Visual

Matéria-colab = **Editorial Clean** sempre.
Caderno NUNCA na matéria-colab.

---

## Output Format

```
# Briefing Matéria-Colab — [Nome]

## Contexto da Pessoa
- **Nome:** [completo]
- **Cargo:** [atual]
- **Bio resumida:** [2-3 linhas]
- **Tese que defende:** [1 frase]

## Ângulo pela Lente
**Título-com-lente:** "[título principal]"
**Conexão com 'Built, not prompted':** [1-2 linhas explicando o ângulo]

## Estrutura de Matéria

### Seção 1: [nome da seção]
**Frase-chave:** "[frase sugerida]"
**Conteúdo:** 
- [bullet 1]
- [bullet 2]
**Lastro:** "[citação ou dado]" — Fonte: [URL/data]

### Seção 2: [nome da seção]
...

### Seção 3: [nome da seção]
...

[até 5 seções]

## Citações e Dados Públicos como Lastro
1. "[citação literal]" — [fonte]
2. "[dado/métrica]" — [fonte]
3. "[trecho de post]" — [fonte]

## Headlines Alternativas
1. "[headline 1 — ≤ 210 chars]"
2. "[headline 2 — ≤ 210 chars]"
3. "[headline 3 — ≤ 210 chars]"

## Ganchos de DM (pós-publicação)
1. "[gancho 1 — ≤ 280 chars]"
2. "[gancho 2 — ≤ 280 chars]"
3. "[gancho 3 — ≤ 280 chars]"

## Formato Visual
**Estilo:** Editorial Clean
**Proporção slides:** [sugestão de N slides se carrossel]

## Notas para Produção
- [observações relevantes para a criação da matéria]
```

---

## Output Example

```
# Briefing Matéria-Colab — Victor Baggio

## Contexto da Pessoa
- **Nome:** Victor Baggio
- **Cargo:** CEO, [Agência]
- **Bio resumida:** Lidera agência de IA focada em média/grande empresa. Background em tecnologia + negócios. Ativo no LinkedIn com posts sobre implementação de IA em operações.
- **Tese que defende:** IA como infraestrutura de empresa, não ferramenta pontual

## Ângulo pela Lente
**Título-com-lente:** "Como Victor Baggio estrutura diagnóstico de processo antes de propor IA — e por que 90% das agências fazem o contrário"
**Conexão com 'Built, not prompted':** Baggio é exemplo externo da tese processo-antes-de-ferramenta. Demonstra que construtores sérios diagnosticam antes de codar.

## Estrutura de Matéria

### Seção 1: O problema que Baggio viu primeiro
**Frase-chave:** "A maioria das agências começa pela ferramenta. Baggio começa pelo diagnóstico."
**Conteúdo:**
- Contexto do mercado de agências de IA
- O que a maioria faz errado (pula direto pra implementação)
**Lastro:** "[citação do post X]" — linkedin.com/...

[... seções 2-4 ...]

## Headlines Alternativas
1. "Como Victor Baggio estrutura diagnóstico de processo antes de propor IA — e por que 90% das agências fazem o contrário"
2. "Antes de qualquer linha de código, Baggio faz 3 perguntas. A maioria dos fornecedores faz zero."
3. "O que separa uma agência de IA que entrega de uma que promete: o framework de diagnóstico do Baggio"

## Ganchos de DM
1. "Victor, escrevi uma matéria sobre como vc estrutura diagnóstico antes de propor IA. Tá no meu feed. Quis registrar porque é o oposto do que a maioria faz."
2. "Baggio, publiquei um carrossel sobre teu framework de diagnóstico. Achei que ia te interessar ver como enquadrei."
3. "Victor, saiu uma matéria no meu feed sobre teu processo. Sem combinação — pesquisei e montei. Dá uma olhada."
```

---

## Veto Conditions

Rejeitar e refazer se:
1. ❌ Briefing sugere "perguntas para entrevista" — veto IMEDIATO
2. ❌ Briefing propõe reunião ou pauta combinada
3. ❌ Headlines não passam no gate da lente
4. ❌ Menos de 3 seções na estrutura de matéria
5. ❌ Citações não verificáveis

---

## Quality Criteria

- [ ] Todas as seções obrigatórias presentes (contexto, ângulo, estrutura, citações, DM, headlines)
- [ ] ZERO referência a entrevista, reunião ou pauta combinada
- [ ] Headlines passam no gate da lente (≤ 210 chars, específicas)
- [ ] Ganchos de DM ≤ 280 chars, provocativos sem bajulação
- [ ] Citações verificáveis com fonte
- [ ] Lente "Built, not prompted" em todas as seções
- [ ] Formato visual: Editorial Clean indicado

---

## Próximo Passo

→ **step-03**: Review do briefing (completude + qualidade + lente)
