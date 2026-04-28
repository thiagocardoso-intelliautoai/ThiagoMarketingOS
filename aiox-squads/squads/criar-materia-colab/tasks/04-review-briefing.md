# Task: Auto-Review do Briefing

> Step 04 do pipeline — Auto-review com vetos editoriais. **Veto 1 (teste de remoção do nome) é primeiro check**.

---

## Metadata
- **Step:** step-04-review-briefing
- **Agent:** redator-materia (Rita Estratégista-Editorial — auto-review)
- **Input:** `output/briefing-editorial-{slug}-{angulo}.md`
- **Output:** `output/briefing-editorial-{slug}-{angulo}.md` (revisado, com status final)

---

## Context Loading

Carregar antes de executar:
- `output/briefing-editorial-{slug}-{angulo}.md` — Briefing a revisar
- `data/veto-conditions.md` — 6 condições de veto (com Veto 1 sharpened)
- `data/atomos-estrategicos.md` — 6 átomos
- `data/formato-materia-colab.md` — Papel do squad e fronteira

---

## Instruções

### 1. Veto 1 — Teste de remoção do nome ⚠️ PRIMEIRO E MAIS IMPORTANTE

**Faça este teste antes de qualquer outro check.**

> Substituir mentalmente toda menção a "[nome da pessoa]" e "[empresa dele]" por "[Fulano]" e "[empresa dele]" no briefing. Ler o briefing inteiro com [Fulano].
>
> - **Se a tese sustenta sozinha** (personagem é evidência intercambiável, frame de "outro [Fulano]" ainda funcionaria) → ✅ **passa**.
> - **Se desmonta / vira buraco / só faz sentido com aquela pessoa específica** → ❌ **veta**. Personagem virou sujeito da história. Arquitetura está invertida. **Voltar pra Etapa 02**.

**Exemplos calibradores:**

✅ **Passa**: tese é "Roadmap é ferramenta de quem ainda não entregou." Briefing usa [Fulano] como exemplo de quem opera fazendo (200 projetos sem começar pelo roadmap). Substituindo nome: tese segue válida, [Fulano] segue sendo evidência viva. Outro nome com mesmo comportamento serviria.

❌ **Veta**: briefing abre falando da trajetória de Victor Baggio na Playbook Lab e termina celebrando o método dele. Substituindo "Victor Baggio" por "[Fulano]": o post vira reportagem genérica sobre uma agência qualquer. A tese era a Playbook Lab, não uma tese do Thiago.

Se o Veto 1 disparar: **rejeitar imediatamente** e voltar pra Etapa 02 (estruturar narrativa). Não tentar consertar redigindo melhor — é problema de esqueleto.

### 2. Vetos restantes (depois do Veto 1 passar)

Verificar **na ordem**:

2. ❌ **Veto 2 — Citações com fonte**: toda citação literal entre aspas tem URL + data. Sem fonte → marcar `[sem fonte pública]` ou cortar. Paráfrase apresentada como citação direta = veto.
3. ❌ **Veto 3 — Sem menção a entrevista/reunião**: zero menção a contato prévio, perguntas, pauta combinada, autorização. Briefing é base pra jornalismo unilateral.
4. ❌ **Veto 4 — Sem tom de parceria/celebração**: zero "agradecemos a fulano", "em parceria com", "é uma honra cobrir". Tom é editorial-jornalístico, não relacionamento.
5. ❌ **Veto 5 — Estilo visual: Editorial Clean** declarado explicitamente em §8.
6. ❌ **Veto 6 — Risco endereçado**: se o ângulo declarou risco, briefing tem tese desafiadora real. Sem neutralização, sem puxa-saco.

### 3. Verificar fronteira (anti-invasão)

Confirmar que o briefing **NÃO contém** território do `carrosseis-linkedin`:

- [ ] Sem copy de slide ("Slide 1: ...", "Slide 2: ...")
- [ ] Sem hook formatado pra capa
- [ ] Sem caption do post
- [ ] Sem hashtags
- [ ] Sem nota visual por slide
- [ ] Sem contagem de slides ditada
- [ ] Sem DM
- [ ] Sem headlines alternativas

Se algum desses aparecer: cortar. Squad não dita formato físico.

### 4. Verificar completude do briefing

| Seção do briefing | Presente? | OK? |
|---|---|---|
| §1 Tese (frase única, sem nome) | [ ] | [ ] |
| §2 Ângulo aprovado (arquétipo + título + risco) | [ ] | [ ] |
| §3 Personagem como evidência (lastro com fontes) | [ ] | [ ] |
| §4 Lacuna ancorada (aplicada ou justificada) | [ ] | [ ] |
| §5 Risco e endereçamento | [ ] | [ ] |
| §6 Lente "Built, not prompted" específica | [ ] | [ ] |
| §7 Esqueleto narrativo (5 blocos na ordem) | [ ] | [ ] |
| §8 Estilo visual: Editorial Clean | [ ] | [ ] |
| Notas pra `carrosseis-linkedin` | [ ] | [ ] |

### 5. Status final

Ao final do briefing, preencher:

```markdown
### Status

- **Status:** ✅ Pronto pra carrosseis-linkedin / 🔄 Refazer
- **Veto que disparou (se aplicável):** [Veto X — descrição]
- **Etapa pra voltar (se aplicável):** [Etapa 02 / Etapa 03]
- **Notas finais:** [observações pro Thiago no checkpoint de aprovação]
```

### Política de retomada

- **Veto 1 dispara** → volta pra Etapa 02 (problema de esqueleto narrativo)
- **Vetos 2-6 disparam** → volta pra Etapa 03 (problema de redação/checks)
- **Falha de fronteira (invasão de carrosseis-linkedin)** → volta pra Etapa 03 e cortar conteúdo invasor
- **Tudo OK** → segue pro checkpoint de aprovação do Thiago

---

## Próximo Passo

→ **step-05** (checkpoint humano): Thiago revisa o briefing. Se aprovar, briefing alimenta `carrosseis-linkedin`.
