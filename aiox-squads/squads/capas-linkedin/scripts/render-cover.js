#!/usr/bin/env node
/**
 * render-cover.js — Renderizador headless para capas LinkedIn/Instagram
 * 
 * Usa Puppeteer (Chromium headless) para:
 * 1. Abrir o HTML da capa
 * 2. Setar viewport exato (1080x1350)
 * 3. Aguardar fonts + imagens
 * 4. Tirar screenshot pixel-perfect sem artefatos de UI
 * 
 * Uso:
 *   node scripts/render-cover.js <slug>
 *   node scripts/render-cover.js 3-perguntas-antes-de-comprar-ia
 * 
 * Input:  output/covers/<slug>/cover.html
 * Output: output/covers/<slug>/cover.png
 * 
 * POR QUE ESTE SCRIPT EXISTE:
 * O browser subagent do Antigravity controla o Chrome real do usuário.
 * Quando ele interage com a página, o browser adiciona highlight de foco
 * (contorno azul) nos elementos, que aparece no screenshot.
 * 
 * Este script usa um Chromium headless separado — sem UI, sem mouse,
 * sem seleção, sem azul. Resultado: PNG limpo e pixel-perfect.
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// ── Config ──
const VIEWPORT = { width: 1080, height: 1350, deviceScaleFactor: 1 };
const SQUAD_ROOT = path.resolve(__dirname, '..');
const COVERS_DIR = path.join(SQUAD_ROOT, 'output', 'covers');
const ASSETS_DIR = path.join(SQUAD_ROOT, 'assets');

/**
 * Copia assets (profile-photo, fotos) para o diretório da capa.
 * Isso garante que o HTML pode usar caminhos locais simples
 * (ex: src="profile-photo.png") sem depender de caminhos relativos
 * que quebram conforme a profundidade do diretório muda.
 * 
 * DETECÇÃO REMOTA (ASSETS-003):
 * Se o HTML usa URLs do Supabase (supabase.co/storage), skip copy de fotos
 * locais — Puppeteer com networkidle0 resolve HTTPS automaticamente.
 * Profile-photo.png é mantido como fallback local se não usar URL remota.
 * 
 * FIX PERMANENTE: Nunca mais foto de perfil quebrada no render.
 */
function copyAssetsTocover(coverDir) {
  const htmlPath = path.join(coverDir, 'cover.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const usesRemotePhotos = html.includes('supabase.co/storage');

  if (usesRemotePhotos) {
    console.log('   ☁️ Template usa URLs remotas — skip copy de fotos');
    
    // Ainda copia profile-photo.png se não é URL remota no HTML
    if (!html.includes('supabase.co/storage/v1/object/public/content-assets/source-photos/profile')) {
      const profileSrc = path.join(ASSETS_DIR, 'profile-photo.png');
      const profileDest = path.join(coverDir, 'profile-photo.png');
      if (fs.existsSync(profileSrc)) {
        fs.copyFileSync(profileSrc, profileDest);
        console.log('   📷 Asset copiado: profile-photo.png (local fallback)');
      }
    }
    return;
  }

  // ── Comportamento padrão: copia assets locais (código legado inalterado) ──

  // 1. Copiar profile-photo.png
  const profileSrc = path.join(ASSETS_DIR, 'profile-photo.png');
  const profileDest = path.join(coverDir, 'profile-photo.png');
  
  if (fs.existsSync(profileSrc)) {
    fs.copyFileSync(profileSrc, profileDest);
    console.log(`   📷 Asset copiado: profile-photo.png`);
  } else {
    console.warn(`   ⚠️ profile-photo.png não encontrado em ${ASSETS_DIR}`);
  }

  // 2. Copiar fotos do banco (para estilo Pessoa+Texto)
  const photosDir = path.join(ASSETS_DIR, 'photos');
  const photosDest = path.join(coverDir, 'photos');
  
  if (fs.existsSync(photosDir)) {
    if (!fs.existsSync(photosDest)) {
      fs.mkdirSync(photosDest, { recursive: true });
    }
    const photos = fs.readdirSync(photosDir).filter(f => 
      /\.(png|jpg|jpeg|webp)$/i.test(f)
    );
    for (const photo of photos) {
      fs.copyFileSync(
        path.join(photosDir, photo),
        path.join(photosDest, photo)
      );
    }
    if (photos.length > 0) {
      console.log(`   📷 ${photos.length} foto(s) copiada(s) de assets/photos/`);
    }
  }
}

async function renderCover(slug) {
  const coverDir = path.join(COVERS_DIR, slug);
  const htmlPath = path.join(coverDir, 'cover.html');
  const pngPath = path.join(coverDir, 'cover.png');

  // Verifica se o HTML existe
  if (!fs.existsSync(htmlPath)) {
    console.error(`❌ HTML não encontrado: ${htmlPath}`);
    process.exit(1);
  }

  console.log(`🎨 Renderizando capa: ${slug}`);
  console.log(`   HTML: ${htmlPath}`);
  console.log(`   Viewport: ${VIEWPORT.width}x${VIEWPORT.height}`);

  // ── Copiar assets para o diretório da capa ──
  copyAssetsTocover(coverDir);
  console.log(`   ✅ Assets sincronizados`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--font-render-hinting=none',   // Render de fonte limpo
    ],
  });

  try {
    const page = await browser.newPage();
    
    // Viewport exato 1080x1350
    await page.setViewport(VIEWPORT);

    // Navega para o HTML local via file://
    const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;
    await page.goto(fileUrl, { 
      waitUntil: 'networkidle0',  // Espera TODAS as requests resolverem
      timeout: 30000 
    });

    // Espera extra para Google Fonts renderizar
    await new Promise(r => setTimeout(r, 2000));

    // Espera imagens carregarem
    await page.evaluate(() => {
      return Promise.all(
        Array.from(document.images)
          .filter(img => !img.complete)
          .map(img => new Promise((resolve, reject) => {
            img.addEventListener('load', resolve);
            img.addEventListener('error', resolve);
          }))
      );
    });

    // ── VALIDAÇÃO: Detectar imagens quebradas ──
    const brokenImages = await page.evaluate(() => {
      return Array.from(document.images)
        .filter(img => img.naturalWidth === 0)
        .map(img => img.getAttribute('src'));
    });

    if (brokenImages.length > 0) {
      console.error(`\n❌ IMAGENS QUEBRADAS DETECTADAS:`);
      brokenImages.forEach(src => console.error(`   • ${src}`));
      console.error(`\n   Verifique se os assets existem no diretório da capa.`);
      console.error(`   O script copia automaticamente de assets/ — se ainda falhou,`);
      console.error(`   o src no HTML pode estar usando caminho relativo errado.`);
      console.error(`   USE SEMPRE caminhos locais: src="profile-photo.png"\n`);
      process.exit(1);
    }
    console.log(`   ✅ Todas as imagens carregaram OK`);

    // Remove qualquer foco/seleção residual (belt and suspenders)
    await page.evaluate(() => {
      document.activeElement?.blur();
      window.getSelection()?.removeAllRanges();
    });

    // Screenshot pixel-perfect
    await page.screenshot({
      path: pngPath,
      type: 'png',
      clip: {
        x: 0,
        y: 0,
        width: VIEWPORT.width,
        height: VIEWPORT.height,
      },
    });

    console.log(`✅ PNG salvo: ${pngPath}`);
    console.log(`   Dimensões: ${VIEWPORT.width}x${VIEWPORT.height}`);
    
    // Verifica tamanho do arquivo
    const stats = fs.statSync(pngPath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    console.log(`   Tamanho: ${sizeKB} KB`);

  } catch (err) {
    console.error(`❌ Erro no render: ${err.message}`);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// ── CLI ──
const slug = process.argv[2];

if (!slug) {
  console.error('Uso: node scripts/render-cover.js <slug>');
  console.error('Exemplo: node scripts/render-cover.js 3-perguntas-antes-de-comprar-ia');
  process.exit(1);
}

renderCover(slug);
