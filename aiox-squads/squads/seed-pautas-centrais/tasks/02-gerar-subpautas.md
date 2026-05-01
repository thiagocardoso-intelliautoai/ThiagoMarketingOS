# Task: Gerar Subpautas

> Step 03 do pipeline — Execuções subsequentes. Gera Subpautas novas dentro das Pautas Centrais existentes.

---

## Metadata
- **Step:** step-03-gerar-subpautas
- **Agent:** estrategista (Eva Estratégia)
- **Input:** `output/pautas-centrais.md` (pautas já estabelecidas)
- **Output:** `output/subpautas/subpautas-{data}.md`

---

## Context Loading

Carregar antes de executar:
- `data/linkedin-strategy.md` — Lente, bandeiras, ICP, fontes de tese, regras de qualidade
- `output/pautas-centrais.md` — Pautas Centrais já confirmadas
- `output/subpautas/` — Subpautas já existentes (para evitar duplicatas)
- `agents/estrategista.md` — Persona da Eva Estratégia
- `../../../historia-thiago/criterio-narrativa-relevance.md` — Critério de classificação de narrativa-relevance (4 sinais, 3 níveis, tabela de decisão)

---

## Instruções

### 1. Ler Pautas Centrais Existentes

Carregar as 4 Pautas Centrais de `output/pautas-centrais.md`. Nunca propor Pauta Central nova — só o Thiago pode fazer isso.

### 2. Analisar Estoque Atual

Varrer `output/subpautas/` para:
- Contar quantas subpautas existem por pauta central
- Identificar gaps (pauta com poucas subpautas)
- Listar subpautas já criadas (para evitar duplicatas)

### 3. Gerar 2-4 Subpautas Novas

Priorizar:
1. Pautas centrais com menos estoque (balancear)
2. Ângulos que complementem os existentes (não repitam)
3. Urgência real (aconteceu algo essa semana que se encaixa?)

Para cada subpauta, preencher:

```
### Subpauta: [título curto e específico]
- **Pauta Central:** [nome da pauta]
- **Fonte de tese:** [classificação]
- **Narrativa-relevance:** 🔴 ALTA | 🟡 MÉDIA | ⚫ NULA
- **Justificativa-narrativa:** [1-2 linhas explicando a classificação]
- **Ângulo:** [1 frase — o que torna essa subpauta diferente]
- **Hook embrionário:** [≤ 210 chars — testável como hook real]
- **Matéria-prima:** [de onde vem o dado/exemplo]
- **Urgência:** 🔴 Urgente | 🟡 Relevante | 🟢 Estoque
- **Conexão com existente:** [se complementa subpauta anterior, qual]
```

### 3.5 Classificar Narrativa-Relevance

Para cada subpauta gerada no passo 3:
1. Consultar `criterio-narrativa-relevance.md` (já no Context Loading)
2. Aplicar os 4 sinais à subpauta:
   - **Sinal 1:** Hook embrionário tem verbo em primeira pessoa? (`aprendi`, `errei`, `vendi`, `passei`...)
   - **Sinal 2:** Qual a fonte de tese? (Falha Documentada → 🔴 | Processo Diagnóstico → 🟡 | Benchmark/Tutorial → ⚫)
   - **Sinal 3:** Tipo de proposição: Experiencial/Observacional pessoal → suporta | Factual/Tutorial → não suporta
   - **Sinal 4:** Hook tem marcadores concretos? (pessoas nomeadas, períodos, números reais)
3. Usar a Tabela de Decisão Rápida para determinar o nível
4. Registrar `Narrativa-relevance` com o emoji e nível correto
5. Escrever `Justificativa-narrativa` com 1-2 linhas de raciocínio

**Regra de conservadorismo:** Em caso de dúvida entre 🟡 e ⚫, classificar ⚫.

**VETO:** Subpauta sem `Narrativa-relevance` preenchido → BLOQUEADA. Classificar antes de prosseguir.

### 4. Verificar Qualidade

Antes de entregar, verificar cada subpauta:
- [ ] Passa na lente "Built, not prompted"?
- [ ] Ângulo é novo (não duplica existente)?
- [ ] Hook embrionário ≤ 210 chars?
- [ ] Matéria-prima identificada?
- [ ] Classificada na pauta central correta?

---

## Output Format

```
# Subpautas — Geração [data]

## Diagnóstico do Estoque
| Pauta Central | Subpautas existentes | Gap |
|---------------|---------------------|-----|
| [nome] | [N] | [alto/médio/baixo] |

## Novas Subpautas

### Subpauta: [título]
- **Pauta Central:** [nome]
- **Fonte de tese:** [classificação]
- **Ângulo:** [1 frase]
- **Hook embrionário:** [≤ 210 chars]
- **Matéria-prima:** [origem]
- **Urgência:** [emoji]
- **Conexão:** [se houver]

---
[repetir para cada subpauta]
```

---

## Veto Conditions

Rejeitar e refazer se:
1. ❌ Subpauta duplica ângulo já existente
2. ❌ Subpauta sem hook embrionário
3. ❌ Subpauta genérica (ex: "fale sobre automação")
4. ❌ Subpauta que não passa na lente
5. ❌ Propõe Pauta Central nova (não é função dessa task)
6. ❌ Subpauta sem campo `Narrativa-relevance` classificado

---

## Quality Criteria

- [ ] 2-4 subpautas novas geradas
- [ ] Diagnóstico de estoque incluído
- [ ] Balanceamento entre pautas centrais considerado
- [ ] Todos os hooks embrionários ≤ 210 chars
- [ ] Nenhuma duplicata com subpautas existentes
- [ ] Matéria-prima identificada pra cada
- [ ] `Narrativa-relevance` classificado em todas as subpautas com justificativa
- [ ] Distribuição realista — alertar se 100% das subpautas forem 🔴 (critério conservador não está sendo aplicado)

---

## Próximo Passo

→ **step-04**: ⏸️ CHECKPOINT — Thiago revisa e aprova/edita Subpautas geradas
