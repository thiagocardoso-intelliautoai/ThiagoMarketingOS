# Handoff: Refatoracao Estrategica dos Squads LinkedIn

> **Para:** Analyst (Alex) primeiro. Architect (Aria), Scrum Master (River) e Dev (Dex) **somente se a Fase 1 concluir que precisa**.
> **Contexto:** Reavaliacao completa do sistema de producao de conteudo LinkedIn para Thiago C. Lima / Winning Sales.
> **Objetivo central:** Otimizar a estrategia dos squads ao algoritmo 2026 do LinkedIn **e** deixar a experiencia do Thiago mais rapida e eficaz. A pergunta-guia e: "Como o Thiago produz conteudo melhor com menos atrito?"
> **Status:** Documento de handoff. Nao executar nenhuma fase sem comando explicito.

---

## 0. Postura: Otimizar Primeiro, Cortar Quando Fizer Sentido

Este projeto **nao e um redesign do zero**, mas tambem **nao e protecao do que ja existe**.

O Thiago disse com clareza:

> "Minha opiniao nao e matar os squads nem deixar de usar o software. As vezes ta um overengineer, mas nao tenho problemas com a plataforma agora — ela so nao ta muito otimizada estrategicamente. E isso que eu quero resolver, principalmente com a nova versao da minha estrategia baseada no algoritmo do LinkedIn, e tambem trazer uma experiencia melhor pra mim, mais rapida e eficaz. A licenca pra excluir esta no documento porque nao quero que voce se limite — mas nao necessariamente precisa excluir algo."

Traducao operacional para o Analyst:

- **Default e manter e otimizar.** Cortes acontecem quando ha justificativa clara, nao por gosto de simplificar.
- **Licenca de cortar continua valida** — incluindo squads inteiros, agentes, ou ate o software, se a Fase 1 demonstrar que isso melhora a experiencia E o resultado dos posts. Nao se limite por respeito ao que ja existe.
- **A regua final e dupla:** (1) o post performa melhor sob o algoritmo 2026 e (2) o Thiago gasta menos tempo e atrito pra produzir.

### Cenarios validos de output

A Fase 1 deve avaliar estes cenarios sem viés a priori:

| Cenario | Descricao |
|---------|-----------|
| **A — Otimizar tudo no lugar** | Estrutura atual permanece, prompts/templates/agentes recebem update estrategico baseado no algoritmo 2026. Cortes pequenos onde houver overengineering claro. |
| **B — Otimizar e enxugar** | Estrutura permanece, mas alguns squads/agentes/etapas sao removidos por nao mexerem ponteiro nem ajudarem o Thiago. |
| **C — Colapsar para 1-2 squads + manter software** | Maioria dos squads vira historia. CCC continua. Producao fica focada em poucos pipelines fortes. |
| **D — Software como vitrine** | CCC vira repositorio visual; producao sai dos squads. So aceitavel se a Fase 1 mostrar que isso e mais rapido E mais eficaz pro Thiago. |
| **E — Hibrido** | Combinacoes dos anteriores. |

A expectativa **realista** do usuario e algo entre **A** e **B** — mas a Fase 1 nao pode decidir isso antes da analise.

### Regras anti-overengineering (sem virar anti-sistema)

- Otimizar > demolir. Demolir > preservar por inercia.
- "Mais simples e rapido pro Thiago" e criterio, mas "menos sistema" sem ganho operacional nao e virtude.
- Nenhuma feature/squad/agente sobrevive sem responder: "isso ajuda no algoritmo OU economiza tempo do Thiago?". Se nao, candidato a corte.
- Nenhuma feature/squad/agente novo entra a menos que responda a mesma pergunta com sim claro.

---

## 1. Insumos Obrigatorios

A Fase 1 **nao pode** comecar sem ler estes dois documentos por inteiro:

1. **`linkedin-algorithm-2026-reference.md`** (raiz do projeto) — descricao mecanica do algoritmo atual do LinkedIn (360Brew, sinais, pesos, formatos, supressoes, recompensas). Toda recomendacao de squad precisa ser justificada contra este documento.
2. **A propria opiniao do usuario** sobre onde o sistema atual ajuda e onde estorva. O Thiago vai mandar isso por escrito antes da analise comecar. Se nao chegou, **pedir antes de comecar**.

---

## 2. Restricoes Estrategicas Conhecidas (input do usuario)

Estas sao decisoes ja tomadas pelo usuario. Nao questionar, **incorporar**.

### 2.1. Decisoes guiadas pelo algoritmo, nao por preferencia

Hoje existem 4 estilos de carrossel e 5 estilos de capa no sistema. **Reduzir.** Manter so o que tem evidencia de performar pelo algoritmo 2026, nao o que parece bonito. A Fase 1 precisa propor o corte com base na secao 5 do doc do algoritmo (formato vencedor por tamanho de base, dwell time, save rate, document vs image).

### 2.2. Tamanho da base do Thiago: ~1.000 conexoes (dado fechado)

**Nao perguntar de novo. Usar como input.**

A secao 5.0 do doc do algoritmo mostra que o formato vencedor **inverte conforme tamanho de seguidores**:
- <5K seguidores: **imagem autoral** (single ou multi) vence em reach E engagement
- 5K-20K: misto (testar imagem + carrossel)
- 20K-50K: document/carrossel vence
- 50K+: document/carrossel vence forte

Com ~1.000 conexoes, o Thiago esta na faixa onde **imagem autoral domina**. Implicacoes diretas para a Fase 1:

- O **squad de capa** (imagem unica) e o formato visual com **maior probabilidade de mexer ponteiro hoje** — desde que a imagem seja autoral, com peso visual proprio (nao stock generico).
- O **squad de carrossel** nao e o formato vencedor para essa base. Isso **nao significa cortar automaticamente** — pode permanecer como formato secundario para conteudo educacional/framework (que ainda gera saves), mas perde prioridade estrategica e de tempo de producao.
- A Fase 1 deve recomendar como balancear: % de posts em imagem autoral vs carrossel vs texto puro, dado ~1.000 conexoes hoje, com nota de quando reavaliar (ex: ao cruzar 5K).
- Multi-image (3+ autorais) reverte a penalidade de single-image stock e pode ser uma variante do squad de capa que vale a pena explorar.

### 2.3. CTA na arte, nao no texto — via label `lead-magnet` entre squads

Para evitar deteccao de engagement bait pelo NLP do 360Brew (secao 6.2 do doc do algoritmo), o padrao desejado e:

- O **texto do post nao menciona** lead magnet, nao pede comentario padronizado, nao usa "Comente X que mando".
- O CTA "Comente algo para receber [recurso]" entra **dentro da arte** (capa, ou ultimo slide do carrossel), **nao no texto**.
- Resultado esperado: o classificador nao le a imagem como bait, e os comentarios chegam variados (nao padronizados), reforcando sinal de conversa autentica.

#### Problema mecanico (apontado pelo usuario)

Se o squad de capa/carrossel so recebe o **post como input** e o post nao menciona o lead magnet, o squad **nao tem como saber** que aquele post e de lead magnet — e portanto nao tem como decidir injetar o CTA na arte.

#### Solucao recomendada (a Fase 1 valida ou propoe melhor)

Introduzir uma **label `lead-magnet`** que viaja com o post entre squads:

- O squad que cria o **texto do post** (hoje `pesquisa-conteudo-linkedin`) recebe do Thiago o sinal de que aquele post **e** um lead magnet, e qual o recurso (ex: "framework de prospeccao em 5 etapas").
- O squad emite o post **sem CTA no texto** + um campo de metadata: `lead_magnet: true`, `recurso: "framework de prospeccao em 5 etapas"`, `cta_arte: "Comente FRAMEWORK pra receber na DM"` (ou variante natural).
- Os squads **downstream** (capa, carrossel) leem essa metadata. Se `lead_magnet: true`, injetam o CTA na arte (regra do squad). Se `false` ou ausente, operam normal sem CTA.
- O Content Command Center (se sobreviver) tambem deve persistir essa metadata, pra que o post no historico fique rastreavel como "lead magnet".

#### Implicacao para a Fase 1

- Confirmar (ou propor melhor) o protocolo da label: nome do campo, onde mora (front-matter de markdown? campo do squad.yaml? coluna no Supabase?), como e injetado no fluxo, como o Thiago marca isso na origem (no CCC ou no prompt de inicio do squad).
- Garantir que **todo squad downstream** que produz arte sabe ler essa label e tem template/regra pra injetar o CTA. Templates de capa e carrossel devem ter uma variante "com CTA-na-arte" e outra "sem CTA".
- Se a recomendacao for matar carrossel ou capa, a label so precisa funcionar no(s) squad(s) sobrevivente(s).

### 2.4. Topical DNA — 3 a 4 pilares, 80% do conteudo dentro deles

Secao 7.1 do algoritmo: o 360Brew categoriza autoridade por consistencia em 2-4 pilares ao longo de ~90 dias. O squad de seed-pautas-centrais precisa refletir isso explicitamente. Se hoje ele permite N pilares, **forcar teto de 4** e exigir 80% de aderencia. Se isso ja existe, validar.

### 2.5. Lead magnet — composicao, nao categoria

Secao 6.10 do algoritmo: lead magnet nao e penalizado como conceito. O que e penalizado e a composicao bait + link externo + click bounce. A Fase 1 precisa garantir que qualquer squad que produza post com lead magnet siga a composicao limpa:

- Asset entregue **dentro** do post (document) ou via inbound (DM, perfil, newsletter), **nunca** via link externo no body.
- Captura por DM organico (sem CTA padronizado), por inbound de perfil ou por newsletter.
- Sem "comente X" no texto. Se houver CTA, ele esta na arte (ver 2.3).

### 2.6. Formatos em queda — questionar antes de manter

- **Video** (secao 5.3): formato com maior queda em 2026. Se existe ou foi planejado squad de video, justificar fortissimo a permanencia ou cortar.
- **Single-image stock**: penalidade. Se algum squad gera capa generica, cortar ou converter para "imagem autoral".
- **Polls e hashtags >5**: cortar de qualquer template/prompt.

---

## 3. Fase 1: Diagnostico Estrategico com `/analyst`

### Objetivo

Produzir um diagnostico que responda **uma** pergunta:

> Qual e a versao mais simples possivel deste sistema que melhora o resultado dos posts do Thiago no LinkedIn dado o algoritmo 2026?

### Sub-perguntas que o diagnostico precisa responder

1. Quais squads, dos 6 atuais, tem evidencia de mexer ponteiro? Quais existem so por organizacao interna ou por overengineering?
2. O Content Command Center (software) tem papel **operacional** (cria conteudo) ou **de vitrine** (mostra conteudo ja criado)? Qual deveria ter? Onde ele acelera o Thiago e onde ele atrasa?
3. Qual cenario (A/B/C/D/E da secao 0) e o recomendado e por que? (Lembrando: expectativa realista do usuario e A ou B; D so se houver argumento muito forte.)
4. Dado que a base atual e ~1.000 conexoes (imagem autoral domina), como balancear entre squad de capa, squad de carrossel e texto puro? Quando reavaliar essa proporcao?
5. Quais dos 4 estilos de carrossel e 5 estilos de capa sobrevivem ao corte por evidencia algoritmica? (Resposta esperada: poucos. Talvez 1-2 de cada.)
6. Como implementar a label `lead-magnet` (secao 2.3) entre squads? Onde ela mora, como o Thiago a aciona, como os squads downstream a consomem?
7. Onde o Thiago tem **atrito hoje** ao usar o sistema (passos manuais, esperas, copia-cola, decisoes redundantes)? Cada um desses pontos vale uma recomendacao especifica de aceleracao.
8. As fases 2-5 deste handoff (architect, sm, dev) sao **necessarias** ou o trabalho e majoritariamente "atualizar prompts + ajustar templates + deletar overengineering" — caso em que so a Fase 1 + execucao direta pelo Dex bastam?

### Passo 1.1 — Acordar formato do resumao antes de produzir

Antes de entregar o diagnostico, o agente perguntar como o Thiago quer ler. Opcoes a oferecer:

- (a) Decisao primeiro, justificativa depois (recomendacao no topo)
- (b) Walk-through do sistema atual primeiro, depois recomendacao
- (c) Lado a lado: cada squad/peca atual com veredito (manter / fundir / matar / transformar) e justificativa por linha

Esperar aprovacao do Thiago.

### Passo 1.2 — Diagnostico

Depois de aprovado o formato, entregar:

1. Mapeamento atual (squads, agentes, dados, scripts, CCC) com **veredito por peca** (manter / simplificar / fundir / matar).
2. Cenario recomendado entre A-E com justificativa baseada no algoritmo + opiniao do usuario.
3. Lista de cortes especificos: arquivos a deletar, agentes a remover, etapas a colapsar, opcoes de estilo a eliminar.
4. Lista de mudancas operacionais que **nao precisam de codigo** (ajuste de prompt, ajuste de template, ajuste de doc).
5. Lista de mudancas que **precisam de codigo** (e portanto justificam Fases 2-5).
6. Recomendacao explicita: **executar Fases 2-5 ou pular direto para uma sessao de demolicao com `/dev`**?
7. Riscos de overengineering que ainda podem aparecer na execucao e como evita-los.

### Output da Fase 1

Documento em `aiox-project/docs/diagnostico-refatoracao-squads-linkedin.md` (Markdown), curto e acionavel. Se passar de ~10 paginas equivalentes, esta longo demais para o objetivo desta fase.

### Checkpoint

O Thiago precisa aprovar **explicitamente** o cenario recomendado antes de qualquer fase posterior comecar. Se ele discordar do cenario, iterar dentro da Fase 1 ate convergir.

### Prompt de inicio sugerido

```text
/analyst

Use como referencia obrigatoria:
- aiox-project/docs/handoff-refatoracao-estrategica-squads-linkedin.md
- linkedin-algorithm-2026-reference.md

Comece pela Fase 1.

Inputs ja conhecidos (nao perguntar de novo):
- Base atual: ~1.000 conexoes no LinkedIn (faixa onde imagem autoral domina).
- Postura do Thiago: nao quer matar squads nem o software por padrao. Quer otimizar a estrategia ao algoritmo 2026 e tornar a producao mais rapida e eficaz pra ele. Tem permissao pra recomendar cortes — incluindo grandes — se e somente se isso melhorar resultado de post OU experiencia. Cenario realista esperado: A ou B da secao 0.

Antes de produzir o diagnostico, me proponha o formato (a, b ou c da secao "Passo 1.1") e espere minha aprovacao.

Regras:
- Toda recomendacao precisa passar na Regra de Ouro (secao 9): teste de algoritmo OU teste de experiencia.
- Trate o protocolo da label `lead-magnet` (secao 2.3) como item explicito do diagnostico — proponha o desenho concreto.
- Se a sua recomendacao for que as Fases 2-4 (architect/epic/story) sao desnecessarias e pode ir direto pro Dex, diga isso explicitamente.
```

---

## 4. Fase 2 (CONDICIONAL): Direcao Tecnica com `/architect`

**So executar se a Fase 1 recomendar.** Se a refatoracao for majoritariamente "deletar arquivos e atualizar prompts", **pular esta fase e ir direto para a Fase 5 (Dev)**.

### Quando esta fase faz sentido

- Existe mudanca arquitetural real (ex: reestruturar o schema do CCC, mudar persistencia, repensar pipeline).
- Existe risco tecnico que vale planejar antes (ex: migrar dados, quebrar compatibilidade).

### Quando esta fase NAO faz sentido (e deve ser pulada)

- A mudanca e majoritariamente: deletar pastas de squad, remover opcoes de estilo, ajustar prompts dos squads sobreviventes, atualizar `CLAUDE.md`.
- Nenhum esquema de banco muda.
- Nenhum CLI novo precisa existir.

### Output (se executada)

`aiox-project/docs/direcao-tecnica-refatoracao-squads-linkedin.md` com:
- Arquitetura-alvo (so o que muda em relacao ao atual).
- Sequencia tecnica recomendada.
- Itens fora de escopo.

---

## 5. Fase 3 (CONDICIONAL): Epics com `/architect` ou `/pm`

**So executar se a Fase 2 foi executada e identificou blocos de trabalho > 1 dia cada.** Caso contrario, ir para Fase 4 ou 5.

### Cuidado

Se sair daqui com mais de **3 epics**, alguma coisa esta errada. Refatoracao para simplificar nao deveria gerar muito epic.

---

## 6. Fase 4 (CONDICIONAL): Stories com `/sm`

**So executar se houver epic.** Se a refatoracao couber em 1-3 stories diretas, criar as stories sem epic e pular para Fase 5.

### Regras duras

- Maximo de 5 stories no total. Se passar disso, parar e questionar se nao esta dividindo trabalho artificialmente.
- Story de "deletar arquivos X, Y, Z" e legitima e basta — nao quebrar em 3 stories.
- Story de "atualizar prompt do squad sobrevivente para refletir algoritmo 2026" e legitima — nao quebrar em sub-stories de "atualizar agente A", "atualizar agente B".

---

## 7. Fase 5: Execucao com `/dev`

**Esta fase quase sempre acontece.** Pode acontecer direto depois da Fase 1, sem passar por architect/sm.

### Regras de execucao

- Implementar **somente** o que a Fase 1 (e Fases 2-4 se executadas) aprovaram.
- Nao reintroduzir squads, agentes, opcoes de estilo, scripts ou features que foram cortados — mesmo que pareca "facil deixar la por seguranca".
- Toda alteracao em prompt/template/agente que sobreviveu **precisa** referenciar `linkedin-algorithm-2026-reference.md` no comentario do commit (ex: "remove engagement bait do template de post — algoritmo 2026 sec 6.2").
- O `CLAUDE.md` raiz precisa ser atualizado para refletir o novo conjunto de squads/comandos. Se a tabela de slash commands encolher, encolher.
- O `aiox-squads/shared/scripts/` so mantem CLIs de squads que sobreviveram.

### Verificacao final (do proprio Dex antes de fechar)

- [ ] Algum squad/agente/template foi cortado mas o `CLAUDE.md` ainda referencia? Limpar.
- [ ] Algum CLI ficou orfao (squad morto)? Deletar.
- [ ] Algum prompt sobrevivente ainda tem CTA padronizado tipo "Comente X que mando"? Trocar pela variante CTA-na-imagem (se aplicavel).
- [ ] Algum prompt/template ainda gera link externo no body? Trocar por padrao "asset dentro do post" ou "captura por inbound".
- [ ] Hashtags > 5 em algum template? Reduzir para 0-3.
- [ ] Algum squad de video sobreviveu sem justificativa explicita contra a secao 5.3 do algoritmo? Cortar ou exigir justificativa.

---

## 8. Resultado Final Esperado

Ao final, o sistema deve estar em **um** dos estados:

- (a) Mais magro: 1-2 squads, prompts alinhados ao algoritmo 2026, CCC mantido como vitrine, captura por inbound limpa.
- (b) So vitrine: producao saiu do sistema, CCC mostra os posts ja criados, fim.
- (c) Sem sistema: producao volta para Claude Code/ChatGPT direto com prompt forte, CCC desligado.

O que **nao** e resultado aceitavel:

- "Refatoramos e ficou mais bem organizado" sem corte material.
- Mais squads, mais agentes, mais opcoes do que antes.
- Stories sobre reorganizar pasta sem impacto em post.

---

## 9. Regra de Ouro

Toda peca do sistema (squad, agente, etapa, template, opcao de estilo, campo do CCC) tem que passar em **um** dos dois testes pra sobreviver:

1. **Teste de algoritmo:** existe sinal claro no algoritmo 2026 de que essa peca aumenta alcance, autoridade ou conversao?
2. **Teste de experiencia:** essa peca economiza tempo ou reduz atrito do Thiago de forma mensuravel?

Se passa em pelo menos um, **manter** (eventualmente otimizar).
Se passa nos dois, **prioridade de otimizacao**.
Se nao passa em nenhum, **candidato a corte** — mas confirmar com o Thiago antes, porque pode estar servindo a um proposito que o Analyst nao captou.

Para **adicionar** algo novo, exigencia mais alta: a adicao precisa passar em pelo menos um teste com argumento forte e nao reintroduzir overengineering.

---

## 10. Erros a evitar nesta refatoracao

- Tratar este projeto como redesign incremental — nao e, e demolicao seletiva.
- Pular o `linkedin-algorithm-2026-reference.md` e recomendar com base em "boas praticas genericas".
- Criar epic/story para algo que e literalmente `rm -rf squad-x/`.
- Manter squad porque "ja existe" — sunk cost nao e argumento.
- Adicionar agente novo ou template novo "para garantir" — qualquer adicao precisa passar nos tres testes da secao 9.
- Esquecer de atualizar o `CLAUDE.md` raiz depois do corte — usuario fica com slash commands fantasmas.
