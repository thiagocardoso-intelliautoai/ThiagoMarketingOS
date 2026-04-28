# Task: Finalizar Briefing Editorial

> Step 03 do pipeline — Consolidar tese + ângulo + evidências + esqueleto + lente + risco + estilo num `briefing-editorial.md` final pronto pra alimentar `carrosseis-linkedin`.

---

## Metadata
- **Step:** step-03-finalizar-briefing
- **Agent:** redator-materia (Rita Estratégista-Editorial)
- **Input:** estrutura narrativa do step-02 + `output/dossie-{slug}.md` + ângulo aprovado
- **Output:** `output/briefing-editorial-{slug}-{angulo}.md`

---

## Context Loading

Carregar antes de executar:
- Estrutura narrativa do step-02
- `output/dossie-{slug}.md` — Dossiê completo
- `data/atomos-estrategicos.md` — 6 átomos (carregar TODOS)
- `data/veto-conditions.md` — Vetos
- `data/formato-materia-colab.md` — Papel deste squad e fronteira com `carrosseis-linkedin`
- `templates/materia-template.md` — Template do briefing
- `agents/redator-materia.md` — Persona da Rita

---

## Instruções

### O que esta etapa NÃO faz

Importante deixar claro o que **fica fora**:
- ❌ NÃO escreve copy de slide (hook formatado, slide 1, slide 2, …) — isso é trabalho do `carrosseis-linkedin`
- ❌ NÃO escreve caption do post — `carrosseis-linkedin` faz
- ❌ NÃO escolhe quantidade de slides (3-8) — `carrosseis-linkedin` decide
- ❌ NÃO escreve hashtags
- ❌ NÃO escreve nota visual por slide
- ❌ NÃO gera DM (removido — não usamos esse mecanismo)
- ❌ NÃO gera headlines alternativas (a capa do carrossel é o headline)

### O que esta etapa faz

Consolida o esqueleto narrativo do step-02 num briefing editorial estruturado conforme `templates/materia-template.md`. Output é instrução estratégica densa pro `carrosseis-linkedin`.

### 1. Ativar átomos estratégicos

Carregar os 6 átomos antes de finalizar:
1. **brand_lens** — "Built, not prompted"
2. **distribution_mechanic** — Jornalismo, não colab tradicional
3. **distribution_gate** — Título pela lente é âncora
4. **signature_visual** — Editorial Clean (assinatura da série)
5. **positioning_gap** — Dentro (operação) vs fora (consultoria)
6. **positioning_voice_patterns** — Idade = consequência. Moldura = dentro vs fora

### 2. Preencher cada seção do template

Seguir `templates/materia-template.md`. Para cada seção:

**§1. Tese do Thiago** — Frase única vinda do step-02. Sem nome do personagem.

**§2. Ângulo aprovado** — Reproduzir arquétipo, título pela lente, risco declarado.

**§3. Personagem como evidência** — Quem é, comportamento que confirma a tese, lastro (citações + URLs + datas), notas relevantes.

**§4. Lacuna ancorada** — Frase-chave do diferencial Thiago (frame "dentro vs fora"). Se não aplicável: declarar e justificar.

**§5. Risco e endereçamento** — Como o briefing trata o risco com tese desafiadora real. Se sem risco: declarar.

**§6. Lente "Built, not prompted"** — Como ela atravessa este briefing especificamente (não genérico).

**§7. Esqueleto narrativo obrigatório** — Reproduzir os 5 blocos do step-02 com função + substância de cada bloco. Reforçar a regra: "A tese é o esqueleto. O personagem é evidência viva."

**§8. Estilo visual obrigatório** — "Editorial Clean" (não negociável, é a assinatura da série).

**§9. Auto-Review Editorial** — Será preenchido na Etapa 04 (review).

### 3. Tom e densidade do briefing

- **Instrução estratégica, não copy.** Frases descrevem o que o conteúdo faz, não o conteúdo final.
- **Denso.** Sem floreio, sem genérico. Cada frase orienta uma decisão downstream.
- **Lastreado.** Toda evidência sobre o personagem tem URL + data. Sem fonte → marcar `[sem fonte pública]` ou cortar.

### 4. Notas finais pra `carrosseis-linkedin`

No final do briefing, usar a sub-seção **"Notas pra carrosseis-linkedin"** pra registrar:
- Recomendações específicas que ajudam o downstream (ex: "esta citação cabe na capa", "fechamento pode ser uma pergunta tipo X")
- Avisos sobre o que **não** fazer (ex: "não usar foto da pessoa, é Editorial Clean")

### 5. Aplicar input livre do Thiago

Se o Thiago deu direção:
- "Foca no case X" → case X vira evidência central no §3
- "Tom mais duro" → registrar nas notas pra `carrosseis-linkedin` (tese mais provocativa, fechamento mais afiado)
- "Rime com minha última falha documentada" → registrar nas notas como ponte narrativa

---

## Output Format

Arquivo `output/briefing-editorial-{slug}-{angulo}.md` seguindo `templates/materia-template.md`.

---

## Veto Conditions

Rejeitar e refazer se:
1. ❌ **Veto 1 — Teste de remoção do nome falha** (briefing desmonta se trocar nome por "[Fulano]")
2. ❌ Personagem mencionado na §1 (Tese) ou §2 (Ângulo)
3. ❌ Briefing escreve copy de slide / hook formatado / caption / hashtags
4. ❌ Briefing escolhe contagem de slides (não é papel do squad)
5. ❌ Citação sem fonte verificável
6. ❌ Sugestão de entrevista/reunião com a pessoa
7. ❌ Tom de parceria/agradecimento/celebração
8. ❌ Estilo visual ≠ Editorial Clean
9. ❌ Risco declarado ignorado
10. ❌ Briefing inclui DM ou headlines alternativas (removidos)

---

## Quality Criteria

- [ ] Tese formulada como frase única, sem personagem
- [ ] Ângulo, evidências e fontes preenchidos
- [ ] Lacuna tratada (aplicada ou justificada)
- [ ] Risco endereçado se declarado
- [ ] Lente "Built, not prompted" descrita especificamente pra este briefing
- [ ] Esqueleto narrativo dos 5 blocos reproduzido com função + substância
- [ ] Estilo visual: Editorial Clean
- [ ] Sem copy de slide, caption, hashtags, hook formatado, contagem de slides, DM, headlines alternativas
- [ ] Notas pra `carrosseis-linkedin` preenchidas (ou explicitamente "Sem notas adicionais")
- [ ] Input do Thiago respeitado

---

## Próximo Passo

→ **step-04**: Rita roda auto-review com vetos editoriais (especialmente Veto 1).
