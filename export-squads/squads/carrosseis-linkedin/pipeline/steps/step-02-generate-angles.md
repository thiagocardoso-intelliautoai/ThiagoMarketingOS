---
execution: inline
agent: copywriter
format: linkedin-post
inputFile: squads/carrosseis-linkedin/pipeline/data/theme-input.md
outputFile: squads/carrosseis-linkedin/output/angles.md
---

# Step 02: Gerar Ângulos

## Context Loading

Load these files before executing:
- `squads/carrosseis-linkedin/pipeline/data/theme-input.md` — Tema e estilo escolhidos pelo usuário
- `squads/carrosseis-linkedin/pipeline/data/linkedin-strategy.md` — Estratégia completa do Thiago
- `squads/carrosseis-linkedin/pipeline/data/tone-of-voice.md` — Opções de tom de voz
- `squads/carrosseis-linkedin/pipeline/data/domain-framework.md` — Metodologia operacional
- `squads/carrosseis-linkedin/agents/copywriter.agent.md` — Persona do Caio Carrossel
- `squads/carrosseis-linkedin/agents/copywriter/tasks/generate-angles.md` — Instruções da task

## Instructions

### Process
1. Ler o tema fornecido no checkpoint e classificar no pilar ACRE
2. Executar Pre-Writing Diagnosis: awareness level do Carlos Oliveira, market sophistication, Big Idea, driver psicológico
3. Gerar 5 ângulos distintos — cada um usa driver diferente: Medo, Oportunidade, Educacional, Contrário, Inspiracional
4. Para cada ângulo: criar hook preview (max 210 chars) + rationale de 1 linha
5. Recomendar o tom de voz mais adequado (de tone-of-voice.md)

## Output Format

```
# Ângulos — [TEMA]

**Pilar ACRE:** [classificação]

## Ângulo 1 — 🔴 Medo/Perda
**Hook:** [max 210 chars]
**Rationale:** [1 linha]

## Ângulo 2 — 🟢 Oportunidade
**Hook:** [max 210 chars]
**Rationale:** [1 linha]

## Ângulo 3 — 📚 Educacional
**Hook:** [max 210 chars]
**Rationale:** [1 linha]

## Ângulo 4 — ↔️ Contrário
**Hook:** [max 210 chars]
**Rationale:** [1 linha]

## Ângulo 5 — ⭐ Inspiracional
**Hook:** [max 210 chars]
**Rationale:** [1 linha]

---
**Tom recomendado:** [nome do tom]
```

## Output Example

```
# Ângulos — IA substituindo SDRs

**Pilar ACRE:** Alcance

## Ângulo 1 — 🔴 Medo/Perda
**Hook:** Em 12 meses, SDRs que não usam IA vão custar 3x mais do que produzem. A conta já começou.
**Rationale:** Loss aversion + dado específico cria urgência real sem ser guru

## Ângulo 2 — 🟢 Oportunidade
**Hook:** Enquanto o mercado debate se IA substitui SDRs, quem já integrou tá economizando 15h/semana.
**Rationale:** Janela de oportunidade + dado concreto da Winning Sales

## Ângulo 3 — 📚 Educacional
**Hook:** Testei 3 ferramentas de IA para qualificação de leads. Uma mudou a operação. As outras foram hype.
**Rationale:** Teste real + filtro anti-hype alinha com o posicionamento do Thiago

## Ângulo 4 — ↔️ Contrário
**Hook:** IA não vai substituir seu SDR. Vai substituir o PROCESSO que o seu SDR odeia fazer.
**Rationale:** Reframe da narrativa dominante, posição que diferencia

## Ângulo 5 — ⭐ Inspiracional
**Hook:** Imagine seu time de vendas focando 100% em vender. Todo o resto? Automatizado. Já existe.
**Rationale:** Future pacing + prova de que é possível (Winning Sales já faz)

---
**Tom recomendado:** Direto e Provocador
```

## Veto Conditions

Reject and redo if ANY of these are true:
1. Menos de 5 ângulos ou drivers repetidos
2. Algum ângulo é sobre um tema diferente do fornecido

## Quality Criteria

- [ ] 5 ângulos com 5 drivers diferentes
- [ ] Todos sobre o MESMO tema
- [ ] Hooks cabem em ~210 chars
- [ ] Tom recomendado alinhado com pilar ACRE
