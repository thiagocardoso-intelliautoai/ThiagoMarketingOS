# Task: Estruturar Narrativa

> Step 02 do pipeline — Definir arco narrativo e ancorar cada seção em evidência.

---

## Metadata
- **Step:** step-02-estruturar-narrativa
- **Agent:** redator-materia (Rita Redatora)
- **Input:** `output/dossie-{slug}.md` + ângulo + input livre do Thiago
- **Output:** estrutura narrativa integrada ao draft

---

## Context Loading

Carregar antes de executar:
- `output/dossie-{slug}.md` — Dossiê aprofundado do Ivan
- `data/linkedin-strategy.md` — Lente, mecânica, lacuna
- `data/formato-materia-colab.md` — Regras do formato
- `data/atomos-estrategicos.md` — 6 átomos estratégicos
- `data/veto-conditions.md` — Condições de veto
- `agents/redator-materia.md` — Persona da Rita

---

## Instruções

### 1. Absorver Dossiê + Ângulo + Input Livre

Ler dossiê do Ivan, o ângulo aprovado e o input livre do Thiago. Identificar:
- O arco narrativo natural (trajetória → caso → resultado → tese)
- Os pontos de convergência com a lente do Thiago
- As citações mais fortes pra usar como lastro
- O risco declarado e como a matéria vai endereçar

### 2. Decidir Quantidade de Seções

3-5 seções. Escolher com base na densidade do dossiê:
- Dossiê rico (muitos cases, muitas citações): 5 seções
- Dossiê adequado: 4 seções
- Dossiê mínimo: 3 seções (não forçar seção que não sustenta)

### 3. Definir Estrutura de Seções

Para cada seção, definir:

```
### Seção [N]: [Título curto da seção]
**Tese da seção:** [1 frase — o que essa seção defende]
**Frases-chave (2-4):**
1. "[frase que sustenta a tese da seção]"
2. "[frase que sustenta a tese da seção]"
3. "[frase que sustenta a tese da seção]"
**Evidência ancorada:** "[citação ou dado]" — Fonte: [URL/data]
**Conexão com lente:** [como conecta com "Built, not prompted"]
```

### 4. Validar Arco Narrativo

O arco deve seguir lógica interna:

```
Seção 1: Abertura — Contexto + hook (por que importa AGORA)
Seção 2: Caso/Processo — O que a pessoa faz/fez que conecta com a lente
Seção 3: Dados/Resultado — Prova tangível (números, métricas, resultado)
Seção 4: Lente do Thiago — Conexão explícita. Tese minha sobre o que observo nela
Seção 5: Fechamento — Insight/takeaway + ponte pro engajamento
```

Variações permitidas — o que importa é que tenha:
- Hook que puxa
- Meio que sustenta com dados
- Fechamento que conecta com a tese

### 5. Verificar Risco Declarado

Se o ângulo tem risco (do seed):
- [ ] A estrutura endereça o risco?
- [ ] Existe seção com tese desafiadora real (não puxa-saco)?
- [ ] O tom é jornalístico, não promotional?

Exemplo: ângulo sensível sobre sócio → a matéria precisa ter tese que desafia, não que celebra.

### 6. Respeitar Input Livre do Thiago

Se o Thiago deu direção:
- "Foca no case X" → Case X vira seção central, não complementar
- "Tom mais duro" → Ajustar frases-chave pra tom mais direto/provocativo
- "Rime com minha última falha documentada" → Incluir ponte narrativa com conteúdo anterior do Thiago

---

## Output Format

```
# Estrutura Narrativa — [Nome] / [Ângulo]

## Ângulo
- **Arquétipo:** [do input]
- **Título pela lente:** "[do input]"
- **Risco:** [do input]

## Input do Thiago aplicado
[como o input livre influenciou a estrutura — ou "Nenhum"]

## Arco Narrativo: [N] seções

### Seção 1: [título]
**Tese da seção:** [1 frase]
**Frases-chave:**
1. "[frase]"
2. "[frase]"
**Evidência ancorada:** "[citação]" — Fonte: [URL]
**Conexão com lente:** [1 frase]

### Seção 2: [título]
...

[3-5 seções]

## Validação do Arco
- [ ] Hook que puxa na abertura
- [ ] Meio sustentado por dados/citações
- [ ] Tese do Thiago como fio condutor
- [ ] Risco endereçado (se declarado)
- [ ] Input do Thiago respeitado
```

---

## Veto Conditions

Rejeitar e reestruturar se:
1. ❌ Estrutura sem tese do Thiago (arco é elogio)
2. ❌ Seção sem evidência ancorada (genérica)
3. ❌ Risco declarado ignorado
4. ❌ Menos de 3 seções
5. ❌ Sugestão de entrevista/reunião em qualquer seção

---

## Quality Criteria

- [ ] 3-5 seções com tese, frases-chave e evidência
- [ ] Arco narrativo coerente (hook → meio → fechamento)
- [ ] Tese do Thiago é fio condutor, não apêndice
- [ ] Risco declarado endereçado na estrutura
- [ ] Evidências ancoradas com fontes
- [ ] Input do Thiago respeitado

---

## Próximo Passo

→ **step-03**: Rita redige a matéria completa com base nesta estrutura
