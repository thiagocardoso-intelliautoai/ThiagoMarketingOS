# Task: Inicialização — Pautas Centrais + Subpautas Embrionárias

> Step 01 do pipeline — Primeira execução. Confirma as 4 Pautas Centrais e gera Subpautas embrionárias.

---

## Metadata
- **Step:** step-01-inicializacao
- **Agent:** estrategista (Eva Estratégia)
- **Input:** átomos estratégicos (via data/)
- **Output:** `output/pautas-centrais.md` + `output/subpautas/`

---

## Context Loading

Carregar antes de executar:
- `data/linkedin-strategy.md` — Lente, bandeiras, ICP, fontes de tese, regras de qualidade
- `agents/estrategista.md` — Persona da Eva Estratégia

---

## Instruções

### 1. Confirmar as 4 Pautas Centrais

As 4 Pautas Centrais são derivadas diretamente das 4 fontes recorrentes de tese (átomo `content_sources`). Apresentar ao Thiago para confirmação/edição:

| # | Pauta Central | Fonte de Tese | Descrição |
|---|---------------|---------------|-----------|
| 1 | **Construção Real** | Skills em Produção | Bastidores de skills, agents e sistemas de IA que estão rodando em produção na Winning. O que foi construído, como funciona, resultados reais. |
| 2 | **Benchmark Real** | Benchmark Real | Comparações com dados verificáveis. Ferramentas testadas, resultados medidos, análises quantitativas. Não é lista de ferramentas — é teste com resultado. |
| 3 | **Diagnóstico de Processo** | Process Diagnostic Anônimo | Padrões, gargalos e diagnósticos observados em operações comerciais. Sem expor clientes — foco no padrão recorrente que o ICP reconhece como "meu problema". |
| 4 | **Falha Documentada** | Falha Documentada | Arco de erro → aprendizado. Tentativas que falharam, por que falharam, o que mudou. Vulnerabilidade estratégica que gera confiança. |

> **Regra:** O Thiago pode renomear, ajustar descrições ou reordenar. NÃO pode haver mais nem menos que 4 pautas centrais iniciais.

### 2. Gerar 3 Subpautas Embrionárias por Pauta Central

Para cada Pauta Central confirmada, gerar 3 subpautas. Cada subpauta segue o template:

```
### Subpauta: [título curto e específico]
- **Pauta Central:** [nome da pauta]
- **Fonte de tese:** [classificação]
- **Ângulo:** [1 frase — o que torna essa subpauta diferente]
- **Hook embrionário:** [≤ 210 chars — testável como hook real]
- **Matéria-prima:** [de onde vem o dado/exemplo — experiência real, ferramenta, caso, etc.]
- **Urgência:** 🔴 Urgente | 🟡 Relevante | 🟢 Estoque
```

### 3. Verificar Qualidade

Antes de entregar, verificar cada subpauta:
- [ ] Passa na lente "Built, not prompted"?
- [ ] Tem ângulo específico (não genérico)?
- [ ] Hook embrionário ≤ 210 chars?
- [ ] Matéria-prima identificada?
- [ ] Não duplica outra subpauta?

---

## Output Format

```
# Pautas Centrais — Seed Inicial

## Pauta Central 1: [nome]
**Fonte de tese:** [classificação]
**Descrição:** [1-2 linhas]

### Subpauta 1.1: [título]
- **Ângulo:** [1 frase]
- **Hook embrionário:** [≤ 210 chars]
- **Matéria-prima:** [origem do dado]
- **Urgência:** [emoji]

### Subpauta 1.2: [título]
...

### Subpauta 1.3: [título]
...

---

## Pauta Central 2: [nome]
...

## Pauta Central 3: [nome]
...

## Pauta Central 4: [nome]
...
```

---

## Output Example

```
# Pautas Centrais — Seed Inicial

## Pauta Central 1: Construção Real
**Fonte de tese:** Skills em Produção
**Descrição:** Bastidores de skills, agents e sistemas de IA rodando em produção na Winning.

### Subpauta 1.1: DBA Generator — o agent que libera 4h/semana
- **Ângulo:** O agent que automatiza geração de análises de banco não substituiu analista — substituiu a parte chata do trabalho dele
- **Hook embrionário:** "Meu agent gera 12 análises por dia. Não substituiu ninguém. Substituiu 4h de tédio que ninguém queria fazer."
- **Matéria-prima:** DBA Generator em produção na Winning, dados de uso real
- **Urgência:** 🟡 Relevante

### Subpauta 1.2: Skill Manager — por que centralizei 10 skills num único agente
- **Ângulo:** A decisão arquitetural de centralizar em vez de distribuir — e por que isso importa quando você escala
- **Hook embrionário:** "10 skills de vendas. 1 agente que gerencia todas. A decisão que parecia preguiça e virou arquitetura."
- **Matéria-prima:** Skill Manager real, decisão de design documentada
- **Urgência:** 🟢 Estoque
```

---

## Veto Conditions

Rejeitar e refazer se:
1. ❌ Subpauta sem hook embrionário
2. ❌ Subpauta genérica (ex: "fale sobre IA")
3. ❌ Subpauta que não passa na lente "Built, not prompted"
4. ❌ Mais ou menos de 4 Pautas Centrais
5. ❌ Pauta Central proposta que não se conecta a uma fonte de tese

---

## Quality Criteria

- [ ] 4 Pautas Centrais, cada uma ligada a 1 fonte de tese
- [ ] 3 Subpautas embrionárias por Pauta Central (12 total)
- [ ] Todas as subpautas com hook embrionário ≤ 210 chars
- [ ] Balanceamento entre pautas (3 cada)
- [ ] Nenhuma subpauta duplicada
- [ ] Matéria-prima identificada pra cada subpauta

---

## Próximo Passo

→ **step-02**: ⏸️ CHECKPOINT — Thiago revisa e aprova/edita Pautas Centrais e Subpautas
