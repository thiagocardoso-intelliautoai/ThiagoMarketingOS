#!/usr/bin/env node
/**
 * upload-cover-cli.js
 *
 * CLI para fazer upload de capa(s) PNG para o Supabase.
 *
 * Modo single-image (legacy):
 *   node upload-cover-cli.js --file cover.png --style "Estilo" --post-title "Título"
 *
 * Modo multi-image (REFAC-005A-INFRA):
 *   node upload-cover-cli.js --slides-dir output/covers/{slug}/ --style "Estilo" --post-title "Título"
 *
 * Modo multi-image lê todos os PNGs do diretório. Se houver `manifest.json` com
 *   [{file: "cover-01.png", sequence: 1, caption?: "..."}, ...]
 * usa a ordem do manifest. Senão, ordena alfabeticamente por nome (cover-01.png antes de cover-02.png).
 */

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const { supabase, uploadCover, uploadCoverMultiImage, slugify } = require('./upload-to-supabase');

// ── CLI Arguments ─────────────────────────────────────────────
const argv = yargs(process.argv.slice(2))
  .usage('Uso (single): node upload-cover-cli.js --file cover.png --style "Estilo" --post-title "Título"\n     (multi):  node upload-cover-cli.js --slides-dir output/covers/{slug}/ --style "Estilo" --post-title "Título"')
  .option('slug', {
    alias: 's',
    type: 'string',
    describe: 'Slug da capa (se omitido, gera a partir do post-title)'
  })
  .option('file', {
    alias: 'f',
    type: 'string',
    describe: 'Caminho para o arquivo PNG da capa (modo single-image legacy)'
  })
  .option('slides-dir', {
    alias: 'd',
    type: 'string',
    describe: 'Diretório com PNGs múltiplos (modo multi-image — REFAC-005A-INFRA)'
  })
  .option('style', {
    type: 'string',
    demandOption: true,
    describe: 'Estilo visual da capa (ex: "Pessoa+Texto", "Pessoa+Texto Multi-Image")'
  })
  .option('post-title', {
    alias: 't',
    type: 'string',
    demandOption: true,
    describe: 'Título do post pai (para buscar o post_id no Supabase)'
  })
  .check((args) => {
    if (!args.file && !args['slides-dir']) {
      throw new Error('Erro: forneça --file (single) OU --slides-dir (multi)');
    }
    if (args.file && args['slides-dir']) {
      throw new Error('Erro: --file e --slides-dir são mutuamente exclusivos');
    }
    return true;
  })
  .help()
  .parseSync();

// ── Helpers ───────────────────────────────────────────────────

/**
 * Lê manifest.json se existir e retorna array ordenado de { path, caption }.
 * Schema esperado: [{ file: "cover-01.png", sequence: 1, caption?: "..." }, ...]
 *
 * Se não houver manifest, lista PNGs do diretório e ordena por nome
 * (cover-01.png, cover-02.png, ... — padding numérico recomendado).
 */
function detectMultiImages(dirPath) {
  const manifestPath = path.join(dirPath, 'manifest.json');

  if (fs.existsSync(manifestPath)) {
    let manifest;
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    } catch (err) {
      throw new Error(`manifest.json inválido em ${dirPath}: ${err.message}`);
    }

    if (!Array.isArray(manifest) || manifest.length === 0) {
      throw new Error(`manifest.json deve ser um array não-vazio em ${dirPath}`);
    }

    // Ordena por sequence (se presente) ou pela ordem original do array
    const sorted = [...manifest].sort((a, b) => {
      if (typeof a.sequence === 'number' && typeof b.sequence === 'number') {
        return a.sequence - b.sequence;
      }
      return 0;
    });

    return sorted.map((entry) => {
      if (!entry.file) throw new Error(`manifest.json: entrada sem campo "file"`);
      const fullPath = path.join(dirPath, entry.file);
      if (!fs.existsSync(fullPath)) {
        throw new Error(`Arquivo do manifest não encontrado: ${fullPath}`);
      }
      return { path: fullPath, caption: entry.caption || null };
    });
  }

  // Fallback: lista PNGs ordenados por nome (cover-XX.png recomendado)
  const files = fs.readdirSync(dirPath)
    .filter((f) => /^cover-\d+\.png$/i.test(f))
    .sort();

  if (files.length === 0) {
    throw new Error(`Nenhum PNG no padrão cover-NN.png em ${dirPath} (e sem manifest.json)`);
  }

  return files.map((f) => ({ path: path.join(dirPath, f), caption: null }));
}

// ── Main ──────────────────────────────────────────────────────

async function main() {
  const postTitle = argv['post-title'];
  const slug = argv.slug || slugify(postTitle);
  const style = argv.style;
  const isMultiMode = !!argv['slides-dir'];

  console.log('');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log(`║  upload-cover-cli — ${isMultiMode ? 'Multi-Image' : 'Single-Image '}      ║`);
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('');

  // 1. Validar input + detectar imagens
  let images = []; // { path, caption }[]
  if (isMultiMode) {
    const dir = path.resolve(argv['slides-dir']);
    if (!fs.existsSync(dir)) {
      console.error(`❌ Diretório não encontrado: ${dir}`);
      process.exit(1);
    }
    try {
      images = detectMultiImages(dir);
    } catch (err) {
      console.error(`❌ ${err.message}`);
      process.exit(1);
    }
    console.log(`📂 Diretório: ${dir}`);
    console.log(`🖼️  Imagens encontradas: ${images.length}`);
    images.forEach((img, i) => {
      const size = (fs.statSync(img.path).size / 1024).toFixed(1);
      const captionStr = img.caption ? ` — "${img.caption}"` : '';
      console.log(`   ${i + 1}. ${path.basename(img.path)} (${size} KB)${captionStr}`);
    });
  } else {
    const filePath = path.resolve(argv.file);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Arquivo não encontrado: ${filePath}`);
      process.exit(1);
    }
    const stats = fs.statSync(filePath);
    console.log(`🖼️  Arquivo: ${path.basename(filePath)} (${(stats.size / 1024).toFixed(1)} KB)`);
    images = [{ path: filePath, caption: null }];
  }

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

  // 3. Upload (single ou multi)
  try {
    if (isMultiMode) {
      const result = await uploadCoverMultiImage(slug, images, style, post.id);
      console.log('');
      console.log(`✅ Multi-image "${slug}" uploaded → ${result.count} imagens`);
      result.urls.forEach((u) => {
        console.log(`   seq=${u.sequence} → ${u.storagePath}`);
      });
    } else {
      const result = await uploadCover(slug, images[0].path, style, post.id);
      console.log('');
      console.log(`✅ Capa "${slug}" uploaded → ${result.imageUrl}`);
      console.log(`   Storage path: ${result.storagePath}`);
    }
  } catch (err) {
    console.error(`❌ Erro no upload: ${err.message}`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('❌ Erro fatal:', err.message);
  process.exit(1);
});
