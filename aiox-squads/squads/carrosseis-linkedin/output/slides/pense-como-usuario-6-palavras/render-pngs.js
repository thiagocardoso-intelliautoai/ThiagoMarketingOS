const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SLIDE_DIR = __dirname;
const TOTAL_SLIDES = 7;

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1350 },
    deviceScaleFactor: 1,
  });

  for (let i = 1; i <= TOTAL_SLIDES; i++) {
    const num = String(i).padStart(2, '0');
    const htmlPath = path.join(SLIDE_DIR, `slide-${num}.html`);
    const pngPath = path.join(SLIDE_DIR, `slide-${num}.png`);

    if (!fs.existsSync(htmlPath)) {
      console.log(`⚠️ slide-${num}.html not found, skipping`);
      continue;
    }

    const page = await context.newPage();
    await page.goto(`file://${htmlPath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle' });
    
    // Wait for fonts
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: pngPath,
      type: 'png',
      clip: { x: 0, y: 0, width: 1080, height: 1350 }
    });

    console.log(`✅ slide-${num}.png rendered (1080x1350)`);
    await page.close();
  }

  await browser.close();
  console.log(`\n🎉 All ${TOTAL_SLIDES} slides rendered as PNG`);
})();
