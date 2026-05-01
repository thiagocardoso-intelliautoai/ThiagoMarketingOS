# Critério de Narrativa-Relevance

> **Single source of truth** para decidir quando buscar uma história do Thiago.
> Todo agente e squad que precisa invocar o subagent `historia-thiago` deve usar este documento.
> **Design: conservador por padrão** — em dúvida entre 🟡 e ⚫, classifica ⚫.

---

## Os 4 Sinais

Aplique os 4 sinais em sequência. A combinação dos resultados determina o nível.

---

### Sinal 1 — Verbo pessoal no hook embrionário

O hook ou subpauta contém verbo em primeira pessoa descrevendo uma ação real, erro, descoberta ou conquista do Thiago?

**✅ Exemplos positivos (sinal presente)**

| Hook / subpauta | Verbo(s) pessoal(is) |
|-----------------|----------------------|
| "a primeira venda que fechei depois de meses tentando" | fechei |
| "quando errei a oferta e perdi o cliente" | errei, perdi |
| "aprendi a diferença entre lábia e proposta de valor" | aprendi |
| "tentei vender automação pra concessionária" | tentei, vender |
| "passei vergonha numa call ao vivo" | passei |
| "consegui meu primeiro contrato aos 18" | consegui |

**❌ Exemplos negativos (sinal ausente)**

| Hook / subpauta | Por quê ausente |
|-----------------|-----------------|
| "70% dos vendedores cometem esse erro" | dado genérico, sem Thiago |
| "5 passos para fechar uma venda consultiva" | tutorial imperativo |
| "o algoritmo do LinkedIn funciona assim" | explicação técnica |
| "como a IA está mudando vendas em 2025" | análise de mercado |
| "empresas que adotam IA vendem 30% mais" | benchmark |

---

### Sinal 2 — Fonte de tese da subpauta

De onde vem a afirmação central da subpauta?

| Fonte de tese | Nível default |
|---------------|---------------|
| **Falha Documentada** — fracasso pessoal real com contexto | 🔴 ALTA |
| **Processo Diagnóstico Anônimo** — observação de padrão vivido | 🟡 MÉDIA |
| **Skills em Produção** — demonstração de técnica usada por Thiago | 🟡 MÉDIA (com cautela) |
| **Benchmark Real** — estatística de mercado ou dado externo | ⚫ NULA |
| **Tutorial / How-to puro** — instrução sem experiência âncora | ⚫ NULA |

> **Atenção:** Skills em Produção pode ter sinal misto. Só classifica 🟡 se há relato de quando/como Thiago aplicou, não apenas descrição da técnica.

---

### Sinal 3 — Tipo de proposição

A subpauta é uma proposição experiencial, observacional ou conceitual com âncora pessoal?

**✅ Tipos que suportam história**

- **Experiencial:** "quando fiz X, aprendi Y" — evento específico ocorrido
- **Observacional pessoal:** "notei nos meus clientes que..." — padrão visto de dentro
- **Conceitual com âncora:** "esse conceito mudou quando entendi ao vivo que..." — ideia ilustrada por caso real

**❌ Tipos que NÃO suportam história**

- **Factual puro:** "X% das empresas fazem Y" — dado externo sem experiência
- **Conceitual puro:** "essa técnica funciona porque..." — teoria sem caso âncora
- **Tutorial:** "para fazer X, siga os passos..." — instrução sem voz pessoal

---

### Sinal 4 — Marcadores temporais e sociais

A subpauta ou hook embrionário contém referências concretas a pessoas reais, período de tempo ou números específicos?

**✅ Marcadores presentes (sinal forte)**

- Pessoa nomeada: Saulo, Alan Nicholas, Shaya, Rafael Faria
- Período: "quando eu tinha 17", "em outubro de 2025", "no primeiro mês"
- Número: "4 meses construindo", "1000 leads, 0 vendas", "R$2.500/mês"
- Local: "na concessionária", "no Discord do Alan", "na Winning Sales"

**❌ Marcadores ausentes (sinal fraco)**

- "recentemente", "há um tempo", "no começo"
- "as empresas", "os vendedores", "o mercado"
- "muitos", "alguns", "a maioria"

---

## Os 3 Níveis

### 🔴 ALTA — Busca obrigatória no subagent

**Critério objetivo:** ≥2 sinais positivos fortes, sendo que Sinal 1 (verbo pessoal) ou Sinal 4 (marcadores) está presente.

**O que fazer:** chamar `historia-thiago` subagent com a query. Esperar história com fala literal, cena e lição.

**Tipo de post resultante:** storytelling com experiência âncora — post de maior engajamento e diferenciação.

---

### 🟡 MÉDIA — Busca exploratória (opcional)

**Critério objetivo:** sinais mistos — Sinal 1 ausente mas Sinais 3+4 presentes, ou Sinal 2 = "Skills em Produção" com relato parcial.

**O que fazer:** invocar subagent com query ampla. Se subagent retornar 0 histórias aderentes → **não forçar**. Produzir post sem história ou reformular o ângulo.

**Tipo de post resultante:** post de insight/observação com toque pessoal leve — pode funcionar sem história.

---

### ⚫ NULA — Skip (não buscar)

**Critério objetivo:** Sinal 1 ausente E (Sinal 2 = Benchmark/Tutorial OU Sinal 3 = Factual/Tutorial).

**O que fazer:** não invocar o subagent. Produzir post técnico, informativo ou de curadoria sem âncora narrativa.

**Por quê é conservador:** post factual sem história é ok. Post com história forçada degrada qualidade e voz.

---

## Tabela de Decisão Rápida

Matriz **Fonte de Tese** (eixo Y) × **Tipo de Proposição** (eixo X) → nível default:

|  | Experiencial | Observacional Pessoal | Conceitual c/ âncora | Factual Puro | Tutorial |
|--|--|--|--|--|--|
| **Falha Documentada** | 🔴 | 🔴 | 🟡 | ⚫ | ⚫ |
| **Processo Diagnóstico** | 🔴 | 🟡 | 🟡 | ⚫ | ⚫ |
| **Skills em Produção** | 🟡 | 🟡 | 🟡 | ⚫ | ⚫ |
| **Benchmark Real** | ⚫ | ⚫ | ⚫ | ⚫ | ⚫ |
| **Tutorial Puro** | ⚫ | ⚫ | ⚫ | ⚫ | ⚫ |

> **Regra de leitura:** encontre a linha (Fonte de Tese) e a coluna (Tipo de Proposição) da subpauta. O cruzamento é o nível default. Confirme com os 4 sinais se o resultado parecer inesperado.

---

## Exemplos Baseados em Dados Reais

### Exemplos 🔴 ALTA (≥3)

**Exemplo 🔴-1: "Passei 4 meses construindo automação que não vendeu"**
- Subpauta: fracasso de produto construído sem validar proposta de valor
- Sinal 1 ✅: "construí", "passei", "não vendi" — verbos pessoais explícitos
- Sinal 2 ✅: Falha Documentada
- Sinal 3 ✅: Experiencial — evento específico ocorrido (Jun/2025)
- Sinal 4 ✅: Saulo nomeado, "4 meses", Jonathan e Douglas nomeados
- **História âncora:** `jornada-profissional.md` — "Saulo e os 4 meses de automação"

**Exemplo 🔴-2: "Minha primeira tentativa de criar comunidade foi horrível"**
- Subpauta: vulnerabilidade como ferramenta de conexão
- Sinal 1 ✅: "entrei", "falei", "não sabia" — verbos pessoais na cena
- Sinal 2 ✅: Falha Documentada (call que "deu tudo errado")
- Sinal 3 ✅: Experiencial — cena do Discord com fala literal preservada
- Sinal 4 ✅: Alan Nicholas nomeado, Discord, Saulo como aliado que surgiu
- **História âncora:** `jornada-profissional.md` — "Discord do Alan: vergonha da primeira call"

**Exemplo 🔴-3: "Aprendi que lábia não basta — valor sim"**
- Subpauta: diferença entre comunicação e proposta de valor em vendas
- Sinal 1 ✅: "aprendi", "passei vergonha", "vendi" — verbos pessoais
- Sinal 2 ✅: Falha Documentada (protótipo bugou ao vivo na frente de clientes reais)
- Sinal 3 ✅: Experiencial — cena com NicoChat travado, mães dos amigos nomeadas como público
- Sinal 4 ✅: NicoChat nomeado, "mãe dos amigos" como público real
- **História âncora:** `jornada-profissional.md` — "Vendi pra mãe dos amigos (e passei muita vergonha)"

---

### Exemplos 🟡 MÉDIA (≥3)

**Exemplo 🟡-1: "No momento mais baixo, considerei trabalhos braçais"**
- Subpauta: persistência construída nos momentos invisíveis, não nas conquistas
- Sinal 1 🔶: "pensei", "considerei" — verbos pessoais, mas reflexivos (não ação dramática)
- Sinal 2 🔶: Processo Diagnóstico — observação de si mesmo em fase difícil
- Sinal 3 ✅: Observacional pessoal — padrão de como persistência funciona
- Sinal 4 ✅: "junho de 2025", "passeador de cachorro" como opção concreta
- **História âncora:** `evolucao-pessoal.md` — "Pensei em trabalhar de passeador de cachorro"

**Exemplo 🟡-2: "Comecei a documentar minha história por causa de um vídeo"**
- Subpauta: construir asset hoje para usar amanhã
- Sinal 1 🔶: "comecei", "decidi" — verbos pessoais, mas inspiração externa como gatilho
- Sinal 2 🔶: Skills em Produção — hábito de documentação como skill construído
- Sinal 3 ✅: Conceitual com âncora — ideia de "asset" ilustrada por decisão real
- Sinal 4 ✅: Lion nomeado, junho de 2025, "carta pra o Thiago do futuro"
- **História âncora:** `evolucao-pessoal.md` — "A inspiração do Lion para gravar a história"

**Exemplo 🟡-3: "Saber usar ChatGPT não é saber ganhar dinheiro com IA"**
- Subpauta: diferença entre familiaridade com ferramenta e monetização
- Sinal 1 🔶: "descobri", "não tinha noção" — verbos pessoais mas conceito é a tese central
- Sinal 2 🔶: Skills em Produção / Processo Diagnóstico
- Sinal 3 ✅: Conceitual com âncora — ilustrado pela virada com curso do Alan Nicholas
- Sinal 4 ✅: Alan Nicholas nomeado, 8020 (primeira turma), concessionária como contexto
- **História âncora:** `jornada-profissional.md` — "Conheci a IA na Volkswagen (do jeito certo)"

---

### Contraexemplos ⚫ NULA (≥3)

**Contraexemplo ⚫-1: "5 gatilhos de fechamento para vendas consultivas B2B"**
- Por que parece tentador: fala de vendas — tema que Thiago domina
- Por que é ⚫: Sinal 1 ausente (nenhum verbo pessoal — são comandos), Sinal 3 = Tutorial, Sinal 2 = Tutorial Puro
- Post resultante correto: lista curada de gatilhos, sem história âncora
- Teste rápido: existe uma cena do Thiago onde esses 5 gatilhos aparecem como fatos? Não — são técnicas abstratas

**Contraexemplo ⚫-2: "Como o algoritmo do LinkedIn distribui conteúdo em 2025"**
- Por que parece tentador: Thiago faz conteúdo no LinkedIn — parece relevante
- Por que é ⚫: Sinal 1 ausente, Sinal 2 = Benchmark Real / técnico externo, Sinal 3 = Factual Puro
- Post resultante correto: post informativo sobre funcionamento do algoritmo, sem história âncora
- Teste rápido: existe uma cena do Thiago onde o algoritmo do LinkedIn é o personagem da história? Não

**Contraexemplo ⚫-3: "Taxa de conversão média de cold email no Brasil é X%"**
- Por que parece tentador: Thiago trabalha com outbound e tem experiência com prospecção
- Por que é ⚫: dado é externo (benchmark de mercado), sem âncora em experiência pessoal específica
- Post resultante correto: post de dados/educação com curadoria de benchmarks
- Nota de cautela: se a subpauta fosse "meu funil de cold email deu X% de conversão em Y meses", seria 🔴 (números pessoais com período)

---

## Regra de Tie-Break

**Quando sinais conflitam, qual prevalece?**

> **Verbo pessoal explícito (Sinal 1) > Fonte de tese (Sinal 2)**

**Situação de tie-break mais comum:** subpauta tem fonte 🟡 (Skills em Produção) mas o hook tem verbo pessoal forte.

**Exemplos:**

| Situação | Sem tie-break | Com tie-break | Resultado final |
|----------|--------------|---------------|-----------------|
| Fonte: Skills em Produção + Verbo: "quando eu errei ao aplicar essa técnica" | 🟡 | Sinal 1 forte sobe | 🔴 |
| Fonte: Falha Documentada + Sem verbo pessoal no hook | 🔴 | Sinal 1 ausente baixa | 🟡 |
| Fonte: Benchmark + Verbo pessoal parcial | ⚫ | Sinal 2 Benchmark trava subida | ⚫ |

**Por quê esta regra?**
A Fonte de tese pode ser mal inferida pelo agente (subpauta pode parecer factual na formulação mas ser experiencial na intenção). O verbo pessoal explícito no hook é o sinal mais objetivo e menos ambíguo — quando está lá, preserva a intenção narrativa do criador.

---

## Como Usar Este Documento

1. Receber a subpauta ou hook embrionário
2. Aplicar Sinal 1 (verbo pessoal): está presente?
3. Consultar a Tabela de Decisão Rápida com Fonte de Tese + Tipo de Proposição
4. Verificar Sinais 3 e 4 para confirmar ou ajustar
5. Aplicar Regra de Tie-Break se resultado for ambíguo
6. Se resultado = 🔴 ou 🟡: invocar `historia-thiago` subagent
7. Se resultado = ⚫: pular busca, produzir post sem âncora narrativa

---

*Documento criado para HISTORIA-001. Referenciado em `_index.md`.*
*Mantido como single source of truth — qualquer mudança no critério deve ser feita aqui.*
