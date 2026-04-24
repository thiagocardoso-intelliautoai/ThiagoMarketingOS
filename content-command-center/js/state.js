// state.js — Mode definitions with Lucide SVG icons

const svgIcon = (paths) => `<svg viewBox="0 0 24 24">${paths}</svg>`;

export const MODE_LABELS = {
  1: {
    name: 'Pesquisa Semanal',
    icon: svgIcon('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>'),
    desc: 'Varrer fontes Tier 1/2/3 e trazer os top insights da semana'
  },
  2: {
    name: 'Benchmark Concorrentes',
    icon: svgIcon('<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 6 9 6 9Z"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 18 9 18 9Z"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>'),
    desc: 'Analisar o que os top players gringos estão publicando'
  },
  3: {
    name: 'Briefing On-Demand',
    icon: svgIcon('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 13H8"/><path d="M16 17H8"/><path d="M16 13h-2"/>'),
    desc: 'Pesquisar a fundo um tema específico'
  },
  4: {
    name: 'Escrever Post Direto',
    icon: svgIcon('<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>'),
    desc: 'Já tem a ideia — pula pesquisa, vai direto pro Redator'
  },
};


// ─── FONTE DE TESE CONFIG ───
// Substitui PILLAR_CONFIG (ACRE eliminado na v2)
export const FONTE_TESE_CONFIG = {
  skills_producao: { label: 'Skills em Produção', cssClass: 'badge-skills' },
  benchmark_real: { label: 'Benchmark Real', cssClass: 'badge-benchmark' },
  process_diagnostic: { label: 'Process Diagnostic', cssClass: 'badge-diagnostic' },
  falha_documentada: { label: 'Falha Documentada', cssClass: 'badge-falha' },
};

export const STATUS_LABELS = {
  rascunho: 'Rascunho',
  agendado: 'Agendado',
  publicado: 'Publicado',
};

export const URGENCY_LABELS = {
  urgente: 'Urgente',
  relevante: 'Relevante',
  pode_esperar: 'Pode esperar',
};
