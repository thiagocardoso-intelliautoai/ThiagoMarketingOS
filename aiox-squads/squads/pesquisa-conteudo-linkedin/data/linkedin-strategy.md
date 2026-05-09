# Estratégia LinkedIn — Thiago C.Lima

> Diretrizes estratégicas de conteúdo para o perfil LinkedIn do Thiago.
> Fonte de verdade: átomos estratégicos em `copilot/atomos/atoms.yaml`.
> Última atualização: abril/2026 — v2.

---

## Posicionamento

> **Lacuna encontrada:** O operador construtor que mostra IA rodando por dentro
> de uma operação B2B real, não de fora vendendo consultoria.

Não sou guru de prompt, não sou acadêmico, não sou agência vendendo IA.
Sou o raro cara que constrói e roda IA dentro de uma empresa comercial viva
e traduz, em tempo real, o que funciona e o que falha pra empresário tomar decisão.

---

## Lente Proprietária — "Built, not prompted"

O construtor-tradutor: construo IA em operação comercial real, e traduzo
o que funciona pra quem toma decisão de negócio.

**Contra quem me defino:**
- "Especialista" que nunca rodou nada em produção
- Lista de "10 ferramentas de IA que vão mudar sua vida"
- Jargão técnico sem tradução pra empresário

**Portabilidade:** se eu for Head hoje, Founder amanhã, Consultor depois — a lente vive.

---

## Bandeiras

### Âncora: "Anti-prompt, pro-sistema"

- **Inimigo:** a cultura de "um prompt mágico resolve" e o marketing de guru de IA
- **Convocação:** empresário que quer resultado operacional de IA, não show de mágica
- **Lastro:** Skills e Agents rodando em produção comercial na Winning Sales
- **Teste por post:** "Isso reforça que IA em operação é sistema construído, não truque pontual?"

### Sub-bandeira: "Processo antes de ferramenta"

- **Inimigo:** a pressa de "botar um agente de IA aqui" sem mapear o processo
- **Convocação:** empresário que já tentou colocar IA e não deu resultado
- **Lastro:** skill process-diagnosis-form, diagnósticos de HubSpot, Active Campaign
- **Tese-raiz:** "Automação sem redesenho é bagunça mais rápida."

**Costura:** primeiro o processo, depois o sistema, nunca o truque.

---

## ICP (hipótese de trabalho)

**Empresário ou operador de negócio com time comercial/marketing que quer usar IA de forma correta, não com hype.**

ICP amplo de propósito — a especificidade mora na lente e nas bandeiras, não em filtros demográficos. Quem não se encaixa se auto-exclui.

**Audiência vs Serviço:**
- **Conteúdo** fala pra esse ICP amplo. Volume, autoridade, descoberta de nicho via dados
- **Serviço** atende caso a caso — qualquer empresário que precisa de processo redesenhado + IA implementada

**A descobrir em 3-6 meses com dados reais:**
- Qual porte mais engaja?
- Qual função mais comenta? (CEO, COO, Head de Marketing, Head de Vendas)
- Quem vira lead qualificado vs quem só curte?
- Existe sub-nicho emergente?

**Princípio:** ICP é descoberto, não prescrito. *Niche finds you* quando a tese é afiada.

---

## 4 Fontes Recorrentes de Tese

| Fonte | Template de tese | Matéria-prima |
|-------|------------------|---------------|
| **Skills em Produção** | "Descobri que [X] não funciona em [Y] porque [Z]. Aqui está o que funciona." | weekly-report, winning-sales-pptx, process-diagnosis-form, dba-generator |
| **Benchmark Real** | "Rodei [A] vs [B] em [caso real]. Resultado: [número]. Aqui está quando cada um ganha." | n8n vs Claude Code Routines vs Managed Agents; EasyPanel; Antigravity |
| **Process Diagnostic Anônimo** | "Mapeei o processo comercial de [tipo de empresa]. O gargalo parece [óbvio], mas é [tua lente]." | Diagnósticos internos (HubSpot, Active Campaign, centralização multi-fonte) |
| **Falha Documentada** | "Tentei [X] por [tempo]. Não funcionou. Aqui está o porquê, e o que eu faria diferente." | Tudo que travou no caminho até agora |

---

## 4 Regras de Qualidade

Cada post precisa passar nas 4:

1. **Sai melhor do que entrou** — algo novo na cabeça, não repetição do feed
2. **Destrava decisão, não execução** — muda o que o leitor decide na próxima reunião, não precisa virar tutorial
3. **Não existe em outro lugar** — tese ou ângulo que só eu tenho por vivência proprietária
4. **Embalagem narrativa** — tem história, arco, abertura que fisga. Não é bullet point seco

> **Nota:** regra 2 foi adaptada do Crasto. Original era "aplicável hoje" (faz sentido pra curso). No contexto Thiago que vende tradução + construção, o filtro é destravar decisão.

---

## Frequência

- **1 tese nova por semana, mínimo**
- As 4 fontes rodam em ciclo — nunca fica mais de 2 semanas sem publicar Falha Documentada
- Nada de gimmick sem substância. Embalagem alimentada por tese

---

## Algoritmo 2026 — o que premia e suprime (REFAC-003)

> Resumo operacional para o squad. **Direção de movimento**, não números absolutos — o doc-fonte alerta contra tratar números como leis.
> Fonte canônica: `linkedin-algorithm-2026-reference.md` (raiz do projeto).

### Sinais que pesam (§3.1)

- **Dwell time 61+s** (vs 1.2% engagement em 0-3s) → maior amplificador
- **Comment substantivo 25+ palavras** → ~15× peso de like
- **Save** → ~5× peso de like, ~2× comment
- **Share com texto** → topo da hierarquia
- **Profile-content alignment** → gate de Fase 1 + amplificador Fase 3

### O que o sistema suprime (§6)

- **AI-content sem edição** (-45 a -55% engagement) — §6.1 (padrões léxicos típicos de LLM)
- **Engagement bait** detectado por NLP — §6.2 ("Comment YES", "Tag a friend", "Save for later" como CTA isolado)
- **External link no body** (~60% reach) — §6.4
- **Hashtag stuffing 5+** (10+ = spam) — §6.5
- **Edição pesada nos primeiros 60-90 min** (interrompe golden hour) — §6.6
- **Polls** (dwell time zero, 0.07% engagement em alguns estudos) — §6.9
- **Lead magnets como composição** (bait + link + bounce) — §6.10 — não atômico, é a *composição* que penaliza

### O que o sistema recompensa (§7)

- **Topical consistency** — 2-4 pilares, 80% dentro, 90 dias mínimo — §7.1
- **Saves e shares como métricas norte** — 8%+ save rate = ciclos virais; 4-6% = top-tier — §7.2
- **Comments substantivos e threaded conversations** — replies entre comentadores > replies só com autor — §7.3
- **Profile-content alignment** — input em toda decisão de ranking — §7.4
- **Específicos e dados originais** — nomes de empresas, métricas exatas, períodos, frameworks nomeados → 3-4× reach vs genérico equivalente — §7.5
- **Posting cadence consistente** — 3-5 posts/semana reconhecida — §7.7

### Implicação operacional para o squad

- **CTA:** prefere Salva-justificada (Ramo 1) e Comente-longo (Ramo 2) — vide `agents/redator.md` § Sistema Decisório de CTA. CTA genérico ("Salva pra ler depois") é REJECT no gate.
- **Hashtags:** 0-3 máximo (§6.5). Padrão histórico de "sem hashtags" continua aceitável — 0 é baseline neutro.
- **Polls:** zero. Não geram dwell time, classificáveis como engagement bait.
- **Link externo:** zero no body. Se necessário, link em DM após interação inicial, em newsletter, ou em Article nativo.
- **Hook:** especificidade (números, nomes, períodos, frameworks nomeados) é a defesa contra suspeita de AI-generated (§6.1). Estrutura de `data/hook-structures.md` é base; voz autoral do Thiago + dado real anula penalidade.
- **Length:** sweet spot 800-2.000 chars; cutoff "see more" em 210 chars. Long-form (1.000-1.300 chars) outperforma short por dwell time (§5.4).

---

## Regras Editoriais

1. **Nunca publicar sem revisão** (step-07 do pipeline com checklist integrado)
2. **Dados sempre com fonte** — sem dado solto
3. **Tom consistente** — consultar `tone-of-voice.md` sempre
4. **Um post, uma ideia** — Rule of 1 inegociável
5. **Postar entre 7h-9h BRT** — pico de atividade do ICP
6. **Responder comentários em até 2h** — o algoritmo recompensa
7. **Não deletar posts com baixa performance** — o LinkedIn pune
