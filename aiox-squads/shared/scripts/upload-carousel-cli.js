#!/usr/bin/env node
/**
 * upload-carousel-cli.js
 * 
 * CLI para fazer upload de um carrossel (slides PNG + PDF) para o Supabase.
 * Detecta automaticamente os slides e PDF no diretório.
 * 
 * Uso:
 *   node upload-carousel-cli.js --slug "slug" --slides-dir output/slides/slug/ --style "twitter-style" --post-title "Título"
 */

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const { supabase, uploadCarousel, slugify } = require('./upload-to-supabase');

// ── CLI Arguments ─────────────────────────────────────────────
const argv = yargs(process.argv.slice(2))
  .usage('Uso: node upload-carousel-cli.js --slug "slug" --slides-dir output/slides/slug/ --style "estilo" --post-title "Título"')
  .option('slug', {
    alias: 's',
    type: 'string',
    describe: 'Slug do carrossel (se omitido, gera a partir do post-title)'
  })
  .option('slides-dir', {
    alias: 'd',
    type: 'string',
    demandOption: true,
    describe: 'Diretório contendo os slides PNG e o PDF'
  })
  .option('style', {
    type: 'string',
    demandOption: true,
    describe: 'Estilo visual do carrossel (ex: "twitter-style", "editorial-clean")'
  })
  .option('post-title', {
    alias: 't',
    type: 'string',
    demandOption: true,
    describe: 'Título do post pai (para buscar o post_id no Supabase)'
  })
  .help()
  .parseSync();

// ── Helpers ───────────────────────────────────────────────────

/**
 * Detecta slides PNG e PDF em um diretório.
 */
function detectAssets(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  // Slides PNG em ordem (slide-01.png, slide-02.png, etc.)
  const slidePngs = files
    .filter(f => /^slide-\d+\.png$/i.test(f))
    .sort()
    .map(f => path.join(dirPath, f));

  // PDF (pegar o primeiro encontrado)
  const pdfFile = files.find(f => f.toLowerCase().endsWith('.pdf'));
  const pdfPath = pdfFile ? path.join(dirPath, pdfFile) : null;

  return { slidePngs, pdfPath };
}

// ── Main ──────────────────────────────────────────────────────

async function main() {
  const slidesDir = path.resolve(argv['slides-dir']);
  const postTitle = argv['post-title'];
  const slug = argv.slug || slugify(postTitle);
  const style = argv.style;

  console.log('');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║  upload-carousel-cli — Upload de Carrossel      ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('');

  // 1. Validar diretório
  if (!fs.existsSync(slidesDir)) {
    console.error(`❌ Diretório não encontrado: ${slidesDir}`);
    process.exit(1);
  }

  // 2. Detectar assets
  const { slidePngs, pdfPath } = detectAssets(slidesDir);

  console.log(`📂 Diretório: ${slidesDir}`);
  console.log(`🔑 Slug: ${slug}`);
  console.log(`🎨 Estilo: ${style}`);
  console.log(`📝 Post: ${postTitle}`);
  console.log(`📑 Slides encontrados: ${slidePngs.length}`);
  
  if (slidePngs.length > 0) {
    slidePngs.forEach((s, i) => {
      const size = (fs.statSync(s).size / 1024).toFixed(1);
      console.log(`   ${i + 1}. ${path.basename(s)} (${size} KB)`);
    });
  }

  if (pdfPath) {
    const pdfSize = (fs.statSync(pdfPath).size / 1024).toFixed(1);
    console.log(`📄 PDF: ${path.basename(pdfPath)} (${pdfSize} KB)`);
  } else {
    console.error(`❌ Nenhum PDF encontrado em ${slidesDir}`);
    process.exit(1);
  }

  if (slidePngs.length === 0) {
    console.error(`❌ Nenhum slide PNG encontrado (padrão: slide-XX.png)`);
    process.exit(1);
  }

  console.log('');

  // 3. Buscar post_id pelo título
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

  // 4. Upload do carrossel
  try {
    const result = await uploadCarousel(slug, slidePngs, pdfPath, style, post.id);
    console.log('');
    console.log(`✅ Carrossel "${slug}" uploaded → ${result.slideCount} slides + PDF`);
    console.log(`   PDF URL: ${result.pdfUrl}`);
    console.log(`   Carousel ID: ${result.carouselId}`);
  } catch (err) {
    console.error(`❌ Erro no upload: ${err.message}`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('❌ Erro fatal:', err.message);
  process.exit(1);
});
