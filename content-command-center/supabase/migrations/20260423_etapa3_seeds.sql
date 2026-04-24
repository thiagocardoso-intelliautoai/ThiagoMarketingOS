-- ═══════════════════════════════════════════════════════════
-- Etapa 3 — Seeds: Lista Distribuição + Exclusões + 18 Átomos
-- Run AFTER 20260423_etapa3_schema.sql
-- Migration: 20260423_etapa3_seeds.sql
-- Source: copilot/atomos/atoms.yaml (369 linhas, revisado e aprovado)
-- ═══════════════════════════════════════════════════════════

-- ─── 1. LISTA DE DISTRIBUIÇÃO INICIAL (4 nomes reais) ───

INSERT INTO lista_distribuicao (nome, funcao, expectativa, expande_bolha) VALUES
  ('Victor Baggio', 'Agência de IA (média/grande empresa)', 'Provável comentário. Único nome que expande pra rede externa.', true),
  ('Ivan Nunes', 'Sócio Winning Sales', 'Comentário quase certo. Chance de repost.', false),
  ('Coutinho', 'Sócio Winning Sales', 'Comentário quase certo. Chance de repost.', false),
  ('Rafael Faria', 'Sócio Winning Sales', 'Comentário quase certo. Chance de repost.', false)
ON CONFLICT DO NOTHING;

-- ─── 2. EXCLUSÕES DE DISTRIBUIÇÃO ───

INSERT INTO exclusoes_distribuicao (tipo, nome_ou_arquetipo, motivo) VALUES
  ('arquetipo', 'Gurus de prompt/IA sem construção real', 'Sem lastro de construção real — contradiz a lente "Built, not prompted"'),
  ('arquetipo', 'Influencers genéricos sem tese proprietária', 'Tese inexistente — não passa no gate do título-com-lente'),
  ('arquetipo', 'Pessoas sem enquadramento pela lente', 'Gate inegociável: se não consigo formular título pela minha lente, a pessoa não serve')
ON CONFLICT DO NOTHING;

-- ─── 3. ÁTOMOS ESTRATÉGICOS (18 átomos de atoms.yaml → JSONB) ───

INSERT INTO atomos_estrategicos (chave, valor) VALUES

-- ── FUNDAÇÃO (01-fundacao.md) ──

('brand_lens', '{
  "name": "Built, not prompted",
  "subtitle": "O construtor-tradutor",
  "definition": "Eu construo IA em operação comercial real, e traduzo o que funciona pra quem toma decisão de negócio.",
  "angulo": [
    "Não sou guru de prompt mágico",
    "Não sou acadêmico que fala de IA em tese",
    "Sou o raro operador que sente a dor do processo E sabe construir a solução"
  ],
  "contra_quem": [
    "Especialista que nunca rodou nada em produção",
    "Lista de 10 ferramentas de IA que vão mudar sua vida",
    "Jargão técnico sem tradução pra empresário"
  ],
  "portabilidade": "Se eu for Head hoje, Founder amanhã, Consultor depois — a lente vive. Não depende do cargo."
}'::jsonb),

('flag_anchor', '{
  "name": "Anti-prompt, pro-sistema",
  "inimigo": "A cultura de um prompt mágico resolve e o marketing de guru de IA.",
  "convocacao": "Empresário que quer resultado operacional de IA, não show de mágica.",
  "lastro": "Skills e Agents rodando em produção comercial na Winning Sales.",
  "teste_por_post": "Isso reforça que IA em operação é sistema construído, não truque pontual?"
}'::jsonb),

('flag_sub', '{
  "name": "Processo antes de ferramenta",
  "inimigo": "A pressa de botar um agente de IA aqui sem mapear o processo. Automação que amplifica bagunça em vez de resolver.",
  "convocacao": "Empresário (qualquer porte) que já tentou colocar IA e não deu resultado — porque o problema nunca foi falta de IA, foi processo mal desenhado.",
  "lastro": "skill process-diagnosis-form, diagnósticos de HubSpot, Active Campaign, centralização multi-fonte. Chego com pergunta sobre processo antes de ferramenta.",
  "tese_raiz": "Automação sem redesenho é bagunça mais rápida.",
  "costura_com_ancora": "Âncora diz: IA é sistema construído, não truque. Sub-bandeira diz: e sistema pressupõe processo claro antes de código. Juntas: primeiro o processo, depois o sistema, nunca o truque."
}'::jsonb),

('icp_hypothesis', '{
  "definicao": "Empresário ou operador de negócio com time comercial/marketing que quer usar IA de forma correta, não com hype.",
  "principio_de_design": "ICP amplo de propósito — a especificidade mora na lente e nas bandeiras, não em filtros demográficos. Quem não se encaixa se auto-exclui.",
  "audiencia_vs_servico": {
    "audiencia": "Conteúdo fala pra esse ICP amplo. Volume, autoridade, descoberta de nicho via dados.",
    "servico": "Serviço atende caso a caso — qualquer empresário (PME, média, grande) que precisa de processo redesenhado + IA implementada. Sem incoerência com a audiência."
  },
  "a_descobrir_3_6_meses": [
    "Qual porte mais engaja?",
    "Qual função mais comenta? (CEO, COO, Head de Marketing, Head de Vendas)",
    "Quem vira lead qualificado vs quem só curte?",
    "Existe sub-nicho emergente (ex: founder-led growth que produz conteúdo)?"
  ],
  "principio": "ICP é descoberto, não prescrito. Niche finds you quando a tese é afiada e você lê quem engaja."
}'::jsonb),

('content_sources', '{
  "principio": "Os estilos visuais do TMO são embalagem. Autoridade vem da tese dentro do formato. Foco: 1-2 estilos signature + rotação disciplinada de substância.",
  "fontes": [
    {
      "nome": "Skills em Produção",
      "template_tese": "Descobri que [X] não funciona em [Y] porque [Z]. Aqui está o que funciona.",
      "materia_prima": "weekly-report, winning-sales-pptx, process-diagnosis-form, dba-generator"
    },
    {
      "nome": "Benchmark Real",
      "template_tese": "Rodei [A] vs [B] em [caso real]. Resultado: [número]. Aqui está quando cada um ganha.",
      "materia_prima": "n8n vs Claude Code Routines vs Managed Agents; EasyPanel; Antigravity"
    },
    {
      "nome": "Process Diagnostic Anônimo",
      "template_tese": "Mapeei o processo comercial de [tipo de empresa]. O gargalo parece [óbvio], mas é [tua lente].",
      "materia_prima": "Diagnósticos internos já feitos (HubSpot, Active Campaign, centralização multi-fonte)"
    },
    {
      "nome": "Falha Documentada",
      "template_tese": "Tentei [X] por [tempo]. Não funcionou. Aqui está o porquê, e o que eu faria diferente.",
      "materia_prima": "Tudo que travou no caminho até agora"
    }
  ],
  "meta_regras": [
    "Fala da dor, não do mecanismo.",
    "Uma tese nova por semana, mínimo. As 4 fontes rodam em ciclo — nunca fica mais de 2 semanas sem publicar Falha Documentada.",
    "Nada de gimmick sem substância.",
    "Signature visual > rotação ampla. 1-2 estilos como assinatura.",
    "ICP como hipótese viva. Revisar em 3 meses com dados reais."
  ]
}'::jsonb),

-- ── CONTEÚDO (02-conteudo.md) ──

('content_rules', '{
  "nota_adaptacao": "Regra 2 foi reescrita do Crasto original. No contexto Thiago que vende tradução + construção, não execução, o filtro é destravar decisão, não execução.",
  "regras": [
    {"numero": 1, "nome": "Sai melhor do que entrou", "definicao": "Quem leu tem que sair com algo novo na cabeça, não repetição do que já circula no feed."},
    {"numero": 2, "nome": "Destrava decisão, não execução", "definicao": "Cada post tem que deixar o leitor mais capaz de decidir algo na operação dele."},
    {"numero": 3, "nome": "Não existe em outro lugar", "definicao": "Tese ou ângulo que só eu tenho, por ter acesso a dados ou vivência proprietária."},
    {"numero": 4, "nome": "Embalagem narrativa", "definicao": "Tem história, arco, abertura que fisga. Não é bullet point seco."}
  ]
}'::jsonb),

('audience_levels', '{
  "nota_operacional": "Os níveis não são fila cronológica, são loops simultâneos. Cada semana o feed precisa ter peça que alimenta cada nível.",
  "niveis": [
    {"numero": 1, "nome": "Desconhecido", "descricao": "Nunca ouviu falar de você.", "objetivo": "Fisgar com hook universal.", "conteudo_que_alimenta": "Topo aberto do funil interno — hooks que funcionam pra qualquer pessoa scrollando o feed."},
    {"numero": 2, "nome": "Curioso", "descricao": "Viu 1-2 posts, ainda não segue.", "objetivo": "Provar que tem substância.", "conteudo_que_alimenta": "Tese proprietária visível no primeiro post — Benchmark Real e Skill em Produção mostram lastro em 10 segundos."},
    {"numero": 3, "nome": "Seguidor", "descricao": "Segue, lê recorrente, ainda não interage.", "objetivo": "Consolidar a lente na cabeça dele.", "conteudo_que_alimenta": "Consistência de bandeira batendo semana a semana, Falha Documentada (humaniza), bastidor da construção."},
    {"numero": 4, "nome": "Engajado", "descricao": "Comenta, manda DM, puxa conversa.", "objetivo": "Virar lead qualificado ou amplificador.", "conteudo_que_alimenta": "Peças que provocam resposta — Process Diagnostic anônimo, perguntas abertas, convites diretos pra debate."},
    {"numero": 5, "nome": "Amplificador", "descricao": "Reposta, cita você como referência.", "objetivo": "Municiar pra ele continuar espalhando.", "conteudo_que_alimenta": "Peças reshareable (frases de efeito, dados chocantes), matérias colab-Crasto."}
  ]
}'::jsonb),

('signature_visual', '{
  "decisao": "Dupla do caderno como assinatura fixa.",
  "capa_signature": "Rascunho no Papel",
  "carrossel_signature": "Notebook Raw",
  "por_que_casa": "A lente Built, not prompted e a sub-bandeira Processo antes de ferramenta são sobre o momento antes do sistema virar código — é o desenho do fluxo, a pergunta sobre o processo, o rascunho.",
  "diferenciacao_no_feed": "O oceano de carrossel do empresário brasileiro é fundo preto/texto branco/emoji de fogo. Caderno destoa em 0.3 segundos de scroll.",
  "regra_de_rotacao": "Caderno é default. Só sai quando o conteúdo for estruturalmente incompatível.",
  "excecoes": [
    {"estilo": "Data-Driven", "quando": "Peça é benchmark com números/gráfico comparativo."},
    {"estilo": "Quote Card", "quando": "Tese tem frase tão afiada que o visual tem que sair da frente. Raro, uso cirúrgico."}
  ],
  "proporcao_orientativa": "70% caderno, 20% data-driven, 10% quote card.",
  "exclusoes_de_signature": ["Pessoa+Texto", "Print de Autoridade", "Editorial Clean (exceto matéria-colab)", "Twitter Style", "Micro-Infográfico"]
}'::jsonb),

-- ── ALCANCE (03-alcance.md) ──

('reach_mechanic', '{
  "pergunta_que_resolve": "Como meu conteúdo pega carona em conversas que já estão acontecendo em escala no feed?",
  "diferenca_de_distribuicao": "Distribuição é canal terceiro levando meu conteúdo pra rede externa. Alcance é eu usando evento/meme de massa como hook universal pra entregar minha tese.",
  "mecanica": "Meme/evento quente tem distribuição algorítmica absurda. Quando eu entro com contexto inesperado (tese sobre IA/processo dentro de meme que não tem nada a ver), o contraste vira alcance.",
  "escopo": "Meme de massa — o que todo mundo tá falando, não só público de IA/tech.",
  "cadencia": "Semanal ou menos. Meme útil pra minha lente não aparece todo dia.",
  "janela": "24-48h depois do evento. Se demorar, perdeu.",
  "formato_visual": "Pauta quente fica no caderno (Rascunho no Papel + Notebook Raw). Exceção: notícia pura com especificação técnica → Editorial Clean ou Data-Driven."
}'::jsonb),

('reach_quality_rule', '{
  "regua": "Um leitor consegue descrever minha tese mesmo esquecendo o meme?",
  "resultado_sim": "Meme foi porta de entrada legítima. Publica.",
  "resultado_nao": "A única coisa memorável é o meme. Escorregou pra gimmick. Não publica.",
  "principio": "Eu apresento minha visão sempre. Não sou porta-notícias."
}'::jsonb),

-- ── DISTRIBUIÇÃO (04-distribuicao.md) ──

('distribution_mechanic', '{
  "pergunta_que_resolve": "Como meu conteúdo sai do meu círculo atual de seguidores?",
  "formato": "Matéria-colab estilo G4 adaptada pro LinkedIn. Carrossel sobre pessoa relevante pro meu ICP, marco como colaboradora, envio pronto — sem reunião, sem pauta combinada, sem contrapartida.",
  "natureza": "Jornalismo com formato de colab. Pessoa é sujeito, lente continua sendo minha.",
  "por_que_funciona": "Carrossel jornalístico denso sobre pessoas é gap real no LinkedIn.",
  "como_distribui": "Tag sozinha não põe no feed da pessoa. Mas comentário da pessoa distribui pra rede dela via notificação. Repost é efeito premium.",
  "regua_de_qualidade": "Tem que ser bom a ponto da pessoa querer comentar ou repostar."
}'::jsonb),

('distribution_gate', '{
  "regra": "Pessoa só entra se eu consigo formular o título da matéria pela minha lente.",
  "exemplos_que_passam": [
    "Como [Fulano] estrutura diagnóstico de processo antes de propor IA — e por que 90% das agências fazem o contrário",
    "3 perguntas que [Fulano] faz antes de aceitar um projeto de IA. A maioria dos fornecedores pula direto pra ferramenta."
  ],
  "regra_de_exclusao": "Se não consigo achar ângulo pela minha lente, a pessoa não serve — por mais famosa ou qualificada que seja."
}'::jsonb),

('distribution_subject_profile', '{
  "definicao": "O sujeito da matéria é alguém cuja rede inclui meu ICP, mas não é necessariamente meu ICP. É o profissional cuja história serve de veículo pra minha tese.",
  "formato_visual": "Editorial Clean — caderno NUNCA na matéria-colab. Caderno é reservado pra pensamento construtor próprio.",
  "coexistencia": "Os dois formatos (caderno + editorial clean) coexistem no feed com DNA visual conectado (tipografia base igual, paleta próxima, mesma voz de design). São 2 signatures, não 2 marcas."
}'::jsonb),

('distribution_exclusions', '{
  "regra": "Sem título-com-lente, sem matéria.",
  "arquetipos_excluidos": [
    "Gurus de prompt/IA sem construção real",
    "Influencers genéricos sem tese proprietária",
    "Pessoas que eu não consigo enquadrar pela lente Built, not prompted"
  ],
  "prioridade_expansao": "Próximos nomes devem estar fora da bolha Winning. Victor Baggio é o modelo — decisores que não me conhecem."
}'::jsonb),

('distribution_initial_list', '{
  "nota": "Sem pressa de encher. Começo pequeno, expando com o tempo.",
  "lista": [
    {"nome": "Victor Baggio", "funcao": "Agência de IA (média/grande empresa)", "expectativa": "Provável comentário. Único nome que expande pra rede externa."},
    {"nome": "Ivan Nunes", "funcao": "Sócio Winning Sales", "expectativa": "Comentário quase certo. Chance de repost."},
    {"nome": "Coutinho", "funcao": "Sócio Winning Sales", "expectativa": "Comentário quase certo. Chance de repost."},
    {"nome": "Rafael Faria", "funcao": "Sócio Winning Sales", "expectativa": "Comentário quase certo. Chance de repost."}
  ],
  "observacao_estrategica": "3 dos 4 nomes são Winning — ótimo pra aquecer formato, mas rede sobrepõe. Não expande alcance real. Prioridade: fora da bolha."
}'::jsonb),

-- ── POSICIONAMENTO (05-lacuna-de-posicionamento.md) ──

('positioning_gap', '{
  "pergunta_que_resolve": "Qual é o espaço único que eu ocupo no mercado de conteúdo de IA no LinkedIn brasileiro?",
  "voce_marca": "Operador de IA de 19 anos que já é Head em consultoria de vendas B2B real. Quatro tentativas antes do acerto — cada falha ensinou uma camada. Construtor dentro de operação viva, não de fora vendendo consultoria.",
  "mercado": {
    "polo_1": {"nome": "Construtores técnicos", "exemplos": "Victor Baggio, Fernando Tedesco / Playbook Lab", "descricao": "Vendem consultoria de IA de fora, têm lastro técnico real, falam mais pra técnicos, não traduzem pra empresário."},
    "polo_2": {"nome": "Gurus de vendas", "exemplos": "Consultores B2B brasileiros consolidados", "descricao": "Dominam vocabulário de processo comercial mas tocam IA por cima, sem construir."},
    "polo_3": {"nome": "Influencers de IA generalista + agências", "exemplos": "Listas de ferramentas, cases visuais brilhantes", "descricao": "Tese inexistente."},
    "centro": "Nenhum dos 3 polos ocupa o centro."
  },
  "sociedade": "Setor de IA no Brasil visto como promessa vazia com muito hype. Empresário B2B médio já ouviu IA vai revolucionar tudo mil vezes. Cansaço de promessa. Demanda reprimida por prova real.",
  "lacuna_encontrada": "O operador construtor que mostra IA rodando por dentro de uma operação B2B real, não de fora vendendo consultoria.",
  "defensibilidade": {
    "contra_construtores_tecnicos": "Eu não vendo consultoria de IA. Eu opero IA como funcionário. Meu lastro não vem de cliente A contratou, vem de eu mesmo construí e ela precisa funcionar todo dia.",
    "contra_gurus_vendas": "Eu também tenho vocabulário de processo comercial, mas chego no outro polo: não apenas falo de processo, construo o sistema que automatiza.",
    "contra_influencers": "Minha régua das 4 regras exclui conteúdo genérico por construção.",
    "contra_agencias": "Agência vende. Eu documento. Quando eu posto, o sujeito é a construção, não o serviço."
  }
}'::jsonb),

('positioning_voice_patterns', '{
  "padroes": [
    {"numero": 1, "nome": "Distância percorrida > idade", "regra": "Idade é gimmick quando vira hook principal. Substância quando vira consequência de distância. Nunca liderar com idade."},
    {"numero": 2, "nome": "Falha Documentada é estoque grande", "regra": "O arco pessoal tem 3 falhas antes do primeiro acerto + tudo que travou depois. Falha honesta é diferencial absurdo no feed brasileiro."},
    {"numero": 3, "nome": "Moldura do dentro vs fora", "regra": "Sempre que o post tocar em construção, pontuar que é dentro da operação B2B, não consultoria de fora. Não é branding — é verdade estrutural do posicionamento."},
    {"numero": 4, "nome": "Skills em produção ganham moldura certa ou não saem", "regra": "DBA generator não pode ser postado como automatizei entregável da consultoria. Moldura certa: liberei tempo do consultor pra pensamento de verdade, não pra digitação."}
  ]
}'::jsonb),

('positioning_not_gap', '{
  "descartados": [
    {"nome": "Jovem prodígio de IA", "motivo": "Gimmick. Idade é consequência, nunca hook."},
    {"nome": "Cara que entende de IA aplicada a vendas", "motivo": "Muito genérico. Vira concorrência direta com Playbook Lab e gurus de vendas."},
    {"nome": "Anti-guru de IA", "motivo": "Puramente negativo. Serve como contraste tático, mas não sustenta posicionamento positivo."},
    {"nome": "Construtor brasileiro de IA no LinkedIn", "motivo": "Existem outros. Sem dentro vs fora e sem arco das 4 tentativas, vira mais um construtor."}
  ],
  "revisao": "Revisar em 3 meses com dados reais. Lacuna é hipótese viva, não cristal."
}'::jsonb)

ON CONFLICT (chave) DO UPDATE SET
  valor = EXCLUDED.valor,
  updated_at = NOW();

-- ═══════════════════════════════════════════════════════════
-- DONE — Seeds Etapa 3
-- 4 pessoas na lista de distribuição
-- 3 exclusões de arquétipo
-- 18 átomos estratégicos (JSONB)
-- ═══════════════════════════════════════════════════════════
