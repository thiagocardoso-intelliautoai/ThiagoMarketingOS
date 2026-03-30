# Template: Rascunho no Papel

> **Nota:** Este estilo NÃO usa HTML/CSS como os outros.
> Usa o script `generate-cover-pro.js` com **Nano Banana Pro** (gemini-3-pro-image-preview)
> para gerar o infográfico sobre a foto do papel.
>
> ⚠️ **NÃO usar a ferramenta `generate_image` do Antigravity** — ela usa o Gemini 3.1 Flash Image
> (Nano Banana 2), que é inferior. O script usa o Nano Banana Pro (melhor modelo de imagem).

## Visão Geral do Material

- **Caderno:** Moleskine preto com elástico, páginas lisas (sem pautas)
- **Cor do papel:** Creme/off-white — varia levemente com a iluminação dos monitores
- **Abertura:** Sempre em DUAS páginas — usar a dobra central como separador natural
- **Iluminação:** Luz quente de monitor (amarelo/laranja) lateral — gera sombras suaves
- **Ambiente:** Escuro — contraste natural entre papel claro e fundo escuro

## Pipeline de Execução

### Step 1: Extrair conteúdo do post
Ler o post e identificar os 3-5 blocos de informação-chave que serão
transformados em infográfico. Priorizar:
- Dados/números impactantes
- Fluxos/etapas de um processo
- Comparações (antes/depois, certo/errado)
- Frameworks ou modelos conceituais
- Listas de itens-chave

### Step 2: Selecionar foto de fundo
Selecionar foto via `node shared/scripts/list-source-photos-cli.js --category papers` — usar URL pública retornada.

> 📌 **Source of truth: Supabase.** Fallback: `assets/papers/` local (fase de transição).

| Tipo de Post | Fotos Recomendadas |
|---|---|
| Vendas B2B / Winning Sales | `paper-01` (monitor WS), `paper-02` (logos) |
| Framework / Fluxo longo | `paper-03` (paisagem = mais espaço horizontal) |
| Bastidores / "Eu faço assim" | `paper-04` (selfie setup), `paper-05` (close) |
| Reflexão / Planejamento | `paper-03` (cama), `paper-06` (noturno) |
| Opinião forte / Provocação | `paper-05` (close provocador) |

**Regra:** Nunca repetir a mesma foto em sequência.

### Step 3: Planejar layout do infográfico
Antes de gerar, definir:
- **Tipo**: fluxo, lista, comparação, framework ou dado hero
- **Blocos**: max 3-5 elementos
- **Área útil**: as DUAS páginas visíveis do caderno
- **Dobra central**: usar como divisor natural (ex: lado esquerdo vs. direito em comparações)
- **Orientação**: verificar se a foto tem caderno em retrato ou paisagem

### Step 4: Gerar imagem via Nano Banana Pro

**⚡ USAR SEMPRE O SCRIPT — NUNCA a ferramenta generate_image:**

```bash
node scripts/generate-cover-pro.js \
  --slug {slug-da-capa} \
  --image-url "{URL_SUPABASE_DA_FOTO}" \
  --prompt "{PROMPT COMPLETO ABAIXO}"
```

> ⚠️ **Preferência:** usar `--image-url` com URL Supabase. Fallback local: `--image assets/papers/{foto}.jpg`

**Prompt base para o infográfico:**
```
On the blank notebook pages visible in this photo, draw a hand-sketched 
infographic in realistic pencil/pen style. The notebook is a Moleskine 
with cream-colored unlined pages, open to two pages with a center fold.

The sketch should look like someone actually drew it by hand with a 
pencil on this paper, respecting the warm monitor lighting that 
illuminates the pages from the side.

Content of the sketch:
[CONTEÚDO DO INFOGRÁFICO AQUI — em português BR]

Style rules:
- Realistic pencil/pen strokes, slightly imperfect lines
- Hand-lettered text in Portuguese (NOT digital typography)
- Simple icons drawn by hand (arrows, circles, boxes, stars)
- Organically arranged, not perfectly aligned
- Use the center fold as a natural divider between sections
- Only draw ON the paper pages — do not modify anything outside the notebook
- The surrounding scene (hands, desk, monitor, etc.) must remain exactly as-is
- Match the paper's cream color and existing lighting/shadows
- Text must be legible and clear despite being hand-drawn
- Use only black/dark gray pencil — occasional underline or circle 
  in a slightly different shade for emphasis
- Keep margins from the notebook edges — don't draw to the very edge
```

**Exemplo completo de comando (Supabase):**
```bash
node scripts/generate-cover-pro.js \
  --slug ia-como-sistema-nervoso \
  --image-url "https://xxx.supabase.co/storage/v1/object/public/content-assets/source-photos/papers/paper-01-monitor-winning-sales-mao-segurando.jpg" \
  --prompt "On the blank notebook pages visible in this photo, draw a hand-sketched infographic in realistic pencil/pen style. The notebook is a Moleskine with cream-colored unlined pages, open to two pages with a center fold. The sketch should look like someone actually drew it by hand with a pencil on this paper, respecting the warm monitor lighting that illuminates the pages from the side. Content of the sketch: Título: 'IA como Sistema Nervoso'. Lado esquerdo: lista com 3 itens - '1. Dados entram (CRM, calls, emails)', '2. IA processa (padrões, alertas)', '3. Time age (prioridades certas)'. Lado direito: funil simples desenhado com setas - 'Lead → Qualificação → Proposta → Fechamento'. Embaixo: '73% mais conversão (G4 Educação)'. Style rules: Realistic pencil/pen strokes, slightly imperfect lines. Hand-lettered text in Portuguese (NOT digital typography). Simple icons drawn by hand (arrows, circles, boxes, stars). Use the center fold as a natural divider between sections. Only draw ON the paper pages. The surrounding scene must remain exactly as-is."
```

> 📝 **Fallback local:** substituir `--image-url` por `--image assets/papers/paper-01-monitor-winning-sales-mao-segurando.jpg`

### Step 5: Verificar resultado
O script salva automaticamente em `output/covers/{slug}/cover.png`.
Verificar com `view_file`:

Checklist:
- [ ] Rascunho parece real (passaria como foto se compartilhada sem questionar)
- [ ] Texto legível em mobile (fonte não microscópica)
- [ ] Cenário ao redor intocado (mãos, monitor, fundo)
- [ ] Iluminação do rascunho coerente com a luz da foto original
- [ ] Dobra central respeitada (conteúdo não "cruza" a dobra)
- [ ] Informação do post corretamente representada
- [ ] Máx. 5 blocos de informação
- [ ] Aspecto de lápis/caneta — ZERO tipografia digital

### Step 6: Se precisar ajustar
Se o resultado não ficou bom, ajustar o prompt e rodar novamente:
```bash
node scripts/generate-cover-pro.js \
  --slug {mesmo-slug} \
  --image-url "{MESMA_URL_SUPABASE}" \
  --prompt "{PROMPT AJUSTADO}"
```
O arquivo será sobrescrito automaticamente.

> 📝 **Fallback local:** substituir `--image-url` por `--image assets/papers/{mesma-foto}.jpg`

## Dicas para o Designer (Dani Design)

- **Menos é mais** — 3 blocos com setas simples > 7 blocos apertados
- **Hierarquia por tamanho** — título do rascunho maior, detalhes menores
- **Setas e conectores simples** — linhas retas ou curvas, não elaboradas
- **Asteriscos e bullets** — para listas, use * ou • desenhados
- **Numeração** — para fluxos, use 1. 2. 3. escritos à mão
- **Sublinhados e círculos** — para destaques, use sublinhado ou circule palavras
- **Dobra como recurso** — usar para separar "problema vs. solução", "antes vs. depois"
- **Sombra natural** — a iluminação lateral cria sombras — posicionar texto onde a luz bate melhor

## Sobre o Modelo

| Propriedade | Valor |
|---|---|
| Modelo | `gemini-3-pro-image-preview` |
| Nome comercial | **Nano Banana Pro** |
| Qualidade | Estado da arte — o melhor modelo de imagem do Google |
| Custo | **Grátis** (free tier do Google AI Studio) |
| Limite | ~500-1000 imagens/dia |
| vs. Antigravity | Antigravity usa `gemini-3.1-flash-image-preview` (Nano Banana 2) — inferior |
| Script | `scripts/generate-cover-pro.js` |
| Config | `.env` com `GEMINI_API_KEY` |
