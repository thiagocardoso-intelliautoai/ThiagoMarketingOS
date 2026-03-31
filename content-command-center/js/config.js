// config.js — Runtime configuration (loaded from meta tags or defaults)
// Story HARDENING-001: Extract hardcoded credentials

function getConfig(name, fallback = '') {
  const meta = document.querySelector(`meta[name="app-${name}"]`);
  return meta?.content || fallback;
}

export const CONFIG = {
  SUPABASE_URL: getConfig('supabase-url', 'https://mvryaxohnbftupocdlqa.supabase.co'),
  SUPABASE_ANON_KEY: getConfig('supabase-anon-key', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12cnlheG9obmJmdHVwb2NkbHFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MDYwMDcsImV4cCI6MjA5MDM4MjAwN30.q-5bXwAvewyhqgH0x_hSTXnqBc7XL8ZBBuNTMDBqQQM'),
};
