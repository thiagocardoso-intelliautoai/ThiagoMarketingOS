---
task: "Design Twitter-Style"
order: 1
input: |
  - carousel_copy: Copy aprovado com texto por slide
  - profile_photo: Path da foto de perfil
output: |
  - design_system: Documentação do design system
  - html_files: Array de HTML self-contained por slide
---

# Design Twitter-Style

Cria slides no estilo Twitter: fundo preto, foto de perfil circular, nome + @, texto branco de impacto, print de autoridade no slide 1.

## Process

1. Ler o copy aprovado do carrossel para entender quantos slides e quais textos
2. Ler `pipeline/data/visual-styles.md` → seção "Estilo 1: Twitter-Style" para specs completas
3. Definir design system: cores (#000000 fundo, #FFFFFF texto, cor accent), fonte Inter, espaçamento
4. Criar HTML do slide 1 (Hook): fundo preto, foto circular do perfil no topo, "Thiago C.Lima" + "@othiago-clima", texto hero branco, area para print de autoridade na metade inferior
5. Criar HTML dos slides 2-N (Conteúdo): mesmo design system, foto menor no topo, foco total em texto branco
6. Criar HTML do último slide (CTA): texto de ação com cor accent destacada
7. Todos os HTMLs: self-contained, inline CSS, body 1080x1350, sem deps externas

## Output Format

```yaml
design_system:
  viewport: "1080x1350"
  colors:
    background: "#000000"
    text: "#FFFFFF"
    accent: "#..."
    muted: "#..."
  typography:
    family: "Inter"
    hero: "58px / 700"
    body: "38px / 500"
    caption: "24px / 500"
  profile:
    name: "Thiago C.Lima"
    handle: "@othiago-clima"
    photo: "circular, 80px slide 1, 48px restante"

slides:
  - file: "slide-01.html"
    type: "hook"
    has_print: true
  - file: "slide-02.html"
    type: "content"
  - file: "slide-NN.html"
    type: "cta"
```

## Output Example

> Use as quality reference, not as rigid template.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1080px; height: 1350px; overflow: hidden;
      background: #000000;
      font-family: 'Inter', sans-serif;
      padding: 64px;
      display: flex; flex-direction: column;
    }
    .profile {
      display: flex; align-items: center; gap: 16px;
      margin-bottom: 48px;
    }
    .profile-photo {
      width: 80px; height: 80px; border-radius: 50%;
      background: #333; overflow: hidden;
    }
    .profile-photo img { width: 100%; height: 100%; object-fit: cover; }
    .profile-info { display: flex; flex-direction: column; }
    .profile-name { font-size: 28px; font-weight: 700; color: #FFFFFF; }
    .profile-handle { font-size: 22px; font-weight: 500; color: #8899AA; }
    .hook-text {
      font-size: 58px; font-weight: 700; color: #FFFFFF;
      line-height: 1.2; flex: 1;
      display: flex; align-items: center;
    }
    .hook-text .accent { color: #4DA6FF; }
    .authority-print {
      background: #111111; border-radius: 16px;
      padding: 24px; margin-top: 32px;
    }
  </style>
</head>
<body>
  <div class="profile">
    <div class="profile-photo"><img src="assets/profile-photo.png" alt="Thiago"></div>
    <div class="profile-info">
      <span class="profile-name">Thiago C.Lima</span>
      <span class="profile-handle">@othiago-clima</span>
    </div>
  </div>
  <div class="hook-text">
    O CLAUDE SIMPLESMENTE <span class="accent">DOBROU.</span><br>
    Mas tem regras que ninguém tá te contando.
  </div>
  <div class="authority-print">
    <!-- Print de autoridade renderizado aqui -->
  </div>
</body>
</html>
```

## Quality Criteria

- [ ] Fundo #000000 em todos os slides
- [ ] Foto de perfil + nome + @ visíveis em todos os slides
- [ ] Font hero >= 52px, body >= 34px
- [ ] Contraste branco sobre preto >= 4.5:1
- [ ] HTML self-contained, inline CSS only (+ Google Fonts)
- [ ] Body 1080x1350 exato

## Veto Conditions

Reject and redo if ANY are true:
1. Algum HTML tem dependência externa (CDN, JS, imagem externa)
2. Viewport diferente de 1080x1350
3. Qualquer slide contém hashtags (#) no texto visual — hashtags são exclusivas da legenda do post, NUNCA devem aparecer renderizadas dentro das imagens/slides
