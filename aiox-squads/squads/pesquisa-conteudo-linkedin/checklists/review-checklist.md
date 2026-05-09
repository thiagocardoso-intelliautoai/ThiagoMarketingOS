# Checklist de Revisão de Post LinkedIn

> Checklist oficial do Revisor para avaliar posts antes da aprovação.
> 4 blocos com peso — Score ≥ 80% = aprovado, < 80% = devolver.

---

## 🪝 Hook — Peso: 40%

- [ ] Usa estrutura validada de `data/hook-structures.md`
- [ ] ≤ 210 caracteres (contados)
- [ ] Primeira frase para o scroll (gera curiosidade/impacto)
- [ ] Sem clickbait ou promessa exagerada
- [ ] Tom consistente com `data/tone-of-voice.md`

---

## 📐 Estrutura — Peso: 25%

- [ ] Framework identificável (PAS, Contraste, Storytelling, Lista, Declaração+Defesa)
- [ ] Post total ≤ 1.300 caracteres com espaços
- [ ] Parágrafos de max 2 linhas
- [ ] Espaço branco suficiente (respira na tela)
- [ ] Rule of 1 — uma ideia central, uma mensagem
- [ ] Dados citados com fonte
- [ ] Sem hashtags (não impactam alcance no LinkedIn em 2026)

---

## 🗣️ Tom de Voz — Peso: 20%

- [ ] Anti-guru: sem vocabulário proibido (game changer, sinergia, hack, disruptivo, etc.)
- [ ] Coloquial brasileiro profissional (não acadêmico, não forçado)
- [ ] Teste de leitura em voz alta — soa como o Thiago falaria
- [ ] Sem jargões sem contexto
- [ ] Emojis apenas funcionais (✅, 📌, →, ⚠️) — NUNCA 🔥, 🚀, 💪, 💡

---

## 📣 CTA — Peso: 15% (Sistema Decisório REFAC-003)

> Heurística canônica em `agents/redator.md` § Sistema Decisório de CTA. 4 critérios duros — qualquer falha = REJECT.

- [ ] **(1) Coerência:** CTA escolhido é coerente com tipo de valor entregue?
  - Ramo 1 (Salva) quando o post entrega framework / dado original / processo replicável / matriz / checklist
  - Ramo 2 (Comente longo) quando o post conta história, observação ou tese sem ferramenta replicável
- [ ] **(2) Se "Salva":** justificativa é **específica e lógica** (diz POR QUE e QUANDO o leitor vai precisar)?
  - ✅ "Salva — vai precisar dessa árvore na próxima reunião de pipeline."
  - ❌ "Salva pra ler depois" / "Salva pra não esquecer" / "Salva pra usar depois" → **REJECT** (forçar refazer ou trocar pra Ramo 2)
- [ ] **(3) Se "Comente":** provocação pede resposta de **2-3 frases mínimo** (não pergunta sim/não, não pede uma palavra)?
  - ✅ "Me conta: como vc lidou com isso? quero comparar com [contexto]."
  - ❌ "Concorda?" / "Curtiu?" / "É isso ou tô viajando?" → **REJECT**
- [ ] **(4) Banidos:** nenhum padrão proibido aparece?
  - "Salva pra ler depois" / "Comente YES" / "Tag um amigo" / "Like se concordar"
  - "Comente X que mando" (REFAC-002 §6.2 + §6.10)
  - Emoji-as-bullet, polls (§6.9), link externo no body (§6.4)
  - Venda direta: "compre agora", "saiba mais", "link na bio"

---

## Cálculo do Score

| Bloco | Peso | Nota (0-100) | Score Ponderado |
|-------|------|-------------|-----------------|
| Hook | 40% | ___  | ___ |
| Estrutura | 25% | ___ | ___ |
| Tom de Voz | 20% | ___ | ___ |
| CTA | 15% | ___ | ___ |
| **TOTAL** | **100%** | | **___** |

**Score ≥ 80%** → ✅ Aprovado → Segue para aprovação do Thiago
**Score < 80%** → ❌ Rejeitado → Devolver ao Redator com feedback acionável
