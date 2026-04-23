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
- **Ângulo:** [1 frase — o que torna essa subpauta diferente]
- **Hook embrionário:** [≤ 210 chars — testável como hook real]
- **Matéria-prima:** [de onde vem o dado/exemplo]
- **Urgência:** 🔴 Urgente | 🟡 Relevante | 🟢 Estoque
- **Conexão com existente:** [se complementa subpauta anterior, qual]
```

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

---

## Quality Criteria

- [ ] 2-4 subpautas novas geradas
- [ ] Diagnóstico de estoque incluído
- [ ] Balanceamento entre pautas centrais considerado
- [ ] Todos os hooks embrionários ≤ 210 chars
- [ ] Nenhuma duplicata com subpautas existentes
- [ ] Matéria-prima identificada pra cada

---

## Próximo Passo

→ **step-04**: ⏸️ CHECKPOINT — Thiago revisa e aprova/edita Subpautas geradas
