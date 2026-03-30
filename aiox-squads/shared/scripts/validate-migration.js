const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../squads/capas-linkedin/.env') });

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function validate() {
  // Posts
  const { data: posts } = await sb.from('posts').select('id, slug, content_type').order('slug');
  console.log('=== POSTS (' + posts.length + ') ===');
  for (const p of posts) {
    console.log('  ' + p.slug + ' (' + p.content_type + ')');
  }

  // Covers
  const { data: covers } = await sb.from('covers').select('slug, style, image_url').order('slug');
  console.log('\n=== COVERS (' + covers.length + ') ===');
  for (const c of covers) {
    console.log('  ' + c.slug + ' — ' + c.style);
  }
  if (covers[0]) {
    console.log('\n  🔗 Sample URL: ' + covers[0].image_url);
  }

  // Carousels
  const { data: carousels } = await sb.from('carousels').select('slug, visual_style, slide_count, pdf_url').order('slug');
  console.log('\n=== CAROUSELS (' + carousels.length + ') ===');
  for (const c of carousels) {
    console.log('  ' + c.slug + ' — ' + c.visual_style + ' (' + c.slide_count + ' slides)');
  }
  if (carousels[0]) {
    console.log('\n  🔗 PDF URL: ' + carousels[0].pdf_url);
  }

  // Slides
  const { data: slides } = await sb.from('carousel_slides').select('slide_number, image_url, carousel_id').order('slide_number');
  console.log('\n=== CAROUSEL_SLIDES (' + slides.length + ') ===');

  // Summary
  console.log('\n═══════════════════════════════════════');
  console.log('RESUMO DE VALIDAÇÃO:');
  console.log('  Posts:           ' + posts.length + '/17');
  console.log('  Covers:          ' + covers.length + '/7');
  console.log('  Carousels:       ' + carousels.length + '/2');
  console.log('  Carousel Slides: ' + slides.length + '/15');
  const ok = posts.length === 17 && covers.length === 7 && carousels.length === 2 && slides.length === 15;
  console.log(ok ? '\n✅ TODOS OS DADOS VÁLIDOS!' : '\n⚠️ Contagens não batem — verificar.');
  console.log('═══════════════════════════════════════');
}

validate().catch(e => { console.error(e); process.exit(1); });
