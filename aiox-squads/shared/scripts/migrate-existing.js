/**
 * migrate-existing.js
 *
 * Script one-shot para migrar todos os posts, capas e carrosseis existentes
 * dos JSONs locais (inbox.json + seed.json) para o Supabase.
 *
 * Idempotente — pode rodar múltiplas vezes sem duplicar dados.
 *
 * Uso:
 *   node migrate-existing.js
 */

const fs = require('fs');
const path = require('path');
const { savePost, uploadCover, uploadCarousel, slugify } = require('./upload-to-supabase');

// ── Configuração de paths ─────────────────────────────────────
const PROJECT_ROOT = path.resolve(__dirname, '../../../');
const INBOX_PATH   = path.join(PROJECT_ROOT, 'content-command-center', 'data', 'inbox.json');
const SEED_PATH    = path.join(PROJECT_ROOT, 'content-command-center', 'data', 'seed.json');
const COVERS_ROOT  = path.join(PROJECT_ROOT, 'aiox-squads', 'squads', 'capas-linkedin', 'output', 'covers');
const SLIDES_ROOT  = path.join(PROJECT_ROOT, 'aiox-squads', 'squads', 'carrosseis-linkedin', 'output', 'slides');

// ── Helpers ───────────────────────────────────────────────────

function loadJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`⚠️  Erro ao ler ${filePath}: ${err.message}`);
    return { posts: [] };
  }
}

function deduplicatePosts(allPosts) {
  const seen = new Map();
  for (const post of allPosts) {
    const key = post.title.toLowerCase().trim();
    if (!seen.has(key)) {
      seen.set(key, post);
    }
  }
  return Array.from(seen.values());
}

/**
 * Localiza o cover.png para um dado slug.
 * Tenta: 1) slug da derivation, 2) slug gerado do título
 */
function findCoverPath(post) {
  const derivSlug = post.derivations?.cover?.slug;
  const coverSlug = post.derivations?.cover?.coverPath;
  
  // Tentar path direto da derivation
  if (coverSlug) {
    const absPath = path.join(PROJECT_ROOT, coverSlug);
    if (fs.existsSync(absPath)) return absPath;
  }

  // Tentar pelo slug da derivation
  if (derivSlug) {
    const candidate = path.join(COVERS_ROOT, derivSlug, 'cover.png');
    if (fs.existsSync(candidate)) return candidate;
  }

  // Tentar pelo slug gerado
  const genSlug = slugify(post.title);
  const candidate = path.join(COVERS_ROOT, genSlug, 'cover.png');
  if (fs.existsSync(candidate)) return candidate;

  return null;
}

/**
 * Localiza slides PNG e PDF para um carrossel.
 */
function findCarouselAssets(post) {
  const genSlug = slugify(post.title);
  
  // slidesDir pode vir do post ou calcular
  let slideDir;
  if (post.slidesDir) {
    slideDir = path.join(PROJECT_ROOT, post.slidesDir);
  } else {
    slideDir = path.join(SLIDES_ROOT, genSlug);
  }

  if (!fs.existsSync(slideDir)) return null;

  // Encontrar slides PNG em ordem
  const files = fs.readdirSync(slideDir);
  const slidePngs = files
    .filter(f => /^slide-\d+\.png$/i.test(f))
    .sort()
    .map(f => path.join(slideDir, f));

  // Encontrar PDF
  let pdfPath = null;
  if (post.pdfPath) {
    const absPdf = path.join(PROJECT_ROOT, post.pdfPath);
    if (fs.existsSync(absPdf)) pdfPath = absPdf;
  }
  if (!pdfPath) {
    const pdfFile = files.find(f => f.endsWith('.pdf'));
    if (pdfFile) pdfPath = path.join(slideDir, pdfFile);
  }

  if (slidePngs.length === 0 || !pdfPath) return null;

  return { slidePngs, pdfPath };
}

// ── Main ──────────────────────────────────────────────────────

async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║  SUPABASE-002 — Migração de Dados Existentes    ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('');

  // 1. Carregar JSONs
  console.log('📂 Carregando dados...');
  const inbox = loadJson(INBOX_PATH);
  const seed  = loadJson(SEED_PATH);
  
  console.log(`   inbox.json: ${inbox.posts.length} posts`);
  console.log(`   seed.json:  ${seed.posts.length} posts`);

  // 2. Deduplicar
  const allPosts = [...inbox.posts, ...seed.posts];
  const uniquePosts = deduplicatePosts(allPosts);
  console.log(`   Únicos (após deduplicação): ${uniquePosts.length} posts`);
  console.log('');

  // Contadores
  let postsSaved = 0;
  let coversUploaded = 0;
  let carouselsUploaded = 0;
  let slidesUploaded = 0;
  let errors = 0;

  const total = uniquePosts.length;

  // 3. Processar cada post
  for (let i = 0; i < uniquePosts.length; i++) {
    const post = uniquePosts[i];
    const idx = `[${i + 1}/${total}]`;

    try {
      // 3a. Salvar post
      const saved = await savePost(post);
      postsSaved++;
      console.log(`${idx} ✅ Post "${post.title.substring(0, 50)}..." salvo`);

      // 3b. Verificar se tem cover
      if (post.contentType === 'cover' && post.derivations?.cover) {
        const coverPath = findCoverPath(post);
        if (coverPath) {
          const coverSlug = post.derivations.cover.slug || slugify(post.title);
          const coverStyle = post.derivations.cover.style || 'unknown';
          await uploadCover(coverSlug, coverPath, coverStyle, saved.id);
          coversUploaded++;
          console.log(`${idx} ✅ + Capa uploaded (${coverStyle})`);
        } else {
          console.log(`${idx} ⚠️  Capa não encontrada em disco para "${post.title.substring(0, 40)}..."`);
        }
      }

      // 3c. Verificar se tem carrossel
      if (post.contentType === 'carousel') {
        const assets = findCarouselAssets(post);
        if (assets) {
          const carouselSlug = slugify(post.title);
          const carouselStyle = post.visualStyle || 'unknown';
          await uploadCarousel(carouselSlug, assets.slidePngs, assets.pdfPath, carouselStyle, saved.id);
          carouselsUploaded++;
          slidesUploaded += assets.slidePngs.length;
          console.log(`${idx} ✅ + Carrossel uploaded (${assets.slidePngs.length} slides + PDF)`);
        } else {
          console.log(`${idx} ⚠️  Assets de carrossel não encontrados para "${post.title.substring(0, 40)}..."`);
        }
      }

    } catch (err) {
      errors++;
      console.error(`${idx} ❌ Erro: ${err.message}`);
    }
  }

  // 4. Resumo
  console.log('');
  console.log('═══════════════════════════════════════════════════');
  console.log(`✅ Migração concluída:`);
  console.log(`   📝 ${postsSaved} posts salvos`);
  console.log(`   🖼️  ${coversUploaded} capas uploaded`);
  console.log(`   📑 ${carouselsUploaded} carrosseis uploaded (${slidesUploaded} slides total)`);
  if (errors > 0) {
    console.log(`   ❌ ${errors} erros`);
  }
  console.log('═══════════════════════════════════════════════════');
}

main().catch(err => {
  console.error('❌ Erro fatal:', err);
  process.exit(1);
});
