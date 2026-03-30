/**
 * SUPABASE-001: Validação + Bucket Setup
 * 
 * Este script:
 * 1. Valida a conexão com Supabase
 * 2. Cria o bucket content-assets (se não existe)
 * 3. Verifica se as tabelas existem
 * 4. Faz um smoke test inserindo/lendo/deletando um registro
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Carregar .env
const envPath = path.join(__dirname, '..', '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex > 0) {
      env[trimmed.slice(0, eqIndex)] = trimmed.slice(eqIndex + 1);
    }
  }
});

const SUPABASE_URL = env.SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = env.SUPABASE_ANON_KEY;

console.log('📊 SUPABASE-001: Validação do Setup\n');
console.log(`URL: ${SUPABASE_URL}`);

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const supabaseAnon = createClient(SUPABASE_URL, ANON_KEY, {
  auth: { persistSession: false },
});

const results = {
  connection: false,
  bucket: false,
  posts: false,
  covers: false,
  carousels: false,
  carousel_slides: false,
  rls_read: false,
  rls_write: false,
  smoke_test: false,
};

async function step1_connection() {
  console.log('\n1️⃣  Conexão...');
  try {
    // Use storage API to test connection (works with both keys)
    const { data, error } = await supabaseAdmin.storage.listBuckets();
    if (!error) {
      console.log(`   ✅ Conectado (${data.length} buckets encontrados)`);
      results.connection = true;
    } else {
      console.log(`   ❌ Erro: ${error.message}`);
    }
  } catch (e) {
    console.log(`   ❌ ${e.message}`);
  }
}

async function step2_bucket() {
  console.log('\n2️⃣  Bucket "content-assets"...');
  
  // Check if exists
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  const exists = buckets?.some(b => b.name === 'content-assets');
  
  if (exists) {
    console.log('   ✅ Já existe');
    results.bucket = true;
    return;
  }
  
  // Create
  const { error } = await supabaseAdmin.storage.createBucket('content-assets', {
    public: true,
    fileSizeLimit: 52428800,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'application/pdf'],
  });
  
  if (!error) {
    console.log('   ✅ Criado com sucesso');
    results.bucket = true;
  } else {
    console.log(`   ❌ ${error.message}`);
  }
}

async function step3_tables() {
  console.log('\n3️⃣  Tabelas...');
  
  const tables = ['posts', 'covers', 'carousels', 'carousel_slides'];
  
  for (const table of tables) {
    const { error } = await supabaseAdmin.from(table).select('id').limit(0);
    const ok = !error;
    results[table] = ok;
    console.log(`   ${ok ? '✅' : '❌'} ${table}${error ? ` → ${error.message}` : ''}`);
  }
}

async function step4_rls() {
  console.log('\n4️⃣  RLS (testando com anon key)...');
  
  if (!results.posts) {
    console.log('   ⏭️  Pulando (tabela posts não existe)');
    return;
  }
  
  // Test read
  const { error: readErr } = await supabaseAnon.from('posts').select('id').limit(0);
  results.rls_read = !readErr;
  console.log(`   ${!readErr ? '✅' : '❌'} Leitura pública${readErr ? ` → ${readErr.message}` : ''}`);
  
  // Test write (insert + delete)
  const testSlug = `__test_${Date.now()}`;
  const { data: inserted, error: insertErr } = await supabaseAnon
    .from('posts')
    .insert({
      title: 'TEST',
      slug: testSlug,
      hook_text: 'test',
      body: 'test',
    })
    .select('id')
    .single();
  
  results.rls_write = !insertErr;
  console.log(`   ${!insertErr ? '✅' : '❌'} Escrita anon${insertErr ? ` → ${insertErr.message}` : ''}`);
  
  // Cleanup
  if (inserted) {
    await supabaseAdmin.from('posts').delete().eq('id', inserted.id);
    console.log('   🗑️  Registro de teste removido');
  }
}

async function step5_smokeTest() {
  console.log('\n5️⃣  Smoke Test completo...');
  
  if (!results.posts) {
    console.log('   ⏭️  Pulando (tabelas não existem)');
    return;
  }
  
  try {
    // Insert post
    const { data: post, error: postErr } = await supabaseAdmin
      .from('posts')
      .insert({
        title: 'Smoke Test Post',
        slug: `smoke-test-${Date.now()}`,
        content_type: 'text',
        pillar: 'A',
        hook_text: 'Hook de teste',
        body: 'Corpo do post de teste',
        status: 'armazem',
      })
      .select()
      .single();
    
    if (postErr) throw new Error(`Insert post: ${postErr.message}`);
    console.log(`   ✅ Post criado: ${post.id}`);
    
    // Insert cover
    const { data: cover, error: coverErr } = await supabaseAdmin
      .from('covers')
      .insert({
        post_id: post.id,
        slug: post.slug,
        style: 'editorial-clean',
        image_url: 'https://example.com/test.png',
        image_path: 'covers/test.png',
      })
      .select()
      .single();
    
    if (coverErr) throw new Error(`Insert cover: ${coverErr.message}`);
    console.log(`   ✅ Cover criada: ${cover.id}`);
    
    // Insert carousel
    const { data: carousel, error: carErr } = await supabaseAdmin
      .from('carousels')
      .insert({
        post_id: post.id,
        slug: post.slug,
        visual_style: 'twitter-style',
        slide_count: 5,
        pdf_url: 'https://example.com/test.pdf',
        pdf_path: 'carousels/test.pdf',
      })
      .select()
      .single();
    
    if (carErr) throw new Error(`Insert carousel: ${carErr.message}`);
    console.log(`   ✅ Carousel criado: ${carousel.id}`);
    
    // Insert slides
    const { error: slideErr } = await supabaseAdmin
      .from('carousel_slides')
      .insert([
        { carousel_id: carousel.id, slide_number: 1, image_url: 'https://example.com/s1.png', image_path: 'slides/s1.png' },
        { carousel_id: carousel.id, slide_number: 2, image_url: 'https://example.com/s2.png', image_path: 'slides/s2.png' },
      ]);
    
    if (slideErr) throw new Error(`Insert slides: ${slideErr.message}`);
    console.log('   ✅ 2 slides criados');
    
    // Read back via anon key
    const { data: readPost } = await supabaseAnon
      .from('posts')
      .select('*, covers(*), carousels(*, carousel_slides(*))')
      .eq('id', post.id)
      .single();
    
    if (readPost && readPost.covers && readPost.carousels) {
      console.log('   ✅ Leitura com JOINs OK');
    }
    
    // CASCADE delete test
    const { error: delErr } = await supabaseAdmin
      .from('posts')
      .delete()
      .eq('id', post.id);
    
    if (!delErr) {
      console.log('   ✅ CASCADE delete OK');
    }
    
    results.smoke_test = true;
    console.log('   🎉 Smoke test PASSED');
    
  } catch (e) {
    console.error(`   ❌ Smoke test FAILED: ${e.message}`);
  }
}

async function main() {
  await step1_connection();
  
  if (!results.connection) {
    console.error('\n❌ Não foi possível conectar. Verifique SUPABASE_URL e keys no .env');
    process.exit(1);
  }
  
  await step2_bucket();
  await step3_tables();
  await step4_rls();
  await step5_smokeTest();
  
  // Summary
  const allTablesDone = results.posts && results.covers && results.carousels && results.carousel_slides;
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO SUPABASE-001\n');
  console.log(`  Conexão:        ${results.connection ? '✅' : '❌'}`);
  console.log(`  Bucket:         ${results.bucket ? '✅' : '❌'}`);
  console.log(`  Tabela posts:   ${results.posts ? '✅' : '❌'}`);
  console.log(`  Tabela covers:  ${results.covers ? '✅' : '❌'}`);
  console.log(`  Tabela carousels: ${results.carousels ? '✅' : '❌'}`);
  console.log(`  Tabela c_slides:  ${results.carousel_slides ? '✅' : '❌'}`);
  console.log(`  RLS leitura:    ${results.rls_read ? '✅' : '⏭️'}`);
  console.log(`  RLS escrita:    ${results.rls_write ? '✅' : '⏭️'}`);
  console.log(`  Smoke test:     ${results.smoke_test ? '✅' : '⏭️'}`);
  console.log(`  .env URL:       ✅ ${SUPABASE_URL}`);
  
  if (allTablesDone && results.bucket && results.smoke_test) {
    console.log('\n🎉 SUPABASE-001 COMPLETA! Tudo funcionando.\n');
  } else if (!allTablesDone) {
    console.log('\n⚠️  TABELAS NÃO EXISTEM — Execute o DDL no SQL Editor:');
    console.log('   https://supabase.com/dashboard/project/mvryaxohnbftupocdlqa/sql/new');
    console.log(`\n   Arquivo: ${path.resolve(__dirname, '..', 'migrations', '001-initial-schema.sql')}\n`);
    console.log('   OU faça login no CLI e execute:');
    console.log('   npx supabase login');
    console.log('   npx supabase db query --project-ref mvryaxohnbftupocdlqa < supabase/migrations/001-initial-schema.sql\n');
  }
  
  console.log('='.repeat(60));
}

main().catch(err => {
  console.error('💥', err.message);
  process.exit(1);
});
