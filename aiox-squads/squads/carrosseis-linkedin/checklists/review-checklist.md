# Review Checklist — Carrosséis LinkedIn

> Checklist usado pelo Raul Revisão (Reviewer) no step-08 do pipeline.
> Baseado nos critérios de qualidade definidos em `data/quality-criteria.md`.

---

## Critérios de Aprovação

| Critério | Peso | Threshold |
|----------|------|-----------|
| Alinhamento com tom de voz | Alto | >= 7/10 |
| Legibilidade visual | Alto | >= 7/10 |
| CTA funcional | Médio | >= 6/10 |
| Aderência à Lente | Médio | >= 6/10 |
| Consistência entre slides | Alto | >= 7/10 |

**✅ APPROVE:** Média >= 7/10 **E** nenhum critério abaixo de 5/10
**❌ REJECT:** Média < 7/10 **OU** qualquer critério abaixo de 5/10

---

## 1. Copy — Revisão de Texto (Peso: 35%)

- [ ] Hook cabe em ~210 caracteres (antes do "ver mais" do LinkedIn)
- [ ] Escrito em primeira pessoa com voz autêntica do Thiago
- [ ] Parágrafos de 1-2 frases com quebras de linha entre eles
- [ ] Contém insights acionáveis (mín. 3 por carrossel)
- [ ] CTA é pergunta genuína ou chamada específica para ação
- [ ] Sem links no corpo do post (link nos comentários)
- [ ] Hashtags 3-5 na última linha
- [ ] Tom de voz consistente com a opção selecionada
- [ ] Vocabulário aprovado (sem termos proibidos: game changer, sinergia, hack, etc.)
- [ ] Cada slide tem UMA ideia, max 20-30 palavras

---

## 2. Design — Twitter-Style (Peso: 30%)

> Aplicar apenas se o estilo selecionado for Twitter-Style.

### Critérios comuns (ambos os layouts)
- [ ] Fundo charcoal `#1A1A2E` (with-print) ou `#0F1419` (no-print)
- [ ] Foto de perfil circular 80px + nome + @ visíveis no topo
- [ ] Texto principal `#F1F5F9` com contraste mín. 4.5:1
- [ ] Font size mín. 34px para body, 52-58px para hero/tweet
- [ ] HTML self-contained (sem dependências externas exceto Google Fonts)
- [ ] Viewport exato: 1080 x 1350

### Gate condicional por layout (REFAC-004)

**Se slide 1 = `with-print` (a task `obter-print-autoridade` retornou path/URL):**
- [ ] Print real ocupa ~70% do slide em image-fill (não placeholder, não imagem genérica)
- [ ] Hero text reduzido (~32px) por cima — não compete com o print
- [ ] **Autenticidade da fonte validada:**
  - [ ] URL pública e acessível (não conteúdo behind login wall)
  - [ ] Atribuição correta presente (autor/@ ou veículo)
  - [ ] Sem deepfake, sem citação fora de contexto, sem manipulação visual
  - [ ] Domínio na white-list da task ou aprovado via upload manual
- [ ] Total de slides do post = N (preservou a estrutura original)

**Se slide 1 = `no-print` (a task retornou null):**
- [ ] Slide 1 = texto-tweet puro (BG `#0F1419`, body 52-58px), sem placeholder de imagem
- [ ] **Hook do ex-slide-2 promovido é forte o suficiente para abrir o post sozinho** (sem ancoragem visual do print)
- [ ] Total de slides = N-1 (encolheu corretamente — o slide-1-com-print não foi gerado, e o conteúdo do slide 2 subiu para a posição 1)
- [ ] Copy do slide promovido cabe na Rule of 1 (max 30 palavras) e mantém o sentido sem perda

---

## 2. Design — Editorial Clean (Peso: 30%)

> Aplicar apenas se o estilo selecionado for Editorial Clean.
> **Validação detalhada em `checklists/editorial-clean-checklist.md`** (specs de paleta, tipografia, variantes e gates anti-AI — REFAC-004 auditoria Uma).

Resumo dos gates críticos (ver checklist específico para detalhes):
- [ ] Paleta restrita aos 6 tokens declarados em `:root` — sem hex literal nos seletores
- [ ] Cor `--muted` é `#71717A` (passa WCAG AA 4.6:1) — proibido `#94A3B8` ou `#888888`
- [ ] Accent é Teal `#14B8A6` em **todo** slide — proibido azul `#2563EB`
- [ ] Hero ≥44px (variantes definem o tamanho exato), body ≥36px
- [ ] Pelo menos 2 slides usam variantes diferentes do base (anti-AI §6.1)
- [ ] `border-radius: 0px` em todos os containers/buttons

---

## 2. Design — Pessoa-Style (Peso: 30%)

> Aplicar apenas se o estilo selecionado for Pessoa-Style.

- [ ] Foto do Thiago integrada ao design de forma natural
- [ ] Contraste de texto protegido (overlay 60%+)
- [ ] Se usou IA: resultado realista, sem artefatos visuais
- [ ] Se usou IA: face/expressão não foram alteradas
- [ ] Font size mín. 34px para body
- [ ] Cores complementares derivadas da foto
- [ ] Viewport exato: 1080 x 1350

---

## 3. Consistência Visual (Peso: 20%)

- [ ] Tipografia consistente entre todos os slides
- [ ] Paleta de cores mantida do primeiro ao último slide
- [ ] Foto de perfil e nome no mesmo posicionamento em todos os slides
- [ ] Estilo visual uniforme (não misturar Twitter-style com Pessoa-style)
- [ ] Último slide tem CTA claro e visualmente destacado

---

## 4. Aderência Estratégica (Peso: 15%)

- [ ] Fonte de tese identificada e coerente com o conteúdo
- [ ] Relevante para o ICP (empresário/operador que quer usar IA de forma correta)
- [ ] Alinhado com a estratégia LinkedIn definida em `data/linkedin-strategy.md`
- [ ] Complementa (não repete) posts de texto recentes

---

## Formato de Feedback

### Quando APROVADO (média >= 7/10)

```
## ✅ Carrossel Aprovado — Score: [X]/10

### Scores por Critério
| Critério | Score |
|----------|-------|
| Alinhamento tom de voz | [X]/10 |
| Legibilidade visual | [X]/10 |
| CTA funcional | [X]/10 |
| Aderência à Lente | [X]/10 |
| Consistência entre slides | [X]/10 |
| **Média** | **[X]/10** |

### Pontos Fortes
- [2-3 itens que funcionaram bem]

### Sugestões (não bloqueantes)
- [Ajustes finos opcionais]

> ⏳ Aguardando aprovação final do Thiago.
```

### Quando REJEITADO (média < 7/10 ou critério < 5/10)

```
## ❌ Carrossel Rejeitado — Score: [X]/10

### Scores por Critério
| Critério | Score |
|----------|-------|
| ... | ... |

### Problemas Identificados
1. [Problema + qual critério afeta + score dado]
2. [Problema + qual critério afeta + score dado]

### O que corrigir
1. [Instrução clara para o Copywriter/Designer]
2. [Instrução clara para o Copywriter/Designer]

> 🔄 Devolver ao Copywriter (step-04) para correção.
```

---

## Veto Conditions (Rejeição Automática)

1. **Vocabulário proibido presente** no copy
2. **Viewport diferente de 1080x1350**
3. **Contraste abaixo de 4.5:1** em qualquer slide
4. **HTML com dependências externas** (exceto Google Fonts)
5. **Slide com mais de 30 palavras** de conteúdo
6. **Mistura de estilos** (Twitter-style e Pessoa-style no mesmo carrossel)
