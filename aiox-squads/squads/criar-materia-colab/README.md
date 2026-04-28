# 📝 Criar Matéria-Colab — Briefing Editorial

## Propósito

Squad **puramente estratégico-editorial**. Recebe ângulo aprovado + nome da pessoa e produz um **briefing-editorial.md** que alimenta `carrosseis-linkedin` no fluxo matéria-colab (estilo Editorial Clean).

A palavra "matéria" no nome do squad refere-se a **estilo editorial** (jornalístico, opinativo, denso) — **não** ao formato físico do post. Quem produz o formato físico é `carrosseis-linkedin`.

> **Substitui:** `briefing-materia-colab` (deprecated) e a versão v1.0 deste squad (que escrevia matéria longa de 2.500 palavras).

---

## Fronteira clara — o que este squad faz e o que não faz

| Faz aqui | Fica pro `carrosseis-linkedin` |
|---|---|
| Formula a tese (frase única) | Define copy do hook (≤ 210 chars) |
| Aprova ângulo + arquétipo | Define quantidade de slides (3-8) |
| Levanta evidências do personagem com lastro | Escreve copy de cada slide (≤ 30 palavras) |
| Define esqueleto narrativo obrigatório | Traduz esqueleto em sequência de slides |
| Aplica vetos editoriais (Veto 1 primeiro) | Aplica regras de design (anti-IA, viewport, contraste) |
| Declara estilo: Editorial Clean | Renderiza HTML + PNG via Puppeteer |
| | Faz quality scoring final |

**Briefing NÃO contém:** copy de slide, hook formatado, caption, hashtags, nota visual por slide, contagem de slides, DM, headlines alternativas.

---

## Input

1. **Nome da pessoa** (sujeito do briefing — evidência viva da tese)
2. **Ângulo específico aprovado** (do `seed-lista-distribuicao`):
   - Arquétipo (Como faz o que prega / Contra o consenso / O que aprendi estudando ele / Padrão que vi no trabalho dele)
   - Título pela lente (≤ 210 chars)
   - Evidências (posts, cases, citações)
   - Risco declarado (se houver)
3. **Input livre do Thiago** (opcional) — ex: "foca no case X", "tom mais duro", "rime com minha última falha documentada"

## Output

**`output/briefing-editorial-{slug}-{angulo}.md`** — briefing estruturado em 9 seções:

1. Tese do Thiago (frase única, sem nome do personagem)
2. Ângulo aprovado
3. Personagem como evidência (com lastro: URLs + datas)
4. Lacuna ancorada (frame "dentro vs fora", quando aplicável)
5. Risco e endereçamento
6. Lente "Built, not prompted" (específica deste briefing)
7. **Esqueleto narrativo obrigatório** (instrução pro `carrosseis-linkedin`)
8. Estilo visual: Editorial Clean
9. Auto-review (vetos verificados, status final)

---

## Esqueleto narrativo obrigatório

Ordem **inegociável** que `carrosseis-linkedin` deve respeitar quando criar copy:

1. **Abertura — Tese do Thiago.** Sem personagem.
2. **Tese desenvolvida.** Por que essa tese, contra o que ela vai.
3. **Personagem entra como evidência.** Nome aparece aqui pela primeira vez.
4. **Lacuna ancorada (quando aplicável).** Frame "dentro vs fora".
5. **Fechamento volta à tese.** Não termina elogiando a pessoa.

> **Regra inegociável:** A tese é o esqueleto. O personagem é evidência viva. Se você inverteu, refaz.

---

## Princípios Críticos

1. **Briefing estratégico, não copy.** Output orienta decisões downstream — não escreve hook, slide, caption.
2. **Tese minha, pessoa como evidência.** Tese é do Thiago. Personagem é evidência viva, intercambiável (outro [Fulano] com mesmo comportamento serviria).
3. **Veto 1 é a régua mais afiada.** Teste de remoção do nome detecta inversão de arquitetura — o que score formal não pega.
4. **Risco respeitado.** Se o ângulo declarou risco, briefing tem tese desafiadora real — não neutraliza, não vira puxa-saco.
5. **Editorial Clean = assinatura da série.** Pessoa bate o olho no feed e identifica.
6. **Citação verificável ou nada.** Sem fonte → marcar `[sem fonte pública]` ou cortar.

---

## Agentes

- **🔬 Ivan Investigador** — Pesquisador de profundidade. Vai além do seed — posts recentes, cases, citações verificáveis, contexto público.
- **✍️ Rita Estratégista-Editorial** — Formula tese, monta esqueleto narrativo, ancora evidências, aplica vetos editoriais.

## Pipeline

```
step-00 (input) → step-01 (pesquisar) → step-02 (estruturar tese-primeiro)
→ step-03 (finalizar briefing) → step-04 (review com Veto 1) → step-05 (aprovação)
```

| Step | Tipo | Descrição |
|------|------|-----------|
| 00 | ⏸️ Checkpoint | Receber ângulo aprovado + input livre |
| 01 | 🤖 Ivan | Pesquisar pessoa em profundidade |
| 02 | 🤖 Rita | Formular tese + montar esqueleto narrativo (tese-primeiro) |
| 03 | 🤖 Rita | Finalizar briefing-editorial.md (9 seções) |
| 04 | 🤖 Rita | Auto-review (Veto 1 primeiro) |
| 05 | ⏸️ Checkpoint | Aprovação final do briefing |

## Veto Conditions

1. ⚠️ **Teste de remoção do nome** (PRIMEIRO check — detecta inversão de arquitetura)
2. ❌ Citação inventada ou sem fonte
3. ❌ Sugestão de reunião/entrevista
4. ❌ Tom de parceria/agradecimento/celebração
5. ❌ Estilo visual ≠ Editorial Clean
6. ❌ Risco declarado ignorado

**Política de retomada:**
- Veto 1 dispara → volta pra Etapa 02 (problema de esqueleto)
- Vetos 2-6 → volta pra Etapa 03

## Estrutura

```
squads/criar-materia-colab/
├── squad.yaml
├── README.md
├── agents/
│   ├── investigador-materia.md    # Ivan Investigador
│   └── redator-materia.md         # Rita Estratégista-Editorial
├── tasks/
│   ├── 01-pesquisar-profundidade.md
│   ├── 02-estruturar-narrativa.md     # Tese-primeiro + Veto 1 auto-check
│   ├── 03-finalizar-briefing.md       # Consolida nos 9 campos
│   └── 04-review-briefing.md          # Veto 1 PRIMEIRO + vetos 2-6 + fronteira
├── workflows/
│   └── workflow.yaml
├── data/
│   ├── linkedin-strategy.md
│   ├── formato-materia-colab.md       # Papel do squad e fronteira com carrosseis-linkedin
│   ├── atomos-estrategicos.md
│   └── veto-conditions.md             # Veto 1 sharpened (régua operacional)
├── templates/
│   └── materia-template.md            # Template do briefing (9 seções)
└── output/
    └── briefing-editorial-{slug}-{angulo}.md
```

## Downstream

Briefing aprovado alimenta `carrosseis-linkedin` no **fluxo matéria-colab**:
- Pula `step-02-generate-angles` (ângulo já aprovado upstream)
- Adapta `step-04-create-copy` pra ler `briefing-editorial.md` e respeitar o esqueleto narrativo
- Trava estilo em Editorial Clean
