# Handoff — Thiago Marketing OS v2

> Documento de transição entre Claudes. Você é o próximo na linha.
> O Claude anterior ajudou o Thiago a consolidar a estratégia da v2.
> Seu papel agora: co-piloto na execução — decompor estratégia em átomos, atualizar squads no Antigravity, implementar mudanças visuais/funcionais na plataforma.
>
> **Leia este documento inteiro antes de propor qualquer coisa.** Foi escrito pra você entrar operando sem o Thiago precisar repetir contexto.

---

## 0. Estrutura de arquivos e ordem de leitura

Este handoff fica dentro da pasta `copilot/` no próprio repositório do projeto Thiago Marketing OS. A pasta é **temporária** — existe apenas durante a transição v1 → v2. Será arquivada quando a Etapa 3 terminar (átomos estratégicos migrados pro banco, sessão "Estratégia" na plataforma funcionando).

Estrutura:

```
ThiagoMarketingOS/                     ← projeto real no Antigravity
├── [código existente]
├── copilot/
│   ├── README.md                      ← ponto de entrada
│   ├── handoff.md                     ← este arquivo
│   ├── estrategia/
│   │   ├── 01-fundacao.md
│   │   ├── 02-conteudo.md
│   │   ├── 03-alcance.md
│   │   ├── 04-distribuicao.md
│   │   └── 05-lacuna-de-posicionamento.md
│   ├── atomos/                        ← criado na Etapa 0
│   │   └── [átomos decompostos]
│   └── referencias/
│       └── exemplo-lacuna-tallis-gomes.png
```

**Leia tanto este handoff quanto o código real do projeto** (fora de `copilot/`). Propostas que ignorem o banco atual, o fluxo de squads ou a integração Antigravity↔plataforma vão falhar.

Os **5 docs de `estrategia/`** são fonte de **inicialização do sistema de átomos**, não fonte permanente. Após a Etapa 0 decompor os docs em átomos, os átomos passam a ser a fonte de verdade. Os `.md` ficam arquivados como referência histórica da origem.

---

## 1. Quem é o Thiago e como trabalhar com ele

- Head de Automação e IA na Winning Sales (consultoria de vendas brasileira). 19 anos.
- Comunica em português brasileiro, estilo casual e direto
- **Prefere ser desafiado, não validado.** Pushes back em explicações superficiais.
- **Corta overengineering sem cerimônia.** Se você propuser algo cosmético ou inflado, ele vai te dizer. Seja sucinto e proponha só o que move ponteiro real.
- Testa explicações ativamente — não aceita passivamente. Se você errar uma suposição, ele vai apontar.
- Construtor. Já tem a plataforma rodando em produção, já usa Claude Code, já opera squads no Antigravity. Não trate como iniciante.

**Tom sugerido:** direto, opinativo, calibrado. Marque claramente o que você sabe (certeza), o que você supõe (hipótese, pedir confirmação), e o que você não sabe.

---

## 2. Arquitetura: plataforma ≠ Antigravity

### Thiago Marketing OS (plataforma)
- SPA web (https://thiagomarketingos.vercel.app)
- **Não é um gerador de conteúdo direto.** É um gerador de prompts parametrizados.
- Persistência em banco remoto (regra arquitetural — nada local)
- Integração com API oficial do LinkedIn (agendamento de posts já funciona)

### Antigravity (externo)
- Ambiente onde os squads rodam
- Conversa iterativa entre Thiago e squad até aprovar
- **Configuração, criação e atualização de squads acontece no Antigravity, não na plataforma**

### Fluxo operacional atual
1. Thiago abre plataforma → seleciona card → plataforma gera prompt (parametrizado pelos átomos necessários)
2. Thiago copia prompt → cola no Antigravity
3. Antigravity roda squad, conversa iterativa até aprovação
4. Post/carrossel/capa volta automaticamente pra plataforma

**Regra ferro:** mudança em squad → Antigravity. Mudança de UI, banco, fluxo da plataforma → plataforma. Não misture.

---

## 3. Stack técnica relevante

- **API oficial do LinkedIn integrada** — agendamento de posts já rola
- **Member Post Analytics API** do LinkedIn disponível — engagement counts detalhados + demographics de engajadores (industry, job title, location) + profile activity atribuída por post
- **Banco de dados remoto** — tudo persistido em nuvem, zero estado local
- **OpenClaw** — dependência pro agente autônomo semanal (item em tese, Thiago valida antes)

---

## 4. Arquitetura estratégica — átomos como unidade única

**Decisão chave:** estratégia não é armazenada como documentos narrativos no banco. É decomposta em **átomos estratégicos** — unidades atômicas, campos tipados, editáveis individualmente na UI.

### Por que átomos, não documentos

1. **Squad consome só o que precisa.** Briefing Matéria-Colab precisa de lente + critérios de distribuição + lacuna. Não precisa das 4 regras de conteúdo, nem dos 5 níveis, nem do Alcance. Doc inteiro = tokens desperdiçados + sinal diluído.

2. **Manutenção segura.** Edição de "regra 2" na UI é edição de campo específico. Doc em texto livre = margem de erro ao reescrever parágrafo.

3. **Reúso entre squads.** Lente aparece em 10 squads. Mudou uma vez no átomo, atualiza em todos.

4. **UI mais limpa.** Cada átomo vira cartão/campo visual distinto na sessão "Estratégia".

### Camada única

**NÃO existe camada separada de "documento narrativo" no banco.** Fonte única = átomos. Se Thiago quiser documento narrativo pra alinhar consultor, é gerado a partir dos átomos sob demanda.

Os 5 `.md` atuais em `estrategia/` existem apenas pra **inicializar** o sistema — input pra Etapa 0 decompor em átomos. Depois disso, arquivados.

### Átomos inicialmente previstos

(Lista de referência — Etapa 0 pode ajustar conforme necessário.)

| Átomo | Conteúdo | Fonte no doc |
|---|---|---|
| `brand_lens` | Lente proprietária + contra-quem define | 01-fundacao |
| `flag_anchor` | Bandeira âncora: inimigo, convocação, lastro, teste-por-post | 01-fundacao |
| `flag_sub` | Sub-bandeira: inimigo, convocação, lastro, tese-raiz | 01-fundacao |
| `icp_hypothesis` | Hipótese ICP + perguntas em aberto a descobrir | 01-fundacao |
| `content_sources` | 4 fontes recorrentes de tese (nome + template + matéria-prima) | 01-fundacao |
| `content_rules` | 4 regras de qualidade (cada regra = 1 linha) | 02-conteudo |
| `audience_levels` | 5 níveis de relacionamento (cada nível = 1 linha, com "conteúdo que alimenta") | 02-conteudo |
| `signature_visual` | Default capa + default carrossel + regras de rotação + proporção orientativa + exclusões | 02-conteudo |
| `reach_mechanic` | Mecânica de alcance via meme/evento | 03-alcance |
| `reach_quality_rule` | Régua crítica ("tese sobrevive sem o meme") + janela 24-48h | 03-alcance |
| `distribution_mechanic` | Mecânica matéria-colab G4 adaptada | 04-distribuicao |
| `distribution_gate` | Gate do título pela lente | 04-distribuicao |
| `distribution_subject_profile` | Perfil do sujeito da matéria (rede que inclui ICP, não é o ICP) | 04-distribuicao |
| `distribution_exclusions` | Arquétipos de exclusão (gurus, influencers genéricos, etc.) | 04-distribuicao |
| `distribution_initial_list` | Lista inicial de alvos | 04-distribuicao |
| `positioning_gap` | 4 colunas da lacuna: VOCÊ / MERCADO / SOCIEDADE / LACUNA ENCONTRADA | 05-lacuna |
| `positioning_voice_patterns` | Padrões de voz (idade como consequência, moldura dentro/fora, Skills em Produção com moldura certa) | 05-lacuna |
| `positioning_not_gap` | O que NÃO é lacuna (descartado explicitamente) | 05-lacuna |

### Squad × átomos consumidos

Cada squad declara quais átomos precisa. Plataforma monta system prompt puxando só esses.

| Squad | Átomos que consome |
|---|---|
| **Pesquisa Semanal** (migra pra Tab 1 Pautas) | brand_lens, flag_anchor, flag_sub, content_sources, content_rules, reach_mechanic, reach_quality_rule, positioning_gap, positioning_voice_patterns |
| **Benchmark Concorrentes** (migra pra Tab 1 Pautas) | brand_lens, flag_anchor, flag_sub, content_sources, content_rules, positioning_gap, positioning_voice_patterns |
| **Briefing On-Demand** (fica em Tab 2 Posts) | brand_lens, flag_anchor, flag_sub, content_rules, audience_levels, positioning_gap, positioning_voice_patterns |
| **Escrever Post Direto** (fica em Tab 2 Posts) | brand_lens, content_rules, audience_levels, signature_visual, reach_quality_rule (quando vier de meme/evento), positioning_gap, positioning_voice_patterns |
| **Seed Pautas Centrais** (novo, Etapa 2) | brand_lens, flag_anchor, flag_sub, content_sources, content_rules, positioning_gap |
| **Seed Lista Distribuição** (novo, Etapa 2) | brand_lens, distribution_mechanic, distribution_gate, distribution_subject_profile, distribution_exclusions, positioning_gap |
| **Briefing Matéria-Colab** (novo, Etapa 2) | brand_lens, distribution_mechanic, distribution_gate, signature_visual (parcial: regra "matéria-colab = Editorial Clean"), positioning_gap |

---

## 5. Contexto estratégico — 5 documentos base (fonte de inicialização)

Os 5 documentos abaixo são a base que a Etapa 0 vai decompor em átomos. Sempre que precisar de contexto completo ou racional, volte aos originais em `estrategia/`.

### 5.1 Fundação (`estrategia/01-fundacao.md`)

**ICP (hipótese):** empresário ou operador de negócio com time comercial/marketing que quer usar IA de forma correta, não com hype.

**Lente — "Built, not prompted":** construtor-tradutor. Constrói IA em operação comercial real E traduz o que funciona pra quem toma decisão. Contra guru de prompt, acadêmico teórico, jargão técnico sem tradução.

**Bandeiras:**
- **Âncora — "Anti-prompt, pro-sistema":** IA é sistema construído, não truque. Lastro: Skills e Agents rodando em produção na Winning.
- **Sub-bandeira — "Processo antes de ferramenta":** sistema pressupõe processo claro antes de código. Tese-raiz: *"automação sem redesenho é bagunça mais rápida."*

**4 fontes recorrentes de tese:** Skills em Produção / Benchmark Real / Process Diagnostic Anônimo / Falha Documentada.

### 5.2 Conteúdo (`estrategia/02-conteudo.md`)

**4 regras:** (1) sai melhor do que entrou; (2) destrava decisão, não execução; (3) não existe em outro lugar; (4) embalagem narrativa.

**5 níveis de relacionamento** (loops simultâneos): Desconhecido → Curioso → Seguidor → Engajado → Amplificador.

**Signature visual:** 70% Caderno (Rascunho no Papel pra capa, Notebook Raw pra carrossel). 20% Data-Driven pra benchmark. 10% Quote Card uso cirúrgico.

### 5.3 Alcance (`estrategia/03-alcance.md`)

Meme/evento de massa como hook, tese proprietária no fundo. Régua crítica: *"tese sobrevive sem o meme?"* Janela 24-48h. Caderno é default.

### 5.4 Distribuição (`estrategia/04-distribuicao.md`)

Matéria-colab estilo G4. Gate rígido: sem título-com-lente, sem matéria. Formato: Editorial Clean (caderno **nunca** na matéria-colab). Prioridade de expansão: fora da bolha Winning.

### 5.5 Lacuna de Posicionamento (`estrategia/05-lacuna-de-posicionamento.md`)

| VOCÊ / MARCA | MERCADO | SOCIEDADE | LACUNA ENCONTRADA |
|---|---|---|---|
| Operador de IA de 19 anos, Head em consultoria de vendas B2B. 4 tentativas antes do acerto. Construtor **dentro** de operação viva, não de fora. | 3 polos (construtores técnicos de fora / gurus de vendas tocando IA por cima / influencers genéricos) sem centro. | Empresário B2B cansado de promessa de IA. Demanda reprimida por prova real. | **"O operador construtor que mostra IA rodando por dentro de uma operação B2B real, não de fora vendendo consultoria."** |

**Regras críticas de voz:** idade é consequência de substância, nunca hook. Skills em Produção ganham moldura cuidadosa (DBA generator não pode soar como "automatizei entregável da consultoria" — tem que ser "liberei tempo pra pensamento, não pra digitação").

---

## 6. Diagnóstico da v1 (estado atual da plataforma)

### O que existe hoje

**Tab Create — 5 cards:** Pesquisa Semanal, Benchmark Concorrentes, Briefing On-Demand, Escrever Post Direto, Planejamento Mensal

**Tab Conteúdos:** Lista com filtros Status/Urgência/Tipo, Score % em cada post, Modal Preview com Copiar/Gerar Capa/Gerar Carrossel/Publicar, 5 estilos de capa, 4 de carrossel

### Onde não funciona estrategicamente

1. Create trata todos os tipos de post como fluxos iguais
2. Distribuição (matéria-colab) não existe em lugar nenhum
3. Catalogação narrativa não existe — Pautas Centrais e Subpautas não são entidades persistidas
4. Radar de ICP não existe
5. Estratégia não é editável pelo Thiago — ficou congelada em prompts de squad

---

## 7. Escopo acordado da v2

### 7.1 Regras arquiteturais globais

- **Tudo em banco remoto.** Pautas, Subpautas, Distribuição, Arquétipos, posts, labels, métricas, **átomos estratégicos**. Zero estado local.
- **Estratégia vive em átomos**, não em documentos. Fonte única de verdade.
- **Squads declaram átomos que consomem.** Plataforma monta prompt dinamicamente.

### 7.2 Tab 1 — Pautas (NOVA, dentro de Create)

#### Subaba Distribuição

- Lista persistente: **nome + título da matéria pela lente**, editáveis inline
- Botão "Gerar mais sugestões" → gera prompt → Antigravity → lista volta ao banco
- **Blacklist dinâmica injetada pela plataforma no prompt:** pessoas já na lista + átomo `distribution_exclusions`
- Clicar no nome → gera prompt do Briefing Matéria-Colab

#### Subaba Pautas Centrais

- **Vista de lista hierárquica com drill-down:** Pauta Central → Subpautas
- Cada Pauta mostra: contador de uso + tempo desde último post
- Seed squad gera Pautas e Subpautas
- Edição inline persiste no banco
- Clicar numa Subpauta → prompt parametrizando Escrever Post Direto

**Modelagem:** Pauta Central é chapéu temático ("Skills em produção"). Subpauta é ângulo concreto **já formulado como tese-embrião**. Template de tese NÃO é entidade separada — embutido na formulação da Subpauta.

### 7.3 Tab 2 — Posts (Create existente, refinado)

**Cards que ficam:**
- **Briefing On-Demand** — pesquisa profunda, não passa por Subpauta
- **Escrever Post Direto** — aceita input opcional de Subpauta ou Pessoa de Distribuição. Sem input = `pauta_central: null`. É squad também.

**Cards que saem:**
- Pesquisa Semanal → migra pra Tab 1, função muda pra "gerar candidatos a Subpauta"
- Benchmark Concorrentes → migra pra Tab 1, mesma lógica
- Planejamento Mensal → excluído

#### Mecanismo do label `pauta_central`

Determinístico, via código, sem depender de squad. Clique em Subpauta/Pessoa → plataforma seta label + gera ID único embutido no prompt. Antigravity salva post passando ID. Plataforma faz merge via ID. Squad não precisa saber da label.

### 7.4 Tab 3 — Conteúdos (existente, expandido)

- Filtro adicional por Pauta Central
- **Radar de ICP** — tabela por Pauta Central: (total interações / top 5 cargos de quem engajou / profile activity atribuída). Via API oficial já integrada.

### 7.5 Sessão "Estratégia" (nova)

Espaço dedicado na plataforma pra editar átomos estratégicos. Cada átomo = cartão/campo visual distinto. Edição escreve direto no banco. Squads passam a ler do banco na próxima geração.

Layout guiado pela unidade do átomo, não por cópia dos 5 docs. UI clean, separação visual por tipo de átomo.

### 7.6 Em tese — validar antes de implementar

**Agente autônomo semanal** pra popular Memes / Eventos / Notícias 1x/semana pra alimentar fluxo de Alcance. Dependência: OpenClaw. Validar antes.

---

## 8. Decisões descartadas (NÃO ressuscitar sem argumento novo)

1. Matar o Create e fazer "Pauta Engine" com 6 squads hardcoded — fontes são taxonomia, não workflow.
2. Régua de Qualidade como gate modal antes de Publicar — post é construído no Antigravity.
3. Filtros estratégicos adicionais na Biblioteca (Fonte / Nível / Signature) — cosmético.
4. Inverter defaults do Gerar Carrossel — irrelevante pro ponteiro.
5. Pipeline de Distribuição por alvo com status detalhado — Thiago não quer pipeline elaborado.
6. Bandeira "dentro/fora da bolha Winning" na UI — cosmético.
7. Dashboard de "conversões" vagas ou via scraping externo — vago e overengineering.
8. ICP como input do seed squad de Distribuição — ICP é audiência, não sujeito da matéria.
9. "Setores adjacentes" como critério do squad — vago.
10. Input obrigatório de Pauta Central no Escrever Post Direto — ideia solta é caso legítimo.
11. Painel lateral com inputs estratégicos editáveis na UI da subaba Distribuição — inputs ficam no squad.
12. Radar de ICP incluindo "conexões novas atribuídas a posts" — API oficial não atribui. Substituído por "profile activity atribuída."
13. Pasta `estrategia/` na raiz do projeto — criar estrutura paralela desconecta do código. Solução: `copilot/` temporária.
14. **Duas camadas no banco (docs narrativos + átomos).** Rejeitado — redundância + margem de erro na extração. Solução: camada única de átomos. Docs narrativos são gerados a partir dos átomos sob demanda, se necessário.

---

## 9. Etapas de execução

### Etapa 0 — Decomposição em átomos (NOVA, pré-requisito de tudo)

Antes de tocar em qualquer squad ou UI, decompor os 5 docs estratégicos em átomos.

**Processo:**

1. **Ler os 5 `.md`** em `copilot/estrategia/` com atenção
2. **Para cada átomo previsto na tabela da seção 4:** extrair do doc correspondente, formatar em estrutura tipada (nome, descrição, contra-quem, lastro, exemplo — conforme o átomo pedir)
3. **Salvar em `copilot/atomos/`** como arquivos estruturados. **Formato exato (JSON, YAML, markdown estruturado, 1 arquivo por átomo ou agrupado) é decisão inicial da Etapa 0 — pergunte ao Thiago antes de começar.**
4. **Revisar com o Thiago antes de prosseguir.** Ele vai apontar átomo que ficou vago, redundante, ou mal formulado. **Não pule esse passo.**
5. Átomos aprovados ficam em `copilot/atomos/` até a Etapa 3, quando migram pro banco

**Princípio:** se um átomo está vago demais pra squad usar como input direto, ele está mal decomposto. Átomo bom é auto-suficiente — squad consome ele e já sabe o que fazer sem precisar de contexto extra.

**Nota:** a tabela da seção 4 é **referência inicial**, não cristal. Se durante decomposição você descobrir que "signature_visual" precisa virar 3 átomos separados, ou que dois deveriam ser um, **proponha ao Thiago**. Granularidade certa emerge da decomposição real.

**Pergunta inicial da Etapa 0:** o Thiago prefere decompor todos os átomos de uma vez e revisar em bloco, ou decompor doc por doc e revisar em 5 rodadas menores?

### Etapa 1 — Atualizar os 4 squads existentes

Pesquisa Semanal, Benchmark Concorrentes, Briefing On-Demand, Escrever Post Direto.

**Como o Thiago vai operar:** joga cada squad + átomos relevantes (da seção 4) no input de uma IA revisora, pede análise de configuração.

Tabela "Squad × átomos consumidos" na seção 4 é ponto de partida. IA revisora pode discordar.

**IMPORTANTE:** Pesquisa Semanal e Benchmark Concorrentes vão migrar de função na Etapa 3 (de "gerar post/insight" pra "gerar candidatos a Subpauta"). **Pergunte ao Thiago** qual abordagem prefere:
- (1 passada) revisar squad já com nova função
- (2 passadas) primeiro alinhar com estratégia atual, depois adaptar

Planejamento Mensal não entra em Etapa 1 — foi excluído.

#### Decisão: ACRE morto

**Pilares ACRE (Alcance/Credibilidade/Retorno/Engajamento) foram eliminados.** Thiago confirmou que estão desatualizados e não usa. Isso afeta:
- Campo `pillar` no banco (`posts` table) → remover ou deprecar na Etapa 3
- `PILLAR_CONFIG` em `state.js` → remover na Etapa 3
- Classificação ACRE nos agentes e data files → remover na Etapa 1
- Filtros ACRE na UI → remover na Etapa 3

#### Ações específicas nos `data/` do squad pesquisa-conteudo-linkedin

Análise completa feita pré-Etapa 0 (ver `analise-squad-vs-estrategia.md` no copilot do Antigravity). Resumo das ações:

**1. `data/linkedin-strategy.md` — REESCREVER**
- ICP "Carlos Oliveira" → substituir por `icp_hypothesis` (átomo)
- Pilares ACRE → substituir por lente + bandeiras + 4 fontes de tese (átomos `brand_lens`, `flag_anchor`, `flag_sub`, `content_sources`)
- Temas recorrentes genéricos → substituir por 4 fontes de tese (átomo `content_sources`)
- Calendário rígido Seg/Qua/Sex → substituir por "1 tese nova/semana, mínimo"
- Métricas numéricas → substituir por discovery de ICP em 3-6 meses
- Objetivo do LinkedIn → alinhar com lacuna (átomo `positioning_gap`)
- Manter: regras editoriais operacionais (horário, resposta, não deletar posts)

**2. `data/tone-of-voice.md` — COMPLEMENTAR**
- Princípio central: ajustar referência ao ICP atualizado
- Adicionar seção "Padrões de Voz da Lacuna" com 4 regras do átomo `positioning_voice_patterns`:
  (1) Distância percorrida > idade; (2) Falha Documentada é estoque grande;
  (3) Moldura "dentro/fora"; (4) Skills com moldura certa ou não saem
- Adicionar: "fala da dor, não do mecanismo" (meta-regra de `content_sources`)
- Manter: 5 pilares do tom, vocabulário, emojis, teste de tom

**3. `data/competitors.md` — REORGANIZAR**
- Separar em: "Concorrentes de Posicionamento (BR)" com 3 polos da lacuna + "Referências de Formato (Gringos)" com lista atual
- Polo 1: Construtores técnicos (Victor Baggio, Playbook Lab)
- Polo 2: Gurus de vendas (consultores B2B brasileiros)
- Polo 3: Influencers de IA generalista + agências

**4. `data/research-sources.md` — REORGANIZAR**
- Adicionar Tier 0 (fontes internas de tese): Skills em Produção, Benchmark Real, Process Diagnostic, Falha Documentada
- Fontes externas (Gartner, etc.) continuam como Tier 1-3 (contexto e validação)

**5. Agentes — ATUALIZAR REFERÊNCIAS**
- `pesquisador.md`: trocar filtro "Carlos Oliveira" por filtro do ICP atualizado; remover classificação ACRE
- `redator.md`: trocar referências a "Pilares ACRE" por lente + bandeiras; adicionar 4 regras de qualidade como filtro
- `revisor.md`: em standby, atualizar se reativado

**6. Arquivos neutros (sem conflito, ajuste fino)**
- `data/hook-structures.md` — atualizar exemplos pra alinhar com lente (não urgente)
- `data/post-structure-linkedin.md` — sem alteração necessária
- `data/lead-magnet-template.md` — validar relevância na v2

### Etapa 2 — Criar 3 squads novos no Antigravity

1. **Seed Pautas Centrais e Subpautas**
2. **Seed Lista de Distribuição**
3. **Briefing Matéria-Colab**

Átomos consumidos em cada: ver tabela da seção 4.

### Etapa 3 — Mudanças visuais UI/UX, banco, e sessão Estratégia

- Tab 1 Pautas (nova) com subabas Distribuição e Pautas Centrais
- Migração de Pesquisa Semanal e Benchmark Concorrentes pra Tab 1
- Remoção do Planejamento Mensal
- Filtro por Pauta Central na Tab 3
- Radar de ICP na Tab 3
- **Sessão "Estratégia" nova** — cada átomo é cartão/campo editável
- **Schema de banco:** Pautas, Subpautas, Lista Distribuição, Arquétipos Exclusão, label `pauta_central` nos posts, ID de integração Antigravity↔plataforma, **tabelas de átomos estratégicos** (migrados do `copilot/atomos/`)
- **Squads passam a ler átomos do banco** em vez de arquivos locais

**Quando a Etapa 3 completar, `copilot/` pode ser arquivada.**

---

## 10. Primeiro passo concreto

1. Cumprimenta o Thiago e confirma que leu: handoff inteiro + 5 docs em `copilot/estrategia/` + deu uma passada no código real
2. **Começar pela Etapa 0 — decomposição em átomos.** Pré-requisito de tudo.
3. Pergunta ao Thiago: **prefere decompor todos os átomos de uma vez e revisar em bloco, ou decompor doc por doc e revisar em 5 rodadas menores?**
4. Pergunta sobre formato dos arquivos em `copilot/atomos/` (JSON, YAML, markdown estruturado?)
5. Espera resposta antes de propor qualquer coisa

**Não proponha mudanças fora deste escopo sem argumento novo.** Thiago corta overengineering. Se tiver insight novo que mova ponteiro, traga marcado como sugestão, não requisito.

---

## 11. Perguntas em aberto (pra ter na cabeça, não trazer preventivamente)

- Mecanismo técnico exato de como Antigravity salva post de volta na plataforma
- OpenClaw viabiliza o agente autônomo semanal?
- Tier exato da API oficial do LinkedIn ("gold" pode ser Premium de usuário, não tier de API)
- Formato exato dos arquivos de átomo em `copilot/atomos/` — Thiago define na Etapa 0

---

**Fim do handoff.** Boa sorte.
