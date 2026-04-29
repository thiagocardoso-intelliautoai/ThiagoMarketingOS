#!/usr/bin/env node
/**
 * Teste isolado do parser de ângulos para diagnosticar
 * por que só 1 dos 3 ângulos do Victor Baggio foi capturado.
 */

const fs = require('fs');
const path = require('path');

// Reproduz a função parseAngulosMarkdown exatamente como está no CLI
function parseAngulosMarkdown(content) {
  const angulos = [];
  const lines = content.split('\n');
  
  let currentAngulo = null;
  let inEvidencias = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Detectar início de ângulo
    const matchA = trimmed.match(/^#{2,3}\s+[ÂA]ngulo\s+\d+/i);
    const matchB = trimmed.match(/^#{2,3}\s+[ÂA]ngulo\s+\[?N?\+?\d+\]?/i);
    
    if (matchA || matchB) {
      console.log(`[MATCH] Linha ${i+1}: "${trimmed}" → matchA=${!!matchA}, matchB=${!!matchB}`);
      if (currentAngulo) {
        angulos.push(currentAngulo);
      }
      currentAngulo = {
        arquetipo: null,
        titulo_pela_lente: null,
        evidencias: [],
        risco: null,
        origem: null,
      };
      inEvidencias = false;
      continue;
    }
    
    if (!currentAngulo) continue;
    
    // Extrair campos
    if (trimmed.startsWith('- **Arquétipo:**') || trimmed.startsWith('- **Arquetipo:**')) {
      const val = trimmed.replace(/- \*\*Arqu[ée]tipo:\*\*\s*/, '').trim();
      console.log(`  [ARQU] Linha ${i+1}: "${val}"`);
      currentAngulo.arquetipo = val;
      inEvidencias = false;
    }
    else if (trimmed.startsWith('- **Título pela lente:**')) {
      let val = trimmed.replace('- **Título pela lente:**', '').trim();
      val = val.replace(/^[""\u201C]|[""\u201D]$/g, '').replace(/^"|"$/g, '');
      console.log(`  [TIT] Linha ${i+1}: "${val.substring(0, 60)}..."`);
      currentAngulo.titulo_pela_lente = val;
      inEvidencias = false;
    }
    else if (trimmed.startsWith('- **Evidências específicas')) {
      inEvidencias = true;
    }
    else if (inEvidencias && trimmed.match(/^\d+\.\s+/)) {
      const evidencia = trimmed.replace(/^\d+\.\s+/, '').trim();
      currentAngulo.evidencias.push(evidencia);
    }
    else if (trimmed.startsWith('- **Risco:**')) {
      currentAngulo.risco = trimmed.replace('- **Risco:**', '').trim();
      inEvidencias = false;
    }
    else if (trimmed.startsWith('- **Origem:**')) {
      inEvidencias = false;
    }
    // AQUI: A condição que potencialmente mata os ângulos seguintes
    else if (trimmed.startsWith('- **Não-duplicata:**') || trimmed.startsWith('---') || trimmed.startsWith('## ')) {
      if (trimmed.startsWith('## ')) {
        console.log(`  [!!] Linha ${i+1}: "## " detectado DENTRO de currentAngulo → inEvidencias=false`);
        console.log(`       Conteúdo: "${trimmed}"`);
      }
      inEvidencias = false;
    }
  }
  
  // Último ângulo
  if (currentAngulo) {
    angulos.push(currentAngulo);
  }
  
  return angulos;
}

// Carregar o arquivo real de output
const filePath = path.resolve(__dirname, '../../squads/seed-lista-distribuicao/output/angulos-aprofundados.md');
const content = fs.readFileSync(filePath, 'utf-8');

console.log('═══════════════════════════════════════════');
console.log(' Parser Test — angulos-aprofundados.md');
console.log('═══════════════════════════════════════════');
console.log('');

// Listar todas as linhas que começam com ## ou ### para debug
const lines = content.split('\n');
console.log('=== Linhas com ## ou ### no arquivo ===');
lines.forEach((line, i) => {
  const trimmed = line.trim();
  if (trimmed.startsWith('##')) {
    const matchA = trimmed.match(/^#{2,3}\s+[ÂA]ngulo\s+\d+/i);
    const matchB = trimmed.match(/^#{2,3}\s+[ÂA]ngulo\s+\[?N?\+?\d+\]?/i);
    console.log(`  L${i+1}: "${trimmed}" → matchA=${!!matchA}, matchB=${!!matchB}`);
  }
});
console.log('');

console.log('=== Rodando parser ===');
const angulos = parseAngulosMarkdown(content);

console.log('');
console.log('═══════════════════════════════════════════');
console.log(` RESULTADO: ${angulos.length} ângulo(s) parseados`);
console.log('═══════════════════════════════════════════');
angulos.forEach((a, i) => {
  console.log(`  ${i+1}. [${a.arquetipo || 'NULL'}] "${(a.titulo_pela_lente || 'NULL').substring(0, 60)}..."`);
  console.log(`     evidências: ${a.evidencias.length}, risco: ${a.risco ? 'sim' : 'não'}`);
});
