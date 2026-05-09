# Template: Post Final LinkedIn

> Template padrão para output do post aprovado.
> Front-matter YAML é **obrigatório** (REFAC-002) — propaga marcação semântica para os squads de capa/carrossel e o CLI de persistência.

---

```
---
title: "[Título do post — vira o slug no DB]"
pillar: A | B | C | D
is_lead_magnet: false       # ou true
lead_magnet_resource: null  # ou "framework de prospecção em 5 etapas" (apenas se is_lead_magnet=true)
cta_arte: null              # ou "Comente FRAMEWORK pra receber na DM" (texto que vai DENTRO da arte, NUNCA no body)
---

## Post LinkedIn — [Fonte de Tese] — [Data]

### Metadata
- **Fonte de tese:** [Skills em Produção / Benchmark Real / Process Diagnostic / Falha Documentada]
- **Tema:** [tema central]
- **Framework:** [PAS/Contraste/Storytelling/Lista/Declaração+Defesa]
- **Fonte(s):** [fontes usadas]
- **Horário sugerido:** 7h-9h BRT

---

### Post

[Hook — max 210 chars]

[Body — blocos de max 2 linhas separados por espaço]

[Insight/Takeaway]

[CTA — pergunta aberta ou ação no post; NUNCA cita lead_magnet_resource quando is_lead_magnet=true]

---

### Score de Revisão: [X]%
- Hook: ✅/❌
- Estrutura: ✅/❌
- Tom de Voz: ✅/❌
- CTA: ✅/❌
- Anti-bait (§6.2/§6.10): ✅/❌  ← apenas quando is_lead_magnet=true; ver Veto #8 do redator

### Status: ✅ Aprovado pelo Thiago em [data]
```

---

## Notas sobre o Front-Matter (REFAC-002)

- **Sempre incluir** o bloco `---`, mesmo quando o post não é lead magnet (`is_lead_magnet: false` explícito). Os squads downstream usam a presença do front-matter como sinal de que o pipeline veio do CCC e não pedem confirmação manual.
- `lead_magnet_resource` e `cta_arte` ficam `null` quando `is_lead_magnet=false`.
- Quando `is_lead_magnet=true`, o Redator aplica a **Veto Condition #8** do `agents/redator.md`: zero menção ao recurso no body, zero link externo, zero padrões de bait §6.2.
