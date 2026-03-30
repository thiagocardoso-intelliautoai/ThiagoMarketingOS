#!/usr/bin/env node
/**
 * upload-source-photo-cli.js
 *
 * Upload individual de uma foto para o Supabase Storage + insert na tabela source_photos.
 * Idempotente: se (category, filename) já existe → upsert.
 *
 * Uso:
 *   node shared/scripts/upload-source-photo-cli.js \
 *     --category papers \
 *     --file assets/papers/paper-01-monitor-winning-sales-mao-segurando.jpg \
 *     --description "Mão segurando caderno + monitor WS" \
 *     --best-for "Vendas B2B, WS" \
 *     --orientation retrato
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

// ── Dotenv ────────────────────────────────────────────────────
require('dotenv').config({
  path: path.resolve(__dirname, '../../squads/capas-linkedin/.env')
});

// ── Args ──────────────────────────────────────────────────────
const argv = yargs(hideBin(process.argv))
  .usage('Uso: $0 --category <cat> --file <path> [--description "..."] [--best-for "..."] [--orientation <ori>]')
  .option('category', {
    alias: 'c',
    describe: 'Categoria da foto (papers, photos, profile)',
    choices: ['papers', 'photos', 'profile'],
    demandOption: true,
  })
  .option('file', {
    alias: 'f',
    describe: 'Caminho do arquivo de imagem',
    type: 'string',
    demandOption: true,
  })
  .option('description', {
    alias: 'd',
    describe: 'Descrição da foto',
    type: 'string',
    default: null,
  })
  .option('best-for', {
    alias: 'b',
    describe: 'Melhor uso da foto',
    type: 'string',
    default: null,
  })
  .option('orientation', {
    alias: 'o',
    describe: 'Orientação da foto',
    choices: ['retrato', 'paisagem', 'quadrado'],
    default: null,
  })
  .option('sort-order', {
    alias: 's',
    describe: 'Ordem de exibição',
    type: 'number',
    default: 0,
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

const BUCKET = 'content-assets';

// ── Main ──────────────────────────────────────────────────────
async function main() {
  const { category, file: filePath, description, bestFor, orientation, sortOrder } = argv;

  // 1. Resolve path (relative to CWD or absolute)
  const absPath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);

  // 2. Validate file exists
  if (!fs.existsSync(absPath)) {
    console.error(`❌ Arquivo não encontrado: ${absPath}`);
    process.exit(1);
  }

  const filename = path.basename(absPath);
  const ext = path.extname(filename).toLowerCase();
  const mimeType = ext === '.png' ? 'image/png'
    : ext === '.jpeg' || ext === '.jpg' ? 'image/jpeg'
    : 'application/octet-stream';

  const storagePath = `source-photos/${category}/${filename}`;

  console.log(`📤 Uploading ${filename} → ${storagePath}...`);

  // 3. Read file
  const fileBuffer = fs.readFileSync(absPath);

  // 4. Upload to Storage (upsert)
  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (uploadErr) {
    console.error(`❌ Erro no upload: ${uploadErr.message}`);
    process.exit(1);
  }

  // 5. Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(storagePath);

  const publicUrl = urlData.publicUrl;

  // 6. Upsert in source_photos table
  const row = {
    category,
    filename,
    description: description || filename,
    best_for: bestFor || null,
    orientation: orientation || null,
    storage_path: storagePath,
    public_url: publicUrl,
    file_size: fileBuffer.length,
    mime_type: mimeType,
    sort_order: sortOrder,
    active: true,
    updated_at: new Date().toISOString(),
  };

  const { data: existing } = await supabase
    .from('source_photos')
    .select('id')
    .eq('category', category)
    .eq('filename', filename)
    .maybeSingle();

  if (existing) {
    // Update existing record
    const { error: updateErr } = await supabase
      .from('source_photos')
      .update(row)
      .eq('id', existing.id);

    if (updateErr) {
      console.error(`❌ Erro no update: ${updateErr.message}`);
      process.exit(1);
    }
    console.log(`🔄 Atualizado (já existia): ${filename}`);
  } else {
    // Insert new record
    const { error: insertErr } = await supabase
      .from('source_photos')
      .insert(row);

    if (insertErr) {
      console.error(`❌ Erro no insert: ${insertErr.message}`);
      process.exit(1);
    }
    console.log(`✅ Inserido: ${filename}`);
  }

  console.log(`🔗 ${publicUrl}`);
}

main().catch((err) => {
  console.error(`❌ Erro fatal: ${err.message}`);
  process.exit(1);
});
