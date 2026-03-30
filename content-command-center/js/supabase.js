// supabase.js — Supabase Client + Storage Helpers
// Story SUPABASE-003: Data Layer Refactoring
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://mvryaxohnbftupocdlqa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12cnlheG9obmJmdHVwb2NkbHFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MDYwMDcsImV4cCI6MjA5MDM4MjAwN30.q-5bXwAvewyhqgH0x_hSTXnqBc7XL8ZBBuNTMDBqQQM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
