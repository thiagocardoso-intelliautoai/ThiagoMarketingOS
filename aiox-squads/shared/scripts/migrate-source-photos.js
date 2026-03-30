#!/usr/bin/env node
/**
 * migrate-source-photos.js
 *
 * Migração one-shot: lê todas as fotos locais e faz upload para o Supabase.
 * Idempotente: pula fotos que já existem (por filename + category).
 *
 * Fontes:
 *   - assets/papers/*.jpg   → extrai metadados do README.md
 *   - assets/photos/*.jpg   → usa filename como description
 *   - assets/profile-photo.png → categoria "profile"
 *
 * Uso:
 *   node shared/scripts/migrate-source-photos.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// ── Dotenv ────────────────────────────────────────────────────
require('dotenv').config({
  path: path.resolve(__dirname, '../../squads/capas-linkedin/.env')
});

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

// ── Paths ─────────────────────────────────────────────────────
const ASSETS_ROOT = path.resolve(__dirname, '../../squads/capas-linkedin/assets');
const PAPERS_DIR = path.join(ASSETS_ROOT, 'papers');
const PHOTOS_DIR = path.join(ASSETS_ROOT, 'photos');
const PROFILE_PHOTO = path.join(ASSETS_ROOT, 'profile-photo.png');

// ── Parse README.md for paper metadata ────────────────────────
function parsePapersReadme() {
  const readmePath = path.join(PAPERS_DIR, 'README.md');
  if (!fs.existsSync(readmePath)) {
    console.warn('⚠️  README.md não encontrado em papers/ — usando metadados genéricos');
    return {};
  }

  const content = fs.readFileSync(readmePath, 'utf-8');
  const metadata = {};

  // Parse table rows: | # | Filename | Cenário | Tipo Papel | Orientação | Melhor Para |
  const lines = content.split('\n');
  for (const line of lines) {
    // Skip header and separator lines
    if (!line.startsWith('|') || line.includes(':-:') || line.includes('Arquivo')) continue;

    const cells = line.split('|').map(c => c.trim()).filter(Boolean);
    if (cells.length < 6) continue;

    const [num, filenameCell, cenario, tipoPapel, orientacao, melhorPara] = cells;

    // Extract filename from backticks
    const filenameMatch = filenameCell.match(/`([^`]+)`/);
    if (!filenameMatch) continue;

    const filename = filenameMatch[1];

    metadata[filename] = {
      description: cenario,
      bestFor: melhorPara,
      orientation: orientacao.toLowerCase() === 'retrato' ? 'retrato'
        : orientacao.toLowerCase() === 'paisagem' ? 'paisagem'
        : 'quadrado',
      sortOrder: parseInt(num, 10) || 0,
    };
  }

  return metadata;
}

// ── Upload a single photo ─────────────────────────────────────
async function uploadPhoto({ category, filename, absPath, description, bestFor, orientation, sortOrder, mimeType }) {
  const storagePath = `source-photos/${category}/${filename}`;

  // Check if already exists
  const { data: existing } = await supabase
    .from('source_photos')
    .select('id')
    .eq('category', category)
    .eq('filename', filename)
    .maybeSingle();

  if (existing) {
    return { status: 'skipped', filename };
  }

  // Read file
  const fileBuffer = fs.readFileSync(absPath);

  // Upload to storage
  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (uploadErr) {
    return { status: 'error', filename, error: uploadErr.message };
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(storagePath);

  // Insert into table
  const { error: insertErr } = await supabase
    .from('source_photos')
    .insert({
      category,
      filename,
      description: description || filename,
      best_for: bestFor || null,
      orientation: orientation || null,
      storage_path: storagePath,
      public_url: urlData.publicUrl,
      file_size: fileBuffer.length,
      mime_type: mimeType,
      sort_order: sortOrder || 0,
      active: true,
    });

  if (insertErr) {
    return { status: 'error', filename, error: insertErr.message };
  }

  return { status: 'uploaded', filename, publicUrl: urlData.publicUrl };
}

// ── Main ──────────────────────────────────────────────────────
async function main() {
  console.log('🚀 Iniciando migração de source photos...\n');

  const photos = [];

  // ── 1. Papers ─────────────────────────────────────────────
  const papersMetadata = parsePapersReadme();
  const paperFiles = fs.readdirSync(PAPERS_DIR)
    .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
    .sort();

  for (const filename of paperFiles) {
    const meta = papersMetadata[filename] || {};
    photos.push({
      category: 'papers',
      filename,
      absPath: path.join(PAPERS_DIR, filename),
      description: meta.description || filename,
      bestFor: meta.bestFor || null,
      orientation: meta.orientation || 'retrato',
      sortOrder: meta.sortOrder || 0,
      mimeType: 'image/jpeg',
    });
  }

  // ── 2. Photos ─────────────────────────────────────────────
  const photoFiles = fs.readdirSync(PHOTOS_DIR)
    .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
    .sort();

  for (const filename of photoFiles) {
    const ext = path.extname(filename).toLowerCase();
    photos.push({
      category: 'photos',
      filename,
      absPath: path.join(PHOTOS_DIR, filename),
      description: filename.replace(/\.[^.]+$/, ''),
      bestFor: null,
      orientation: null,
      sortOrder: 0,
      mimeType: ext === '.png' ? 'image/png' : 'image/jpeg',
    });
  }

  // ── 3. Profile photo ──────────────────────────────────────
  if (fs.existsSync(PROFILE_PHOTO)) {
    photos.push({
      category: 'profile',
      filename: 'profile-photo.png',
      absPath: PROFILE_PHOTO,
      description: 'Foto de perfil LinkedIn',
      bestFor: 'Profile, About',
      orientation: 'retrato',
      sortOrder: 1,
      mimeType: 'image/png',
    });
  }

  // ── Execute uploads ───────────────────────────────────────
  const total = photos.length;
  let uploaded = 0;
  let skipped = 0;
  let errors = 0;

  const countByCategory = { papers: 0, photos: 0, profile: 0 };

  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    const prefix = `[${i + 1}/${total}]`;

    const result = await uploadPhoto(photo);

    if (result.status === 'uploaded') {
      console.log(`${prefix} ✅ ${result.filename} → uploaded`);
      uploaded++;
      countByCategory[photo.category]++;
    } else if (result.status === 'skipped') {
      console.log(`${prefix} ⏭️  ${result.filename} → já existe`);
      skipped++;
    } else {
      console.log(`${prefix} ❌ ${result.filename} → erro: ${result.error}`);
      errors++;
    }
  }

  // ── Summary ───────────────────────────────────────────────
  console.log('\n' + '═'.repeat(60));
  if (uploaded > 0) {
    console.log(`✅ ${uploaded} fotos migradas (${countByCategory.papers} papers + ${countByCategory.photos} photos + ${countByCategory.profile} profile)`);
  }
  if (skipped > 0) {
    console.log(`⏭️  ${skipped} fotos já existiam (puladas)`);
  }
  if (errors > 0) {
    console.log(`❌ ${errors} erros durante a migração`);
    process.exit(1);
  }
  console.log('═'.repeat(60));
}

main().catch((err) => {
  console.error(`❌ Erro fatal: ${err.message}`);
  process.exit(1);
});
