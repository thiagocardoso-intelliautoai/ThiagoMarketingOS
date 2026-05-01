#!/usr/bin/env node
/**
 * save-pautas-cli.js
 *
 * CLI para salvar pautas centrais + subpautas no Supabase.
 * Parseia os markdowns gerados pelo squad seed-pautas-centrais e persiste via upsert.
 * Idempotente: pode rodar múltiplas vezes sem duplicar dados.
 *
 * Uso:
 *   node save-pautas-cli.js
 *   node save-pautas-cli.js --pautas-file output/pautas-centrais.md --subpautas-file output/subpautas/seed-inicial.md
 */

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const { savePauta, saveSubpauta } = require('./upload-to-supabase');

// ── Mapeamentos markdown → DB enum ────────────────────────────

const FONTE_TESE_MAP = {
  'skills em producao':          'skills_producao',
  'skills em produção':          'skills_producao',
  'skills producao':             'skills_producao',
  'benchmark real':              'benchmark_real',
  'process diagnostic':         'process_diagnostic',
  'process diagnostic anonimo': 'process_diagnostic',
  'process diagnostic anônimo': 'process_diagnostic',
  'falha documentada':           'falha_documentada',
};

const URGENCIA_MAP = {
  'urgente':       'urgente',
  'relevante':     'relevante',
  'estoque':       'pode_esperar',
  'pode_esperar':  'pode_esperar',
};

function normalizeFonteTese(raw) {
  const key = raw.trim().toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '');
  for (const [k, v] of Object.entries(FONTE_TESE_MAP)) {
    if (key === k || key.startsWith(k)) return v;
  }
  console.warn(`⚠️  fonte_tese não reconhecida: "${raw}" → usando "skills_producao"`);
  return 'skills_producao';
}

function normalizeUrgencia(raw) {
  // Remover emoji e espaços extras: "🟡 Relevante" → "relevante"
  const clean = raw.trim()
    .replace(/^[\u{1F300}-\u{1FFFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\s]+/u, '')
    .trim().toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '');
  return URGENCIA_MAP[clean] || 'relevante';
}

// ── Parser: pautas-centrais.md ────────────────────────────────

/**
 * Parseia o arquivo pautas-centrais.md e retorna array de pautas.
 *
 * Formato esperado:
 *   ## Pauta Central N: Nome
 *   **Fonte de tese:** Valor
 *   **Descrição:** Texto
 */
function parsePautasMd(content) {
  const pautas = [];
  const sections = content.split(/^## Pauta Central \d+:/m).slice(1);

  sections.forEach((section, idx) => {
    const lines = section.trim().split('\n');

    // Primeira linha: " Nome da Pauta"
    const nome = lines[0].trim();

    let fonte_tese = null;
    let descricao = null;

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('**Fonte de tese:**')) {
        fonte_tese = normalizeFonteTese(trimmed.replace('**Fonte de tese:**', '').trim());
      }
      if (trimmed.startsWith('**Descrição:**')) {
        descricao = trimmed.replace('**Descrição:**', '').trim();
      }
    }

    if (!nome || !fonte_tese) {
      console.warn(`⚠️  Pauta ${idx + 1} sem nome ou fonte_tese — ignorada`);
      return;
    }

    pautas.push({ nome, fonte_tese, descricao, ordem: idx });
  });

  return pautas;
}

// ── Parser: subpautas/*.md ────────────────────────────────────

/**
 * Parseia um arquivo de subpautas e retorna array de subpautas.
 * Cada subpauta inclui pauta_nome para resolução do pauta_central_id.
 *
 * Formato esperado:
 *   ## Pauta Central N: Nome
 *   ### Subpauta: Titulo [— 🎯 Lead Magnet]
 *   - **Pauta Central:** Nome
 *   - **Ângulo:** Texto
 *   - **Hook embrionário:** "Texto"
 *   - **Matéria-prima:** Texto
 *   - **Urgência:** 🟡 Relevante
 */
function parseSubpautasMd(content) {
  const subpautas = [];

  // Dividir por seções de subpauta (### Subpauta:)
  const sections = content.split(/^### Subpauta:/m).slice(1);

  for (const section of sections) {
    const lines = section.split('\n');

    // Primeira linha: " Titulo [— 🎯 Lead Magnet]"
    const titleLine = lines[0].trim();
    const is_lead_magnet = titleLine.includes('🎯 Lead Magnet');
    const titulo = titleLine
      .replace(/\s*—\s*🎯\s*Lead Magnet\s*$/i, '')
      .trim();

    let pauta_nome = null;
    let angulo = null;
    let hook_embrionario = null;
    let materia_prima = null;
    let urgencia = 'relevante';

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith('- **Pauta Central:**')) {
        pauta_nome = trimmed.replace('- **Pauta Central:**', '').trim();
      }
      else if (trimmed.startsWith('- **Ângulo:**') || trimmed.startsWith('- **Angulo:**')) {
        angulo = trimmed.replace(/- \*\*[ÂA]ngulo:\*\*\s*/, '').trim();
      }
      else if (trimmed.startsWith('- **Hook embrionário:**') || trimmed.startsWith('- **Hook embrionario:**')) {
        hook_embrionario = trimmed
          .replace(/- \*\*Hook embri[oó]n[aá]rio:\*\*\s*/, '')
          .replace(/^[""]|[""]$/g, '')
          .replace(/^"|"$/g, '')
          .trim();
      }
      else if (trimmed.startsWith('- **Matéria-prima:**') || trimmed.startsWith('- **Materia-prima:**')) {
        materia_prima = trimmed.replace(/- \*\*Mat[eé]ria-prima:\*\*\s*/, '').trim();
      }
      else if (trimmed.startsWith('- **Urgência:**') || trimmed.startsWith('- **Urgencia:**')) {
        const rawUrgencia = trimmed.replace(/- \*\*Urg[eê]ncia:\*\*\s*/, '').trim();
        urgencia = normalizeUrgencia(rawUrgencia);
      }
    }

    if (!titulo || !pauta_nome) {
      console.warn(`⚠️  Subpauta sem título ou pauta_nome — ignorada`);
      continue;
    }

    subpautas.push({ titulo, pauta_nome, angulo, hook_embrionario, materia_prima, urgencia, is_lead_magnet });
  }

  return subpautas;
}

// ── CLI Arguments ─────────────────────────────────────────────

const SQUAD_DIR = path.resolve(__dirname, '../../squads/seed-pautas-centrais');

const argv = yargs(process.argv.slice(2))
  .usage('Uso: node save-pautas-cli.js [--pautas-file PATH] [--subpautas-file PATH]')
  .option('pautas-file', {
    alias: 'p',
    type: 'string',
    default: path.join(SQUAD_DIR, 'output/pautas-centrais.md'),
    describe: 'Caminho para o markdown de pautas centrais',
  })
  .option('subpautas-file', {
    alias: 's',
    type: 'string',
    default: path.join(SQUAD_DIR, 'output/subpautas/seed-inicial.md'),
    describe: 'Caminho para o markdown de subpautas',
  })
  .help()
  .parseSync();

// ── Main ──────────────────────────────────────────────────────

async function main() {
  const pautasPath = path.resolve(argv['pautas-file']);
  const subpautasPath = path.resolve(argv['subpautas-file']);

  console.log('');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║  save-pautas-cli — Salvar no Supabase            ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('');

  // Verificar arquivos
  if (!fs.existsSync(pautasPath)) {
    console.error(`❌ Arquivo não encontrado: ${pautasPath}`);
    process.exit(1);
  }
  if (!fs.existsSync(subpautasPath)) {
    console.error(`❌ Arquivo não encontrado: ${subpautasPath}`);
    process.exit(1);
  }

  console.log(`📁 Pautas:    ${path.basename(pautasPath)}`);
  console.log(`📁 Subpautas: ${path.basename(subpautasPath)}`);
  console.log('');

  // 1. Parsear pautas
  const pautasContent = fs.readFileSync(pautasPath, 'utf-8');
  const pautas = parsePautasMd(pautasContent);

  if (pautas.length === 0) {
    console.error('❌ Nenhuma pauta encontrada no arquivo');
    process.exit(1);
  }

  // 2. Salvar pautas + construir mapa nome → id
  console.log(`📐 Pautas encontradas: ${pautas.length}`);
  const pautaIdMap = {};

  for (const pauta of pautas) {
    const saved = await savePauta(pauta);
    pautaIdMap[pauta.nome] = saved.id;
    console.log(`   ✅ [${pauta.fonte_tese}] "${pauta.nome}" (id: ${saved.id})`);
  }

  console.log('');

  // 3. Parsear subpautas
  const subpautasContent = fs.readFileSync(subpautasPath, 'utf-8');
  const subpautas = parseSubpautasMd(subpautasContent);

  console.log(`📐 Subpautas encontradas: ${subpautas.length}`);

  let savedCount = 0;
  let skippedCount = 0;

  for (const sub of subpautas) {
    // Resolver pauta_central_id pelo nome
    const pauta_central_id = pautaIdMap[sub.pauta_nome];

    if (!pauta_central_id) {
      console.warn(`⚠️  Pauta não encontrada para subpauta "${sub.titulo}" (pauta: "${sub.pauta_nome}") — ignorada`);
      skippedCount++;
      continue;
    }

    try {
      const saved = await saveSubpauta({
        pauta_central_id,
        titulo: sub.titulo,
        angulo: sub.angulo,
        hook_embrionario: sub.hook_embrionario,
        materia_prima: sub.materia_prima,
        urgencia: sub.urgencia,
        status: 'ativa',
        is_lead_magnet: sub.is_lead_magnet,
      });
      savedCount++;
      const lmBadge = sub.is_lead_magnet ? ' 🎯' : '';
      console.log(`   ✅ [${sub.urgencia}]${lmBadge} "${sub.titulo.substring(0, 55)}..." (id: ${saved.id})`);
    } catch (err) {
      console.error(`   ❌ Erro ao salvar "${sub.titulo}": ${err.message}`);
      skippedCount++;
    }
  }

  console.log('');
  console.log('────────────────────────────────────────────────────');
  console.log(`✅ ${pautas.length} pauta(s) + ${savedCount} subpauta(s) salvas no Supabase`);
  if (skippedCount > 0) {
    console.log(`⚠️  ${skippedCount} subpauta(s) ignorada(s) (erro ou pauta não resolvida)`);
  }
  console.log('');
}

main().catch(err => {
  console.error('❌ Erro fatal:', err.message);
  process.exit(1);
});
