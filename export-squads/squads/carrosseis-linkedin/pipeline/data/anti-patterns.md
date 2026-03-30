# Anti-Patterns — Carrosséis LinkedIn

## Copy — Never Do

1. **Começar com clichê** — "No mundo de hoje...", "Você sabia que...?", "Nesse post vou compartilhar..." são gatilhos de scroll instantâneo
2. **Usar vocabulário proibido** — "game changer", "fórmula mágica", "segredo", "hack", "sinergia", "pensar fora da caixa"
3. **Paredes de texto** — Mais de 3 linhas seguidas no mobile é muro. Quebrar com Enter agressivo
4. **Promessas mágicas** — "IA vai substituir seu time", "automatize tudo em 1 dia" são anti-Thiago
5. **Emojis emocionais** — 🔥🚀💪😍 jamais. Apenas funcionais: ✅📌→
6. **Links no corpo do post** — Mata alcance em ~3x no LinkedIn. Sempre "link nos comentários"
7. **Corporativês** — "Alavancagem", "sinergia", "ecossistema" — escrever como humano
8. **CTA vago** — "Espero que ajude!" não é CTA. "Comenta WORKFLOW e mando o PDF" é CTA

## Copy — Always Do

1. **Liderar com hook** — A primeira frase decide se param de scrollar
2. **Rule of 1** — UMA ideia por post, UM leitor, UMA promessa
3. **Dados específicos** — "47% em 12 dias" supera "melhorou significativamente"
4. **Primeira pessoa** — "Eu aprendi" supera "Aprendemos" ou "É importante"
5. **Fechar com pergunta genuína** — Específica, não genérica

## Design — Never Do

1. **Fontes abaixo do mínimo** — Nunca abaixo de 34px para body, 20px absolute floor
2. **Texto sobre imagem sem proteção** — Sempre overlay 60%+ ou gradient
3. **Dependências externas no HTML** — Nada de CDN, Bootstrap, Tailwind. Só Google Fonts @import
4. **Mais de 5 cores** — Criar ruído visual. Max: primary + secondary + accent + background + text
5. **Contador de slides** — "1/7", "3/8" — LinkedIn já mostra navegação nativa
6. **Placeholder text** — Jamais Lorem ipsum ou "Texto aqui" em entregável
7. **Pular verificação de render** — Sempre renderizar e verificar screenshot antes de prosseguir

## Design — Always Do

1. **Design system antes de criar** — Definir cores, fontes, espaçamento, grid antes de qualquer HTML
2. **Verificar primeiro slide** — Render e inspeção visual do slide 1 antes de criar o resto
3. **Self-contained HTML** — Cada arquivo renderiza independente, com dimensões exatas no body
4. **WCAG AA** — Contraste mínimo 4.5:1 para todo texto legível
