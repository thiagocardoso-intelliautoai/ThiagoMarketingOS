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
    // VISUAL-002: sugestao visual emitida pelo squad (string livre, ex: "carrossel/Notebook Raw (motivo)")
    recommended_visual: postData.recommendedVisual || null,
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

  // 2. Upload para Storage (upsert, sem cache — covers são substituídas com frequência)
  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType: 'image/png',
      upsert: true,
      cacheControl: '0'
    });

  if (uploadErr) throw new Error(`uploadCover storage ("${slug}"): ${uploadErr.message}`);

  // 3. Obter URL pública com cache-buster (evita CDN servir versão antiga)
  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(storagePath);

  const imageUrl = `${urlData.publicUrl}?v=${Date.now()}`;

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

// ── savePauta ─────────────────────────────────────────────────

/**
 * Upsert de uma pauta central na tabela `pautas_centrais` por nome.
 * Retorna o registro inserido/atualizado (com id).
 *
 * fonte_tese válidos: skills_producao | benchmark_real | process_diagnostic | falha_documentada
 */
async function savePauta({ nome, fonte_tese, descricao, ordem }) {
  const { data, error } = await supabase
    .from('pautas_centrais')
    .upsert({ nome, fonte_tese, descricao, ordem: ordem ?? 0 }, { onConflict: 'nome' })
    .select('id, nome')
    .single();

  if (error) throw new Error(`savePauta("${nome}"): ${error.message}`);
  return data;
}

// ── saveSubpauta ──────────────────────────────────────────────

/**
 * Upsert de uma subpauta na tabela `subpautas` por (titulo, pauta_central_id).
 * Retorna o registro inserido/atualizado (com id).
 *
 * urgencia válidos: urgente | relevante | pode_esperar
 * status válidos:  ativa | usada | descartada
 */
async function saveSubpauta({ pauta_central_id, titulo, angulo, hook_embrionario, materia_prima, urgencia, status, is_lead_magnet }) {
  const { data, error } = await supabase
    .from('subpautas')
    .upsert(
      {
        pauta_central_id,
        titulo,
        angulo: angulo ?? null,
        hook_embrionario: hook_embrionario ?? null,
        materia_prima: materia_prima ?? null,
        urgencia: urgencia ?? 'relevante',
        status: status ?? 'ativa',
        is_lead_magnet: is_lead_magnet ?? false,
      },
      { onConflict: 'titulo,pauta_central_id' }
    )
    .select('id, titulo')
    .single();

  if (error) throw new Error(`saveSubpauta("${titulo}"): ${error.message}`);
  return data;
}

// ── savePessoa ────────────────────────────────────────────────

/**
 * Upsert de uma pessoa na tabela `lista_distribuicao` por nome.
 * Se a pessoa já existe (match por nome), retorna o registro existente.
 * Retorna o registro inserido/encontrado (com id).
 */
async function savePessoa(pessoaData) {
  // Primeiro verificar se já existe
  const { data: existing } = await supabase
    .from('lista_distribuicao')
    .select('*')
    .ilike('nome', pessoaData.nome)
    .maybeSingle();

  if (existing) {
    // Atualizar campos se fornecidos
    const updates = {};
    if (pessoaData.funcao) updates.funcao = pessoaData.funcao;
    if (pessoaData.rede_relevante) updates.rede_relevante = pessoaData.rede_relevante;
    if (pessoaData.expande_bolha !== undefined) updates.expande_bolha = pessoaData.expande_bolha;
    if (pessoaData.observacao) updates.observacao = pessoaData.observacao;
    if (pessoaData.status_relacao) updates.status_relacao = pessoaData.status_relacao;

    if (Object.keys(updates).length > 0) {
      const { error: updateErr } = await supabase
        .from('lista_distribuicao')
        .update(updates)
        .eq('id', existing.id);
      if (updateErr) throw new Error(`savePessoa update ("${pessoaData.nome}"): ${updateErr.message}`);
    }
    return existing;
  }

  // Inserir nova pessoa
  const row = {
    nome: pessoaData.nome,
    funcao: pessoaData.funcao || null,
    rede_relevante: pessoaData.rede_relevante || null,
    expande_bolha: pessoaData.expande_bolha || false,
    observacao: pessoaData.observacao || null,
    status_relacao: pessoaData.status_relacao || null,
  };

  const { data, error } = await supabase
    .from('lista_distribuicao')
    .insert(row)
    .select()
    .single();

  if (error) throw new Error(`savePessoa insert ("${pessoaData.nome}"): ${error.message}`);
  return data;
}

// ── saveAngulo ────────────────────────────────────────────────

/**
 * Insere um ângulo na tabela `angulos_distribuicao`.
 * Verifica duplicata por titulo_pela_lente + pessoa_id antes de inserir.
 * Retorna o registro inserido ou existente.
 */
async function saveAngulo(anguloData) {
  // Verificar duplicata
  const { data: existing } = await supabase
    .from('angulos_distribuicao')
    .select('*')
    .eq('pessoa_id', anguloData.pessoa_id)
    .eq('titulo_pela_lente', anguloData.titulo_pela_lente)
    .maybeSingle();

  if (existing) {
    return existing;
  }

  const row = {
    pessoa_id: anguloData.pessoa_id,
    arquetipo: anguloData.arquetipo,
    titulo_pela_lente: anguloData.titulo_pela_lente,
    evidencias: anguloData.evidencias || [],
    risco: anguloData.risco || null,
    expectativa_comentario: anguloData.expectativa_comentario || null,
    expectativa_repost: anguloData.expectativa_repost || null,
    origem: anguloData.origem || 'manual',
    status: anguloData.status || 'novo',
  };

  const { data, error } = await supabase
    .from('angulos_distribuicao')
    .insert(row)
    .select()
    .single();

  if (error) throw new Error(`saveAngulo ("${anguloData.titulo_pela_lente}"): ${error.message}`);
  return data;
}

// ── updateAnguloStatus ────────────────────────────────────────

/**
 * Atualiza o status de um ângulo na tabela `angulos_distribuicao`.
 */
async function updateAnguloStatus(anguloId, newStatus) {
  const { data, error } = await supabase
    .from('angulos_distribuicao')
    .update({ status: newStatus })
    .eq('id', anguloId)
    .select()
    .single();

  if (error) throw new Error(`updateAnguloStatus ("${anguloId}"): ${error.message}`);
  return data;
}

// ── Exports ───────────────────────────────────────────────────

module.exports = {
  supabase,
  slugify,
  savePost,
  uploadCover,
  uploadCarousel,
  savePauta,
  saveSubpauta,
  savePessoa,
  saveAngulo,
  updateAnguloStatus,
  BUCKET
};
