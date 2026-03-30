#!/usr/bin/env node
/**
 * list-source-photos-cli.js
 *
 * Listagem formatada de fotos na tabela source_photos.
 *
 * Uso:
 *   node shared/scripts/list-source-photos-cli.js --category papers
 *   node shared/scripts/list-source-photos-cli.js               # lista todas
 *   node shared/scripts/list-source-photos-cli.js --json         # output JSON
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

// ── Dotenv ────────────────────────────────────────────────────
require('dotenv').config({
  path: path.resolve(__dirname, '../../squads/capas-linkedin/.env')
});

// ── Args ──────────────────────────────────────────────────────
const argv = yargs(hideBin(process.argv))
  .usage('Uso: $0 [--category <cat>] [--json]')
  .option('category', {
    alias: 'c',
    describe: 'Filtrar por categoria (papers, photos, profile)',
    choices: ['papers', 'photos', 'profile'],
    type: 'string',
  })
  .option('json', {
    alias: 'j',
    describe: 'Output em formato JSON',
    type: 'boolean',
    default: false,
  })
  .strict()
  .help()
  .parseSync();

// ── Supabase client ───────────────────────────────────────────
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY devem estar definidos no .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

// ── Main ──────────────────────────────────────────────────────
async function main() {
  const { category, json: jsonOutput } = argv;

  // Build query
  let query = supabase
    .from('source_photos')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true })
    .order('filename', { ascending: true });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error(`❌ Erro na consulta: ${error.message}`);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log(category
      ? `📭 Nenhuma foto encontrada na categoria "${category}".`
      : '📭 Nenhuma foto encontrada.');
    process.exit(0);
  }

  // JSON output
  if (jsonOutput) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  // Formatted table output
  console.log(`\n📸 Source Photos${category ? ` — ${category}` : ' — todas'} (${data.length} fotos)\n`);

  // Calculate column widths
  const cols = {
    idx:         3,
    filename:    Math.max(8, ...data.map(r => r.filename.length)),
    description: Math.max(11, ...data.map(r => (r.description || '').length)),
    bestFor:     Math.max(8, ...data.map(r => (r.best_for || '').length)),
    orientation: 10,
    category:    8,
  };

  // Cap widths for readability
  cols.filename    = Math.min(cols.filename, 55);
  cols.description = Math.min(cols.description, 45);
  cols.bestFor     = Math.min(cols.bestFor, 35);

  // Header
  const header = [
    '#'.padEnd(cols.idx),
    'Filename'.padEnd(cols.filename),
    'Description'.padEnd(cols.description),
    'Best For'.padEnd(cols.bestFor),
    'Orient'.padEnd(cols.orientation),
    'Cat'.padEnd(cols.category),
  ].join(' │ ');

  const separator = [
    '─'.repeat(cols.idx),
    '─'.repeat(cols.filename),
    '─'.repeat(cols.description),
    '─'.repeat(cols.bestFor),
    '─'.repeat(cols.orientation),
    '─'.repeat(cols.category),
  ].join('─┼─');

  console.log(header);
  console.log(separator);

  // Rows
  data.forEach((row, i) => {
    const line = [
      String(i + 1).padEnd(cols.idx),
      truncate(row.filename, cols.filename).padEnd(cols.filename),
      truncate(row.description || '', cols.description).padEnd(cols.description),
      truncate(row.best_for || '', cols.bestFor).padEnd(cols.bestFor),
      (row.orientation || '—').padEnd(cols.orientation),
      row.category.padEnd(cols.category),
    ].join(' │ ');
    console.log(line);
  });

  console.log('');
}

function truncate(str, maxLen) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1) + '…';
}

main().catch((err) => {
  console.error(`❌ Erro fatal: ${err.message}`);
  process.exit(1);
});
