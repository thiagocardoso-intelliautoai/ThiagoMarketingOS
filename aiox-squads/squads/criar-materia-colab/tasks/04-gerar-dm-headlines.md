# Task: Gerar Ganchos de DM e Headlines

> Step 04 do pipeline — Criar headlines alternativas e scripts de DM pós-publicação.

---

## Metadata
- **Step:** step-04-gerar-dm-headlines
- **Agent:** redator-materia (Rita Redatora)
- **Input:** matéria draft (`output/materia-{slug}-{angulo}.md`)
- **Output:** seções DM + Headlines adicionadas à matéria

---

## Context Loading

Carregar antes de executar:
- `output/materia-{slug}-{angulo}.md` — Matéria draft do step-03
- `data/linkedin-strategy.md` — Mecânica de distribuição
- `data/formato-materia-colab.md` — Regras de gancho de DM

---

## Instruções

### 1. Headlines Alternativas (2-3)

DIFERENTES do título pela lente (que é âncora estratégica do seed). Headlines são variações pro carrossel.

**Regras:**
- Passam no gate da lente ("Built, not prompted")
- ≤ 210 chars cada
- Específicas (só o Thiago escreveria, não qualquer influenciador)
- Tom jornalístico, não clickbait

### 2. Ganchos de DM (2-3 com tons diferentes)

Script curto (3-5 linhas) pra Thiago mandar pra pessoa após publicação.

**3 tons:**
- **Direto:** Factual, sem floreio. "Escrevi sobre [X]. Tá no meu feed."
- **Aspiracional:** Reconhece trabalho, conecta com lente. Respeito, não bajulação.
- **Provocativo:** Desafia ou surpreende. Provoca reação genuína.

**Regras para TODOS:**
- ≤ 280 chars cada
- Provocar comentário/repost, NÃO pedir permissão
- ZERO bajulação, ZERO proposta de reunião

---

## Output Format

Adicionar ao final da matéria:

```markdown
---
## Headlines Alternativas
> Título pela lente (âncora): "[título original]"
1. "[headline 1 — ≤ 210 chars]"
2. "[headline 2 — ≤ 210 chars]"
3. "[headline 3 — ≤ 210 chars]"

## Ganchos de DM (pós-publicação)
### Tom Direto
"[gancho — ≤ 280 chars]"
### Tom Aspiracional
"[gancho — ≤ 280 chars]"
### Tom Provocativo
"[gancho — ≤ 280 chars]"
```

---

## Veto Conditions

1. ❌ Headline não passa no gate (genérica)
2. ❌ Headline > 210 chars
3. ❌ Gancho > 280 chars
4. ❌ Gancho pede permissão ou propõe reunião
5. ❌ Gancho bajula
6. ❌ Menos de 2 headlines ou 2 ganchos

---

## Próximo Passo

→ **step-05**: Rita faz auto-review da matéria completa
