// render-slides.js — Renderiza todos os slides como PNG 1080x1350
// Requisito: npx playwright install chromium
// Uso: node render-slides.js [diretorio-do-slug]
// Exemplo: node render-slides.js a-falacia-do-sem-esforco
// Se nenhum argumento, renderiza todos os subdiretórios de slides/

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:7788/output/slides';
const SLIDES_DIR = path.join(__dirname, 'slides');

async function renderDir(browser, slugDir) {
  const dirPath = path.join(SLIDES_DIR, slugDir);
  const htmlFiles = fs.readdirSync(dirPath)
    .filter(f => f.endsWith('.html'))
    .sort();

  if (htmlFiles.length === 0) {
    console.log(`  ⚠️ Nenhum HTML encontrado em ${slugDir}/`);
    return;
  }

  console.log(`\n📁 ${slugDir} (${htmlFiles.length} slides)`);

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1080, height: 1350 });

  for (const htmlFile of htmlFiles) {
    const slideName = path.basename(htmlFile, '.html');
    const url = `${BASE_URL}/${slugDir}/${htmlFile}`;
    const outPath = path.join(dirPath, `${slideName}.png`);

    console.log(`  Renderizando ${slideName}...`);
    await page.goto(url, { waitUntil: 'networkidle' });

    // Aguarda Google Fonts carregar
    await page.waitForTimeout(1500);

    await page.screenshot({
      path: outPath,
      clip: { x: 0, y: 0, width: 1080, height: 1350 },
    });

    console.log(`  ✅ Salvo em: ${outPath}`);
  }

  await page.close();
}

(async () => {
  const arg = process.argv[2];
  const browser = await chromium.launch();

  if (arg) {
    // Renderizar slug específico
    const dirPath = path.join(SLIDES_DIR, arg);
    if (!fs.existsSync(dirPath)) {
      console.error(`❌ Diretório não encontrado: ${dirPath}`);
      process.exit(1);
    }
    await renderDir(browser, arg);
  } else {
    // Renderizar todos os subdiretórios
    const dirs = fs.readdirSync(SLIDES_DIR)
      .filter(d => fs.statSync(path.join(SLIDES_DIR, d)).isDirectory())
      .sort();

    if (dirs.length === 0) {
      console.log('⚠️ Nenhum diretório de slides encontrado em output/slides/');
      process.exit(0);
    }

    console.log(`🎯 Encontrados ${dirs.length} carrosséis para renderizar`);
    for (const dir of dirs) {
      await renderDir(browser, dir);
    }
  }

  await browser.close();
  console.log('\n🎯 Todos os slides renderizados com sucesso!');
})();
