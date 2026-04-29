// prompts.js — Prompt templates para Claude Code / Antigravity (v3 — Pessoa 1:N Ângulos)

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

  // ─── v3: Ângulos — novos prompts ───

  aprofundarPessoa(nome, angulosExistentes = [], inputLivre = '') {
    const angulosStr = angulosExistentes.length > 0
      ? `\nÂngulos já existentes (NÃO repetir):\n${angulosExistentes.map(a => `- [${a.arquetipo}] ${a.titulo_pela_lente}`).join('\n')}`
      : '\nNenhum ângulo existente — gerar ângulos iniciais.';
    const inputStr = inputLivre
      ? `\nDireção livre do operador: "${inputLivre}"`
      : '';
    return `/z-seed-lista-distribuicao
Modo: Aprofundar ângulos de pessoa existente
Pessoa: "${nome}"${angulosStr}${inputStr}`;
  },

  criarMateriaColab(angulo, pessoa) {
    const evidenciasStr = Array.isArray(angulo.evidencias) && angulo.evidencias.length > 0
      ? `\nEvidências:\n${angulo.evidencias.map(e => `- ${e}`).join('\n')}`
      : '';
    return `/z-criar-materia-colab
Pessoa: "${pessoa.nome}"
Função: ${pessoa.funcao || '(não informada)'}
Rede relevante: ${pessoa.rede_relevante || '(não informada)'}

Ângulo selecionado:
Arquétipo: ${angulo.arquetipo}
Título pela lente: "${angulo.titulo_pela_lente}"${evidenciasStr}
${angulo.risco ? `Risco editorial: ${angulo.risco}` : ''}

Ângulo ID: ${angulo.id}`;
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
