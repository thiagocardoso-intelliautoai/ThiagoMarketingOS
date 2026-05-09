# Diagnóstico — Refatoração Estratégica dos Squads LinkedIn

> **Autor:** Atlas (Analyst) · **Data:** 2026-05-06 · **Formato:** lado-a-lado por peça (Passo 1.1 c)
> **Insumos:** `linkedin-algorithm-2026-reference.md` (v2, mai/2026) + `aiox-project/docs/handoff-refatoracao-estrategica-squads-linkedin.md`
> **Inputs travados:** ~1.000 conexões · postura "otimizar primeiro / cortar quando fizer sentido" · Regra de Ouro (algoritmo OU experiência) · cenário-alvo realista A ou B
> **Status:** Aguarda aprovação do Thiago no cenário recomendado e na decisão sobre Fases 2–4.

---

## Resumo executivo (3 frases)

1. **Cenário recomendado: B — Otimizar e enxugar.** Mantém o sistema, alinha prompts ao algoritmo 2026, corta variantes que não passam na Regra de Ouro, e ataca o gap mais caro: o squad de capa (formato vencedor para <5K) está subotimizado e o de carrossel está sobre-otimizado.
2. **Fases 2–4 (architect/pm/sm) são desnecessárias.** O trabalho é deletar arquivos, editar prompts, adicionar 1 coluna no Supabase e atualizar `CLAUDE.md` — vai direto para `/dev`. Única exceção: se você decidir cortar matéria-colab por completo, vale 30 min com `/data-engineer` antes.
3. **Maior alavanca de ponteiro (curto prazo):** redirecionar tempo do carrossel para capa (com variante multi-image autoral) e introduzir a label `lead-magnet` para parar de violar §6.2 do algoritmo (CTA bait no texto).

---

## 1. Tabela mestre — veredito peça por peça

> Legenda — Veredito: **MANTER** (passa nos dois testes) · **MANTER+OTIMIZAR** (passa em 1, otimizar para passar nos 2) · **SIMPLIFICAR** (passa em 1 mas com gordura) · **FUNDIR** (passa em 1 mas duplica outra peça) · **MATAR** (não passa em nenhum) · **VERIFICAR USO** (passa-no-papel mas suspeito de peso morto)

### 1.1. Squads (7 atuais)

| # | Peça | Teste algoritmo (2026) | Teste experiência | Veredito | Justificativa em 1-2 frases |
|---|------|------------------------|--------------------|----------|------------------------------|
| 1 | **pesquisa-conteudo-linkedin** | ✅ Forte — onde nasce o texto. Topical DNA (§7.1), dwell-time hooks (§3.1), evita bait (§6.2). | ✅ Crítico — sem ele, Thiago pesquisa e escreve do zero. | **MANTER + OTIMIZAR** | Core do sistema. Primeiro alvo de update estratégico (prompts vs §3, §6, §7). |
| 2 | **capas-linkedin** | ✅ **Maior alavanca hoje** — §5.0: imagem autoral domina <5K em reach E engagement. | ✅ Rápido produzir vs carrossel. | **MANTER + OTIMIZAR (prioridade #1)** | Subotimizado: 5 estilos diluem foco e há risco de virar "single-image stock" (§6.7). |
| 3 | **carrosseis-linkedin** | ⚠️ Fraco para <5K (§5.0 — vencedor 20K+). Ainda gera saves para conteúdo educacional. | ⚠️ Caro de produzir (4 estilos × N slides × render × PDF). | **SIMPLIFICAR + PRIORIDADE BAIXA** | Não cortar — saves de educação ainda valem (§3.1). Mas reduzir estilos e tirar do default. Reavaliar ao cruzar 5K. |
| 4 | **seed-pautas-centrais** | ✅ Crítico — §7.1 (3-4 pilares, 80%, 90 dias) é o cerne do Topical DNA. | ✅ Sem ele, Thiago inventa pauta toda vez. | **MANTER + OTIMIZAR** | Forçar **teto explícito de 4** + regra de **80% aderência** + janela de **90 dias** no prompt do estrategista. |
| 5 | **seed-lista-distribuicao** | ➖ Indireto — matéria-colab é estratégia de network, não formato com peso no 360Brew. | ❓ Depende de uso real. | **VERIFICAR USO** | Se Thiago não rodou matéria-colab nos últimos 90 dias, peça morta. Decisão tua, não do algoritmo. |
| 6 | **briefing-materia-colab** | ➖ Indireto. | ❓ Idem. | **VERIFICAR USO + FUNDIR** | Se matéria-colab sobreviver, fundir com #7 (briefing → criar é 1 fluxo, não 2 squads). |
| 7 | **criar-materia-colab** | ➖ Indireto. | ❓ Idem. | **VERIFICAR USO + FUNDIR** | Recebe ângulo do #5 e produz matéria. Pode absorver o briefing do #6 sem perda. |

**Decisão pendente do Thiago:** matéria-colab (#5, #6, #7) — usa de verdade ou está parado? Se parado → corte total dos 3 squads. Se usa → fusão de #6 em #7.

### 1.2. Estilos visuais — Capas (5 atuais)

> §5.0 + §6.7 do algoritmo: para <5K conexões, **imagem autoral** domina; **single-image stock genérico** sofre penalidade. A pergunta para cada estilo é: gera imagem autoral com peso visual próprio?

| Estilo | É autoral? | Risco "stock genérico"? | Veredito | Justificativa |
|--------|------------|--------------------------|----------|----------------|
| **Rascunho no Papel** | ✅ Sim — foto real de papel + desenho à lápis | Baixo (assinatura visual única) | **MANTER (top)** | Anti-AI explícito (§6.1), peso visual próprio, alto dwell. |
| **Pessoa + Texto** | ✅ Sim — foto real do Thiago + texto | Baixo (face nos primeiros 3-4s — §5.3 boost) | **MANTER (top)** | Maior sinal de autenticidade. Inverte penalidade single-image (§6.7). |
| **Micro-Infográfico** | ⚠️ Depende — pode virar gráfico genérico | Médio | **SIMPLIFICAR ou FUNDIR** | Manter só se tem dado real (§7.5 — específicos recompensam). Senão fundir como variante de Pessoa+Texto. |
| **Print de Autoridade** | ✅ Sim — screenshot estilizado de fonte real | Baixo (cita fonte = §7.5) | **MANTER** | Útil quando o post defende tese com prova externa. |
| **Quote Card** | ❌ Tipografia genérica sem peso autoral | **Alto** (§6.7 — pena 30% médio) | **MATAR** | É o caso clássico de single-image stock. Frase do Thiago em fundo bonito ≠ imagem autoral. |

**Adicionar (1 novo):**

| Estilo novo | Justificativa algoritmo |
|-------------|--------------------------|
| **Multi-Image Autoral (3+ fotos)** | §6.7 — multi-image reverte penalidade single-image. Para posts com 3+ momentos/cenas/exemplos. Variante natural de "Pessoa+Texto" estendida. |

**Resultado capas:** 5 → **3 (Rascunho, Pessoa+Texto, Print Autoridade) + 1 novo (Multi-Image)** = **4 estilos finais**.

### 1.3. Estilos visuais — Carrosséis (4 atuais)

> §5.2: documents performam quando há trust acumulado e save rate alto. Para <5K, é formato secundário. Critério aqui: o estilo tem assinatura própria do Thiago, ou é template genérico?

| Estilo | Diferenciação | Veredito | Justificativa |
|--------|---------------|----------|----------------|
| **Twitter-style** | ✅ Print de autoridade em fundo preto | **MANTER** | Funciona para validação de tese (§7.5). Único com personalidade visual forte. |
| **Editorial Clean** | ⚠️ Tipografia bold + whitespace — bonito mas genérico | **SIMPLIFICAR** | Cabe como default neutro. Manter só se virar único "estilo limpo" (absorver Data-Driven). |
| **Data-Driven** | ⚠️ Números gigantes + barras | **FUNDIR em Editorial Clean** | É o mesmo Editorial Clean com layout numérico. Não precisa de squad/template separado. |
| **Notebook Raw** | ✅ Anti-AI (§6.1) — papel craft, escrita manual | **MANTER (com cuidado)** | Diferenciação alta, mas alto custo de produção. Manter para conteúdo "história/desabafo", não educacional. |

**Resultado carrosséis:** 4 → **3 (Twitter-style, Editorial Clean — absorvendo Data-Driven, Notebook Raw)**.

### 1.4. Tasks/agentes/dados internos — cortes específicos

| Caminho | Status | Veredito |
|---------|--------|----------|
| `pesquisa-conteudo-linkedin/tasks/03-aprofundamento.md` | Marcado DEPRECIADO no `squad.yaml:114` | **DELETAR** + remover do yaml |
| `pesquisa-conteudo-linkedin/tasks/08-revisao-qualidade.md` | Marcado DEPRECIADO em `squad.yaml:130` | **DELETAR** + remover do yaml |
| `pesquisa-conteudo-linkedin/tasks/05-planejamento-mensal.md` (Modo 5) | Gera 12 posts pré-planejados | **VERIFICAR USO** — calendário rígido conflita com §7.1 (recência/relevância). Se Thiago não usa há 60 dias → corte. |
| `carrosseis-linkedin/templates/data-driven-base.html` | Estilo a fundir | **DELETAR** (absorvido em Editorial Clean) |
| `capas-linkedin/templates/quote-card.html` | Estilo a matar | **DELETAR** |
| `pesquisa-conteudo-linkedin/data/lead-magnet-template.md` | Existe template legacy | **REESCREVER** seguindo §6.10 (composição limpa: asset dentro do post OU inbound, sem CTA bait no texto) |
| `briefing-materia-colab/` (squad inteiro) | Se mat-colab sobreviver | **FUNDIR em criar-materia-colab/** como step 0 |

### 1.5. Content Command Center (CCC)

| Aspecto | Teste algoritmo | Teste experiência | Veredito |
|---------|-----------------|--------------------|----------|
| **Histórico de posts (vitrine)** | ➖ Indireto | ✅ Sem ele, Thiago perde rastreabilidade | **MANTER** |
| **Geração de prompts pré-formatados (dispatcher)** | ➖ Indireto | ✅ Economiza 5-10 min por post | **MANTER** |
| **Persistência de carrosséis/capas via CLI** | ➖ Indireto | ✅ Source-of-truth single | **MANTER** |
| **Falta hoje:** campos `lead_magnet`, `lead_magnet_resource`, `cta_arte` | ✅ §6.2/§6.10 — viabiliza CTA-na-arte | ✅ Tira o atrito de "esquecer de marcar" | **ADICIONAR** |

**Veredito CCC:** **MANTER + ADICIONAR campos de label**. Não vira vitrine pura, não morre. Cenário D descartado.

---

## 2. Cenário recomendado — **B (Otimizar e enxugar)**

### Por quê B (e não A, C, D, E)

- **A (otimizar tudo no lugar):** insuficiente. Os 5 estilos de capa, 4 de carrossel, os 3 squads de matéria-colab e tasks deprecadas são gordura mensurável que viola a Regra de Ouro. Manter "porque já existe" é sunk cost.
- **C (colapsar para 1-2 squads):** excessivo. seed-pautas e capas têm passagem clara nos dois testes. Colapsar perderia capacidade que volta a importar quando a base crescer (>5K → carrossel volta).
- **D (software como vitrine):** descartado. CCC acelera o Thiago hoje (geração de prompt, dispatcher). Tirar produção do CCC adiciona atrito sem ganho algorítmico.
- **E (híbrido):** o B já é híbrido — corta o que não passa, otimiza o que passa.

### O que B significa concretamente

- **Corta:** Quote Card, Data-Driven, 2 tasks deprecadas, possivelmente Modo 5 e os 3 squads de matéria-colab (pendente sua decisão).
- **Otimiza:** prompts/templates de pesquisa-conteudo, capas e seed-pautas alinhados ao algoritmo 2026 com referência explícita a `linkedin-algorithm-2026-reference.md` no commit.
- **Adiciona:** estilo Multi-Image, label `lead-magnet` ponta a ponta, teto explícito de 4 pilares no seed-pautas.
- **Reposiciona:** carrossel sai do default, vira exceção para conteúdo educacional/framework.

---

## 3. Design da label `lead-magnet` (resposta ao Passo 1.6 do handoff)

### 3.1. Onde mora

**Camada 1 — Supabase (`posts` table):**
```sql
ALTER TABLE posts ADD COLUMN lead_magnet boolean DEFAULT false;
ALTER TABLE posts ADD COLUMN lead_magnet_resource text NULL;  -- "framework de prospecção em 5 etapas"
ALTER TABLE posts ADD COLUMN cta_arte text NULL;              -- "Comente FRAMEWORK pra receber na DM"
```

**Camada 2 — Front-matter do markdown** (`output/post-final.md`):
```yaml
---
title: "..."
pillar: A
lead_magnet: true
lead_magnet_resource: "framework de prospecção em 5 etapas"
cta_arte: "Comente FRAMEWORK pra receber na DM"
---
```

### 3.2. Como o Thiago aciona

**Opção preferida (menor atrito):** Step 0 do `pesquisa-conteudo-linkedin` (modo seleção) acrescenta 1 pergunta:
> "Este post é lead magnet? (s/N) Se sim, qual o recurso e qual o CTA-na-arte?"

**Alternativa (paralela):** UI do CCC tem checkbox "Este post é lead magnet?" + 2 campos. Quando o Thiago cola o prompt já gerado, os campos viajam dentro do prompt. Pode coexistir com o Step 0.

### 3.3. Como squads downstream consomem

- **capas-linkedin** lê o front-matter do post. Se `lead_magnet: true`:
  - Templates Pessoa+Texto, Multi-Image, Print Autoridade ganham **variante "com CTA"** que injeta `cta_arte` no canto inferior (faixa discreta, não bait visual).
  - Rascunho no Papel: CTA pode entrar como anotação "à mão" — mantém autenticidade.
- **carrosseis-linkedin** idem, mas o CTA entra **no último slide** (já é convenção de carrossel).
- **Default seguro:** se `lead_magnet` ausente ou false → comporta-se igual hoje, sem CTA.

### 3.4. Texto do post (regra dura)

Quando `lead_magnet: true`, o **Redator** (`pesquisa-conteudo-linkedin/agents/redator.md`) é instruído a **NÃO mencionar** o recurso no body, **NÃO usar** "Comente X que mando", **NÃO colocar** link externo. O CTA vive **só na arte**. Isso é a defesa contra §6.2 (NLP de bait) e §6.4 (link externo).

### 3.5. Persistência no CCC

CCC mostra badge "📌 Lead Magnet" nos posts marcados, com tooltip do recurso. Métrica futura: comparar reach/save rate de posts lead-magnet vs não-lead-magnet (não escopo agora, mas o schema viabiliza).

---

## 4. Mudanças sem código (só prompts/templates/docs)

> Maioria do trabalho mora aqui. Tudo isso pode ser executado pelo `/dev` em uma sessão.

1. **`pesquisa-conteudo-linkedin/data/linkedin-strategy.md`** — adicionar seção "Algoritmo 2026: o que premia/suprime" com referências a §3, §6, §7.
2. **`pesquisa-conteudo-linkedin/agents/redator.md`** — instruir explicitamente: zero "comente X que mando", zero link externo no body, hashtags 0-3, sem polls, sem "It's not just X, it's Y" (§6.1).
3. **`pesquisa-conteudo-linkedin/data/hook-structures.md`** — auditar 9 estruturas vs §3.1 (dwell time hooks) e §6.1 (padrões anti-AI). Cortar as que viraram clichê de LLM.
4. **`pesquisa-conteudo-linkedin/data/lead-magnet-template.md`** — reescrever conforme §6.10 (composição limpa, sem CTA bait, asset dentro do post OU inbound).
5. **`seed-pautas-centrais/agents/estrategista.md`** — incluir regras §7.1: teto 4 pilares, 80% aderência, janela 90 dias, alerta se conteúdo sai do DNA.
6. **`capas-linkedin/data/visual-styles.md`** — remover Quote Card, adicionar Multi-Image Autoral, cada estilo com nota anti-AI (§6.7).
7. **`carrosseis-linkedin/data/visual-styles.md`** — remover Data-Driven (absorvido), reposicionar squad como "secundário" no header.
8. **`CLAUDE.md` (raiz)** — atualizar tabela de slash commands (se squads de matéria-colab forem cortados), atualizar count de estilos.
9. **READMEs de cada squad** — alinhar com novo estado.

---

## 5. Mudanças que precisam de código

> Tudo abaixo cabe em **1 story de `/dev`** (ou 2 no máximo). Nenhuma exige `/architect`.

1. **DELETE de arquivos** — tasks deprecadas, templates Quote Card / Data-Driven, possivelmente Modo 5, possivelmente os 3 squads de matéria-colab.
2. **MIGRATION Supabase** — 3 colunas novas em `posts` (lead_magnet, lead_magnet_resource, cta_arte). Idempotente.
3. **CCC frontend** — campo lead-magnet no formulário de criação/edição de post + badge na vitrine.
4. **CLI `save-post-cli.js`** — aceitar flags `--lead-magnet`, `--lead-magnet-resource`, `--cta-arte`.
5. **Templates HTML novos** — variantes "com CTA" dos 3 estilos de capa que usam CTA-na-arte (Pessoa+Texto, Multi-Image, Print Autoridade) + último slide com CTA dos carrosséis.
6. **Step 0 do pesquisa-conteudo** — adicionar perguntas da label, escrever no front-matter.
7. **Designer de capa/carrossel** — ler front-matter, escolher variante.

---

## 6. Decisão sobre Fases 2–4

**RECOMENDAÇÃO EXPLÍCITA: pular Fases 2 (architect), 3 (epic) e 4 (sm). Ir direto para Fase 5 com `/dev`.**

### Por quê

- **Sem mudança arquitetural real.** Não há repensar de pipeline, persistência ou estrutura de dados além de 3 colunas idempotentes. Não justifica `/architect`.
- **Sem epic.** O trabalho cabe em 1-2 stories de `/dev`. O handoff já alerta (§5): "se sair daqui com mais de 3 epics, alguma coisa está errada".
- **Sem multi-story.** O handoff já é o brief. Criar story de `/sm` é cerimonial.

### Exceção (única) que ativaria architect

Se você decidir **cortar matéria-colab por completo** (3 squads + scripts + tabelas relacionadas no CCC), vale **30 minutos com `/data-engineer`** para auditar dependências no schema antes de deletar. Não é Fase 2 inteira — é uma mini-consulta.

### Plano de voo proposto

```
/analyst (agora — esperando aprovação)
    ↓
[opcional, 30 min] /data-engineer — audita dependências matéria-colab
    ↓
/dev — executa cortes + label + alinhamento ao 2026
    ↓
/devops — push + PR
```

---

## 7. Atrito atual do Thiago (inferido — confirma ou corrige)

Não tive como observar uso real, então abaixo são hipóteses fortes:

1. **Decisão paralela "qual squad uso agora?"** — 7 squads é demais para uma cabeça segurar. Se cortar matéria-colab → 4. Sensação de "menos sistema" sem perda de capacidade.
2. **9 escolhas de estilo (5 capa + 4 carrossel) por post** — excesso. Pós-corte: 4 + 3 = 7 escolhas, e carrossel sai do default.
3. **Tasks DEPRECIADO ainda no yaml** — confunde a leitura. Limpar.
4. **Esquecer de marcar lead magnet** — hoje não tem como marcar; squad downstream não sabe; CTA fica errado. Label resolve.
5. **Modo 5 (planejamento mensal de 12 posts)** — suspeito de gerar 12 posts mortos por inércia. Algoritmo premia recência semântica, não calendário rígido. Se você não usa há 60+ dias, corte.
6. **3 squads para matéria-colab** — se você roda 1× por mês ou menos, é peso morto cognitivo. Corta tudo. Se roda 1×/semana, fundir briefing → criar.

---

## 8. Riscos de overengineering na execução

Para o `/dev` ficar de olho:

1. **Não criar "modo light" de squads cortados.** Se mata Quote Card, mata. Não vira "Quote Card v2 simplificado".
2. **Não adicionar agente novo.** A label não pede agente novo — é instrução no Redator + leitura no Designer.
3. **Não criar abstração para "variante com/sem CTA".** É um if no template. Não vira sistema de variantes parametrizadas.
4. **Não migrar dados antigos.** Posts existentes ficam com `lead_magnet=false` (default). Não tem retro-marcação.
5. **Não esquecer de atualizar `CLAUDE.md`.** Tabela de slash commands precisa refletir estado pós-corte. Sem squads fantasmas.
6. **Não introduzir testes para a label.** É 3 colunas e 1 if. Smoke manual basta.

---

## 9. Perguntas pendentes (preciso de resposta sua antes de fechar)

1. **Matéria-colab — você roda?** (a) Sim, frequente → mantém + funde briefing em criar. (b) Sim, raro → mantém os 3 hibernados. (c) Não/quase nunca → corte total dos 3.
2. **Modo 5 (planejamento de 12 posts)** — usa ou parou? Se parou → corte.
3. **Quote Card — concorda com matar?** Se você usa muito, podemos converter em variante de Print de Autoridade em vez de cortar.
4. **Data-Driven (carrossel)** — concorda com fundir em Editorial Clean?
5. **Confirma cenário B?** Se sim, libero o brief para o `/dev` rodar.

---

## 10. Aderência à Regra de Ouro (auto-auditoria)

Cada recomendação acima foi marcada com:
- ✅ se passa no teste de algoritmo (sinal claro em `linkedin-algorithm-2026-reference.md`)
- ✅ se passa no teste de experiência (reduz tempo/atrito do Thiago)

Adições novas (label, estilo Multi-Image, regra de 80% aderência) passam em **pelo menos um** com argumento forte (referenciado às seções 5.0/6.10/7.1) e **não reintroduzem overengineering** (zero novos agentes, zero novos squads, zero novas abstrações).

— Atlas, investigando a verdade 🔎
