#!/usr/bin/env node
/**
 * save-distribuicao-cli.js
 * 
 * CLI para salvar pessoa + ângulos de distribuição no Supabase.
 * Suporta 2 modos:
 *   - pesquisa: pessoa nova + ângulos (Modo A do squad)
 *   - aprofundamento: ângulos novos para pessoa existente (Modo B do squad)
 * 
 * Uso:
 *   node save-distribuicao-cli.js --nome "Victor Baggio" --file angulos.md --mode aprofundamento
 *   node save-distribuicao-cli.js --nome "Fulano" --file candidatos.md --mode pesquisa --funcao "CEO" --rede-relevante "decisores B2B" --expande-bolha
 *   node save-distribuicao-cli.js --update-status --angulo-titulo "Título do ângulo" --pessoa "Nome" --status materia_em_producao
 */

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const { savePessoa, saveAngulo, updateAnguloStatus, supabase } = require('./upload-to-supabase');

// ── Mapa de arquétipos: descritivo → snake_case ──────────────
const ARQUETIPO_MAP = {
  'como ele faz o que prega': 'como_ele_faz_o_que_prega',
  'contra o consenso': 'contra_o_consenso',
  'o que aprendi estudando ele': 'o_que_aprendi_estudando_ele',
  'padrão que vi no trabalho dele': 'padrao_que_vi_no_trabalho_dele',
  'padrao que vi no trabalho dele': 'padrao_que_vi_no_trabalho_dele',
  'misto': 'misto',
  'outro': 'outro',
};

function normalizeArquetipo(raw) {
  const normalized = raw.trim().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  // Tentar match direto
  for (const [key, value] of Object.entries(ARQUETIPO_MAP)) {
    const keyNorm = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (normalized === keyNorm || normalized.includes(keyNorm)) {
      return value;
    }
  }
  
  // Se já está em snake_case, validar
  const validValues = Object.values(ARQUETIPO_MAP);
  if (validValues.includes(normalized.replace(/\s+/g, '_'))) {
    return normalized.replace(/\s+/g, '_');
  }
  
  // Fallback: outro
  console.warn(`⚠️  Arquétipo não reconhecido: "${raw}" → usando "outro"`);
  return 'outro';
}

// ── CLI Arguments ─────────────────────────────────────────────
const argv = yargs(process.argv.slice(2))
  .usage('Uso: node save-distribuicao-cli.js --nome "Nome" --file angulos.md --mode aprofundamento')
  .option('nome', {
    alias: 'n',
    type: 'string',
    describe: 'Nome da pessoa'
  })
  .option('file', {
    alias: 'f',
    type: 'string',
    describe: 'Caminho para o arquivo markdown de ângulos'
  })
  .option('mode', {
    alias: 'm',
    type: 'string',
    default: 'aprofundamento',
    describe: 'Modo: pesquisa (pessoa nova) ou aprofundamento (ângulos novos)'
  })
  .option('funcao', {
    type: 'string',
    describe: 'Cargo/empresa da pessoa (modo pesquisa)'
  })
  .option('rede-relevante', {
    type: 'string',
    describe: 'Rede relevante (modo pesquisa)'
  })
  .option('expande-bolha', {
    type: 'boolean',
    default: false,
    describe: 'Expande bolha Winning? (modo pesquisa)'
  })
  .option('expectativa-comentario', {
    type: 'string',
    default: 'possivel',
    describe: 'Expectativa de comentário: provavel | possivel | incerto'
  })
  .option('expectativa-repost', {
    type: 'string',
    default: 'incerto',
    describe: 'Expectativa de repost: provavel | possivel | incerto'
  })
  .option('update-status', {
    type: 'boolean',
    describe: 'Modo update: atualizar status de um ângulo existente'
  })
  .option('angulo-titulo', {
    type: 'string',
    describe: 'Título do ângulo (para update-status)'
  })
  .option('pessoa', {
    type: 'string',
    describe: 'Nome da pessoa (para update-status)'
  })
  .option('status', {
    type: 'string',
    describe: 'Novo status: novo | briefing_gerado | materia_em_producao | publicada | descartado'
  })
  .help()
  .parseSync();

// ── Markdown Parser ───────────────────────────────────────────

/**
 * Parseia um arquivo de ângulos (formato aprofundamento-template.md ou candidato-template.md)
 * e retorna array de ângulos estruturados.
 */
function parseAngulosMarkdown(content) {
  const angulos = [];
  const lines = content.split('\n');
  
  let currentAngulo = null;
  let inEvidencias = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Detectar início de ângulo
    if (trimmed.match(/^#{2,3}\s+[ÂA]ngulo\s+\d+/i) || trimmed.match(/^#{2,3}\s+[ÂA]ngulo\s+\[?N?\+?\d+\]?/i)) {
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
      currentAngulo.arquetipo = normalizeArquetipo(val);
      inEvidencias = false;
    }
    else if (trimmed.startsWith('- **Título pela lente:**')) {
      let val = trimmed.replace('- **Título pela lente:**', '').trim();
      // Remover aspas do título
      val = val.replace(/^[""]|[""]$/g, '').replace(/^"|"$/g, '');
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
      const origemRaw = trimmed.replace('- **Origem:**', '').trim().toLowerCase();
      if (origemRaw.includes('input do thiago') || origemRaw.includes('input livre')) {
        currentAngulo.origem = 'aprofundamento_com_input';
      } else if (origemRaw.includes('movimento recente')) {
        currentAngulo.origem = 'aprofundamento_por_movimento_recente';
      } else if (origemRaw.includes('pesquisa')) {
        currentAngulo.origem = 'pesquisa_inicial';
      } else {
        currentAngulo.origem = 'manual';
      }
      inEvidencias = false;
    }
    else if (trimmed.startsWith('- **Não-duplicata:**') || trimmed.startsWith('---') || trimmed.startsWith('## ')) {
      inEvidencias = false;
    }
  }
  
  // Último ângulo
  if (currentAngulo) {
    angulos.push(currentAngulo);
  }
  
  return angulos;
}

// ── Update Status Mode ───────────────────────────────────────

async function handleUpdateStatus() {
  const pessoaNome = argv.pessoa;
  const anguloTitulo = argv['angulo-titulo'];
  const newStatus = argv.status;

  if (!pessoaNome || !anguloTitulo || !newStatus) {
    console.error('❌ Modo update-status requer: --pessoa, --angulo-titulo, --status');
    process.exit(1);
  }

  console.log('');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║  save-distribuicao-cli — Update Status           ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('');

  // Buscar pessoa
  const { data: pessoa } = await supabase
    .from('lista_distribuicao')
    .select('id, nome')
    .ilike('nome', pessoaNome)
    .maybeSingle();

  if (!pessoa) {
    console.error(`❌ Pessoa não encontrada: "${pessoaNome}"`);
    process.exit(1);
  }

  // Buscar ângulo
  const { data: angulo } = await supabase
    .from('angulos_distribuicao')
    .select('id, titulo_pela_lente, status')
    .eq('pessoa_id', pessoa.id)
    .ilike('titulo_pela_lente', `%${anguloTitulo.substring(0, 30)}%`)
    .maybeSingle();

  if (!angulo) {
    console.error(`❌ Ângulo não encontrado para "${pessoaNome}": "${anguloTitulo}"`);
    process.exit(1);
  }

  console.log(`👤 Pessoa: ${pessoa.nome}`);
  console.log(`📐 Ângulo: ${angulo.titulo_pela_lente.substring(0, 60)}...`);
  console.log(`📊 Status: ${angulo.status} → ${newStatus}`);

  const updated = await updateAnguloStatus(angulo.id, newStatus);
  console.log('');
  console.log(`✅ Status atualizado: ${updated.status}`);
}

// ── Main ──────────────────────────────────────────────────────

async function main() {
  // Modo update-status
  if (argv['update-status']) {
    return handleUpdateStatus();
  }

  const nome = argv.nome;
  const filePath = argv.file ? path.resolve(argv.file) : null;
  const mode = argv.mode;

  if (!nome || !filePath) {
    console.error('❌ Argumentos obrigatórios: --nome e --file');
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Arquivo não encontrado: ${filePath}`);
    process.exit(1);
  }

  console.log('');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║  save-distribuicao-cli — Salvar no Supabase      ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('');

  // 1. Parsear ângulos do arquivo
  const content = fs.readFileSync(filePath, 'utf-8');
  const angulos = parseAngulosMarkdown(content);

  if (angulos.length === 0) {
    console.error('❌ Nenhum ângulo encontrado no arquivo');
    process.exit(1);
  }

  console.log(`📁 Arquivo: ${path.basename(filePath)}`);
  console.log(`📐 Ângulos encontrados: ${angulos.length}`);
  console.log(`📋 Modo: ${mode}`);
  console.log('');

  // 2. Salvar/buscar pessoa
  const pessoaData = {
    nome,
    funcao: argv.funcao || null,
    rede_relevante: argv['rede-relevante'] || null,
    expande_bolha: argv['expande-bolha'] || false,
  };

  const pessoa = await savePessoa(pessoaData);
  console.log(`👤 Pessoa: ${pessoa.nome} (id: ${pessoa.id})`);
  console.log(`   ${pessoa.funcao || 'Função não definida'}`);
  console.log('');

  // 3. Salvar ângulos
  let savedCount = 0;
  let skippedCount = 0;

  for (const angulo of angulos) {
    if (!angulo.titulo_pela_lente) {
      console.warn(`⚠️  Ângulo sem título — ignorado`);
      skippedCount++;
      continue;
    }

    const anguloData = {
      pessoa_id: pessoa.id,
      arquetipo: angulo.arquetipo || 'outro',
      titulo_pela_lente: angulo.titulo_pela_lente,
      evidencias: angulo.evidencias,
      risco: angulo.risco,
      expectativa_comentario: argv['expectativa-comentario'] || 'possivel',
      expectativa_repost: argv['expectativa-repost'] || 'incerto',
      origem: angulo.origem || (mode === 'pesquisa' ? 'pesquisa_inicial' : 'aprofundamento_por_movimento_recente'),
      status: 'novo',
    };

    try {
      const saved = await saveAngulo(anguloData);
      savedCount++;
      console.log(`   ✅ [${angulo.arquetipo}] "${angulo.titulo_pela_lente.substring(0, 60)}..." (id: ${saved.id})`);
    } catch (err) {
      console.error(`   ❌ Erro: ${err.message}`);
      skippedCount++;
    }
  }

  console.log('');
  console.log('────────────────────────────────────────────────');
  console.log(`✅ ${pessoa.nome} — ${savedCount} ângulo(s) salvo(s) no Supabase`);
  if (skippedCount > 0) {
    console.log(`⚠️  ${skippedCount} ângulo(s) ignorado(s) (duplicata ou erro)`);
  }
}

main().catch(err => {
  console.error('❌ Erro fatal:', err.message);
  process.exit(1);
});
