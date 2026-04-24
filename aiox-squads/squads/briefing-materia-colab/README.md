# ⚠️ DEPRECATED — Briefing Matéria-Colab

> [!CAUTION]
> **Este squad foi SUBSTITUÍDO por `criar-materia-colab`.**
>
> O squad `criar-materia-colab` vai além do briefing — entrega matéria FINALIZADA
> com frases completas, arco narrativo, marcações de slide e review com score.
>
> **Use:** `/z-criar-materia-colab`
> **Localização:** `aiox-squads/squads/criar-materia-colab/`
>
> Este squad permanece no repositório apenas como referência histórica.
> NÃO execute este squad para novas matérias.

---

## ~~Propósito~~ (deprecated)

~~Gerar briefing completo para matéria-colab no LinkedIn. Recebe nome do alvo + título-com-lente, pesquisa publicamente a pessoa, e monta briefing jornalístico com estrutura de matéria, citações, headlines e gancho de DM.~~

**NÃO é colab tradicional.** Sem entrevista, sem reunião, sem pauta combinada. Jornalismo com formato de colab.

---

## Agentes

- **🔎 Petra Perfil** — Pesquisadora de perfil. Levanta bio, posts, cases e citações públicas.
- **📰 Bruno Briefing** — Redator de briefing. Monta estrutura de matéria, headlines e ganchos de DM.

## Pipeline

```
step-00 (input) → step-01 (pesquisar perfil) → step-02 (montar briefing) → step-03 (review) → step-04 (aprovação)
```

## Briefing Contém (mínimo)

1. Contexto da pessoa (bio, posts, cases)
2. Ângulo pela lente (já pré-formulado)
3. Estrutura de matéria (3-5 seções com frases-chave)
4. Citações/dados públicos como lastro
5. Ganchos de DM (2-3 variações curtas)
6. Headlines alternativas (2-3 variações)

## Briefing NÃO Contém

- ❌ Perguntas para entrevista
- ❌ Proposta de reunião
- ❌ Pauta combinada
- ❌ Contrapartida sugerida

## Estrutura

```
squads/briefing-materia-colab/
├── squad.yaml
├── README.md
├── agents/
│   ├── pesquisador-perfil.md    # Petra Perfil
│   └── redator-briefing.md      # Bruno Briefing
├── tasks/
│   ├── 01-pesquisar-perfil.md   # Pesquisa pública da pessoa
│   ├── 02-montar-briefing.md    # Briefing completo
│   └── 03-review-briefing.md    # Review com score
├── workflows/
│   └── workflow.yaml
├── data/
│   ├── linkedin-strategy.md     # Lente, gate, formato visual
│   └── formato-materia-colab.md # Regras do formato (o que é e o que NÃO é)
├── templates/
│   └── briefing-template.md
└── output/
    ├── perfil-{slug}.md         # Dossiê por alvo
    └── briefing-{slug}.md       # Briefing por alvo
```
