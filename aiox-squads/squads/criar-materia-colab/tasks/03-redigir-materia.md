# Task: Redigir Matéria Completa

> Step 03 do pipeline — Escrever a matéria-colab com frases completas e marcações de slide.

---

## Metadata
- **Step:** step-03-redigir-materia
- **Agent:** redator-materia (Rita Redatora)
- **Input:** estrutura narrativa + `output/dossie-{slug}.md` + átomos estratégicos
- **Output:** `output/materia-{slug}-{angulo}.md` (draft)

---

## Context Loading

Carregar antes de executar:
- Estrutura narrativa do step-02
- `output/dossie-{slug}.md` — Dossiê completo
- `data/atomos-estrategicos.md` — 6 átomos (carregar TODOS)
- `data/veto-conditions.md` — Vetos
- `templates/materia-template.md` — Template da matéria
- `agents/redator-materia.md` — Persona da Rita

---

## Instruções

### 1. Ativar Átomos Estratégicos

Antes de escrever qualquer frase, carregar os 6 átomos:
1. **brand_lens** — "Built, not prompted" — toda frase reforça
2. **distribution_mechanic** — Jornalismo, não colab tradicional
3. **distribution_gate** — Título pela lente é âncora
4. **signature_visual** — Editorial Clean
5. **positioning_gap** — Dentro (operação) vs fora (consultoria)
6. **positioning_voice_patterns** — Idade = consequência. Moldura = dentro vs fora

### 2. Redigir Cada Seção

Para cada seção da estrutura narrativa, escrever:
- **Título curto** (será título do slide)
- **2-4 frases completas** que sustentam a tese da seção
  - FRASES, não bullets. Frases escritas como matéria jornalística
  - Cada frase justifica sua existência
  - Se uma frase é genérica, cortar
- **Evidência ancorada** integrada no texto (citação entre aspas + fonte)

### 3. Separadores de Slide

Inserir `<!-- slide -->` entre cada seção. Isso permite que o squad de carrosséis transforme direto em slides sem tradução manual.

```markdown
## Seção 1: [título]

[frases da seção 1]

"[citação]" — [fonte]

<!-- slide -->

## Seção 2: [título]

[frases da seção 2]

<!-- slide -->
```

### 4. Regras de Escrita

#### Tom
- Jornalístico + opinionated (colunista de negócios, não reporter neutro)
- A tese é do Thiago. A pessoa é evidência. Toda frase reflete isso
- Direto. Sem floreio. Se a frase não avança a tese, deletar

#### Lente
- Toda seção conecta com "Built, not prompted"
- O gap "dentro vs fora" aparece quando relevante
- Idade é consequência natural, nunca hook ("com 24 anos" NUNCA como gancho)

#### Risco
- Se o ângulo tem risco declarado: a matéria precisa de tese desafiadora
- Exemplo: ângulo sobre sócio → não pode ser elogio sem tensão
- A matéria endereça o risco com respeito mas sem neutralidade — tem posição

#### O que NÃO fazer
- ❌ Escrever como briefing (bullets, esqueleto, sugestões)
- ❌ Elogio sem tese ("fulano é incrível porque...")
- ❌ Sugerir entrevista, reunião ou contato com a pessoa
- ❌ Tom de agradecimento ou celebração
- ❌ Frases genéricas que qualquer influenciador escreveria
- ❌ Formato Caderno (Notebook Raw) — é Editorial Clean

### 5. Aplicar Input Livre do Thiago

Se o Thiago deu direção:
- "Foca nesse trecho sobre case X" → case X tem mais peso no texto
- "Tom mais duro" → frases mais curtas, menos concessões, mais provocação
- "Rime com minha última falha documentada" → ponte narrativa explícita

---

## Output Format

Usar `templates/materia-template.md` como base. A matéria draft deve conter:

```markdown
# Matéria-Colab — [Nome]

## Contexto
- **Pessoa:** [nome — cargo — empresa]
- **Ângulo:** [arquétipo] — "[título pela lente]"
- **Formato visual:** Editorial Clean

---

## Seção 1: [título]

[2-4 frases completas escritas como matéria]

"[citação literal]" — [fonte]

<!-- slide -->

## Seção 2: [título]

[2-4 frases completas]

"[citação ou dado]" — [fonte]

<!-- slide -->

## Seção 3: [título]
...

<!-- slide -->

[3-5 seções total]

---

## Citações e Dados Usados como Lastro
1. "[citação]" — [fonte]
2. "[dado]" — [fonte]
3. "[trecho]" — [fonte]
```

---

## Veto Conditions

Rejeitar e reescrever se:
1. ❌ Matéria parece briefing (bullets em vez de frases)
2. ❌ Elogio sem tese (matéria celebratória)
3. ❌ Citação inventada ou sem fonte
4. ❌ Referência a entrevista/reunião
5. ❌ Risco ignorado
6. ❌ Sem marcações de slide

---

## Quality Criteria

- [ ] 3-5 seções com frases completas (não bullets)
- [ ] Tese do Thiago é fio condutor de todas as seções
- [ ] Citações literais com fontes verificáveis
- [ ] Marcações `<!-- slide -->` entre seções
- [ ] Risco declarado endereçado
- [ ] Tom jornalístico + opinionated (não genérico)
- [ ] Input do Thiago respeitado
- [ ] ZERO referência a entrevista/reunião
- [ ] Formato: Editorial Clean

---

## Próximo Passo

→ **step-04**: Rita gera ganchos de DM e headlines alternativas
