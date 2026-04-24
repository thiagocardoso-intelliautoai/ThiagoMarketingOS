// prompts.js — Prompt templates for Antigravity (v2 — ACRE purged, new squads added)

export const Prompts = {
  // ─── TAB CREATE (modos que ficam) ───

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

  // ─── TAB PAUTAS — Prompts parametrizados ───

  seedPautas() {
    return `/z-seed-pautas-centrais
Modo: Geração de novas pautas e subpautas`;
  },

  seedDistribuicao(blacklist = []) {
    const blacklistStr = blacklist.length > 0
      ? `\nBlacklist (NÃO sugerir estas pessoas):\n${blacklist.map(n => `- ${n}`).join('\n')}`
      : '';
    return `/z-seed-lista-distribuicao
Modo: Gerar sugestões de novas pessoas para matéria-colab${blacklistStr}`;
  },

  briefingMateria(nome, tituloComLente) {
    return `/briefing-materia-colab
Pessoa: "${nome}"
${tituloComLente ? `Título pela lente: "${tituloComLente}"` : 'Título pela lente: (a definir pelo squad)'}`;
  },

  postDiretoFromSubpauta(subpauta) {
    return `/z-pesquisa-conteudo-linkedin
Modo: 4 — Escrever Post Direto
Subpauta: "${subpauta.titulo}"
Ângulo: ${subpauta.angulo || '(livre)'}
Hook embrionário: ${subpauta.hook_embrionario || subpauta.hookEmbrionario || '(livre)'}
Matéria-prima: ${subpauta.materia_prima || subpauta.materiaPrima || '(livre)'}
Pauta Central ID: ${subpauta.pauta_central_id || subpauta.pautaCentralId || ''}`;
  },

  postDiretoFromPessoa(pessoa) {
    return `/z-pesquisa-conteudo-linkedin
Modo: 4 — Escrever Post Direto
Contexto: Matéria-colab sobre ${pessoa.nome}
Título pela lente: "${pessoa.titulo_com_lente || pessoa.tituloComLente || '(a definir)'}"
Função: ${pessoa.funcao || ''}`;
  },

  // ─── VISUAIS (sem mudança) ───

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

  // ─── DISPATCH (só modos 3 e 4 restam) ───

  getByMode(mode, options = {}) {
    switch (mode) {
      case 3: return this.briefing(options.tema || '');
      case 4: return this.postDireto(options.ideia || '');
      default: return '';
    }
  }
};
