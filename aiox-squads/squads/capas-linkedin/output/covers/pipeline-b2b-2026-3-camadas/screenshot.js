const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1350 }
  });
  
  await page.goto('http://localhost:5501/output/covers/pipeline-b2b-2026-3-camadas/cover.html', {
    waitUntil: 'networkidle'
  });
  
  // Wait extra for Google Fonts
  await page.waitForTimeout(3000);
  
  await page.screenshot({
    path: 'd:/01AAntiGravity/Criação de conteúdo/aiox-squads/squads/capas-linkedin/output/covers/pipeline-b2b-2026-3-camadas/cover.png',
    clip: { x: 0, y: 0, width: 1080, height: 1350 }
  });
  
  console.log('Screenshot saved: cover.png (1080x1350)');
  await browser.close();
})();
