# Task: Planejamento Mensal — 12 Posts LinkedIn

> Modo 5 do squad Pesquisa e Conteúdo LinkedIn.
> Gera um plano tático de 4 semanas (12 posts) de uma vez.

---

## Contexto

O Redator recebe uma **direção temática** do usuário (ex: "foco em automação de prospecção com IA este mês") e gera 12 posts distribuídos em 4 semanas usando a metodologia integrada DTC + ACRE.

---

## Referências Obrigatórias

→ `data/linkedin-strategy.md` — Pilares ACRE, ICP, temas, métricas
→ `data/tone-of-voice.md` — Tom de voz, vocabulário permitido/proibido
→ `data/hook-structures.md` — 9 estruturas de hook validadas
→ `data/post-structure-linkedin.md` — Frameworks (PAS, Contraste, Storytelling, etc.)

---

## Arquitetura Lógica: DTC + ACRE

Distribuir os 12 posts seguindo esta lógica de funil adaptada para 4 semanas.

Para cada post, escolher um **Tipo de Conteúdo** específico para diversificar a pauta.

### FASE 1: DISRUPÇÃO & ALCANCE (Posts 1 a 4)

**Objetivo:** Criar reconhecimento e despertar curiosidade.
**Pilar ACRE predominante:** Alcance (A) e Engajamento (E)

**Tipos de Conteúdo (escolher variado):**
1. *Histórias de Conexão:* Bastidores/Origem que aproximam
2. *Dores do Público:* Relatos de dificuldades comuns do ICP
3. *POV (Ponto de Vista):* Opinião forte sobre tendências ou erros do setor
4. *Desafie o Comum:* Questionar padrões estabelecidos ("A mentira que te contaram")

### FASE 2: EDUCAÇÃO & CREDIBILIDADE (Posts 5 a 9)

**Objetivo:** Aprofundar interesse, educar e criar confiança técnica.
**Pilar ACRE predominante:** Credibilidade (C) e Engajamento (E)

**Tipos de Conteúdo (escolher variado):**
1. *Estudos de Caso:* Problema > Solução > Resultado
2. *Conteúdo Educativo Profundo:* Frameworks passo a passo
3. *Conselhos Práticos:* Checklists ou "3 passos para resolver X"
4. *Prova Social:* Depoimentos ou conquistas em formato narrativo

### FASE 3: CONVERSÃO & RETORNO (Posts 10 a 12)

**Objetivo:** Gerar MQL e oportunidades de venda.
**Pilar ACRE predominante:** Retorno (R) e Credibilidade (C)

**Tipos de Conteúdo (escolher variado):**
1. *Urgência (FOMO):* Risco de não agir agora
2. *Consultivo/Especialista:* Visão estratégica de longo prazo
3. *Direto (Curto e Objetivo):* Oferta clara sem rodeios

---

## Regras de Execução

1. **Regra do Fator Humano:** A cada 3 posts, 1 DEVE ser pessoal/humanizado (História de conexão ou POV pessoal). Posts 3, 6, 9 e 12 são candidatos naturais.
2. **Regra da Diversidade:** Dentro dos 12 posts, incluir obrigatoriamente 1 que funcione como Infográfico/Diagrama (marcar como [VISUAL] na tabela), mas **jamais** incluir carrossel (isso é do squad carrosseis-linkedin).
3. **Regra do Tom de Voz:** Todos os hooks e direcionamentos DEVEM seguir `data/tone-of-voice.md`. Vocabulário proibido = veto imediato.
4. **Regra dos Hooks:** Usar estruturas do `data/hook-structures.md` como base para cada hook. Nunca inventar do zero.
5. **Regra do ICP:** Cada post deve falar diretamente com o ICP definido em `data/linkedin-strategy.md`.

---

## Formato de Saída

Gerar a resposta contendo a **Tabela de Planejamento** com as colunas abaixo.

Ir direto para a tabela. Sem introduções longas.

### Tabela de Planejamento (12 Linhas)

| **Sem** | **Post** | **Fase ACRE** | **Tipo de Conteúdo** | **Ideia Central (Hook Real)** | **Direcionamento de Escrita** |
| --- | --- | --- | --- | --- | --- |
| 1 | 1 | Alcance | Desafie o Comum | [Hook real — headline + subheadline] | [Estrutura do copy] |

### Regras Específicas das Colunas

#### Coluna "Ideia Central (Hook Real)"

NÃO colocar apenas o tema. Escrever o **Hook real** para o LinkedIn (Headline + Subheadline).

Exemplo:
```
"80% dos leads que marcam visita não aparecem no stand.

Os 3 erros de atendimento digital que você está cometendo (e como corrigir)."
```

Cada hook DEVE ter ≤ 210 caracteres (regra do "ver mais").

#### Coluna "Direcionamento de Escrita"

Formato obrigatório com 3 blocos:

**1. Abertura:** "Texto sugerido para o gancho inicial."

**2. Desenv:** "Os pontos principais do corpo (Problema > Agitação > Solução Técnica)."

**3. Fechamento:** "CTA específico para a fase do funil."

---

## Output

Após aprovação do Thiago, cada post da tabela será salvo individualmente como arquivo separado no armazém:

```
output/planejamento-mensal/
├── post-01.md
├── post-02.md
├── ...
└── post-12.md
```

Cada arquivo segue o template de `templates/armazem-template.md` com os dados da tabela preenchidos.

---

## Regra Absoluta de Output

Retornar APENAS a tabela de planejamento.
Nenhuma mensagem de abertura, fechamento, confirmação ou comentário.
O output começa no primeiro caractere do conteúdo e termina no último.
