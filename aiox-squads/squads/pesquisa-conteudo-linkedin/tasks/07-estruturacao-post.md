# Task: Criação do Post Final

> Step 07 do pipeline — Redator estrutura post completo, aplica revisão de qualidade integrada e entrega post final.

---

## Objetivo

Estruturar post LinkedIn completo usando o hook escolhido pelo Thiago
e o framework mais adequado da biblioteca de estruturas.
Aplicar revisão de qualidade integrada (4 blocos com peso + veto conditions).
Entregar post final pronto para aprovação.

---

## Instruções

### 1. Receber Hook Escolhido
- Hook selecionado pelo Thiago no step-06 (checkpoint)
- Manter o hook exatamente como aprovado

### 2. Selecionar Framework
Consultar `data/post-structure-linkedin.md` e escolher:
- **PAS** (Problema-Agitação-Solução) — para posts de dor do ICP
- **Contraste** (Antes vs Depois) — para mostrar transformação
- **Storytelling** (Narrativa) — para cases e experiências
- **Lista** (Pontos numerados) — para compilados e dicas
- **Declaração+Defesa** — para posicionamento e opinião

Informar framework escolhido e motivo em 1 linha.

### 3. Estruturar o Post

```
[Hook — exatamente como aprovado]

[Espaço]

[Body — blocos de max 2 linhas]
[Espaço entre blocos]
[Dados com fonte quando aplicável]

[Espaço]

[Insight/Takeaway — frase de impacto]

[CTA — pergunta ou ação específica]
```

### 4. Verificar Veto Conditions (OBRIGATÓRIO — verificar PRIMEIRO)

Se QUALQUER condição abaixo for verdadeira, **REFAZER o post antes de prosseguir**:

1. ❌ Hook > 210 caracteres
2. ❌ Post > 1.500 caracteres
3. ❌ Bloco de texto com 4+ linhas sem quebra
4. ❌ Vocabulário proibido presente (game changer, sinergia, hack, fórmula mágica, segredo, disruptivo, mindset)
5. ❌ CTA genérico ("Espero que ajude!", "Curtiu? Compartilhe!")
6. ❌ Duas ou mais ideias concorrentes no mesmo post (violação Rule of 1)

> Se qualquer veto for acionado, corrigir imediatamente antes de continuar.

### 5. Aplicar Revisão de Qualidade Integrada

Avaliar o post nos 4 blocos abaixo (referência: `checklists/review-checklist.md`):

#### 🪝 Hook — Peso: 40%
- [ ] Usa estrutura validada de `data/hook-structures.md`
- [ ] ≤ 210 caracteres (contados)
- [ ] Primeira frase para o scroll (gera curiosidade/impacto)
- [ ] Sem clickbait ou promessa exagerada
- [ ] Tom consistente com `data/tone-of-voice.md`

#### 📐 Estrutura — Peso: 25%
- [ ] Framework identificável (PAS, Contraste, Storytelling, Lista, Declaração+Defesa)
- [ ] Post total ≤ 1.300 caracteres com espaços
- [ ] Parágrafos de max 2 linhas
- [ ] Espaço branco suficiente (respira na tela)
- [ ] Rule of 1 — uma ideia central, uma mensagem
- [ ] Dados citados com fonte
- [ ] Sem hashtags (não impactam alcance no LinkedIn em 2026)

#### 🗣️ Tom de Voz — Peso: 20%
- [ ] Anti-guru: sem vocabulário proibido
- [ ] Coloquial brasileiro profissional (não acadêmico, não forçado)
- [ ] Teste de leitura em voz alta — soa como o Thiago falaria
- [ ] Sem jargões sem contexto
- [ ] Emojis apenas funcionais (✅, 📌, →, ⚠️) — NUNCA 🔥, 🚀, 💪, 💡

#### 📣 CTA — Peso: 15%
- [ ] CTA é pergunta ou ação específica (não genérico)
- [ ] CTA alinhado com o objetivo do post:
  - **Gerar debate:** pergunta aberta ou polarizadora
  - **Gerar salvamentos:** promessa de valor ("salva pra usar depois")
  - **Gerar conversa:** pedido específico ("me conta: qual é o maior gargalo?")
- [ ] Sem venda direta / "compre agora" / "saiba mais"
- [ ] Gera conversa e comentários

### 6. Calcular Score

| Bloco | Peso | Nota (0-100) | Score Ponderado |
|-------|------|-------------|-----------------|
| Hook | 40% | ___  | ___ |
| Estrutura | 25% | ___ | ___ |
| Tom de Voz | 20% | ___ | ___ |
| CTA | 15% | ___ | ___ |
| **TOTAL** | **100%** | | **___** |

- **Score ≥ 80%** → ✅ Entregar post final
- **Score < 80%** → 🔄 Refazer post (max 1 tentativa, depois reescrever do zero com nova abordagem)

### 7. Emitir Sugestão Visual (VISUAL-002)

Decidir e emitir uma sugestão de visual no `## Metadata` do post-final.md, no formato:

```
- **Sugestão Visual:** <formato>/<Estilo> (<motivo curto>)
```

**Decisão (árvore simplificada):**

1. **Formato:**
   - `carrossel` se: ≥3 etapas/itens numerados, ≥2 dados comparativos (ex: "de X para Y", "A vs B"), framework `Lista` ou `Declaração+Defesa` com >1100 chars, ou Storytelling >1000 chars
   - `capa` se: mensagem unitária (frase forte, 1 dado central, reação curta, cena única) ou char_count ≤ 800
   - Empate → `capa` (CTR maior na thumbnail)

2. **Estilo:** seguir os "Vence Quando" documentados em `aiox-squads/squads/{capas,carrosseis}-linkedin/data/visual-styles.md`:
   - Carrossel `Data-Driven` → benchmark com ≥2 dados
   - Carrossel `Twitter-Style` → tem print real + reação ≥3 etapas
   - Carrossel `Editorial Clean` → matéria-colab, premium-neutro
   - Carrossel `Notebook Raw` → opinião pessoal/cru, mito, framework pessoal (default carrossel)
   - Capa `Quote Card` → frase falsificável forte
   - Capa `Micro-Infografico` → 1 dado-hero
   - Capa `Print de Autoridade` → reação curta com print
   - Capa `Pessoa + Texto` → storytelling com foto contextual disponível
   - Capa `Rascunho no Papel` → default humanizado (visualizável em 3-5 blocos)

3. **Motivo curto** (máx 60 chars): por que esse formato/estilo encaixa nesse post.

**Se incerto:** omitir a linha. CCC fará fallback automático via `recommendVisual()`.

### 8. Montar Output Final

Incluir no output:
- Post completo (hook + body + CTA)
- Framework utilizado
- Estrutura de hook usada
- **Sugestão Visual** (linha do Metadata)
- Score de qualidade calculado
- Fontes utilizadas

---

## Regras Específicas

- **Guru-speak = refazer automaticamente** (palavras proibidas do tone-of-voice.md)
- **Dado sem fonte = refazer automaticamente**
- **Max 1 rodada de auto-correção** — Se falhar na 2ª vez, reescrever do zero
- **Feedback a si mesmo deve ser acionável** — "Ajustar tom" é proibido; "Trocar X por Y" é correto

---

## Output

→ `output/post-final.md` com post completo + score de qualidade

## Próximo Passo

→ **step-09**: ⏸️ CHECKPOINT FINAL — Aprovação do Thiago + Salvar no Thiago Marketing OS
