#!/usr/bin/env node
/**
 * generate-cover-pro.js — Geração de imagem via Nano Banana Pro
 * 
 * Usa o modelo gemini-3-pro-image-preview (Nano Banana Pro) do Google AI Studio
 * para gerar capas de alta qualidade — MUITO superior ao Gemini 3.1 Flash Image
 * que a ferramenta generate_image do Antigravity usa por padrão.
 * 
 * FALLBACK INTELIGENTE:
 * 1. Tenta Nano Banana Pro (gemini-3-pro-image-preview) — melhor qualidade
 * 2. Se quota/429: faz fallback para Nano Banana 2 (gemini-3.1-flash-image-preview)
 * 3. Retry automático com exponential backoff
 * 
 * MODOS DE USO:
 * 
 * 1. Text-to-image (geração pura):
 *    node scripts/generate-cover-pro.js --prompt "Desenhe um infográfico..."
 * 
 * 2. Image + text (edição/composição — estilo Rascunho no Papel):
 *    node scripts/generate-cover-pro.js --prompt "Desenhe sobre este papel..." --image assets/papers/paper-01.jpg
 * 
 * 3. Image URL (Supabase/nuvem — sem download manual):
 *    node scripts/generate-cover-pro.js --prompt "Desenhe sobre este papel..." --image-url "https://...supabase.co/.../paper-01.jpg"
 * 
 * 4. Com slug (salva organizado em output/covers/{slug}/):
 *    node scripts/generate-cover-pro.js --slug meu-post --prompt "..." --image assets/papers/paper-01.jpg
 * 
 * 5. Forçar modelo específico:
 *    node scripts/generate-cover-pro.js --model flash --prompt "..."    (Nano Banana 2)
 *    node scripts/generate-cover-pro.js --model pro --prompt "..."      (Nano Banana Pro)
 * 
 * OUTPUT:
 *   - Se --slug: output/covers/{slug}/cover.png
 *   - Se sem slug: output/covers/generated-{timestamp}.png
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });

const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

// ── Config ──
const MODELS = {
  pro: { id: 'gemini-3-pro-image-preview', name: 'Nano Banana Pro', emoji: '🍌' },
  flash: { id: 'gemini-3.1-flash-image-preview', name: 'Nano Banana 2', emoji: '⚡' },
};
const MODEL_PRIORITY = ['pro', 'flash']; // Tenta Pro primeiro, fallback para Flash
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 3000;

const SQUAD_ROOT = path.resolve(__dirname, '..');
const COVERS_DIR = path.join(SQUAD_ROOT, 'output', 'covers');

// ── Parse args ──
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = { prompt: null, image: null, imageUrl: null, slug: null, model: null };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--prompt':
      case '-p':
        parsed.prompt = args[++i];
        break;
      case '--image':
      case '-i':
        parsed.image = args[++i];
        break;
      case '--image-url':
      case '-u':
        parsed.imageUrl = args[++i];
        break;
      case '--slug':
      case '-s':
        parsed.slug = args[++i];
        break;
      case '--model':
      case '-m':
        parsed.model = args[++i];
        break;
    }
  }

  return parsed;
}

// ── Resolve image path ──
function resolveImagePath(imagePath) {
  if (path.isAbsolute(imagePath)) return imagePath;
  
  const fromSquad = path.resolve(SQUAD_ROOT, imagePath);
  if (fs.existsSync(fromSquad)) return fromSquad;
  
  const fromCwd = path.resolve(process.cwd(), imagePath);
  if (fs.existsSync(fromCwd)) return fromCwd;
  
  console.error(`❌ Imagem não encontrada: ${imagePath}`);
  console.error(`   Tentei: ${fromSquad}`);
  console.error(`   Tentei: ${fromCwd}`);
  process.exit(1);
}

// ── Detect MIME type ──
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
  };
  return mimes[ext] || 'image/jpeg';
}

// ── Fetch image from URL (Supabase/remote) ──
async function fetchImageFromUrl(url) {
  console.log(`   ☁️ Baixando imagem da nuvem...`);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  const ext = path.extname(new URL(url).pathname).toLowerCase();
  const mimeType = getMimeType(ext) || 'image/jpeg';
  const sizeKB = (buffer.length / 1024).toFixed(1);
  console.log(`   ☁️ Download OK: ${sizeKB} KB (${mimeType})`);
  return { buffer, mimeType };
}

// ── Sleep helper ──
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Try generate with a specific model ──
async function tryGenerateWithModel(ai, modelKey, contents) {
  const model = MODELS[modelKey];
  
  console.log(`\n${model.emoji} Tentando: ${model.name} (${model.id})`);
  const startTime = Date.now();

  const response = await ai.models.generateContent({
    model: model.id,
    contents,
    config: {
      responseModalities: ['IMAGE', 'TEXT'],
    },
  });

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`   ⏱️  Tempo: ${elapsed}s`);

  return response;
}

// ── Save image from response ──
function saveImage(response, slug) {
  let imageFound = false;
  let textResponse = '';
  let savedPath = null;

  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      textResponse += part.text;
    } else if (part.inlineData) {
      let outputDir, outputPath;

      if (slug) {
        outputDir = path.join(COVERS_DIR, slug);
        outputPath = path.join(outputDir, 'cover.png');
      } else {
        outputDir = COVERS_DIR;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
        outputPath = path.join(outputDir, `generated-${timestamp}.png`);
      }

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const buffer = Buffer.from(part.inlineData.data, 'base64');
      fs.writeFileSync(outputPath, buffer);

      const sizeKB = (buffer.length / 1024).toFixed(1);
      console.log(`\n✅ Imagem salva!`);
      console.log(`   📁 ${outputPath}`);
      console.log(`   📏 ${sizeKB} KB`);
      imageFound = true;
      savedPath = outputPath;
    }
  }

  if (textResponse) {
    console.log(`\n📝 Resposta do modelo:`);
    console.log(`   ${textResponse.substring(0, 200)}`);
  }

  return { imageFound, savedPath, textResponse };
}

// ── Main ──
async function generateImage({ prompt, imagePath, imageUrl, slug, forcedModel }) {
  // Validate API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY não encontrada!');
    console.error('   Crie um arquivo .env com: GEMINI_API_KEY=sua-chave');
    console.error('   Obtenha grátis em: https://aistudio.google.com/apikey');
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });

  console.log(`\n🍌 Nano Banana — Gerador de Imagem Premium`);
  console.log(`   Prompt: "${prompt.substring(0, 80)}${prompt.length > 80 ? '...' : ''}"`);

  // Build contents
  let contents;

  if (imageUrl) {
    // ── Modo URL remota (Supabase/nuvem) ──
    const { buffer, mimeType } = await fetchImageFromUrl(imageUrl);
    const base64Image = buffer.toString('base64');
    const urlFilename = path.basename(new URL(imageUrl).pathname);
    console.log(`   Imagem base: ${urlFilename} (URL remota)`);

    contents = [
      { text: prompt },
      {
        inlineData: {
          mimeType,
          data: base64Image,
        },
      },
    ];
  } else if (imagePath) {
    // ── Modo path local (legado, inalterado) ──
    const resolvedPath = resolveImagePath(imagePath);
    const imageData = fs.readFileSync(resolvedPath);
    const base64Image = imageData.toString('base64');
    const mimeType = getMimeType(resolvedPath);
    
    const fileSizeKB = (imageData.length / 1024).toFixed(1);
    console.log(`   Imagem base: ${path.basename(resolvedPath)} (${fileSizeKB} KB)`);

    contents = [
      { text: prompt },
      {
        inlineData: {
          mimeType,
          data: base64Image,
        },
      },
    ];
  } else {
    contents = prompt;
  }

  // Determine model order
  let modelOrder;
  if (forcedModel && MODELS[forcedModel]) {
    modelOrder = [forcedModel];
    console.log(`   Modelo forçado: ${MODELS[forcedModel].name}`);
  } else {
    modelOrder = [...MODEL_PRIORITY];
    console.log(`   Estratégia: Pro → Flash (fallback automático)`);
  }

  // Try each model with retries
  for (const modelKey of modelOrder) {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        if (attempt > 0) {
          const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
          console.log(`   🔄 Retry ${attempt}/${MAX_RETRIES} em ${delay / 1000}s...`);
          await sleep(delay);
        }

        const response = await tryGenerateWithModel(ai, modelKey, contents);
        const result = saveImage(response, slug);

        if (result.imageFound) {
          console.log(`\n🎉 Gerado com sucesso via ${MODELS[modelKey].name}!`);
          return true;
        } else {
          console.error(`\n⚠️ Nenhuma imagem retornada pelo ${MODELS[modelKey].name}.`);
          if (result.textResponse) {
            console.error(`   Resposta: ${result.textResponse.substring(0, 200)}`);
          }
          break; // Tenta próximo modelo
        }

      } catch (error) {
        const isQuota = error.message.includes('429') || 
                        error.message.includes('quota') || 
                        error.message.includes('rate') ||
                        error.message.includes('RESOURCE_EXHAUSTED');
        const isSafety = error.message.includes('safety') || error.message.includes('SAFETY');

        if (isSafety) {
          console.error(`\n❌ Prompt bloqueado pela política de segurança do ${MODELS[modelKey].name}.`);
          console.error(`   Tente reformular sem conteúdo sensível.`);
          process.exit(1);
        }

        if (isQuota) {
          console.warn(`   ⚠️ Quota/rate limit no ${MODELS[modelKey].name}`);
          
          if (attempt < MAX_RETRIES) {
            continue; // Retry same model
          }
          
          // Move to next model
          if (modelOrder.indexOf(modelKey) < modelOrder.length - 1) {
            console.log(`   ↓ Fazendo fallback para próximo modelo...`);
            break;
          }
        }

        if (attempt === MAX_RETRIES) {
          console.error(`\n❌ Falha no ${MODELS[modelKey].name} após ${MAX_RETRIES + 1} tentativas`);
          console.error(`   Erro: ${error.message.substring(0, 200)}`);
          
          if (modelOrder.indexOf(modelKey) < modelOrder.length - 1) {
            console.log(`   ↓ Tentando próximo modelo...`);
            break;
          }
        }
      }
    }
  }

  // All models failed
  console.error(`\n❌ Todos os modelos falharam!`);
  console.error(`   Verifique:`);
  console.error(`   1. GEMINI_API_KEY válida no .env`);
  console.error(`   2. Limites de uso em https://aistudio.google.com/`);
  console.error(`   3. Tente novamente em alguns minutos`);
  process.exit(1);
}

// ── CLI ──
const args = parseArgs();

if (!args.prompt) {
  console.log(`
🍌 Nano Banana — Gerador de Imagem Premium (Free Tier)
   Modelos: Pro (melhor qualidade) → Flash (fallback rápido)

USO:
  node scripts/generate-cover-pro.js --prompt "descrição" [--image caminho] [--slug nome] [--model pro|flash]

EXEMPLOS:

  1. Geração pura (text-to-image):
     node scripts/generate-cover-pro.js -p "A futuristic city at sunset"

  2. Rascunho no Papel (image + text):
     node scripts/generate-cover-pro.js \\
       -s meu-post \\
       -i assets/papers/paper-01-monitor-winning-sales-mao-segurando.jpg \\
       -p "On the blank notebook pages visible in this photo, draw a hand-sketched infographic..."

  3. Forçar modelo Flash (se Pro estiver com quota):
     node scripts/generate-cover-pro.js -m flash -p "..."

FLAGS:
  -p, --prompt   Prompt de geração (obrigatório)
  -i, --image    Imagem base para edição/composição (opcional)
  -s, --slug     Nome da capa — salva em output/covers/{slug}/ (opcional)
  -m, --model    Forçar modelo: "pro" (Nano Banana Pro) ou "flash" (Nano Banana 2)

MODELOS:
  🍌 pro    gemini-3-pro-image-preview     Melhor qualidade, pode precisar de billing
  ⚡ flash   gemini-3.1-flash-image-preview  Free tier garantido, boa qualidade
  `);
  process.exit(0);
}

generateImage({
  prompt: args.prompt,
  imagePath: args.image,
  imageUrl: args.imageUrl,
  slug: args.slug,
  forcedModel: args.model,
});
