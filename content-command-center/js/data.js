// data.js — CRUD Supabase + localStorage fallback + Import/Export JSON
// Story SUPABASE-003: Refactored Data Layer
import { supabase } from './supabase.js';

const STORAGE_KEY = 'content-command-center';

export const DataStore = {
  _data: null,
  _isOnline: false, // tracks if Supabase loaded successfully

  // ─── 3.3: init() with Supabase JOINs + localStorage fallback ───
  async init() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, covers(*), carousels(*, carousel_slides(*))')
        .order('created_at', { ascending: false });

      if (error) throw error;

      this._isOnline = true;
      const posts = (data || []).map(row => this._mapPostFromDB(row));

      this._data = {
        version: '2.0-supabase',
        lastUpdated: new Date().toISOString(),
        posts,
        pipeline: { active: false, mode: null, currentStep: null, startedAt: null, briefingTheme: null }
      };

      // Persist to localStorage as offline cache
      this._saveLocal();
      console.log(`[DataStore] Loaded ${posts.length} posts from Supabase`);

    } catch (err) {
      console.warn('[DataStore] Supabase offline, falling back to localStorage:', err.message);
      this._isOnline = false;

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.posts || parsed.posts.length === 0) {
          localStorage.removeItem(STORAGE_KEY);
          return this._initEmpty();
        }
        this._data = parsed;
      } else {
        // Try seed.json as last resort
        try {
          const res = await fetch('./data/seed.json');
          this._data = await res.json();
        } catch {
          this._initEmpty();
        }
        this._saveLocal();
      }
    }
    return this._data;
  },

  _initEmpty() {
    this._data = {
      version: '2.0-supabase',
      lastUpdated: new Date().toISOString(),
      posts: [],
      pipeline: { active: false, mode: null, currentStep: null, startedAt: null, briefingTheme: null }
    };
    return this._data;
  },

  // ─── Save to localStorage (offline cache only) ───
  _saveLocal() {
    this._data.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._data));
  },

  // ─── 3.4: Map DB row (snake_case) → JS object (camelCase) ───
  _mapPostFromDB(row) {
    // Extract the first cover/carousel (one-to-one via UNIQUE constraint)
    const cover = Array.isArray(row.covers) ? row.covers[0] : row.covers;
    const carousel = Array.isArray(row.carousels) ? row.carousels[0] : row.carousels;

    return {
      id: row.id,
      title: row.title || '',
      slug: row.slug || '',
      contentType: row.content_type || 'text',
      theme: row.theme || '',
      pillar: row.pillar || 'A',
      pillarLabel: this._pillarLabel(row.pillar),
      hookText: row.hook_text || '',
      hookStructure: row.hook_structure || '',
      framework: row.framework || '',
      body: row.body || '',
      cta: row.cta || '',
      hashtags: row.hashtags || [],
      sources: row.sources || [],
      reviewScore: row.review_score,
      status: row.status || 'armazem',
      urgency: row.urgency || 'relevante',
      week: row.week,
      postNumber: row.post_number,
      series: row.series,
      seriesOrder: row.series_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      publishedAt: row.published_at,
      // Backward-compat derivations for render.js
      derivations: {
        cover: cover ? {
          slug: cover.slug,
          coverPath: cover.image_url,
          style: cover.style
        } : null,
        carousel: carousel ? {
          style: carousel.visual_style,
          slidesCount: carousel.slide_count,
          pdfPath: carousel.pdf_url,
          slides: (carousel.carousel_slides || [])
            .sort((a, b) => a.slide_number - b.slide_number)
            .map(s => ({ number: s.slide_number, imageUrl: s.image_url }))
        } : null
      }
    };
  },

  // ─── 3.5: Map JS object (camelCase) → DB insert (snake_case) ───
  _mapPostToDB(post) {
    const slug = post.slug || this._slugify(post.title);
    return {
      title: post.title || '',
      slug,
      content_type: post.contentType || 'text',
      theme: post.theme || '',
      pillar: post.pillar || 'A',
      pillar_label: this._pillarLabel(post.pillar),
      hook_text: post.hookText || '',
      hook_structure: post.hookStructure || '',
      framework: post.framework || '',
      body: post.body || '',
      cta: post.cta || '',
      hashtags: post.hashtags || [],
      sources: post.sources || [],
      review_score: post.reviewScore || null,
      status: post.status || 'armazem',
      urgency: post.urgency || 'relevante',
      week: post.week || null,
      post_number: post.postNumber || null,
      series: post.series || null,
      series_order: post.seriesOrder || null,
      published_at: post.publishedAt || null
    };
  },

  // ─── Posts CRUD ───

  getPosts() {
    return this._data.posts || [];
  },

  getPostById(id) {
    return this._data.posts.find(p => p.id === id) || null;
  },

  // ─── 3.6: addPost() — Supabase insert + cache update ───
  async addPost(post) {
    const dbPost = this._mapPostToDB(post);

    if (this._isOnline) {
      try {
        const { data, error } = await supabase
          .from('posts')
          .insert(dbPost)
          .select('*, covers(*), carousels(*, carousel_slides(*))')
          .single();

        if (error) throw error;

        const mappedPost = this._mapPostFromDB(data);
        this._data.posts.unshift(mappedPost);
        this._saveLocal();
        return mappedPost;
      } catch (err) {
        console.error('[DataStore] Error inserting post to Supabase:', err.message);
        // Fall through to local-only insert
      }
    }

    // Fallback: local-only insert
    let id = post.id || ('post-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7));
    while (this._data.posts.some(p => p.id === id)) {
      id = 'post-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
    }
    const newPost = {
      id,
      title: post.title || '',
      contentType: post.contentType || 'text',
      theme: post.theme || '',
      pillar: post.pillar || 'A',
      pillarLabel: this._pillarLabel(post.pillar),
      hookText: post.hookText || '',
      hookStructure: post.hookStructure || '',
      framework: post.framework || '',
      body: post.body || '',
      cta: post.cta || '',
      hashtags: post.hashtags || [],
      sources: post.sources || [],
      reviewScore: post.reviewScore || null,
      status: post.status || 'armazem',
      urgency: post.urgency || 'relevante',
      createdAt: new Date().toISOString(),
      publishedAt: null,
      derivations: {
        carousel: post.derivations?.carousel || null,
        cover: post.derivations?.cover || null
      }
    };
    this._data.posts.unshift(newPost);
    this._saveLocal();
    return newPost;
  },

  // ─── 3.7: updatePost() — Supabase update + cache update ───
  async updatePost(id, updates) {
    const idx = this._data.posts.findIndex(p => p.id === id);
    if (idx === -1) return null;

    if (this._isOnline) {
      try {
        // Convert camelCase updates to snake_case
        const dbUpdates = {};
        const fieldMap = {
          title: 'title', contentType: 'content_type', theme: 'theme',
          pillar: 'pillar', pillarLabel: 'pillar_label',
          hookText: 'hook_text', hookStructure: 'hook_structure',
          framework: 'framework', body: 'body', cta: 'cta',
          hashtags: 'hashtags', sources: 'sources',
          reviewScore: 'review_score', status: 'status',
          urgency: 'urgency', publishedAt: 'published_at',
          week: 'week', postNumber: 'post_number',
          series: 'series', seriesOrder: 'series_order'
        };
        for (const [jsKey, dbKey] of Object.entries(fieldMap)) {
          if (updates[jsKey] !== undefined) {
            dbUpdates[dbKey] = updates[jsKey];
          }
        }
        // Always update updated_at
        dbUpdates.updated_at = new Date().toISOString();

        const { error } = await supabase
          .from('posts')
          .update(dbUpdates)
          .eq('id', id);

        if (error) throw error;
      } catch (err) {
        console.error('[DataStore] Error updating post on Supabase:', err.message);
      }
    }

    // Update local cache regardless
    Object.assign(this._data.posts[idx], updates);
    if (updates.pillar) {
      this._data.posts[idx].pillarLabel = this._pillarLabel(updates.pillar);
    }
    this._saveLocal();
    return this._data.posts[idx];
  },

  // ─── 3.8: deletePost() — Supabase delete + cache update ───
  async deletePost(id) {
    const idx = this._data.posts.findIndex(p => p.id === id);
    if (idx === -1) return false;

    if (this._isOnline) {
      try {
        const { error } = await supabase
          .from('posts')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (err) {
        console.error('[DataStore] Error deleting post from Supabase:', err.message);
        // If RLS blocks delete, remove from local cache only (soft delete)
        console.warn('[DataStore] Post removed locally. Server may require elevated permissions.');
      }
    }

    // Update local cache
    this._data.posts.splice(idx, 1);
    this._saveLocal();
    return true;
  },

  // Pipeline state (kept local — not in Supabase)
  getPipeline() {
    return this._data.pipeline;
  },

  setPipeline(pipelineState) {
    Object.assign(this._data.pipeline, pipelineState);
    this._saveLocal();
  },

  resetPipeline() {
    this._data.pipeline = { active: false, mode: null, currentStep: null, startedAt: null, briefingTheme: null };
    this._saveLocal();
  },

  // Export / Import
  exportJSON() {
    const blob = new Blob([JSON.stringify(this._data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-hub-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  async importJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.version && data.posts) {
            // If online, batch insert posts into Supabase
            if (this._isOnline && data.posts.length > 0) {
              const dbPosts = data.posts.map(p => this._mapPostToDB(p));
              const { error } = await supabase
                .from('posts')
                .upsert(dbPosts, { onConflict: 'slug' });
              if (error) console.warn('[DataStore] Import to Supabase partial:', error.message);
              // Re-fetch from Supabase to get consistent state
              await this.init();
            } else {
              this._data = data;
              this._saveLocal();
            }
            resolve(this._data);
          } else {
            reject(new Error('Formato inválido'));
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsText(file);
    });
  },

  // ─── 3.9: processInbox() → no-op ───
  async processInbox() {
    // Inbox pipeline eliminated — Supabase is the single source of truth
    return { imported: 0, updated: 0 };
  },

  // Filter & Search (client-side on cache — unchanged API)
  filterPosts({ pillar, status, urgency, contentType, search } = {}) {
    let posts = this.getPosts();
    if (pillar) posts = posts.filter(p => p.pillar === pillar);
    if (status) posts = posts.filter(p => p.status === status);
    if (urgency) posts = posts.filter(p => p.urgency === urgency);
    if (contentType === 'carousel') {
      posts = posts.filter(p => p.contentType === 'carousel' || p.derivations?.carousel);
    } else if (contentType === 'cover') {
      posts = posts.filter(p => p.contentType === 'cover' || p.derivations?.cover);
    }
    if (search) {
      const q = search.toLowerCase();
      posts = posts.filter(p =>
        (p.title || '').toLowerCase().includes(q) ||
        (p.theme || '').toLowerCase().includes(q) ||
        (p.hookText || '').toLowerCase().includes(q)
      );
    }
    return posts;
  },

  // ─── Helpers ───
  _pillarLabel(code) {
    const map = { A: 'Alcance', C: 'Credibilidade', R: 'Retorno', E: 'Engajamento' };
    return map[code] || code;
  },

  _slugify(text) {
    return (text || 'post')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
  }
};
