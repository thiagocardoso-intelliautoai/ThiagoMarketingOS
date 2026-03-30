#!/usr/bin/env node
/**
 * upload-cover-cli.js
 * 
 * CLI para fazer upload de uma capa PNG para o Supabase.
 * Busca o post_id pelo título e chama uploadCover().
 * 
 * Uso:
 *   node upload-cover-cli.js --slug "slug" --file cover.png --style "Quote Card" --post-title "Título"
 */

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const { supabase, uploadCover, slugify } = require('./upload-to-supabase');

// ── CLI Arguments ─────────────────────────────────────────────
const argv = yargs(process.argv.slice(2))
  .usage('Uso: node upload-cover-cli.js --slug "slug" --file cover.png --style "Estilo" --post-title "Título"')
  .option('slug', {
    alias: 's',
    type: 'string',
    describe: 'Slug da capa (se omitido, gera a partir do post-title)'
  })
  .option('file', {
    alias: 'f',
    type: 'string',
    demandOption: true,
    describe: 'Caminho para o arquivo PNG da capa'
  })
  .option('style', {
    type: 'string',
    demandOption: true,
    describe: 'Estilo visual da capa (ex: "Quote Card", "Rascunho no Papel")'
  })
  .option('post-title', {
    alias: 't',
    type: 'string',
    demandOption: true,
    describe: 'Título do post pai (para buscar o post_id no Supabase)'
  })
  .help()
  .parseSync();

// ── Main ──────────────────────────────────────────────────────

async function main() {
  const filePath = path.resolve(argv.file);
  const postTitle = argv['post-title'];
  const slug = argv.slug || slugify(postTitle);
  const style = argv.style;

  console.log('');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║  upload-cover-cli — Upload de Capa para Supabase║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('');

  // 1. Validar arquivo
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Arquivo não encontrado: ${filePath}`);
    process.exit(1);
  }

  const stats = fs.statSync(filePath);
  console.log(`🖼️  Arquivo: ${path.basename(filePath)} (${(stats.size / 1024).toFixed(1)} KB)`);
  console.log(`🔑 Slug: ${slug}`);
  console.log(`🎨 Estilo: ${style}`);
  console.log(`📝 Post: ${postTitle}`);
  console.log('');

  // 2. Buscar post_id pelo título
  const postSlug = slugify(postTitle);
  
  const { data: post, error: postErr } = await supabase
    .from('posts')
    .select('id, title, slug')
    .eq('slug', postSlug)
    .maybeSingle();

  if (postErr) {
    console.error(`❌ Erro ao buscar post: ${postErr.message}`);
    process.exit(1);
  }

  if (!post) {
    console.error(`❌ Post não encontrado com slug "${postSlug}"`);
    console.error(`   Dica: Rode save-post-cli.js primeiro para salvar o post`);
    process.exit(1);
  }

  console.log(`✅ Post encontrado: "${post.title}" (id: ${post.id})`);

  // 3. Upload da capa
  try {
    const result = await uploadCover(slug, filePath, style, post.id);
    console.log('');
    console.log(`✅ Capa "${slug}" uploaded → ${result.imageUrl}`);
    console.log(`   Storage path: ${result.storagePath}`);
  } catch (err) {
    console.error(`❌ Erro no upload: ${err.message}`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('❌ Erro fatal:', err.message);
  process.exit(1);
});
