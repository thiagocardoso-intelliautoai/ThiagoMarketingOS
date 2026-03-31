// supabase.js — Supabase Client + Storage Helpers
// Story SUPABASE-003: Data Layer Refactoring
// Story HARDENING-001: Credentials extracted to config.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { CONFIG } from './config.js';

export const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

/**
 * Get public URL for a file in the content-assets bucket
 * @param {string} path — storage path (e.g. "covers/meu-post/cover.png")
 * @returns {string} Full public URL
 */
export function getPublicUrl(path) {
  const { data } = supabase.storage.from('content-assets').getPublicUrl(path);
  return data.publicUrl;
}

// ─── Source Photos CRUD (Story ASSETS-005) ───

export async function getSourcePhotos(category = null) {
  let query = supabase.from('source_photos').select('*').eq('active', true).order('sort_order');
  if (category) query = query.eq('category', category);
  return query;
}

export async function insertSourcePhoto(data) {
  return supabase.from('source_photos').insert(data).select().single();
}

export async function deleteSourcePhoto(id) {
  return supabase.from('source_photos').delete().eq('id', id);
}

// ─── Storage Operations ───

export async function uploadSourceImage(file, storagePath) {
  return supabase.storage.from('content-assets').upload(storagePath, file, {
    cacheControl: '3600',
    upsert: true
  });
}

export async function deleteSourceImage(storagePath) {
  return supabase.storage.from('content-assets').remove([storagePath]);
}
