#!/usr/bin/env node
/**
 * save-post-cli.js
 * 
 * CLI para salvar um post no Supabase a partir de um arquivo markdown.
 * Parseia seções conhecidas do post-final e chama savePost().
 * 
 * Uso:
 *   node save-post-cli.js --title "Título" --file post-final.md
 *   node save-post-cli.js --title "Título" --file post-final.md --pillar C --status armazem --urgency relevante --review-score 90
 */

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const { savePost, slugify } = require('./upload-to-supabase');

// ── CLI Arguments ─────────────────────────────────────────────
const argv = yargs(process.argv.slice(2))
  .usage('Uso: node save-post-cli.js --title "Título" --file post-final.md')
  .option('title', {
    alias: 't',
    type: 'string',
    demandOption: true,
    describe: 'Título do post'
  })
  .option('file', {
    alias: 'f',
    type: 'string',
    demandOption: true,
    describe: 'Caminho para o arquivo markdown do post'
  })
  .option('pillar', {
    alias: 'p',
    type: 'string',
    default: 'A',
    describe: 'Pilar ACRE (A, C, R, E)'
  })
  .option('status', {
    alias: 's',
    type: 'string',
    default: 'armazem',
    describe: 'Status do post (armazem, agendado, publicado)'
  })
  .option('urgency', {
    alias: 'u',
    type: 'string',
    default: 'relevante',
    describe: 'Urgência (evergreen, relevante, urgente)'
  })
  .option('review-score', {
    alias: 'r',
    type: 'number',
    describe: 'Score de revisão (0-100)'
  })
  .option('content-type', {
    type: 'string',
    default: 'text',
    describe: 'Tipo de conteúdo (text, cover, carousel)'
  })
  .help()
  .parseSync();

// ── Markdown Parser ───────────────────────────────────────────

/**
 * Extrai seções conhecidas de um post-final.md
 * Espera formato:
 *   ## Metadata (com campos)
 *   ### Post (corpo do post)
 *   ### Revisão (score)
 */
function parsePostMarkdown(content, title) {
  const result = {
    title,
    hookText: '',
    body: '',
    cta: '',
    pillar: argv.pillar,
    pillarLabel: '',
    theme: '',
    framework: '',
    hookStructure: '',
    sources: [],
    reviewScore: argv['review-score'] || null,
    status: argv.status,
    urgency: argv.urgency,
    contentType: argv['content-type'],
  };

  // Tentar encontrar o bloco do post específico por título parcial
  // Ou tomar o conteúdo como um post único
  const lines = content.split('\n');
  
  let inMetadata = false;
  let inPost = false;
  let postLines = [];
  let foundTargetPost = false;

  // Estratégia: procurar pelo título no arquivo (multi-post) ou tratar como single
  // Se o arquivo tem múltiplos posts (separados por # ═══), encontrar o correto
  const hasSeparators = content.includes('═══');
  
  if (hasSeparators) {
    // Multi-post: encontrar o bloco correto
    let currentBlock = [];
    let blocks = [];
    
    for (const line of lines) {
      if (line.includes('═══════════════')) {
        if (currentBlock.length > 0) {
          blocks.push(currentBlock.join('\n'));
        }
        currentBlock = [];
      } else {
        currentBlock.push(line);
      }
    }
    if (currentBlock.length > 0) {
      blocks.push(currentBlock.join('\n'));
    }

    // Encontrar o bloco que contém o título (match parcial)
    const titleNorm = title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    for (const block of blocks) {
      const blockNorm = block.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (blockNorm.includes(titleNorm.substring(0, 30))) {
        content = block;
        foundTargetPost = true;
        break;
      }
    }
    
    if (!foundTargetPost) {
      // Tentar match mais flexível: primeiras palavras do título
      const titleWords = titleNorm.split(/\s+/).slice(0, 5).join(' ');
      for (const block of blocks) {
        const blockNorm = block.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (blockNorm.includes(titleWords)) {
          content = block;
          foundTargetPost = true;
          break;
        }
      }
    }
  }

  // Agora parsear o conteúdo (single block)
  const blockLines = content.split('\n');
  
  for (let i = 0; i < blockLines.length; i++) {
    const line = blockLines[i];
    const trimmed = line.trim();

    // Metadata extraction
    if (trimmed.startsWith('- **Pilar ACRE:**')) {
      const match = trimmed.match(/Pilar ACRE:\*\*\s*(\w)\s*\(([^)]+)\)/);
      if (match) {
        result.pillar = match[1];
        result.pillarLabel = match[2];
      }
    }
    if (trimmed.startsWith('- **Tema:**')) {
      result.theme = trimmed.replace('- **Tema:**', '').trim();
    }
    if (trimmed.startsWith('- **Framework:**')) {
      result.framework = trimmed.replace('- **Framework:**', '').trim();
    }
    if (trimmed.startsWith('- **Hook:**')) {
      result.hookStructure = trimmed.replace('- **Hook:**', '').trim();
    }
    if (trimmed.startsWith('- **Fontes:**')) {
      const sourcesStr = trimmed.replace('- **Fontes:**', '').trim();
      result.sources = sourcesStr.split(',').map(s => s.trim()).filter(Boolean);
    }

    // Post body
    if (trimmed === '### Post') {
      inPost = true;
      continue;
    }
    if (inPost && (trimmed === '---' || trimmed.startsWith('### Revisão'))) {
      inPost = false;
      continue;
    }
    if (inPost) {
      postLines.push(line);
    }

    // Review score
    if (trimmed.includes('**TOTAL**') && trimmed.includes('%')) {
      const scoreMatch = trimmed.match(/\*\*(\d+\.?\d*)\%\*\*/);
      if (scoreMatch && !result.reviewScore) {
        result.reviewScore = Math.round(parseFloat(scoreMatch[1]));
      }
    }
  }

  // Extrair hook, body e CTA do post
  const postText = postLines.join('\n').trim();
  
  if (postText) {
    const postParagraphs = postText.split('\n\n').filter(p => p.trim());
    
    if (postParagraphs.length > 0) {
      // Hook = primeiras 2 linhas ou primeiro parágrafo
      result.hookText = postParagraphs[0].trim();
      
      // CTA = último parágrafo (geralmente começa com # ou pergunta)
      if (postParagraphs.length > 2) {
        const lastParagraph = postParagraphs[postParagraphs.length - 1].trim();
        // Se o último não é hashtags
        if (!lastParagraph.startsWith('#') || lastParagraph.includes('?')) {
          // Verificar se penúltimo é CTA e último são hashtags
          const secondToLast = postParagraphs[postParagraphs.length - 2].trim();
          if (lastParagraph.startsWith('#') && !lastParagraph.includes('?')) {
            result.cta = secondToLast;
            result.body = postParagraphs.slice(1, -2).map(p => p.trim()).join('\n\n');
          } else {
            result.cta = lastParagraph;
            result.body = postParagraphs.slice(1, -1).map(p => p.trim()).join('\n\n');
          }
        } else {
          // Último parágrafo são só hashtags → penúltimo é CTA
          result.cta = postParagraphs[postParagraphs.length - 2].trim();
          result.body = postParagraphs.slice(1, -2).map(p => p.trim()).join('\n\n');
        }
      } else if (postParagraphs.length === 2) {
        result.body = postParagraphs[1].trim();
      }
    }
  }

  // Fallback: se body está vazio, usar o texto completo
  if (!result.body && postText) {
    result.body = postText;
  }

  return result;
}

// ── Main ──────────────────────────────────────────────────────

async function main() {
  const filePath = path.resolve(argv.file);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Arquivo não encontrado: ${filePath}`);
    process.exit(1);
  }

  console.log('');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║  save-post-cli — Salvar Post no Supabase        ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('');

  const content = fs.readFileSync(filePath, 'utf-8');
  const postData = parsePostMarkdown(content, argv.title);

  console.log(`📝 Título: ${postData.title}`);
  console.log(`🔑 Slug: ${slugify(postData.title)}`);
  console.log(`📊 Pilar: ${postData.pillar} (${postData.pillarLabel || 'N/A'})`);
  console.log(`📐 Framework: ${postData.framework || 'N/A'}`);
  console.log(`📊 Score: ${postData.reviewScore || 'N/A'}`);
  console.log(`📋 Status: ${postData.status}`);
  console.log(`⏰ Urgência: ${postData.urgency}`);
  console.log(`🪝 Hook: ${postData.hookText ? postData.hookText.substring(0, 80) + '...' : 'N/A'}`);
  console.log('');

  try {
    const saved = await savePost(postData);
    console.log(`✅ Post "${argv.title}" salvo no Supabase (id: ${saved.id})`);
    console.log(`   Slug: ${saved.slug}`);
  } catch (err) {
    console.error(`❌ Erro ao salvar: ${err.message}`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('❌ Erro fatal:', err.message);
  process.exit(1);
});
