# LinkedIn Algorithm 2026 — Reference Document

**Tipo de documento:** Insumo técnico para alimentar agentes estratégicos
**Função do autor:** Especialista em algoritmo do LinkedIn (não estrategista)
**Última atualização:** Maio 2026 (v2 — correções de calibração)
**Idioma:** Português (Brasil), com termos técnicos em inglês quando consagrados

---

## 0. Como usar este documento

Este documento descreve o **funcionamento mecânico** do sistema de ranqueamento do LinkedIn em 2026. Não contém recomendações estratégicas, planos de ação, calendários editoriais ou prescrições de posicionamento. Cada seção entrega:

- O que o sistema faz (mecanismo)
- Como ele decide (sinais e pesos)
- O que ele recompensa e o que ele suprime (comportamento observado)
- Os números de referência mais recentes com fonte

Quem consome este documento (humano ou outra IA) deve transformar essas informações em estratégia. O documento é descritivo, não prescritivo.

### 0.1. Aviso epistêmico (importante)

Boa parte do que se publica sobre "o algoritmo do LinkedIn em 2026" é **inferência de análises observacionais, não documentação oficial**. O LinkedIn não publica os pesos exatos dos sinais, não confirma timelines de rollout, e não detalha como o 360Brew classifica casos específicos. O paper técnico do 360Brew (arXiv 2501.16450) confirma a existência e arquitetura geral do modelo, mas não os pesos operacionais.

Tratar afirmações como "o algoritmo penaliza X em Y%" como leis físicas é incorreto. São **médias estatísticas de amostras** (van der Blom, AuthoredUp, Socialinsider), com variância grande entre contas, nichos, mercados e momentos. O algoritmo é probabilístico, não determinístico — um post com sinal negativo ainda pode performar acima da média se outros sinais compensarem.

Use os números deste documento como **direção de movimento**, não como predição precisa. Quando o documento diz "X é penalizado", leia "X reduz o score esperado de distribuição em condições típicas" — não "X mata o post".

---

## 1. A arquitetura nova: 360Brew

### 1.1. O que é 360Brew

360Brew é o foundation model que substituiu o stack fragmentado de modelos de ranqueamento do LinkedIn. Foi descrito publicamente em paper técnico no arXiv (Firooz et al., janeiro de 2025, ID 2501.16450, "360Brew: A Decoder-only Foundation Model for Personalized Ranking and Recommendation"), publicado pela equipe Foundation AI Technologies (FAIT) do LinkedIn.

Especificações confirmadas pelo paper:

- **Tamanho:** 150 bilhões de parâmetros
- **Arquitetura:** decoder-only, construído sobre Mixtral 8x22B (MoE da Mistral AI), posteriormente adaptado também com referências à família LLaMA-3 da Meta
- **Treinamento:** dados proprietários do LinkedIn (perfis, descrições de vagas, posts, interações), excluindo usuários da União Europeia
- **Capacidade:** mais de 30 tarefas preditivas distintas em uma única instância (ranking de feed, job match, people-you-may-know, ad targeting, etc.)
- **Período de desenvolvimento:** 9 meses por uma equipe pequena (paper)
- **Deploy:** rollout iniciado em meados de 2024, expandindo gradualmente até cobrir 40-100% das superfícies da plataforma ao longo de 2025-2026

### 1.2. A diferença mecânica vs o sistema antigo

O sistema antigo era um conjunto de pipelines paralelos: predição de engajamento, detecção de spam, embedding-based retrieval, filtragem por proximidade social, etc. Cada um produzia um score, e os scores eram combinados. Engenheiros mantinham cada pipeline separadamente, com features hand-engineered.

O 360Brew opera como **um único raciocinador semântico em linguagem natural**. Ele recebe como input verbalizado:

1. O texto completo do post candidato
2. O perfil do criador (headline, About, Experience, Skills, histórico de posts)
3. O perfil do leitor (mesmas dimensões)
4. O histórico recente de comportamento do leitor (entre 2-3 meses de atividade segundo o paper)

E produz um score de relevância via raciocínio semântico, não via combinação aritmética de sinais. O paper explicita que o modelo elimina a necessidade de feature engineering e DAGs complexos de dependências de modelos.

**Implicação operacional:** o sistema agora "lê" e "interpreta" significado. Hacks de sinal isolado (forçar likes, repetir hashtags, manipular contagem de cliques) tornam-se ineficazes ou contraproducentes porque o modelo avalia coerência semântica entre conteúdo, autor e contexto do leitor.

### 1.3. Capacidade de zero-shot reasoning

Por ser um decoder-only LLM, o modelo generaliza para conteúdo novo sem fine-tuning específico. Isso permite:

- Avaliar posts de criadores sem histórico (cold start)
- Avaliar leitores novos sem behavioral data (usa apenas perfil)
- Adaptar-se a tópicos emergentes sem necessidade de retraining
- Inferir significado de posts ambíguos ou multi-tópico

### 1.4. Status confirmado vs especulação

**Confirmado por fonte oficial (LinkedIn ou paper):**
- Existência do modelo e suas especificações técnicas
- Foco em ranking unificado entre superfícies
- Dwell time como sinal de ranking (LinkedIn Engineering Blog, "Leveraging Dwell Time to Improve Member Experiences on the LinkedIn Feed", outubro 2024)
- Adição de Saves e Sends às analytics públicas (final de 2025)
- Penalidade explícita a engagement bait via documentação de comments visibility (Social Media Today reportando atualização da documentação do LinkedIn)

**Inferido por análise de larga escala (Algorithm Insights 2026 da Richard van der Blom, AuthoredUp, Socialinsider, Buffer):**
- Magnitude exata das quedas de alcance
- Hierarquia de pesos entre formatos
- Severidade da penalidade a links externos
- Comportamento da "golden hour"

LinkedIn raramente confirma timelines específicas de rollout ou pesos exatos. Muitas afirmações em mídia secundária (incluindo nomes como "Authenticity Update" ou "Depth Score") são terminologia de mercado, não nomenclatura oficial.

---

## 2. O processo de ranqueamento em três fases

Toda postagem passa por três fases sequenciais. Falhar em qualquer uma encerra a distribuição.

### 2.1. Fase 1 — Quality Filter (segundos após publicação)

O modelo classifica o post em três buckets de qualidade:

- **Spam:** hashtag stuffing, links suspeitos, padrões de engagement bait conhecidos, gramática quebrada, perfil com baixa credibilidade
- **Low quality:** AI-generated content sem perspectiva única, conteúdo template, irrelevância para o nicho declarado do perfil
- **High quality (clear):** original, bem formatado, semanticamente alinhado com o perfil do autor

Posts classificados como spam ou low quality recebem distribuição mínima (centenas de impressões) ou zero. Não há aviso ao autor.

**Sinais que disparam Fase 1 fail (consolidados de Algorithm Insights 2026 e análises do Trust Insights):**

- Frases-padrão de engagement bait detectadas via NLP
- Densidade de hashtag acima de ~5
- Link externo no body do post (não apenas penaliza, pode reclassificar para low quality)
- Conteúdo com padrões léxicos típicos de LLM não-editado
- Discrepância forte entre tópico do post e topical DNA do perfil

### 2.2. Fase 2 — Golden Hour Test (60 a 90 minutos)

Posts aprovados são distribuídos a 2-5% da rede do criador (test audience). O modelo monitora:

- **Dwell time** dos primeiros leitores (oficial)
- **Velocidade de comentários substantivos** (comments com 25+ palavras pesam significativamente mais que comments curtos)
- **Saves nos primeiros minutos** (sinal mais forte por unidade depois de 2025)
- **Click "see more"** (sinal de hook eficaz)
- **Click bounce rate** (cliques seguidos de retorno imediato sinalizam clickbait)
- **Velocidade da resposta do autor a comments** (responder em até 15 minutos amplifica reach segundo dados do Algorithm Insights)

Métrica de referência: apenas ~5% dos posts que underperform no primeiro hour conseguem recuperar e atingir audiência ampliada (Dataslayer, citando dados consolidados de fevereiro de 2026).

**Pesos relativos observados em estudos cruzados:**
- Comment substantivo: ~15× o peso de um like (Meet-Lea analysis)
- Save: ~5× o peso de um like, ~2× o peso de um comment (Posteverywhere)
- Share: peso comparável a save em 2026
- Reaction simples: peso baixo em todas as análises recentes

### 2.3. Fase 3 — Relevance & Expertise Ranking (24 a 72 horas, e até 2-3 semanas)

Posts que passam na Fase 2 entram em distribuição expandida. Aqui o 360Brew aplica seu raciocínio semântico completo:

- Match entre conteúdo do post e topical DNA dos potenciais leitores
- Match entre creator authority e tópico do post
- Coerência da audiência inicial (se quem engajou na Fase 2 são profissionais relevantes ao nicho, expansão é mais agressiva)
- Sustained dwell time da nova audiência

Posts com performance forte podem ressurgir em distribuição por 2-3 semanas (lifespan estendido em 2026 vs 2-3 dias em 2024). Esse "long tail" é particularmente forte para conteúdo educacional, frameworks e dados originais que continuam gerando saves.

**Recency vs relevance:** em junho-julho de 2025 o LinkedIn testou ressurgência mais agressiva de posts antigos relevantes; rebalanceou após pushback. O comportamento atual é híbrido — posts evergreen têm vida útil longa, mas o feed ainda prioriza recência relativa.

---

## 3. Sinais de ranqueamento e seus pesos

### 3.1. Sinais primários (alto peso)

| Sinal | Peso relativo | Fonte |
|-------|---------------|-------|
| Dwell time (61+ segundos) | Engagement de 15.6% vs 1.2% para 0-3s | Prominence Global / Meet-Lea |
| Comment substantivo (25+ palavras) | ~15× peso de like | Meet-Lea / SocialInsider 2026 |
| Save | ~5× peso de like, ~2× peso de comment | PostEverywhere / Algorithm Insights 2026 |
| Share com texto adicionado | Sinal mais alto da hierarquia | Linkboost / van der Blom |
| Profile-content alignment | Gate de Fase 1 e amplificador na Fase 3 | Trust Insights / Ozigi analysis |

### 3.2. Sinais secundários (peso médio)

- **Send (DM compartilhamento)** — sinal de "este post merece atenção privada", adicionado às analytics em Q4 2025
- **Click "see more"** — proxy de hook bem construído
- **Profile clicks pós-leitura** — sinaliza interesse na fonte além do post
- **Follow após o post** — sinal mais forte de authority building
- **Newsletter subscription pelo post** — extremamente alto, mas raro

### 3.3. Sinais negativos (suprimem distribuição)

- **Click bounce** (clique + saída em <3s) — sinaliza clickbait
- **Engagement bait detectado por NLP** — supressão imediata
- **Reciprocidade artificial** (mesmo cluster comentando rapidamente em todos os posts) — shadowban silencioso
- **Edição pesada nos primeiros 60 minutos** — interrompe o ranking test e zera o golden hour
- **External link no body** — penalidade de até ~60% no reach
- **Link no primeiro comentário** — patched no início de 2026 (ainda penaliza, embora menos que link no body)
- **Tags em massa** (5+ menções) — sinal de spam
- **Posting com cadência errática** (semanas de silêncio + bursts) — degrada confiança da conta

### 3.4. Sinais zerados ou quase zerados

- **Likes simples** — quase irrelevante isoladamente
- **Hashtags** — 3-5 ainda funcionam como pista de tópico, mas perderam função de descoberta. Posts com 3+ hashtags tiveram 70% menos reach que posts com zero em estudo do van der Blom de 2025-2026
- **Tags de "Top Voice"** — descontinuadas em outubro de 2025
- **Polls** — engagement rate caiu para ~0.07-4.4% dependendo da fonte; LinkedIn classifica como low-effort em vários contextos. Útil para pages com 50K+ seguidores apenas

---

## 4. Estrutura mecânica do feed

### 4.1. Mudança fundamental: social graph → interest graph

Até 2024, o feed era dominantemente social-graph-based: você via majoritariamente o que sua rede de 1º grau postava, ponderado por proximidade. A partir de 2025-2026, o LinkedIn migrou para interest-graph similar ao TikTok, adaptado para B2B.

Mecanismo: o 360Brew constrói representação semântica de cada usuário a partir de perfil + histórico recente, e entrega conteúdo cuja representação semântica seja próxima — independentemente de conexão direta. Conexões ainda importam (proximidade social é um sinal entre vários), mas não são mais o sinal dominante.

**Consequências mensuráveis:**
- Posts agora alcançam regularmente audiências de 2º e 3º grau ou fora da rede totalmente, se a relevância semântica for alta
- Tamanho de rede tornou-se proxy fraco de reach (MIT Sloan: top 30% por relevância de rede tiveram 210% mais performance que top 30% por tamanho de rede)
- Cold start melhorou: novos perfis com About bem preenchido recebem distribuição inicial sem precisar acumular followers

### 4.2. Distribuição entre tipos de conta

Realocação estrutural confirmada por Socialinsider e Refine Labs:

- **Perfis pessoais:** ~65% do consumo de feed
- **Newsletters/Articles:** distribuição própria via push e e-mail (canal separado do feed)
- **Company Pages:** ~5% do consumo de feed; queda de 60-66% no reach orgânico entre 2024 e 2026
- **Ads patrocinados:** restante

Estudo da Refine Labs: posts de perfis pessoais geraram 2.75× mais impressões e 5× mais engajamento que posts da página corporativa correspondente, mesmo com perfis menores.

Employee reshares alcançam até 561% mais que posts de página corporativa (van der Blom).

### 4.3. Topical DNA

O sistema mantém uma representação semântica do "tópico" de cada perfil, construída a partir de:

- Headline e About
- Experience e Skills
- Histórico de posts (últimos ~90 dias com peso maior)
- Engagement do criador em conteúdo de outros (que tópicos ele consome e comenta)
- Engagement recebido (de quais perfis vem o engagement)

Essa representação é usada em duas direções:

1. **Para decidir distribuição do criador:** posts coerentes com o topical DNA recebem amplificação; posts off-topic são tratados como baixa autoridade naquele assunto e suprimidos.
2. **Para decidir match com leitores:** posts são entregues a leitores cujo próprio topical DNA bate com o tópico do post.

Estudos de prática indicam que o sistema precisa de aproximadamente 90 dias de consistência em um nicho para categorizar o perfil como autoridade nele. Mudanças bruscas de tópico requerem novo período de consolidação.

---

## 5. Hierarquia de formatos — benchmarks 2026

Dados consolidados de Socialinsider (1.3M posts, 16.645 páginas), Buffer (2M+ posts), Algorithm Insights 2026 (1.8M posts), AuthoredUp (3M+ posts, mar/2025-fev/2026), Oktopost (1.000+ B2B pages).

### 5.0. Diferença crítica por tamanho de conta (NOVO em v2)

A hierarquia de formatos **muda significativamente conforme o tamanho da base** (AuthoredUp, mar/2026):

| Tamanho da base | Formato vencedor em reach | Observação |
|-----------------|---------------------------|------------|
| <5K seguidores | **Imagem (single ou multi)** | Imagens superam todos os outros formatos em reach E engagement |
| 5K-20K | Misto (imagem + carrossel) | Transição; testar ambos |
| 20K-50K | **Document/carrossel** | 1.30× reach vs mediana |
| 50K+ | **Document/carrossel** | 1.49× reach vs mediana |

**Mecanismo:** contas pequenas dependem do algoritmo empurrar o conteúdo além da rede imediata. Imagens são consumo de baixa fricção, geram reactions de quem ainda não te conhece. Document posts exigem commit de swipe — só converte bem quando já existe trust acumulado.

**Implicação operacional:** "carrossel é o formato vencedor" é verdade *condicional*. Para contas <5K seguidores, a recomendação se inverte: imagens (incluindo infográficos single-page) podem performar melhor.

### 5.1. Engagement rate médio por formato (média global, todos os tamanhos)

| Formato | Engagement médio | Observação |
|---------|-----------------|------------|
| Native document (PDF carousel) | 6.6% – 7.0% | Líder global; +14% YoY (Socialinsider) |
| Multi-image post | 6.6% | Líder em likes especificamente |
| Native video curto (≤90s) | 5.1% – 5.6% (engagement); reach -36% YoY | Ver 5.3 — formato em queda forte |
| LinkedIn Live | ~29.6% | Outlier; alta exigência de produção |
| Polls | 4.4% (Socialinsider) / 0.07% (Linkboost) | Disputado; depende do tamanho da página |
| Text post longo (1.200-2.000 chars) | ~4% | Estável |
| Single-image | 4.85% (média global) — mas **vence em contas <5K** | Inverte conforme tamanho da base |
| Newsletter/Article | 1.9% (na métrica de feed); distribuição própria via push | Bypassa o feed |
| Post com link externo | -60% vs post equivalente sem link | Penalidade severa |

**Nota terminológica:** "infográfico" e "carrossel" no LinkedIn são tecnicamente o mesmo formato — ambos são document posts (PDF nativo). A distinção é de *tipo de conteúdo*: infográfico geralmente é single-page denso (prova um ponto), carrossel é multi-page sequencial (conta uma história ou ensina um processo).

### 5.2. Document posts (carrosséis PDF) — especificações técnicas

- **Aspect ratio recomendado:** 4:5 (1080×1350px) para mobile-first
- **Slides ideais:** 6-8 (atualizado em 2026, antes era 7-10)
- **Limite máximo prático:** 15 slides (drop-off acelera depois)
- **Limite técnico do LinkedIn:** 300 páginas, 100 MB
- **Tamanho de fonte mínimo:** 22-24px body, 36px headlines
- **Click-through floor crítico:** se a taxa de avanço entre slides cai abaixo de 35%, o post leva penalidade de visibilidade
- **Saves observados:** 1.8× mais que text posts equivalentes (van der Blom). Documents respondem por 12.92% de todos os saves do LinkedIn — 2.6× sua share de conteúdo (AuthoredUp)
- **Dwell time médio:** 35-55 segundos (vs 8-12s em text posts)
- **Engagement vs text:** 2.5× a 3.1× (van der Blom); até 3.7× em estudo Buffer
- **Adoção:** apenas 4.88% dos perfis postam documents regularmente (AuthoredUp) — gap de oportunidade

### 5.3. Vídeo — especificações técnicas (REVISADO em v2)

**Status atualizado:** vídeo é o formato com **maior queda** de 2025 para 2026. Os dados mais recentes (AuthoredUp, mar/2026) mostram que vídeo entrega 0.74× do reach médio em contas 50K+ — formato mais fraco em todos os tiers de tamanho.

- **Aspect ratio recomendado:** 9:16 (vertical 1080×1920) ou 1:1 (quadrado 1080×1080)
- **Duração ideal:** 30-90 segundos para discovery; 2-5 minutos para audiência já existente
- **Retention crítica:** primeiros 3-4 segundos determinam até 65% da retenção total
- **Boost por face/marca nos 4 primeiros segundos:** +69% (LinkedIn Marketing Solutions)
- **Caption queimada:** +29-40% engagement, +32% retention (videos sem som consumidos por 73-85% dos viewers)
- **Mobile share:** 73-80% dos views vêm de mobile
- **Crescimento YoY uploads:** +36-44% (oferta dobrando)
- **Crescimento YoY views:** -36% (Socialinsider) — descompasso indica saturação de oferta
- **Personal-style vs corporate motion graphics:** +44% reactions
- **Função primária em 2026:** autenticidade e conexão humana, **não reach**. Vídeo é formato de "trust-building" para audiência existente, não de descoberta. LinkedIn Live é a exceção (engagement outlier, mas exige produção).

### 5.4. Text post — especificações

- **Sweet spot de caracteres:** 800-1.000 (alguns estudos) ou 1.200-2.000 (outros)
- **Cutoff "see more":** 210 caracteres na primeira linha
- **Long-form (1.000-1.300 chars):** outperforma short por dwell time
- **Long-form (>1.300 chars):** +18% engagement em alguns benchmarks

### 5.5. Newsletter — mecânica especial

- **Distribuição:** triple notification (in-app + push + e-mail) para todos os assinantes; não compete no feed
- **Indexação:** newsletters são indexadas pelo Google (ganho SEO compounding)
- **Limite editorial:** 1 edição por 24 horas, até 110.000-125.000 caracteres
- **Subscriber limit:** ilimitado; primeira edição vai para todos os connections automaticamente
- **Open rate médio:** ~40% ("clicks to read" na nomenclatura do LinkedIn)
- **Crescimento YoY engajamento:** +47%
- **Active newsletters em 2026:** 150.000+ ativas, 36.000+ publicando por mês
- **Implicação mecânica:** newsletter é o único canal que **bypassa o 360Brew no feed** — único caminho garantido de reach a uma base orgânica

---

## 6. O que o sistema suprime ativamente

### 6.1. AI-generated content sem edição

LinkedIn implementou classificadores que reconhecem padrões léxicos típicos de LLM não-editado:

- Estruturas "It's not just X, it's Y"
- Aberturas tipo "Here's the truth about..." / "Let me tell you..."
- Listas perfeitamente paralelas
- Excesso de emoji-as-bullet
- Gramática excessivamente polida sem variação humana
- Ausência de exemplos específicos, números ou anedotas

Estudo Originality.ai (citado por Trust Insights e Ozigi): análise de ~9.000 posts long-form mostrou que posts classificados como likely-AI-generated receberam **45% menos engajamento** que posts likely-human. Algorithm Insights Report 2025 corroborou com -30% reach e -55% engagement em outro estudo.

LinkedIn não bane uso de AI tools. Bane output de AI sem perspectiva original.

### 6.2. Engagement bait

Detecção via NLP, supressão imediata. Padrões reconhecidos:

- "Comment YES if you agree"
- "Like for part 2"
- "Tag a friend who needs this"
- "Type 1 if X, 2 if Y"
- "Save this for later" usado como CTA isolado (uso em contexto natural ainda passa)
- "Comment X to receive [recurso] in your DMs" (especialmente quando o recurso está fora da plataforma)

Distinção que o classificador faz: pergunta aberta genuína (passa) vs solicitação de interação manipuladora (suprime).

### 6.3. Engagement pods e reciprocidade artificial

LinkedIn declarou publicamente que pods são "entirely ineffective" sob o novo sistema. O 360Brew detecta:

- Mesmas contas comentando consistentemente em todos os posts uns dos outros
- Timing de engagement desproporcionalmente rápido (segundos após publicação) de um cluster fixo
- Comments sem coerência semântica com o tópico do post (típico de "Great post!" automatizado)
- Comments com similaridade léxica entre si (típico de geração via mesmo template AI)

Penalidade: shadowban silencioso. Não há aviso, não há suspensão, apenas redução abrupta de reach. Recuperação requer várias semanas de comportamento orgânico para re-calibrar trust score.

### 6.4. External links

- **Body do post:** redução observada de ~60% no reach (van der Blom). Este é o número *médio* — varia por nicho, autoridade do perfil e qualidade do conteúdo. Algumas fontes (Ocean Labs, dados de 2026) reportaram que links com captions value-first têm tido *modesto ganho* de ~5% em alguns contextos, sugerindo que a penalidade está sendo recalibrada.
- **Primeiro comentário:** patched em 2026, ainda penaliza moderadamente
- **Lógica do sistema:** sessão é receita; clique externo encerra sessão. Click bounce (sair e não voltar) marca a conta como tráfego de baixa retenção, com penalidade que se acumula entre posts.

Funcionam com menor fricção:
- Link em DM após interação inicial
- Link dentro de Newsletter
- Link em Article nativo
- Mencionar a fonte verbalmente sem hyperlink

### 6.5. Hashtag stuffing

- 0 hashtags: baseline
- 1-3 hashtags: neutro a positivo (pista de tópico)
- 3-5 hashtags relevantes: ainda aceitável
- 5+ hashtags: penalidade crescente
- 10+ hashtags: classificação como spam

### 6.6. Edição pesada nos primeiros 60-90 minutos

O ranking test depende de estabilidade do conteúdo testado. Edições significativas (parágrafos reescritos, mudança de hook) durante o golden hour interrompem o teste e o post é removido da distribuição expandida. Pequenos typos podem ser corrigidos sem penalidade.

### 6.7. Single-image post

Em 2024 era um formato neutro. Em 2026, single-image post performa ~30% pior que text-only equivalente *na média global*. **Importante (atualizado em v2):** essa média esconde uma inversão por tamanho de conta. Em contas <5K seguidores, imagens (incluindo single-image autoral ou infográfico) frequentemente *vencem* outros formatos em reach (AuthoredUp). A penalidade aplica-se primariamente a single-image stock genérico, não a imagens autorais com peso visual.

Multi-image (3+ imagens autorais) reverte essa penalidade.

### 6.8. Connection Relevance Decay

Conexões com as quais o usuário não interage há 90+ dias têm peso reduzido como audiência inicial. Isso significa que redes grandes mas dormentes geram cada vez menos golden hour signal, forçando os criadores a manter engagement recíproco ativo (o que, ironicamente, pode ser confundido com pod se feito artificialmente).

### 6.9. Polls

Performance disputada nas fontes:
- Socialinsider: 4.4% engagement (mantém-se relevante para pages 50K+)
- Linkboost: 0.07% — classifica polls como engagement bait morto

Convergência: clicar em poll não gera dwell time nem semantic value, então mesmo polls com muitos votos não convertem em distribuição expandida.

### 6.10. Lead magnets — composição de penalidades (NOVO em v2)

"Lead magnet" não é uma categoria atômica que o algoritmo identifica. É uma estrutura composta por sinais individuais, cada um com peso próprio:

| Componente do lead magnet típico | Sinal individual | Peso da penalidade |
|----------------------------------|------------------|--------------------|
| Frase "Comente X que mando no DM" | Engagement bait detectado por NLP | Alto (Fase 1 fail possível) |
| Link externo no body ("baixe aqui") | External link penalty | Alto (~60% reach) |
| Link no primeiro comentário | External link penalty (patched) | Médio |
| CTA "Salva pra ler depois" | Pode ser bait OU sinal genuíno | Variável (contextual) |
| Asset (PDF, framework, planilha) entregue *fora* do post | Click bounce risk | Médio (acumula sobre conta) |
| Mesmo asset entregue *dentro* do post (document) | Sem penalidade — formato premiado | Negativo (positivo) |

**Implicação importante:** o que é penalizado não é o conceito de "trocar valor por captura". É a *composição específica* de bait + link + bounce. Lead magnets bem compostos (asset entregue dentro do post, captura por inbound via DM/perfil/newsletter, sem CTA manipulador) podem rodar com fricção mínima.

**Calibração realista:** afirmações categóricas tipo "lead magnet está morto no LinkedIn" são exageradas. O que se observa empiricamente é:

1. Lead magnets *clássicos* (link externo + CTA bait) pagam fricção alta — 30-60% de reach a menos
2. Essa fricção é *absorvível* por contas com volume/autoridade pré-estabelecida
3. Para contas pequenas (<5K seguidores), o custo proporcional é maior porque há menos reach pra queimar
4. O algoritmo é probabilístico: posts fortes com sinais negativos ainda podem performar acima da média de posts fracos sem sinais negativos
5. Coerência semântica entre autor (topical DNA) e tópico do lead magnet modula a severidade — operador-builder oferecendo framework técnico é lido diferente de coach genérico oferecendo "10 hacks"

**A pergunta operacional correta** não é "lead magnet funciona ou não funciona" — é "qual o custo em reach que pago por cada lead capturado, dado o tamanho atual da minha base?" Esse cálculo é estratégico, não algorítmico, e está fora do escopo deste documento.

---

## 7. O que o sistema recompensa ativamente

### 7.1. Topical consistency (3-4 pilares máximo)

O 360Brew categoriza autoridade por consistência observável. Métricas convergentes:

- 2-4 pilares de tópico, postados em rotação
- 80% do conteúdo dentro dos pilares centrais
- 90 dias de consistência mínima para o sistema solidificar a categorização

Posts off-topic não apenas underperform — eles diluem a topical DNA do perfil para decisões futuras.

### 7.2. Saves e shares como métricas norte

LinkedIn adicionou Saves e Sends às analytics públicas no Q4 2025 sinalizando explicitamente o que valoriza. Save signal interpretation pelo sistema:

- "Este conteúdo merece referência futura" — proxy de durabilidade do valor
- 8%+ save rate corresponde a entrada em ciclos virais
- 4-6% save rate corresponde a top-tier creator no nicho

### 7.3. Comments substantivos e threaded conversations

O sistema valoriza profundidade de conversa, não volume:

- Comments com 25+ palavras: peso ~15× o de likes
- Threads back-and-forth (replies entre comentadores, não só com o autor): trigger mais forte de expansão
- Comments do autor respondendo dentro de 15 minutos: amplificador adicional
- Comments de profissionais com topical DNA aderente ao tópico do post: peso adicional

### 7.4. Profile-content alignment

Headline, About e Experience são input em **toda** decisão de ranking (não só na criação do perfil). Discrepância entre perfil e conteúdo trava o post na Fase 1.

### 7.5. Específicos e dados originais

Posts com nomes de empresas, métricas exatas, períodos específicos, frameworks nomeados recebem 3-4× o reach de posts genéricos equivalentes (van der Blom). O sistema interpreta especificidade como sinal de expertise vivida.

### 7.6. Verificação de identidade

Perfis com badge de verificação (shield icon) experimentaram lift moderado de reach em 2026 — o sistema usa verificação como trust signal contra "ghost accounts" puramente AI.

### 7.7. Posting cadence consistente

- 3-5 posts por semana consistentemente: cadence reconhecida
- Daily posting: aceitável para perfis pessoais com qualidade alta, problemático para Pages (cannibalization)
- Bursts seguidos de silêncio: degrada trust score

Importante: Buffer (2M+ posts) achou que contas postando 11+/semana têm ~3× engagement por post vs once-a-week, contradizendo a tese de "menos é mais". Reconciliação: o que importa é qualidade sustentável, não frequência absoluta.

---

## 8. Métricas-chave do estado atual (2026)

Consolidação de fontes primárias e secundárias convergentes.

### 8.1. Quedas estruturais YoY

- **Views médios:** -50% (Algorithm Insights 2026)
- **Engagement médio:** -25% (Algorithm Insights 2026)
- **Crescimento de seguidores:** -59% (Algorithm Insights 2026)
- **Reach orgânico de Company Pages:** -60% a -66% entre 2024 e 2026
- **Reach médio em % de followers:** caiu de 15-20% para 8-12% (van der Blom)
- **Video views:** -36% YoY (Socialinsider)
- **98% dos usuários:** experimentaram queda de reach em 2026

### 8.2. Crescimentos

- **Engagement rate médio agregado:** +8% YoY (Socialinsider) — paradoxo: fewer impressions com higher quality
- **Document/carousel engagement:** +14% YoY
- **Polls engagement:** +12% YoY (em pages grandes)
- **Newsletters engagement:** +47% YoY
- **Posting frequency de visual content:** dobrou (de 2-5 para 4-7 posts/mês em média entre Pages)
- **Video uploads YoY:** +36-44%

### 8.3. Distribuição do tempo de leitura

| Dwell time | Engagement rate observado |
|------------|---------------------------|
| 0-3 segundos | 1.2% |
| 11-30 segundos | distribuição moderada |
| 31-60 segundos | distribuição máxima |
| 61+ segundos | 15.6% |

13× de diferença entre dwell mínimo e máximo.

### 8.4. Distribuição da rede

- Perfis pessoais: ~65% do feed allocation
- Company Pages: ~5%
- Apenas 1% dos usuários posta regularmente
- LinkedIn responde por 40% dos B2B leads de alta qualidade
- 70% dos usuários são "ghost scrollers" (consomem sem engajar)

### 8.5. Lifespan de post

- 2024: 2-3 dias de distribuição ativa
- 2026: 48-72 horas iniciais + cauda de até 2-3 semanas para evergreen content

---

## 9. Glossário técnico

**360Brew** — Foundation model decoder-only de 150B parâmetros que substitui o stack de ranking fragmentado anterior do LinkedIn.

**Click bounce** — Clique seguido de retorno ao feed em <3s; sinal negativo forte.

**Connection Relevance Decay** — Redução de peso de conexões inativas (>90 dias sem interação).

**Depth Score** — Terminologia de mercado (não oficial do LinkedIn) para o composite de dwell time + comment depth + saves + private shares.

**Dwell time** — Tempo total que o usuário gasta visualizando o post; sinal oficial confirmado pelo LinkedIn Engineering Blog (out/2024).

**Engagement velocity** — Taxa de chegada de interações na primeira hora; alta velocity é sinal positivo, baixa velocity sinal negativo.

**Golden Hour** — Janela de 60-90 minutos pós-publicação onde o post é testado em 2-5% da rede.

**Interest Graph** — Modelo de distribuição baseado em afinidade temática (vs Social Graph baseado em conexões).

**Pod** — Grupo coordenado de contas que se comprometem a engajar mutuamente; detectado e penalizado ativamente.

**Save** — Bookmark do post pelo leitor; sinal de durabilidade de valor, ~5× o peso de like.

**Send** — Compartilhamento do post via DM; adicionado às analytics em Q4 2025.

**Topical DNA** — Representação semântica do nicho/expertise de um perfil, construída a partir de profile + histórico de posts e engagements.

**Zero-shot reasoning** — Capacidade do 360Brew de avaliar conteúdo e usuários novos sem fine-tuning específico, via raciocínio sobre padrões semânticos.

---

## 10. Fontes primárias e estudos de larga escala

### Fontes oficiais LinkedIn

- **LinkedIn FAIT Team (Firooz et al., 2025).** "360Brew: A Decoder-only Foundation Model for Personalized Ranking and Recommendation." arXiv:2501.16450.
- **LinkedIn Engineering Blog (out/2024).** "Leveraging Dwell Time to Improve Member Experiences on the LinkedIn Feed."
- **LinkedIn Marketing Solutions Blog (mar/2026).** "How to Leverage LinkedIn for AI Visibility in 2026."
- **LinkedIn Top Content / Help Center.** "How LinkedIn Ranks Feed Content."
- **LinkedIn Engineering Blog (mar/2026).** Comunicação sobre changes de visibility de comments e detecção de automation.

### Estudos de larga escala (third-party)

- **Algorithm Insights Report 2025 / 2026 — Richard van der Blom & Just Connecting.** 1.8M posts, 58K perfis, 31K Company Pages, 12 meses.
- **AuthoredUp.** 3M+ posts analisados.
- **Socialinsider 2026 LinkedIn Benchmarks.** 1.3M posts, 16.645 Business Pages, dois anos completos.
- **Buffer 2026 LinkedIn Study.** 2M+ posts (e estudo separado de 52M posts).
- **Oktopost 2026 LinkedIn Benchmark.** 1.000+ B2B Company Pages, mar/2026.
- **Sprout Social Q1 2026 Index.** Survey de stated-preference de usuários LinkedIn.
- **Hootsuite Social Trends 2026.**
- **Originality.ai (2025).** ~9.000 posts long-form analisados para detecção de AI-generated.
- **MIT Sloan (2025).** 1.200 perfis B2B, network relevance vs network size.
- **Refine Labs.** Comparação Page corporativa vs perfil pessoal.
- **Trust Insights.** Análise técnica de 360Brew architecture.
- **Dataslayer (fev/2026).** Benchmark interno multi-formato.

### Análises técnicas e secundárias

- Falia, Ozigi, Linkboost, Meet-Lea, PostEverywhere, Growleads, SocialBee, MeetEdgar, ContentIn, ALM Corp, Crea8ive Solution, Yepads, designACE, omnicreator, social sales link, fadyramzy, posteverywhere, predis.ai, growthterminal, postking, exxardigital, sourcegeek, TheLinkedBlog (consolidam o paper original e estudos primários sob diferentes ângulos).

---

## 11. Limitações deste documento

Este documento descreve o estado observado até maio de 2026. As seguintes incertezas devem ser consideradas pelo consumidor:

1. **LinkedIn não publica os pesos exatos** dos sinais de ranking. Pesos relativos são inferidos por análise estatística de larga escala, não medidos diretamente.

2. **Roll-out de 360Brew é gradual e por waves.** Diferentes usuários e geografias podem estar em diferentes versões do sistema simultaneamente. Usuários da União Europeia foram explicitamente excluídos do treinamento (paper).

3. **Terminologias como "Authenticity Update", "Depth Score" e "360Brew V2"** são em parte criação de mídia/marketing, não nomenclatura oficial do LinkedIn. O paper técnico oficial cita apenas "360Brew V1.0".

4. **Convergência entre fontes secundárias** ocorre em parte porque várias delas se baseiam nos mesmos estudos primários (especialmente van der Blom). Tratar números repetidos como múltiplas validações independentes é incorreto.

5. **Mudanças algorítmicas são contínuas.** Qualquer número aqui pode estar desatualizado dentro de meses. A direção do movimento (semântica > sinal isolado, profundidade > volume, retenção > clique) é mais durável que os números absolutos.

6. **Performance em mercados não-anglófonos** (incluindo Brasil) é menos documentada; a maior parte dos benchmarks vem de samples globais com viés anglo-saxão.

7. **O setor de "explicar o algoritmo do LinkedIn" tem mais opinião com cara de ciência do que ciência mesmo.** Quem afirma com precisão como o 360Brew pondera cada sinal está inferindo, não medindo. Este documento tenta ser explícito sobre o que é fato (paper, documentação oficial) vs inferência (análises observacionais), mas a linha nem sempre é nítida.

---

## Changelog

**v2 (mai/2026)** — Correções de calibração após confronto com fontes adicionais:
- Adicionada seção 0.1 (Aviso epistêmico) explicitando o nível de inferência vs fato
- Adicionada seção 5.0 (Diferença por tamanho de conta) — para contas <5K seguidores, imagens vencem documents em reach
- Revisada seção 5.3 (Vídeo) — formato em queda forte, não mais "segundo melhor"
- Adicionada seção 6.10 (Lead magnets — composição de penalidades) substituindo afirmações categóricas anteriores por análise por componente
- Calibrada seção 6.4 (External links) reconhecendo que penalidade pode estar sendo recalibrada
- Calibrada seção 6.7 (Single-image) reconhecendo inversão por tamanho de conta
- Adicionada limitação #7 sobre o setor de análise de algoritmo

**v1 (mai/2026)** — Versão inicial.

---

**Fim do documento.**
