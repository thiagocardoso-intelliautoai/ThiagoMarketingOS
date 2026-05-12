# Design Infográfico — Estilo "Magazine Split-Layout"

**Data:** 2026-05-09
**Story:** [REFAC-005B](stories/REFAC-005B-infografico-design-impl.md)
**Conduzido por:** Squad Creator (Craft) + Thiago C.Lima
**Status:** ✅ **APROVADO POR THIAGO EM 2026-05-09** (accent color: **A — Vermelho-marker `#D32F2F`**)

---

## Contexto Estratégico

### Por que adicionar o estilo Infográfico ao squad de capas

O squad de capas-linkedin tem hoje 3 estilos sobreviventes pós-REFAC-001 (Rascunho no Papel, Pessoa+Texto, Print de Autoridade). Falta um estilo dedicado a **post que vira referência guardável** — formato com maior afinidade ao algoritmo 2026 pra contas <5K conexões.

### Algoritmo 2026 — sinais que este estilo paga

Referência: [`linkedin-algorithm-2026-reference.md`](../../linkedin-algorithm-2026-reference.md)

| Seção | Insight | Como o Infográfico encaixa |
|-------|---------|----------------------------|
| **§3.1 — Dwell time** | "leitor para pra ler" é o sinal forte de qualidade pro algoritmo | Single-page denso retém leitor 35-55s (vs 8-12s em text posts) |
| **§5.0 — Imagem autoral domina <5K conexões** | Tier do Thiago (~1.000 conexões) | Infográfico autoral encaixa diretamente |
| **§7.5 — Especificidade premiada** | Dados, números, frameworks nomeados geram 3-4× reach | Infográfico é o formato MAIS específico (lista, framework, processo) |
| **§5.2 — Saves observados** | Documents respondem por 12.92% de todos os saves do LinkedIn (2.6× sua share). Saves são salvamento = especificidade premiada | Checklist no Infográfico é **literalmente feito pra salvar** |

**Conclusão:** Infográfico combina os 3 sinais mais fortes do algoritmo (dwell + autoral + especificidade) num único formato. Não é "mais um estilo" — é o estilo com maior alinhamento estrutural ao algoritmo 2026 pro tier do Thiago.

---

## Pesquisa de Formatos — A Bolha Real do Thiago

> **Princípio:** A pesquisa não foi feita "em geral" — foi ancorada nos posts que o algoritmo entregou ao feed do Thiago dell-tyme (atravessando a bolha imediata) e nos quais Thiago parou pra ler. Isso é sinal mais forte que dados Socialinsider/AuthoredUp generalistas, porque é validação **dentro do nicho real** do Thiago.

### 4 Exemplos analisados (mandados por Thiago em 2026-05-09)

| # | Autor | Reactions | Reposts | Formato | Aesthetic |
|---|-------|-----------|---------|---------|-----------|
| 1 | Steve Nouri | 161 | 8 | **Whiteboard 2×4 grid** (Q&A dialógico) | Hand-drawn marker + red underline |
| 2 | Fábio Marçal | 187 | 6 | **Comic 2 panels** (before/after narrativo) | Pixar-ish illustration colorida |
| 3 | Carlos Mo (artevillar) | 13 | repost orgânico | **Comic 2 panels** (contraste viewpoints) | Retro sketch monocromático |
| 4 | HOW TO DUPLICATE (Brian Roemmele) | **434** | **54** | **Magazine split-layout** (chart + checklist) | **Cream paper + hand-lettered + red marker accents** |

### Padrão escondido — o que os 4 têm em comum

1. ✅ **Hand-drawn / hand-lettered** (anti-template, anti-Canva por construção)
2. ✅ **Tensão narrativa interna** — Q&A, before/after, contraste, lista-como-conquista
3. ✅ **Assinatura visual distintiva** — cada autor é reconhecível em 1 segundo
4. ✅ **Densidade alta mas digestível** — olho não cansa
5. ✅ **Zero icon-soup do Canva**

### Por que o #4 vence (de longe)

O HOW TO DUPLICATE teve **434 reactions + 54 reposts** — disparado o melhor dos 4. Análise das vantagens estruturais:

| Critério | #1 Whiteboard | #2/3 Comics | **#4 Magazine** |
|----------|:-------------:|:-----------:|:---------------:|
| Custo de produção (sem ilustrador) | ✅ médio | ❌ alto | ✅ **médio** |
| Coerência com squad existente | 🟡 parecido c/ Rascunho | ❌ estética estranha | ✅ **paleta papel já existe** |
| Dwell time §3.1 | ✅ Q&A prende | ✅ narrativa prende | ✅ **chart + checklist prende mais** |
| Saves §7.5 | 🟡 médio | ❌ comic não salva | ✅ **checklist É salvável** |
| Anti-Canva (anti-ref Thiago) | ✅ | ✅ | ✅ |
| Espaço pro CTA-na-arte | 🟡 espremido | ❌ quebra narrativa | ✅ **footer natural** |
| Performance comprovada | 161 | 13-187 | **434 + 54 reposts** |

**Decisão:** Magazine Split-Layout é a sub-tipologia primária do MVP. Comics e Q&A grid ficam como variantes futuras se Thiago quiser depois (stories separadas, não fazem parte deste MVP).

---

## Especificação Visual — Magazine Split-Layout

### Anatomia do template

```
┌─────────────────────────────────────────────┐
│  HOW TO  /  FRAMEWORK  /  PROCESSO          │  ← Eyebrow
│                                             │
│  HEADLINE DO PONTO CENTRAL EM 1-2 LINHAS    │  ← Headline serif bold
│                                             │
├──────────────────┬──────────────────────────┤
│                  │                           │
│                  │  ☐ Item 1 .............. │
│   [VISUAL]       │  ☐ Item 2 .............. │
│   chart simples  │  ☐ Item 3 .............. │
│   OU diagrama    │  ☐ Item 4 .............. │
│   linhas pretas  │  ☐ Item 5 .............. │
│   + accent       │  ☐ Item 6 .............. │
│   marker         │  ☐ Item 7 .............. │
│                  │  ☐ Item 8 .............. │
│                  │  ☐ Item 9 .............. │
│                  │                           │
├──────────────────┴──────────────────────────┤
│  [CTA-na-arte se is_lead_magnet=true]       │  ← Footer 10% altura
│  thiagoc.lima                                │  ← Assinatura
└─────────────────────────────────────────────┘
                  1080 × 1350
```

### Tipografia (decisões finais — escalável, sem hand-lettered custom)

| Elemento | Família | Peso | Tamanho | Cor |
|---|---|---|---|---|
| Eyebrow ("HOW TO", "FRAMEWORK", "PROCESSO") | Inter | 600 | 14pt UPPERCASE, letter-spacing 0.12em | `#64748B` (`--text-muted`) |
| Headline | **Playfair Display** | 700 | 32-40pt | `#1A1A2E` (`--bg-dark`) |
| Visual labels (chart) | Inter | 500 | 16-18pt | `#1A1A2E` |
| Body checklist | Inter | 500 | 22pt | `#1A1A2E` |
| Dotted leaders | — | — | linha pontilhada CSS | `#64748B` |
| Footer/assinatura | Inter | 500 | 18pt | `#64748B` |

**Decisão sobre hand-lettered:** **Descartado**. O "feel magazine" sai da combinação SERIF distinta + CREAM PAPER + DOTTED LEADERS + ACCENT MARKER decisivo — não precisa de letra à mão. Vantagens:
- Zero setup inicial (sem capturar letra de Thiago)
- Escalável (qualquer post vira capa sem fricção manual)
- Ainda é anti-Canva (combinação acima já tira do template)
- Reduz risco (handwriting custom é fácil de errar e ficar feio se algum caractere ficar inconsistente)

### Paleta de cores

**Princípio:** Herda dos estilos existentes (decisão pré-aprovada por Thiago em pre-flight) + adiciona accent vermelho-marker pra diferenciação.

| Cor | Hex | Uso |
|---|---|---|
| Background base | `#F5F1E8` (cream) | Fundo da capa — textura papel sobreposta |
| Texto principal | `#1A1A2E` (`--bg-dark`) | Headline, body, labels |
| Texto secundário | `#64748B` (`--text-muted`) | Eyebrow, leaders, assinatura |
| **Accent (marker)** | `#D32F2F` (vermelho-marker) | **1-2 palavras-chave da headline OU 1 elemento do visual chart** — NUNCA mais que isso |
| Linha (divisor visual/checklist) | `#000000` 60% opacity | Bordas finas tipo grafite |

> **🚩 Flag aberto:** Se a Winning Sales tem cor accent brand oficial (ex: o teal do `--accent` em `#14B8A6`), trocamos `#D32F2F` por ela. **Decisão pendente do Thiago no momento da assinatura deste doc.**

### Background — reuso de asset existente

**Decisão:** Reusar fotos do banco `source_photos` (category=papers) que já existe e suporta o estilo Rascunho no Papel.

- **Como usar:** o template Infográfico aplica uma das fotos de papel como background, com filtro de saturação reduzida + brightness +5% pra ficar mais "neutro" (não compete com o conteúdo do infográfico).
- **Fotos elegíveis:** as 6 fotos `paper-01` a `paper-06` (validar com Thiago quais dessas funcionam — algumas têm caderno aberto que pode atrapalhar o layout Magazine).
- **Recomendação inicial:** `paper-03` (caderno na cama + caderno WS fechado ao lado, paisagem) — visualmente mais "neutro" pra servir de background sem competir.
- **Custo zero:** sem precisar de novas fotos.

### Visual side (lado esquerdo do split)

**Tipos permitidos no MVP:**

1. **Chart hand-drawn-feeling (linha simples)** — ex: gráfico Before/After com 2 curvas, eixos sem grid, labels handwriting-style mas em Inter Medium (descartamos hand-lettered)
2. **Diagrama de framework** — quadrantes (matriz 2×2), pirâmide, funil, fluxo passo-a-passo
3. **Dados hero** — número grande (ex: "434") + contexto curto abaixo
4. **Ilustração simples linha-arte** — só se gerável via CSS/SVG, NÃO precisa de ilustrador

**Anti-padrão visual side:**
- ❌ Ilustração Pixar/Disney (custo de produção alto)
- ❌ Múltiplos charts no mesmo lado (cognitive overload)
- ❌ Icons decorativos sem função (icon-soup do Canva)

### Body side (lado direito do split — checklist)

**Schema obrigatório:**
- **8-12 itens** (mín 8 pra justificar densidade; máx 12 pra não cansar)
- **Checkbox visual** (☐) à esquerda de cada item
- **Dotted leader** entre o item e o fim-de-linha — DEFINITIVO pro look magazine
- **Itens curtos:** 3-8 palavras cada, em paralelismo gramatical (todos verbos no infinitivo, OU todos substantivos)
- **NUMERAÇÃO opcional:** se for processo sequencial, numerar (1., 2., 3.); se for checklist de paridade, só checkbox.

### Footer (CTA-na-arte quando lead magnet)

**Conforme REFAC-002:**
- Quando `is_lead_magnet=true`: bloco CTA-na-arte renderizado no footer.
- Quando `is_lead_magnet=false`: bloco removido, apenas assinatura "thiagoc.lima" visível.

**Especificação do CTA-na-arte (Infográfico):**

| Atributo | Valor |
|---|---|
| Posição | Faixa inferior, full-width, max 130px (≤10% da altura total) |
| Background | Vermelho-marker `#D32F2F` 0.92 opacity OU cor brand Winning Sales |
| Tipografia | Inter Bold 26pt, branco `#FFFFFF` |
| Padding | 22px vertical × 32px horizontal |
| Border-top | 1px solid linha-grafite |
| Implementação | `.cta-bar` no `templates/infografico-magazine.html` entre marcadores `<!-- CTA-BLOCK -->` e `<!-- /CTA-BLOCK -->` (padrão REFAC-002) |

---

## Os 5 Campos da Sub-tarefa 1.2 (story REFAC-005B) — Preenchidos

### 1. Tipologia primária

**Magazine Split-Layout single-page denso** — não comic, não whiteboard Q&A, não multi-data layout. Justificativa: vencedor em 6 de 7 critérios contra os outros 3 formatos do feed real do Thiago, performance comprovada (434 reactions + 54 reposts vs 13-187 dos outros).

Variantes futuras possíveis (NÃO fazem parte deste MVP, abrir stories separadas se quiser):
- Whiteboard Q&A grid (estilo Steve Nouri)
- Comic before/after (estilo Fábio Marçal)
- Comic contraste (estilo Carlos Mo)
- Multi-data layout (números grandes + ícones)
- Híbrido

### 2. Peso visual

- **Hierarquia:** Headline serif domina (1 elemento principal); visual + checklist são suporte equilibrado (40/60 horizontal).
- **Fonte de título:** Playfair Display Bold 32-40pt — distinto dos outros estilos (que são Inter sans).
- **Uso de cor:** monocromático (preto/cinza/cream) + 1 cor accent (vermelho-marker `#D32F2F` ou Winning Sales brand).
- **Ícones:** apenas checkboxes (☐) — zero ícones decorativos.
- **Linhas:** finas, pretas com 60% opacity, sem grid completo nos charts (eixos sim, grid não).

### 3. Referências visuais aprovadas como assinatura

- **Principal:** HOW TO DUPLICATE YOURSELF INTO CLAUDE (Brian Roemmele) — cream paper, serif headline, hand-lettered checklist (que descartamos), accent marker vermelho.
- **Secundárias (inspiração):**
  - Steve Nouri whiteboard (anti-Canva, marker accent)
  - The Visual MBA (Jason Barron) — single-page sketchnotes
  - Eddy Hood's "Cheat Sheets" — magazine layout monocromático
- **Anti-referências (REJEITADO):** Canva-style infográficos coloridos com icon-soup, templates Hubspot/Sprout Social, ilustrações Slidesgo.

### 4. Tempo de produção esperado

| Etapa | Tempo |
|---|---|
| Designer compõe headline + estrutura | 2-3 min |
| Designer escolhe visual (chart/framework/diagrama) | 3-5 min |
| Designer gera checklist com paralelismo gramatical | 3-5 min |
| Render via Puppeteer | 10s |
| **Total por capa** | **8-13 min** |

Comparação:
- Rascunho no Papel: 15-25 min (precisa selecionar foto + gerar rascunho à lápis via IA)
- Pessoa+Texto: 5-10 min (foto + overlay texto)
- Print de Autoridade: 10-20 min (busca/captura print + texto)
- **Infográfico Magazine: 8-13 min** — competitivo, mais barato que Rascunho

### 5. Critério de quando usar

**Use Infográfico Magazine quando o post tem QUALQUER UM dos seguintes:**

1. **Framework nomeado replicável** — ex: "Os 7 passos de uma negociação", "Framework SPIN", "Método X"
2. **Processo sequencial** — ex: "Como preparei meu primeiro Discovery Call do zero"
3. **Checklist acionável** — ex: "12 perguntas pra fazer antes de cada call de demo"
4. **Comparação estruturada** — ex: "Sales bom vs sales ruim em 8 hábitos"
5. **Dados hero + lista de takeaways** — ex: "434 calls depois, eis o que aprendi"

**NÃO use Infográfico Magazine quando:**

- Post é puramente narrativo (storytelling pessoal sem framework) — vai melhor como **Pessoa+Texto** ou **Rascunho no Papel**
- Post é uma reação a fonte de autoridade — vai melhor como **Print de Autoridade**
- Post não tem ≥8 itens pra preencher o checklist (não justifica formato denso) — vai melhor como **Pessoa+Texto**
- Post tem ≥3 momentos/cenas/eventos pra contar visualmente — caso de uso seria Multi-Image, mas REFAC-005A-DESIGN foi Deferred — use **Pessoa+Texto** single-image com texto narrativo no body do post

---

## Diferença Operacional — Infográfico vs Rascunho no Papel

Os 2 estilos são "densos" e podem competir. Critério de desempate:

| | Rascunho no Papel | Infográfico Magazine |
|---|---|---|
| **Tom** | Íntimo, bastidor, "Thiago rascunhando agora" | Didático, autoridade, "Thiago consolidando conhecimento" |
| **Visual base** | Foto de caderno + rascunho à lápis SOBRE | Página inteira de magazine limpa |
| **Quando** | Post tem framework + storytelling pessoal | Post tem framework/processo replicável "salvável" |
| **Output emocional** | Conexão humana ("ele tá pensando comigo") | Referência guardável ("vou salvar pra usar") |
| **Saves esperados** | Médios | **Altos** (checklist é feito pra salvar) |
| **Densidade máxima** | 3-5 blocos | 8-12 itens checklist |
| **Tempo produção** | 15-25 min | 8-13 min |
| **Best for pilares** | A (Alcance), C (Credibilidade) | C (Credibilidade), E (Engajamento) |

**Heurística de decisão (pro `recommend-visual.js`):**

```
SE post tem framework/processo/checklist replicável E ≥8 itens E tom didático/autoridade:
  → recomendar Infográfico Magazine
SENÃO SE post tem framework/dados E tom íntimo/bastidor:
  → recomendar Rascunho no Papel
SENÃO se ambos parecem fit:
  → priorizar Infográfico Magazine (saves > conexão pro algoritmo 2026)
```

---

## Anti-padrões (o que NÃO fazer — críticos)

❌ **Icon soup do Canva** — zero ícones decorativos, só checkboxes funcionais.
❌ **Cores múltiplas decorativas** — máximo 1 accent (vermelho-marker ou brand Winning Sales).
❌ **Background liso digital** — sempre textura papel (reusa `source_photos`).
❌ **Tipografia 100% Helvetica corporativa** — Playfair Display na headline é OBRIGATÓRIO pro feel magazine.
❌ **Checklist com >12 itens** — cognitive overload, leitor desiste.
❌ **Checklist com <8 itens** — não justifica formato denso, usa outro estilo.
❌ **Charts complexos** — visual side deve ser legível em 1 olhar; se exige estudo é cognitive overload.
❌ **Hand-lettered customizado** — descartado (escalabilidade > autoral via letra).
❌ **Ilustrações tipo Pixar/Disney** — custo de produção alto, fora de escopo MVP.
❌ **Mais de 1 cor accent** — vermelho-marker só em 1-2 palavras-chave da headline OU em 1 elemento do chart.

---

## Sub-tarefas de Implementação (Fase 2 — Dev)

Quando esta fase 1 for assinada, a fase 2 da story REFAC-005B implementa:

- [ ] **2.1** Criar `aiox-squads/squads/capas-linkedin/templates/infografico-magazine-base.html` com Magazine Split-Layout conforme especificação acima
- [ ] **2.2** Editar `aiox-squads/squads/capas-linkedin/squad.yaml` adicionando entrada `infografico-magazine` em `templates`
- [ ] **2.3** Estender `aiox-squads/squads/capas-linkedin/agents/designer.md` com instruções para gerar Infográfico Magazine (composição de headline + visual + checklist)
- [ ] **2.4** Atualizar `aiox-squads/squads/capas-linkedin/data/visual-styles.md` com seção completa do Infográfico (referenciando este doc)
- [ ] **2.5** Atualizar CCC:
  - `js/prompts.js`: adicionar entrada **Infográfico Magazine** em `CoverStyles`
  - `js/recommend-visual.js`: implementar heurística de recomendação conforme critério acima
- [ ] **Bonus (decisão Thiago):** Carregar fonte **Playfair Display** via Google Fonts no `<head>` do template OU embutir como `@font-face` self-contained (recomendado: Google Fonts CDN, é estilo já estabelecido)

Esforço estimado fase 2: **5-8h**.

---

## Decisões Pendentes do Thiago no Momento da Assinatura

Antes de assinar, **confirma 1 decisão pequena**:

**🚩 Accent color final:**
- **(A)** Vermelho-marker `#D32F2F` (mesmo do HOW TO DUPLICATE, coerente com pesquisa) — **recomendado pelo Craft**
- **(B)** Cor brand Winning Sales (se existe — qual é o hex?)
- **(C)** Teal accent atual do squad `#14B8A6` (reusa `--accent` dos outros estilos)

Se você não responder, **vou seguir com (A) vermelho-marker** porque é coerente com a pesquisa do algoritmo (HOW TO DUPLICATE performou 434 reactions com vermelho).

---

## ✅ Assinatura

```
✅ Aprovado por Thiago em 2026-05-09
Accent color escolhido: A (Vermelho-marker #D32F2F)
```

Decisão de accent delegada ao squad-creator com guidance "o que achar melhor visualmente". Craft escolheu (A) porque:
- É a cor da pesquisa principal (HOW TO DUPLICATE — 434 reactions)
- Maior contraste sobre cream paper background (legibilidade > coerência interna)
- Diferencia o Infográfico dos outros estilos do squad (que usam teal `#14B8A6`) — assinatura visual própria
- Se Winning Sales tiver brand color oficial no futuro, é troca de 1 token CSS (`--infografico-accent`)

**Fase 2 da story REFAC-005B agora DESBLOQUEADA.**

---

## Referências

- Algoritmo 2026: [`linkedin-algorithm-2026-reference.md`](../../linkedin-algorithm-2026-reference.md) §3.1, §5.0, §5.2, §7.5
- Visual-styles atuais: [`aiox-squads/squads/capas-linkedin/data/visual-styles.md`](../../aiox-squads/squads/capas-linkedin/data/visual-styles.md)
- REFAC-002 (CTA-na-arte): definido em visual-styles.md
- Story-mãe: [`stories/REFAC-005B-infografico-design-impl.md`](stories/REFAC-005B-infografico-design-impl.md)
- Decisões pré-aprovadas: capturadas via `/run-wave 0 --preflight-only` em 2026-05-09

---

**Sessão conduzida em:** 2026-05-09
**Squad-Creator:** Craft (🏗️ Builder)
**Operador:** Thiago C.Lima
