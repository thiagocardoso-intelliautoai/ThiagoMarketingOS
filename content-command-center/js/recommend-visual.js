// recommend-visual.js — VISUAL-002
//
// Sugestao automatica de visual (formato + estilo) para um post finalizado.
// Funcao pura: recebe um post e devolve { formato, estilo, confianca, motivo }.
//
// Sinais usados:
//   - post.framework         (PAS / Contraste / Storytelling / Lista / Declaracao+Defesa)
//   - post.fonteTese         (Skills em Producao / Benchmark Real / Process Diagnostic / Falha Documentada)
//   - post.body, post.hookText
//   - derivados via regex: char_count, dados_quant, tem_etapas, frase_falsificavel
//   - opcionais (vindos do checkbox no preview): post.temPrint, post.temFotoContextual
//
// Source-of-truth da arvore de decisao: docs/architecture/VISUAL-RECOMMENDER-PLAN.md §3.4

// Slugs internos (precisam bater com data-style nos cards do CCC)
export const FORMATO_SLUGS = {
  capa: 'capa',
  carrossel: 'carrossel'
};

// Mapa estilo (string) -> num do card no render.js. Usado pra aplicar classe no card certo.
export const ESTILO_TO_CARD = {
  carrossel: {
    'Twitter-Style': 1,
    'Editorial Clean': 2,
    'Data-Driven': 3,
    'Notebook Raw': 4
  },
  capa: {
    'Rascunho no Papel': 1,
    'Pessoa + Texto': 2,
    'Micro-Infografico': 3,
    'Print de Autoridade': 4,
    'Quote Card': 5
  }
};

// ─── Sinal extraction ───────────────────────────────────────────────────────

const RX_PERCENT = /\d+\s*%/g;
const RX_CURRENCY = /R\$\s?\d+/g;
const RX_MULTIPLIER = /\b\d+\s*x\b/gi;
const RX_TIME = /\d+\s*(?:min|h|seg|dias?|meses?|anos?)\b/gi;
// Aceita unidades coladas no numero (ex: "de 800ms para 350ms", "de R$200 para R$450")
const RX_ANTES_DEPOIS = /(?:\bde|from)\s+R?\$?\s*\d+(?:\s*[a-zA-Z%$/]+)?\s+(?:para|to)\s+R?\$?\s*\d+/gi;
const RX_VS = /\bvs\.?\b/gi;
const RX_NUMBERED_LIST = /^\s*\d+[\.\)]\s/gm;
const RX_PASSO = /\bpasso\s+\d+/gi;
const RX_CONTRAINTUITIVO = /\b(n[aã]o|nunca|verdade|mito|errado|maioria|todo mundo)\b/i;

export function extractSignals(post) {
  const body = String(post.body || '');
  const hookText = String(post.hookText || '');
  const fullText = `${hookText}\n\n${body}`;
  const charCount = fullText.length;

  // Conta dados quantitativos (qualquer numero com unidade)
  const dadosQuantTotal =
    (fullText.match(RX_PERCENT) || []).length +
    (fullText.match(RX_CURRENCY) || []).length +
    (fullText.match(RX_MULTIPLIER) || []).length +
    (fullText.match(RX_TIME) || []).length;

  // Comparativo: de X para Y, ou multiplos `vs`
  const antesDepois = (fullText.match(RX_ANTES_DEPOIS) || []).length;
  const vsCount = (fullText.match(RX_VS) || []).length;
  const dadosQuantComparativos = antesDepois + (vsCount >= 1 ? Math.min(vsCount, 3) : 0);

  // Etapas: lista numerada OU mencao explicita "passo N"
  const numberedItems = (fullText.match(RX_NUMBERED_LIST) || []).length;
  const passos = (fullText.match(RX_PASSO) || []).length;
  const temEtapas = Math.max(numberedItems, passos);

  // Frase falsificavel: hook curto + termo contraintuitivo
  const fraseFalsificavel =
    hookText.length > 0 &&
    hookText.length <= 140 &&
    RX_CONTRAINTUITIVO.test(hookText);

  return {
    framework: post.framework || '',
    fonte_tese: post.fonteTese || '',
    char_count: charCount,
    dados_quant: dadosQuantTotal,
    dados_quant_comparativos: dadosQuantComparativos,
    tem_etapas: temEtapas,
    frase_falsificavel: fraseFalsificavel,
    tem_print: !!post.temPrint,
    tem_foto_contextual: !!post.temFotoContextual,
    is_materia_colab: post.contentType === 'materia-colab' || /materia-colab|matéria-colab/i.test(post.theme || '')
  };
}

// ─── Confidence ─────────────────────────────────────────────────────────────

function calcConfidence(sig, formato, estilo) {
  // Alta: ha sinal forte e nao-ambiguo (ex: ≥3 etapas + framework=Lista, ou ≥2 dados + Benchmark)
  // Baixa: empate / fallback default
  // Media: caso intermediario
  if (formato === 'carrossel') {
    if (sig.tem_etapas >= 3 && (estilo === 'Notebook Raw' || estilo === 'Editorial Clean')) return 'alta';
    if (sig.dados_quant_comparativos >= 2 && estilo === 'Data-Driven') return 'alta';
    if (sig.tem_print && estilo === 'Twitter-Style') return 'alta';
    if (sig.is_materia_colab && estilo === 'Editorial Clean') return 'alta';
    return 'media';
  }
  if (formato === 'capa') {
    if (sig.frase_falsificavel && estilo === 'Quote Card') return 'alta';
    if (sig.dados_quant === 1 && estilo === 'Micro-Infografico') return 'alta';
    if (sig.tem_print && estilo === 'Print de Autoridade') return 'alta';
    if (sig.tem_foto_contextual && sig.framework === 'Storytelling' && estilo === 'Pessoa + Texto') return 'alta';
    if (estilo === 'Rascunho no Papel' && sig.char_count > 400) return 'media';
    return 'baixa';
  }
  return 'baixa';
}

// ─── Main ───────────────────────────────────────────────────────────────────

export function recommendVisual(post) {
  if (!post) return null;
  const sig = extractSignals(post);
  const motivos = [];

  // Decisao 1: Capa OU Carrossel
  let formato;
  if (sig.tem_etapas >= 3) {
    formato = 'carrossel'; motivos.push(`${sig.tem_etapas} etapas sequenciais`);
  } else if (sig.dados_quant_comparativos >= 2) {
    formato = 'carrossel'; motivos.push('múltiplos dados comparativos');
  } else if (sig.char_count > 1100 && ['Lista', 'Declaração+Defesa', 'Declaracao+Defesa'].includes(sig.framework)) {
    formato = 'carrossel'; motivos.push(`framework ${sig.framework} denso`);
  } else if (sig.framework === 'Storytelling' && sig.char_count > 1000) {
    formato = 'carrossel'; motivos.push('storytelling com arco longo');
  } else if (sig.frase_falsificavel || sig.dados_quant === 1 || sig.char_count <= 800) {
    formato = 'capa'; motivos.push('mensagem unitária');
  } else {
    formato = 'capa'; motivos.push('default — CTR maior na thumbnail');
  }

  // Decisao 2: Qual estilo
  let estilo;
  if (formato === 'carrossel') {
    if (sig.dados_quant_comparativos >= 2 && sig.fonte_tese === 'Benchmark Real') {
      estilo = 'Data-Driven'; motivos.push('Benchmark Real com dados');
    } else if (sig.tem_print && sig.char_count > 800) {
      estilo = 'Twitter-Style'; motivos.push('print + reação longa');
    } else if (sig.is_materia_colab) {
      estilo = 'Editorial Clean'; motivos.push('matéria-colab pede premium');
    } else if (['Falha Documentada', 'Skills em Produção', 'Skills em Producao', 'Process Diagnostic'].includes(sig.fonte_tese)) {
      estilo = 'Notebook Raw'; motivos.push(`fonte ${sig.fonte_tese} pede tom pessoal`);
    } else {
      estilo = 'Editorial Clean'; motivos.push('versátil para conteúdo neutro');
    }
  } else { // capa
    if (sig.frase_falsificavel && sig.char_count <= 600) {
      estilo = 'Quote Card'; motivos.push('frase falsificável forte');
    } else if (sig.dados_quant === 1) {
      estilo = 'Micro-Infografico'; motivos.push('1 dado-hero');
    } else if (sig.tem_print) {
      estilo = 'Print de Autoridade'; motivos.push('reação curta com print');
    } else if (sig.tem_foto_contextual && sig.framework === 'Storytelling') {
      estilo = 'Pessoa + Texto'; motivos.push('storytelling com foto contextual');
    } else {
      estilo = 'Rascunho no Papel'; motivos.push('visualizável humanizado');
    }
  }

  const confianca = calcConfidence(sig, formato, estilo);

  return {
    formato,
    estilo,
    confianca,
    motivo: motivos.slice(0, 2).join(' + '),
    cardNum: ESTILO_TO_CARD[formato][estilo] || null
  };
}

// ─── Helpers para leitura/escrita do campo persistido ───────────────────────

// post.recommendedVisual no DB e armazenado como string "carrossel/Notebook Raw (motivo)"
// Esta funcao parseia ela de volta para objeto.
export function parseRecommendedVisual(stringValue) {
  if (!stringValue || typeof stringValue !== 'string') return null;
  const match = stringValue.match(/^(capa|carrossel)\/([^(]+?)(?:\s*\((.+)\))?$/i);
  if (!match) return null;
  const formato = match[1].toLowerCase();
  const estilo = match[2].trim();
  const motivo = (match[3] || '').trim();
  return {
    formato,
    estilo,
    motivo,
    confianca: 'alta', // se veio do squad, assume alta confianca
    cardNum: ESTILO_TO_CARD[formato]?.[estilo] || null
  };
}

export function stringifyRecommendation(rec) {
  if (!rec) return '';
  return `${rec.formato}/${rec.estilo}${rec.motivo ? ` (${rec.motivo})` : ''}`;
}

// Wrapper: tenta usar campo do DB; se vazio, recalcula client-side.
export function getRecommendation(post) {
  if (post?.recommendedVisual) {
    const parsed = parseRecommendedVisual(post.recommendedVisual);
    if (parsed) return parsed;
  }
  return recommendVisual(post);
}
