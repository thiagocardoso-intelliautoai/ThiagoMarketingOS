// prompts.js — Prompt templates for Antigravity

export const Prompts = {
  pesquisaSemanal() {
    return `/z-pesquisa-conteudo-linkedin
Modo: 1 — Pesquisa Semanal`;
  },

  benchmark() {
    return `/z-pesquisa-conteudo-linkedin
Modo: 2 — Benchmark de Concorrentes`;
  },

  briefing(tema) {
    return `/z-pesquisa-conteudo-linkedin
Modo: 3 — Briefing On-Demand
Tema: "${tema}"`;
  },

  postDireto(ideia) {
    if (ideia) {
      return `/z-pesquisa-conteudo-linkedin
Modo: 4 — Escrever Post Direto
Ideia: "${ideia}"`;
    }
    return `/z-pesquisa-conteudo-linkedin
Modo: 4 — Escrever Post Direto
Escolher do Armazém de Ideias`;
  },

  planejamentoMensal(direcao) {
    if (direcao) {
      return `/z-pesquisa-conteudo-linkedin
Modo: 5 — Planejamento Mensal (12 Posts)
Direção temática: "${direcao}"`;
    }
    return `/z-pesquisa-conteudo-linkedin
Modo: 5 — Planejamento Mensal (12 Posts)
Sem direção específica — usar mix balanceado dos pilares de conteúdo`;
  },

  carrossel(post, estilo) {
    const estiloLabels = {
      1: 'Twitter-style (fundo preto, print de autoridade)',
      2: 'Editorial Clean (fundo claro, tipografia bold, premium)',
      3: 'Data-Driven (fundo navy, números gigantes, dados)',
      4: 'Notebook Raw (papel craft, escrita manual, anti-AI)',
    };
    return `/z-carrosseis-linkedin
Tema: "${post.title}"
Estilo: ${estilo} — ${estiloLabels[estilo] || estiloLabels[1]}

Contexto do post original:
Hook: ${post.hookText}

${post.body}`;
  },

  capa(post, estilo) {
    const estiloLabels = {
      1: 'Rascunho no Papel (infográfico à lápis sobre caderno real)',
      2: 'Pessoa + Texto (foto real com overlay)',
      3: 'Micro-Infográfico (dado/métrica hero)',
      4: 'Print de Autoridade (screenshot + opinião)',
      5: 'Quote Card (citação editorial premium)',
    };
    return `/z-capas-linkedin
Tema: "${post.title}"
Estilo: ${estilo} — ${estiloLabels[estilo] || estiloLabels[1]}

Post completo:
${post.body || post.hookText}

Hashtags: ${(post.hashtags || []).join(' ') || '(sem hashtags)'}`;
  },

  getByMode(mode, options = {}) {
    switch (mode) {
      case 1: return this.pesquisaSemanal();
      case 2: return this.benchmark();
      case 3: return this.briefing(options.tema || '');
      case 4: return this.postDireto(options.ideia || '');
      case 5: return this.planejamentoMensal(options.direcao || '');
      default: return '';
    }
  }
};
