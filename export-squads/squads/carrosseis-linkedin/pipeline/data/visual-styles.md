# Estilos Visuais — Carrosséis LinkedIn

## Perfil

- **Nome:** Thiago C.Lima
- **@:** othiago-clima
- **Foto de perfil:** `squads/carrosseis-linkedin/assets/profile-photo.png`
- **Banco de fotos pessoais:** `squads/carrosseis-linkedin/assets/photos/`

---

## Estilo 1: Twitter-Style

### Conceito
Formato inspirado em tweets/posts do X (Twitter) — fundo preto, identidade minimalista, texto branco de alto impacto com print de autoridade como hook visual.

### Especificações — Slide 1 (Hook)
- **Fundo:** #000000 (preto puro)
- **Perfil:** Foto circular (80px diâmetro) + Nome "Thiago C.Lima" + @ "othiago-clima" no topo
- **Texto principal:** Branco (#FFFFFF), fonte bold, 40-58px, alinhado à esquerda
- **Print de autoridade:** Screenshot de um post/notícia de alguém com autoridade no assunto, posicionado na metade inferior do slide como prova social/hook visual
- **Layout:** Compacto, simulando um post de rede social

### Especificações — Slides Seguintes (Conteúdo)
- **Fundo:** #000000 ou #111111
- **Perfil:** Foto circular menor (48px) + nome no topo (consistência)
- **Texto:** Branco, 34-43px, foco total no conteúdo textual
- **Sem print** — o foco é no texto/ensinamento
- **Último slide:** CTA claro (seguir, comentar, salvar)

### Referência Visual
O print na primeira imagem funciona como "gatilho de autoridade" — usar posts reais de referências do mercado (ex: CEO de empresa conhecida, lançamento de ferramenta, dado relevante) para contextualizar e agregar credibilidade ao tema.

---

## Estilo 2: Pessoa-Style

### Conceito
Formato focado em conexão pessoal — usa fotos reais do Thiago adaptadas ao contexto do conteúdo. Pessoas se conectam com pessoas.

### Pipeline de Seleção de Imagem

> **Nota:** O banco de fotos é diverso — contém fotos do Thiago, fotos de praia, computador, paisagens, contextos variados. NEM todas as fotos são do Thiago. O designer deve selecionar pelo contexto e emoção, priorizando conexão humana quando relevante.

1. **Identificar qual imagem usar** — Analisar o banco de fotos em `assets/photos/` e selecionar a mais adequada ao tema/emoção do conteúdo (pode ser foto do Thiago, paisagem, setup, etc.)
2. **Decidir se usa a imagem original ou adapta** — Avaliar se a foto serve como está ou precisa de alteração por IA
3. **Se adaptar: validar a adaptação** — Uma análise crítica avalia se a alteração proposta faz sentido e manterá o realismo
4. **Gerar/usar** — Se aprovada a adaptação, gerar com IA. Se não precisa adaptar, usar a imagem original
5. **Se a validação falhar** — Usar a imagem original sem adaptação (fallback seguro)

### Especificações Visuais
- **Viewport:** 1080 x 1350 (4:5, otimizado para LinkedIn feed)
- **Foto do Thiago:** Integrada ao design com overlay de texto
- **Texto sobre foto:** Sempre com proteção de contraste (gradient overlay 60%+ ou solid overlay)
- **Fontes:** Sans-serif (Inter ou Montserrat), peso mínimo 500
- **Cores:** Derivadas da foto + cor de destaque complementar

### Regras de Adaptação por IA
- **NUNCA** alterar características faciais
- **NUNCA** mudar a expressão
- **PODE** alterar fundo, iluminação, enquadramento
- **PODE** adicionar objetos contextuais coerentes (laptop, whiteboard, etc.)
- **PODE** ajustar vestimenta se coerente com o tom
- **Sempre manter realismo** — se o resultado parecer artificial, usar original

---

## Viewport e Tipografia (Ambos os Estilos)

| Elemento | Twitter-Style | Pessoa-Style |
|----------|--------------|--------------|
| Viewport | 1080 x 1350 | 1080 x 1350 |
| Hero text | 58px / 700 | 52px / 700 |
| Body text | 38px / 500 | 34px / 500 |
| Caption | 24px / 500 | 24px / 500 |
| Font | Inter | Inter ou Montserrat |
