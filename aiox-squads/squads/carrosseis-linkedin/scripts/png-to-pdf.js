#!/usr/bin/env node
/**
 * png-to-pdf.js — Combina PNGs de slides em um PDF de carrossel LinkedIn
 * 
 * Uso:
 *   node scripts/png-to-pdf.js <pasta-dos-slides>
 * 
 * Exemplo:
 *   node scripts/png-to-pdf.js output/slides/a-falacia-do-sem-esforco
 * 
 * O script:
 *   1. Lista todos os slide-*.png em ordem numérica
 *   2. Cria um PDF com cada PNG como página individual (1080x1350px)
 *   3. Salva como carrossel-{slug}.pdf na mesma pasta
 */

const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

// LinkedIn carousel: 1080x1350px → pontos PDF (1px = 0.75pt)
const PAGE_WIDTH = 1080 * 0.75;   // 810pt
const PAGE_HEIGHT = 1350 * 0.75;  // 1012.5pt

async function main() {
  const slidesDir = process.argv[2];

  if (!slidesDir) {
    console.error('❌ Uso: node scripts/png-to-pdf.js <pasta-dos-slides>');
    console.error('   Ex:  node scripts/png-to-pdf.js output/slides/a-falacia-do-sem-esforco');
    process.exit(1);
  }

  const absDir = path.resolve(slidesDir);

  if (!fs.existsSync(absDir)) {
    console.error(`❌ Pasta não encontrada: ${absDir}`);
    process.exit(1);
  }

  // Listar PNGs em ordem numérica (slide-01.png, slide-02.png, ...)
  const pngFiles = fs.readdirSync(absDir)
    .filter(f => /^slide-\d+\.png$/i.test(f))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)[0]);
      const numB = parseInt(b.match(/\d+/)[0]);
      return numA - numB;
    });

  if (pngFiles.length === 0) {
    console.error(`❌ Nenhum slide-*.png encontrado em: ${absDir}`);
    process.exit(1);
  }

  console.log(`📄 Encontrados ${pngFiles.length} slides:`);
  pngFiles.forEach((f, i) => console.log(`   ${i + 1}. ${f}`));

  // Criar PDF
  const pdfDoc = await PDFDocument.create();

  for (const pngFile of pngFiles) {
    const pngBytes = fs.readFileSync(path.join(absDir, pngFile));
    const pngImage = await pdfDoc.embedPng(pngBytes);

    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    page.drawImage(pngImage, {
      x: 0,
      y: 0,
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
    });
  }

  // Extrair slug do nome da pasta
  const slug = path.basename(absDir);
  const outputPath = path.join(absDir, `carrossel-${slug}.pdf`);

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);

  console.log(`\n✅ PDF gerado com sucesso!`);
  console.log(`   📁 ${outputPath}`);
  console.log(`   📊 ${pngFiles.length} páginas`);
  console.log(`   📐 ${PAGE_WIDTH}pt × ${PAGE_HEIGHT}pt (1080×1350px)`);
}

main().catch(err => {
  console.error('❌ Erro ao gerar PDF:', err.message);
  process.exit(1);
});
