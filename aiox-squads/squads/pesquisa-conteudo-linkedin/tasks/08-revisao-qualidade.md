# Task: Revisão de Qualidade

> Step 08 do pipeline — Revisor aplica checklist e aprova/rejeita o post.

---

## Objetivo

Aplicar checklist de revisão de 4 blocos ao post draft.
Score ≥ 80% = aprovado. Score < 80% = devolver ao Redator.

---

## Instruções

### 1. Receber o Post Draft
- Ler `output/post-draft.md` completo
- Verificar se auto-revisão do Redator foi feita

### 2. Aplicar Checklist de Revisão
Usar `checklists/review-checklist.md` (4 blocos com peso):

| Bloco | Peso | Critérios |
|-------|------|-----------|
| 🪝 Hook | 40% | Estrutura validada, ≤210 chars, para scroll, sem clickbait |
| 📐 Estrutura | 25% | Framework claro, ≤1300 chars, parágrafos curtos, Rule of 1 |
| 🗣️ Tom de Voz | 20% | Anti-guru, coloquial BR, sem vocab proibido, natural |
| 📣 CTA | 15% | Tipo correto por pilar, conversacional, sem venda direta |

### 3. Calcular Score
- Cada critério: ✅ Passa (nota máx) ou ❌ Falha (0)
- Score ponderado por bloco
- Score final = média ponderada dos 4 blocos

### 4. Emitir Resultado

#### Se Score ≥ 80%:
```
## ✅ Post Aprovado — Score: [X]%

### Pontos Fortes
- [2-3 itens]

### Sugestões de Melhoria (opcional)
- [Ajustes finos não-bloqueantes]

> ⏳ Aguardando aprovação final do Thiago.
> Postar entre 7h-9h BRT.
```

#### Se Score < 80%:
```
## ❌ Post Rejeitado — Score: [X]%

### Problemas Identificados
1. [Problema + bloco violado]
2. [Problema + bloco violado]

### O que corrigir
1. [Instrução acionável]
2. [Instrução acionável]

> 🔄 Devolver ao Redator. Max 1 revisão extra.
```

---

## Regras Específicas

- **Guru-speak = rejeição automática** (palavras proibidas do tone-of-voice.md)
- **Dado sem fonte = rejeição automática**
- **Max 1 rodada de revisão** — Se falhar na 2ª vez, reescrever do zero
- **Feedback sempre acionável** — "Ajustar tom" é proibido; "Trocar X por Y" é correto

---

## Output

→ `output/review-feedback.md` com resultado da revisão

## Próximo Passo

→ Se ✅: **step-09** — Aprovação final do Thiago
→ Se ❌: Volta ao **step-07** (max 1 vez)
