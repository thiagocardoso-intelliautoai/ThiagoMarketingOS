const fs = require('fs');
const path = require('path');

const outDir = __dirname;
const b64 = fs.readFileSync(path.join(outDir, 'profile-b64.txt'), 'utf8').trim();
const profileSrc = `data:image/png;base64,${b64}`;

// Design System — Twitter-Style "Pense como usuário"
// Colors: #000 background, #FFF text, #FFD700 highlight, #8B8B8B secondary, #111 card bg
// Fonts: Inter 700 (hero 58px), Inter 500 (body 38px), Inter 400 (caption 24px)
// Viewport: 1080x1350

const sharedCSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Inter', sans-serif;
  background: #000000;
  color: #FFFFFF;
  width: 1080px;
  height: 1350px;
  overflow: hidden;
}

.slide {
  width: 1080px;
  height: 1350px;
  padding: 64px;
  display: flex;
  flex-direction: column;
}

.profile {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 0;
}

.profile-photo {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-name {
  font-size: 26px;
  font-weight: 700;
  color: #FFFFFF;
}

.profile-handle {
  font-size: 20px;
  font-weight: 400;
  color: #8B8B8B;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero-text {
  font-size: 58px;
  font-weight: 700;
  line-height: 1.2;
  color: #FFFFFF;
}

.body-text {
  font-size: 40px;
  font-weight: 500;
  line-height: 1.45;
  color: #E0E0E0;
}

.highlight {
  color: #FFD700;
  font-weight: 700;
}

.accent-line {
  width: 80px;
  height: 4px;
  background: #FFD700;
  margin: 32px 0;
  border-radius: 2px;
}

.footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 24px;
}

.swipe-hint {
  font-size: 22px;
  font-weight: 500;
  color: #555555;
}
`;

function profileHTML() {
  return `
    <div class="profile">
      <img class="profile-photo" src="${profileSrc}" alt="Thiago C.Lima">
      <div>
        <div class="profile-name">Thiago C.Lima</div>
        <div class="profile-handle">@othiago-clima</div>
      </div>
    </div>`;
}

function wrapSlide(bodyHTML, extraCSS = '') {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080">
  <style>${sharedCSS}${extraCSS}</style>
</head>
<body>
  <div class="slide">
    ${profileHTML()}
    ${bodyHTML}
  </div>
</body>
</html>`;
}

// ═══════════════════════════════════════
// SLIDE 1 — HOOK
// ═══════════════════════════════════════
const slide01 = wrapSlide(`
    <div class="content">
      <div class="quote-card" style="
        background: #111111;
        border: 1px solid #333333;
        border-left: 4px solid #FFD700;
        border-radius: 12px;
        padding: 40px 48px;
        margin-bottom: 48px;
      ">
        <p style="
          font-size: 52px;
          font-weight: 700;
          line-height: 1.25;
          color: #FFFFFF;
          font-style: italic;
        ">"Pense sempre como<br>um usuário."</p>
        <p style="
          font-size: 26px;
          font-weight: 500;
          color: #FFD700;
          margin-top: 20px;
          text-align: right;
          font-style: normal;
        ">— Ivan Nunes</p>
      </div>

      <h1 class="hero-text" style="margin-top: 16px;">
        <span class="highlight">6 palavras</span><br>
        que mudaram tudo.
      </h1>
    </div>

    <div class="footer">
      <span class="swipe-hint">Deslize →</span>
    </div>
`, `
  .content { gap: 0; }
`);

// ═══════════════════════════════════════
// SLIDE 2 — O ERRO
// ═══════════════════════════════════════
const slide02 = wrapSlide(`
    <div class="content" style="gap: 48px;">
      <p class="hero-text">Eu errei.</p>

      <div class="accent-line"></div>

      <p class="body-text">
        Criei um projeto inteiro<br>
        baseado no que o <span class="highlight">sócio</span> queria.
      </p>

      <p class="body-text" style="color: #999999;">
        Não no que o <span style="color: #FFFFFF; font-weight: 700;">usuário</span> precisava.
      </p>
    </div>
`);

// ═══════════════════════════════════════
// SLIDE 3 — A REALIZAÇÃO
// ═══════════════════════════════════════
const slide03 = wrapSlide(`
    <div class="content" style="gap: 48px;">
      <p class="body-text">
        Ficou pronto.<br>
        Funcional.
      </p>

      <p class="hero-text">
        Mas poderia ser<br>
        <span class="highlight">10x melhor.</span>
      </p>

      <div class="accent-line"></div>

      <p class="body-text" style="color: #999999; font-size: 36px;">
        Se eu tivesse me colocado<br>
        no lugar do usuário<br>
        <span style="color: #E0E0E0;">antes de abrir o editor.</span>
      </p>
    </div>
`);

// ═══════════════════════════════════════
// SLIDE 4 — O FRAMEWORK
// ═══════════════════════════════════════
const slide04 = wrapSlide(`
    <div class="content" style="justify-content: center; align-items: center; text-align: center; gap: 48px;">
      <p class="body-text" style="color: #999999;">Desde então,</p>

      <p class="hero-text" style="font-size: 64px;">
        <span class="highlight">3 perguntas</span><br>
        antes de<br>
        qualquer coisa:
      </p>

      <div class="accent-line" style="margin: 0 auto;"></div>
    </div>
`);

// ═══════════════════════════════════════
// SLIDE 5 — AS 3 PERGUNTAS
// ═══════════════════════════════════════
const slide05 = wrapSlide(`
    <div class="content" style="gap: 40px; justify-content: center;">
      <div style="
        background: #111111;
        border-radius: 12px;
        padding: 36px 40px;
        border-left: 4px solid #FFD700;
      ">
        <p style="font-size: 24px; font-weight: 600; color: #FFD700; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 2px;">Em vendas →</p>
        <p class="body-text" style="font-size: 36px; color: #E0E0E0;">"Se eu fosse o prospect,<br><span style="color: #FFFFFF; font-weight: 700;">atenderia essa abordagem?"</span></p>
      </div>

      <div style="
        background: #111111;
        border-radius: 12px;
        padding: 36px 40px;
        border-left: 4px solid #FFD700;
      ">
        <p style="font-size: 24px; font-weight: 600; color: #FFD700; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 2px;">Em marketing →</p>
        <p class="body-text" style="font-size: 36px; color: #E0E0E0;">"Se eu fosse o ICP,<br><span style="color: #FFFFFF; font-weight: 700;">pararia o scroll?"</span></p>
      </div>

      <div style="
        background: #111111;
        border-radius: 12px;
        padding: 36px 40px;
        border-left: 4px solid #FFD700;
      ">
        <p style="font-size: 24px; font-weight: 600; color: #FFD700; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 2px;">Em software →</p>
        <p class="body-text" style="font-size: 36px; color: #E0E0E0;">"Se eu fosse o usuário,<br><span style="color: #FFFFFF; font-weight: 700;">usaria isso todo dia?"</span></p>
      </div>
    </div>
`);

// ═══════════════════════════════════════
// SLIDE 6 — A REGRA
// ═══════════════════════════════════════
const slide06 = wrapSlide(`
    <div class="content" style="justify-content: center; align-items: center; text-align: center; gap: 48px;">
      <p class="body-text" style="font-size: 42px; color: #999999;">
        Se a resposta é não,
      </p>

      <p style="
        font-size: 96px;
        font-weight: 700;
        color: #FFD700;
        letter-spacing: -2px;
      ">refaz.</p>
    </div>
`);

// ═══════════════════════════════════════
// SLIDE 7 — CTA
// ═══════════════════════════════════════
const slide07 = wrapSlide(`
    <div class="content" style="justify-content: center; align-items: center; text-align: center; gap: 48px;">
      <p class="hero-text" style="font-size: 52px; line-height: 1.3;">
        Qual frase mudou<br>
        como você trabalha?
      </p>

      <div class="accent-line" style="margin: 0 auto;"></div>

      <p class="body-text" style="font-size: 38px; color: #999999;">
        Comenta aqui.
      </p>

      <div style="
        margin-top: 24px;
        background: #FFFFFF;
        color: #000000;
        font-size: 28px;
        font-weight: 700;
        padding: 20px 48px;
        border-radius: 50px;
        display: inline-block;
      ">→ Segue pra mais conteúdo</div>
    </div>
`);

// Write all slides
const slides = [slide01, slide02, slide03, slide04, slide05, slide06, slide07];
slides.forEach((html, i) => {
  const num = String(i + 1).padStart(2, '0');
  const filePath = path.join(outDir, `slide-${num}.html`);
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✅ slide-${num}.html created`);
});

console.log(`\nAll ${slides.length} slides generated in: ${outDir}`);
