# Lead Magnet — Composição §6.10 do Algoritmo LinkedIn 2026

> Reescrita REFAC-002 — alinhada com `linkedin-algorithm-2026-reference.md` §6.10.
> "Lead magnet" **não é categoria atômica** que o algoritmo detecta. É composição de sinais individuais. Posts bem compostos rodam com fricção mínima.

---

## O Princípio §6.10

O que o algoritmo penaliza:

| Sinal individual | Peso | O que evitar |
|-----------------|------|--------------|
| Bait language no body ("Comente X que mando") | Alto (Fase 1 fail) | Não usar — ver Veto #8 do redator |
| Link externo no body ("baixe aqui") | Alto (~60% reach) | Substituir por inbound (DM espontânea, perfil, newsletter) |
| Link no primeiro comentário | Médio | Aceitável, mas só após o post estabelecer reach orgânico |
| Asset entregue *fora* do post (PDF baixar) | Médio (acumula) | Preferir asset *dentro* do post (carrossel/capa) |
| **Asset entregue *dentro* do post** | **Negativo (positivo)** — formato premiado | **Estratégia recomendada** |
| Coerência semântica autor↔tópico | Modula severidade | Topical DNA do Thiago = operador-builder oferecendo framework técnico — coerente |

**Tradução operacional:** lead magnets ruins compõem bait + link + bounce. Lead magnets bons entregam asset dentro do post (carrossel/capa) ou capturam via inbound (DM espontânea, newsletter, perfil), com CTA do texto sendo pergunta aberta — não solicitação manipuladora.

---

## Composição Limpa (Premiada pelo Algoritmo)

### Componentes obrigatórios

1. **Asset DENTRO do post**
   - Carrossel PDF de 8-10 slides com o framework completo, OU
   - Capa do post com o conteúdo essencial + CTA-na-arte direcionando para inbound

2. **Texto do post sem mencionar o recurso**
   - Body trabalha o problema, contraste, ou storytelling
   - CTA é pergunta genuína ("Como você resolve isso hoje?") ou observação ("Salva se faz sentido pro seu time" usado em contexto natural)
   - NUNCA "Comente X que mando" — bait detectável por NLP

3. **CTA-na-arte (apenas dentro da capa/carrossel)**
   - Texto curto e direto na faixa inferior da arte: "Comente FRAMEWORK pra receber na DM" OU "Inbound aberto pra esse framework"
   - Por estar **dentro da arte**, não é detectável pelo NLP de bait do feed
   - Quem captura o asset é quem está **interessado o suficiente para olhar a arte e agir** — qualifica leads automaticamente

4. **Captura via inbound, não via link**
   - DM espontânea (Thiago responde manualmente)
   - Newsletter (link no perfil, não no body)
   - Perfil otimizado (link no campo "Sobre", não no post)

---

## Front-Matter (alimenta o pipeline)

Quando o post É lead magnet, o front-matter do `output/post-final.md` traz:

```yaml
---
is_lead_magnet: true
lead_magnet_resource: "framework de prospecção em 5 etapas"
cta_arte: "Comente FRAMEWORK pra receber na DM"
---
```

- O Redator aplica **Veto Condition #8** (§6.2/§6.10).
- O squad de capas lê `cta_arte` e injeta na faixa inferior (3 templates).
- O squad de carrosseis lê `cta_arte` e renderiza slide N+1 final (4 templates).
- O CLI persiste os 3 campos no DB para a vitrine do CCC.

---

## Checklist Algorítmico (antes de aprovar o post)

- [ ] Body **não menciona** o `lead_magnet_resource`
- [ ] Body **não tem link externo**
- [ ] CTA do texto **não é bait** (sem "comente X que mando", "tag um amigo", "like se concordar")
- [ ] Asset (framework/lista/guia) está **dentro** do post (carrossel ou capa) ou disponível por **inbound** (DM, perfil, newsletter)
- [ ] Hashtags ≤ 3 (§6.5)
- [ ] Coerência semântica: o recurso oferecido alinha com o **topical DNA** do Thiago (operador-builder, técnico-acessível) — não é "10 hacks de coach"
- [ ] `cta_arte` populado e propaga para capa/carrossel via front-matter

---

## Quando Faz Sentido Ser Lead Magnet

- ✅ Você tem um **framework, lista, ou guia** que comprime decisões repetidas
- ✅ O recurso é **modular o suficiente** pra caber num carrossel de 8-10 slides ou numa capa única
- ✅ A captura é **inbound** (DM espontânea, newsletter, perfil) — sem link externo no body
- ✅ Topical DNA do Thiago bate com o tema do recurso

## Quando NÃO Faz Sentido

- ❌ Asset só faz sentido fora do LinkedIn (PDF de 30 páginas, planilha grande) — nesse caso, faz post normal e linka inbound
- ❌ Tema é opinião sem framework reutilizável — vira post normal, não lead magnet
- ❌ Não há `cta_arte` claro — sem CTA-na-arte, é só um post longo

---

## Sobre o Custo em Reach

Lead magnets *clássicos* (link externo + CTA bait) pagam fricção alta — 30-60% de reach a menos. Essa fricção é **absorvível** por contas com volume/autoridade pré-estabelecida.

**A pergunta operacional correta** não é "lead magnet funciona ou não funciona" — é "qual o custo em reach que pago por cada lead capturado, dado o tamanho atual da minha base?". Esse cálculo é estratégico, não algorítmico — ver `linkedin-algorithm-2026-reference.md` §6.10.

A composição que esta template prescreve (asset dentro, sem bait, sem link, captura inbound) **minimiza** essa fricção.
