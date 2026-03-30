#!/usr/bin/env node
/**
 * render-slides.js — Renderiza slides HTML como PNGs limpos (sem overlay de browser agent)
 * 
 * SOLUÇÃO: Usa Puppeteer headless para capturar screenshots SEM nenhum
 * overlay do browser agent (CDP highlight, bordas azuis, etc).
 * 
 * Uso:
 *   node scripts/render-slides.js <pasta-dos-slides>
 * 
 * Exemplo:
 *   node scripts/render-slides.js output/slides/mais-ia-nao-e-mais-produtividade
 * 
 * O script:
 *   1. Lista todos os slide-*.html em ordem numérica
 *   2. Abre cada HTML em browser headless (Chromium sem UI)
 *   3. Define viewport para 1080x1350 (LinkedIn carousel 4:5)
 *   4. Espera Google Fonts carregar (timeout seguro)
 *   5. Captura screenshot limpo como PNG
 *   6. Salva como slide-XX.png na mesma pasta
 * 
 * Funciona para TODOS os estilos: Twitter-style, Editorial Clean,
 * Data-Driven, Notebook Raw.
 * 
 * Requisitos:
 *   npm install puppeteer (ou npx -y puppeteer no primeiro uso)
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// LinkedIn carousel: 4:5 portrait
const VIEWPORT_WIDTH = 1080;
const VIEWPORT_HEIGHT = 1350;
const FONT_WAIT_MS = 2500; // tempo para Google Fonts carregar

async function main() {
  const slidesDir = process.argv[2];

  if (!slidesDir) {
    console.error('❌ Uso: node scripts/render-slides.js <pasta-dos-slides>');
    console.error('   Ex:  node scripts/render-slides.js output/slides/mais-ia-nao-e-mais-produtividade');
    process.exit(1);
  }

  const absDir = path.resolve(slidesDir);

  if (!fs.existsSync(absDir)) {
    console.error(`❌ Pasta não encontrada: ${absDir}`);
    process.exit(1);
  }

  // Listar HTMLs em ordem numérica (slide-01.html, slide-02.html, ...)
  const htmlFiles = fs.readdirSync(absDir)
    .filter(f => /^slide-\d+\.html$/i.test(f))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)[0]);
      const numB = parseInt(b.match(/\d+/)[0]);
      return numA - numB;
    });

  if (htmlFiles.length === 0) {
    console.error(`❌ Nenhum slide-*.html encontrado em: ${absDir}`);
    process.exit(1);
  }

  console.log(`🎨 Renderizando ${htmlFiles.length} slides...`);
  console.log(`   📐 Viewport: ${VIEWPORT_WIDTH}×${VIEWPORT_HEIGHT}`);
  console.log(`   📁 Pasta: ${absDir}`);
  console.log('');

  // Iniciar browser headless — SEM UI, SEM overlay, SEM bordas azuis
  const browser = await puppeteer.launch({
    headless: 'new', // modo headless moderno
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      `--window-size=${VIEWPORT_WIDTH},${VIEWPORT_HEIGHT}`,
    ],
  });

  const page = await browser.newPage();
  
  // Viewport exato para LinkedIn carousel
  await page.setViewport({
    width: VIEWPORT_WIDTH,
    height: VIEWPORT_HEIGHT,
    deviceScaleFactor: 1, // 1:1 pixel ratio — PNG nítido sem escala
  });

  const results = [];

  for (const htmlFile of htmlFiles) {
    const htmlPath = path.join(absDir, htmlFile);
    const pngFile = htmlFile.replace('.html', '.png');
    const pngPath = path.join(absDir, pngFile);

    try {
      // Carregar HTML via file:// (headless pode acessar file://)
      const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;
      await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 15000 });
      
      // Esperar Google Fonts carregar completamente
      await page.evaluate(() => document.fonts.ready);
      await new Promise(resolve => setTimeout(resolve, FONT_WAIT_MS));

      // Screenshot limpo — full page, sem clip (body já é 1080x1350)
      await page.screenshot({
        path: pngPath,
        type: 'png',
        clip: {
          x: 0,
          y: 0,
          width: VIEWPORT_WIDTH,
          height: VIEWPORT_HEIGHT,
        },
      });

      const stats = fs.statSync(pngPath);
      const sizeKB = Math.round(stats.size / 1024);
      console.log(`   ✅ ${pngFile} (${sizeKB}KB)`);
      results.push({ file: pngFile, status: 'ok', size: sizeKB });

    } catch (err) {
      console.error(`   ❌ ${htmlFile}: ${err.message}`);
      results.push({ file: htmlFile, status: 'error', error: err.message });
    }
  }

  await browser.close();

  // Sumário
  const ok = results.filter(r => r.status === 'ok').length;
  const failed = results.filter(r => r.status === 'error').length;

  console.log('');
  console.log(`🏁 Renderização concluída!`);
  console.log(`   ✅ ${ok} slides renderizados`);
  if (failed > 0) console.log(`   ❌ ${failed} slides com erro`);
  console.log(`   📁 ${absDir}`);

  if (failed > 0) process.exit(1);
}

main().catch(err => {
  console.error('❌ Erro fatal:', err.message);
  process.exit(1);
});
