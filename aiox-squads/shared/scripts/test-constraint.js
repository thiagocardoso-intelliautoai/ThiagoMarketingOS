#!/usr/bin/env node
/**
 * Teste de INSERT direto no Supabase para verificar se o CHECK constraint
 * do campo arquetipo aceita os novos valores da migration 20260425.
 */

const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../squads/capas-linkedin/.env')
});

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

async function testConstraint() {
  console.log('═══════════════════════════════════════════');
  console.log(' Teste: CHECK constraint de arquetipo');
  console.log('═══════════════════════════════════════════\n');

  // Pessoa do Victor
  const VICTOR_ID = '7ad76bed-b386-4073-85e6-b92512def2ef';
  
  // Testar cada novo valor de arquétipo
  const testValues = [
    'como_ele_faz_o_que_prega',
    'padrao_que_vi_no_trabalho_dele',
    'o_que_aprendi_estudando_ele',
    // Valores antigos (pra comparar)
    'contra_o_consenso',
    'benchmark_vivo',      // Antigo — deve falhar se migration aplicada
  ];
  
  for (const arq of testValues) {
    const testRow = {
      pessoa_id: VICTOR_ID,
      arquetipo: arq,
      titulo_pela_lente: `[TEST] Teste de constraint — ${arq}`,
      evidencias: [],
      status: 'novo',
    };
    
    const { data, error } = await supabase
      .from('angulos_distribuicao')
      .insert(testRow)
      .select('id, arquetipo')
      .single();
    
    if (error) {
      console.log(`  ❌ ${arq} → REJEITADO: ${error.message}`);
    } else {
      console.log(`  ✅ ${arq} → ACEITO (id: ${data.id})`);
      // Limpar registro de teste
      await supabase.from('angulos_distribuicao').delete().eq('id', data.id);
      console.log(`     🧹 Limpeza: registro de teste removido`);
    }
  }
}

testConstraint().catch(err => {
  console.error('Erro fatal:', err.message);
  process.exit(1);
});
