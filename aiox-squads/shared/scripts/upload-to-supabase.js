/**
 * upload-to-supabase.js
 * 
 * Módulo compartilhado com 3 funções exportadas para interação com Supabase:
 *   - savePost(postData)        → upsert na tabela `posts` por slug
 *   - uploadCover(slug, pngPath, style, postId) → upload PNG + insert `covers`
 *   - uploadCarousel(slug, slidePngs, pdfPath, style, postId) → upload PDF + slides + insert `carousels` / `carousel_slides`
 *
 * Usa SUPABASE_SERVICE_ROLE_KEY para bypass de RLS (server-side).
 * Idempotente: pode rodar múltiplas vezes sem duplicar dados.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../squads/capas-linkedin/.env')
});

// ── Supabase client (service role — bypassa RLS) ──────────────
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY devem estar definidos no .env'
  );
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

const BUCKET = 'content-assets';

// ── Helpers ───────────────────────────────────────────────────

/**
 * Gera slug a partir de um título:
 *  NFD → remove acentos → lowercase → replace [^a-z0-9] por "-" → trim hifens
 */
function slugify(title) {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // remove combining diacritical marks
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ── savePost ──────────────────────────────────────────────────

/**
 * Upsert de um post na tabela `posts` por slug.
 * Retorna o registro inserido/atualizado (com id).
 */
async function savePost(postData) {
  const slug = postData.slug || slugify(postData.title);

  const row = {
    slug,
    title:          postData.title,
    content_type:   postData.contentType || 'text',
    theme:          postData.theme || null,
    pillar:         postData.pillar || 'A',
    pillar_label:   postData.pillarLabel || null,
    hook_text:      postData.hookText,
    hook_structure: postData.hookStructure || null,
    framework:      postData.framework || null,
    body:           postData.body,
    cta:            postData.cta || null,
    hashtags:       postData.hashtags || [],
    sources:        postData.sources || [],
    review_score:   postData.reviewScore ? parseInt(postData.reviewScore, 10) : null,
    status:         postData.status || 'armazem',
    urgency:        postData.urgency || 'relevante',
    week:           postData.week || null,
    post_number:    postData.postNumber || null,
    series:         postData.series || null,
    series_order:   postData.seriesOrder || null,
  };

  const { data, error } = await supabase
    .from('posts')
    .upsert(row, { onConflict: 'slug' })
    .select()
    .single();

  if (error) throw new Error(`savePost("${slug}"): ${error.message}`);
  return data;
}

// ── uploadCover ───────────────────────────────────────────────

/**
 * Faz upload do PNG para o Storage e insere/atualiza na tabela `covers`.
 *
 * @param {string} slug       - Slug do post
 * @param {string} pngPath    - Caminho absoluto para o cover.png
 * @param {string} style      - Estilo visual (ex: "Quote Card")
 * @param {string} postId     - UUID do post pai
 */
async function uploadCover(slug, pngPath, style, postId) {
  // 1. Ler arquivo
  const fileBuffer = fs.readFileSync(pngPath);
  const storagePath = `covers/${slug}/cover.png`;

  // 2. Upload para Storage (upsert)
  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType: 'image/png',
      upsert: true
    });

  if (uploadErr) throw new Error(`uploadCover storage ("${slug}"): ${uploadErr.message}`);

  // 3. Obter URL pública
  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(storagePath);

  const imageUrl = urlData.publicUrl;

  // 4. Upsert na tabela covers
  // Primeiro verificar se já existe
  const { data: existing } = await supabase
    .from('covers')
    .select('id')
    .eq('post_id', postId)
    .maybeSingle();

  if (existing) {
    const { error: updateErr } = await supabase
      .from('covers')
      .update({
        slug,
        style,
        image_url: imageUrl,
        image_path: storagePath,
        file_size: fileBuffer.length,
      })
      .eq('id', existing.id);
    if (updateErr) throw new Error(`uploadCover update ("${slug}"): ${updateErr.message}`);
  } else {
    const { error: insertErr } = await supabase
      .from('covers')
      .insert({
        post_id: postId,
        slug,
        style,
        image_url: imageUrl,
        image_path: storagePath,
        file_size: fileBuffer.length,
      });
    if (insertErr) throw new Error(`uploadCover insert ("${slug}"): ${insertErr.message}`);
  }

  return { imageUrl, storagePath };
}

// ── uploadCarousel ────────────────────────────────────────────

/**
 * Faz upload do PDF + slides individuais e registra nas tabelas `carousels` + `carousel_slides`.
 *
 * @param {string}   slug        - Slug do post
 * @param {string[]} slidePngs   - Array de caminhos absolutos para slide PNGs (em ordem)
 * @param {string}   pdfPath     - Caminho absoluto para o PDF do carrossel
 * @param {string}   style       - Estilo visual (ex: "twitter-style")
 * @param {string}   postId      - UUID do post pai
 */
async function uploadCarousel(slug, slidePngs, pdfPath, style, postId) {
  // 1. Upload PDF
  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfStoragePath = `carousels/${slug}/${path.basename(pdfPath)}`;

  const { error: pdfUploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(pdfStoragePath, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true
    });

  if (pdfUploadErr) throw new Error(`uploadCarousel PDF ("${slug}"): ${pdfUploadErr.message}`);

  const { data: pdfUrlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(pdfStoragePath);

  const pdfUrl = pdfUrlData.publicUrl;

  // 2. Upsert na tabela carousels
  const { data: existing } = await supabase
    .from('carousels')
    .select('id')
    .eq('post_id', postId)
    .maybeSingle();

  let carouselId;

  if (existing) {
    const { error: updateErr } = await supabase
      .from('carousels')
      .update({
        slug,
        visual_style: style,
        slide_count: slidePngs.length,
        pdf_url: pdfUrl,
        pdf_path: pdfStoragePath,
        pdf_size: pdfBuffer.length,
      })
      .eq('id', existing.id);
    if (updateErr) throw new Error(`uploadCarousel update ("${slug}"): ${updateErr.message}`);
    carouselId = existing.id;

    // Limpar slides antigos para re-inserir
    await supabase.from('carousel_slides').delete().eq('carousel_id', carouselId);
  } else {
    const { data: carouselRow, error: insertErr } = await supabase
      .from('carousels')
      .insert({
        post_id: postId,
        slug,
        visual_style: style,
        slide_count: slidePngs.length,
        pdf_url: pdfUrl,
        pdf_path: pdfStoragePath,
        pdf_size: pdfBuffer.length,
      })
      .select()
      .single();
    if (insertErr) throw new Error(`uploadCarousel insert ("${slug}"): ${insertErr.message}`);
    carouselId = carouselRow.id;
  }

  // 3. Upload slides individuais
  const slideRows = [];

  for (let i = 0; i < slidePngs.length; i++) {
    const slidePng = slidePngs[i];
    const slideBuffer = fs.readFileSync(slidePng);
    const slideNum = i + 1;
    const slideFileName = `slide-${String(slideNum).padStart(2, '0')}.png`;
    const slideStoragePath = `carousels/${slug}/${slideFileName}`;

    const { error: slideUploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(slideStoragePath, slideBuffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (slideUploadErr) throw new Error(`uploadCarousel slide ${slideNum} ("${slug}"): ${slideUploadErr.message}`);

    const { data: slideUrlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(slideStoragePath);

    slideRows.push({
      carousel_id: carouselId,
      slide_number: slideNum,
      image_url: slideUrlData.publicUrl,
      image_path: slideStoragePath,
      file_size: slideBuffer.length,
    });
  }

  // 4. Inserir slides na tabela
  if (slideRows.length > 0) {
    const { error: slidesInsertErr } = await supabase
      .from('carousel_slides')
      .insert(slideRows);
    if (slidesInsertErr) throw new Error(`uploadCarousel slides insert ("${slug}"): ${slidesInsertErr.message}`);
  }

  return { pdfUrl, carouselId, slideCount: slidePngs.length };
}

// ── Exports ───────────────────────────────────────────────────

module.exports = {
  supabase,
  slugify,
  savePost,
  uploadCover,
  uploadCarousel,
  BUCKET
};
