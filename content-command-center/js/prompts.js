// prompts.js — Prompt templates para Claude Code / Antigravity (v3 — Pessoa 1:N Ângulos)

// VISUAL-001: Metadata estruturada dos estilos (label + vence_quando + perde_quando).
// Source of truth: aiox-squads/squads/{capas,carrosseis}-linkedin/data/visual-styles.md
// Consumido por render.js para mostrar dicas "vence/perde" nos cards do CCC.
export const CarouselStyles = {
  1: {
    label: 'Twitter-style (fundo preto, print de autoridade)',
    short: 'Fundo preto, print de autoridade',
    vence_quando: 'Há print real + reação tem desenvolvimento em ≥3 etapas',
    perde_quando: 'Sem print disponível, ou reação cabe em 1 frame'
  },
  2: {
    label: 'Editorial Clean (fundo claro, tipografia bold, premium)',
    short: 'Fundo claro, tipografia bold, premium',
    vence_quando: 'Matéria-colab, framework denso/educacional, tutorial formal, tom premium-neutro',
    perde_quando: 'Tom é provocativo/pessoal (vai Notebook Raw)'
  },
  3: {
    label: 'Data-Driven (fundo navy, números gigantes, dados)',
    short: 'Fundo navy, números gigantes, dados',
    vence_quando: 'Há ≥2 números comparativos e a narrativa É sobre os dados',
    perde_quando: 'Só 1 número (vai Micro-Infográfico capa) ou não há dados centrais'
  },
  4: {
    label: 'Notebook Raw (papel craft, escrita manual, anti-AI)',
    short: 'Papel craft, escrita manual, anti-AI',
    vence_quando: 'Conteúdo tem arco pessoal/opinativo (mito, reflexão, framework pessoal) e tom é informal/cru',
    perde_quando: 'É matéria-colab (precisa premium) ou tem dados centrais (vai Data-Driven)'
  }
};

export const CoverStyles = {
  1: {
    label: 'Rascunho no Papel (infográfico à lápis sobre caderno real)',
    short: 'Infográfico à lápis sobre foto real de caderno',
    vence_quando: 'Conteúdo é visualizável em 3-5 blocos (framework, fluxo, comparação) e o tom permite informalidade',
    perde_quando: 'Conteúdo é puramente verbal (frase) ou puramente numérico (1 dado)'
  },
  2: {
    label: 'Pessoa + Texto (foto real com overlay)',
    short: 'Foto real com overlay de texto protegido',
    vence_quando: 'Post é sobre uma cena específica (palestra, cliente, setup) e existe foto adequada',
    perde_quando: 'Tema é abstrato/conceitual sem cena real para ancorar'
  },
  3: {
    label: 'Micro-Infográfico (dado/métrica hero)',
    short: 'Um dado/métrica hero visualizado',
    vence_quando: 'Post inteiro orbita 1 dado quantitativo verificável com fonte citada',
    perde_quando: 'Tem ≥2 dados centrais (vai Data-Driven carrossel) ou nenhum dado'
  },
  4: {
    label: 'Print de Autoridade (screenshot + opinião)',
    short: 'Screenshot + opinião do Thiago',
    vence_quando: 'Reação curta a algo público (tweet, headline) cabe em 1-2 parágrafos',
    perde_quando: 'Não tem print real, ou reação precisa de desenvolvimento longo'
  },
  5: {
    label: 'Quote Card (citação editorial premium)',
    short: 'Citação editorial premium',
    vence_quando: 'Existe UMA frase central falsificável que vira screenshot por si só',
    perde_quando: 'A força do post está no desenvolvimento, não numa frase isolada'
  }
};

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
    const meta = CarouselStyles[estilo] || CarouselStyles[1];
    return `/z-carrosseis-linkedin
Tema: "${post.title}"
Estilo: ${estilo} — ${meta.label}

Contexto do post original:
Hook: ${post.hookText}

${post.body}`;
  },

  capa(post, estilo) {
    const meta = CoverStyles[estilo] || CoverStyles[1];
    return `/z-capas-linkedin
Tema: "${post.title}"
Estilo: ${estilo} — ${meta.label}

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
