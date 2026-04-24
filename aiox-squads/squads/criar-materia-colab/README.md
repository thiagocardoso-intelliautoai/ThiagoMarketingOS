# 📝 Criar Matéria-Colab

## Propósito

Receber ângulo aprovado de pessoa da lista de distribuição e produzir a matéria-colab completa, pronta pra virar carrossel no formato Editorial Clean.

**Este é o próximo step do funil de distribuição.** O squad `seed-lista-distribuicao` pesquisa pessoas e gera ângulos. Este squad pega um ângulo específico já aprovado e constrói a matéria ao redor dele.

> **Substitui:** `briefing-materia-colab` (deprecated). Este squad vai além do briefing — entrega matéria finalizada, não plano de matéria.

---

## Input

1. **Nome da pessoa** (sujeito da matéria)
2. **Ângulo específico:** arquétipo + título pela lente + evidências + risco + dados da pessoa
3. **Input livre do Thiago** (opcional) — ex: "foca no case X", "tom mais duro", "rime com minha última falha documentada"

## Output

Matéria completa com marcações de slide (`<!-- slide -->`), pronta pra alimentar o squad `carrosseis-linkedin`:
- Estrutura de matéria (3-5 seções) com título, frases-chave e evidência ancorada
- Citações e dados públicos com fontes verificáveis
- Ganchos de DM (2-3 variações: direto / aspiracional / provocativo)
- Headlines alternativas (2-3 variações, diferentes do título pela lente)

---

## Princípios Críticos

1. **Jornalismo com formato de colab, NÃO colab tradicional.** Não entrevisto a pessoa. Pesquiso publicamente e monto sozinho. Se o squad sugerir "perguntas pra entrevista", entendeu errado.
2. **A pessoa é sujeito, minha lente é o ângulo.** A tese da matéria é MINHA. A pessoa é evidência viva da minha tese, não protagonista homenageada. Se sair como elogio sem tese, falhou.
3. **Built, not prompted / Processo antes de ferramenta.** Toda matéria reforça essa lente.
4. **Risco declarado respeitado.** Se o ângulo tem risco, a matéria responde a ele com tese desafiadora real — não ignora nem vira puxa-saco.
5. **Formato visual: Editorial Clean.** Matéria-colab nunca usa Caderno (Rascunho no Papel / Notebook Raw). Caderno é pensamento construtor próprio.
6. **Citação verificável ou não entra.** Nunca inventar citação.

---

## Agentes

- **🔬 Ivan Investigador** — Pesquisador de profundidade. Vai além do seed — posts recentes, cases, citações verificáveis, contexto público.
- **✍️ Rita Redatora** — Redatora de matéria-colab. Escreve matéria completa com arco narrativo e tese do Thiago como fio condutor.

## Pipeline

```
step-00 (input) → step-01 (pesquisar) → step-02 (estruturar) → step-03 (redigir) → step-04 (DM+headlines) → step-05 (review) → step-06 (aprovação)
```

| Step | Tipo | Descrição |
|------|------|-----------|
| 00 | ⏸️ Checkpoint | Receber ângulo aprovado + input livre |
| 01 | 🤖 Ivan | Pesquisar pessoa em profundidade |
| 02 | 🤖 Rita | Estruturar narrativa (3-5 seções) |
| 03 | 🤖 Rita | Redigir matéria completa |
| 04 | 🤖 Rita | Gerar ganchos de DM + headlines |
| 05 | 🤖 Rita | Auto-review + veto check + score |
| 06 | ⏸️ Checkpoint | Aprovação final do Thiago |

## Veto Conditions

1. ❌ Matéria sem tese minha (vira elogio)
2. ❌ Citação inventada ou atribuída sem fonte
3. ❌ Matéria que sugere reunião/entrevista com a pessoa
4. ❌ Tom que parece colab tradicional (agradecimento, celebração)
5. ❌ Formato visual diferente de Editorial Clean
6. ❌ Ignorar o risco declarado no ângulo

## Estrutura

```
squads/criar-materia-colab/
├── squad.yaml
├── README.md
├── agents/
│   ├── investigador-materia.md    # Ivan Investigador
│   └── redator-materia.md         # Rita Redatora
├── tasks/
│   ├── 01-pesquisar-profundidade.md
│   ├── 02-estruturar-narrativa.md
│   ├── 03-redigir-materia.md
│   ├── 04-gerar-dm-headlines.md
│   └── 05-review-materia.md
├── workflows/
│   └── workflow.yaml
├── data/
│   ├── linkedin-strategy.md       # Lente, gate, mecânica
│   ├── formato-materia-colab.md   # O que é e o que NÃO é
│   ├── atomos-estrategicos.md     # 6 átomos carregados
│   └── veto-conditions.md         # Condições de veto consolidadas
├── templates/
│   └── materia-template.md        # Template da matéria completa
└── output/
    └── materia-{slug}-{angulo}.md # Output por pessoa/ângulo
```
