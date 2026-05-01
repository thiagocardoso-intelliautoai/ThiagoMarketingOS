-- Lead Magnet Schema Extensions (CCC-002)

-- subpautas: checklist de materiais a produzir
ALTER TABLE subpautas
  ADD COLUMN IF NOT EXISTS lead_magnet_checklist text[] DEFAULT '{}';

-- posts: rastreamento do material produzido
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS lead_magnet_status text
    CHECK (lead_magnet_status IN ('a_fazer', 'concluido')),
  ADD COLUMN IF NOT EXISTS lead_magnet_observation text,
  ADD COLUMN IF NOT EXISTS lead_magnet_updated_at timestamptz;

-- Seed: checklist para subpauta 1.3 (automatizar processo comercial)
UPDATE subpautas
SET lead_magnet_checklist = ARRAY[
  'Construir squad de diagnóstico + recomendação por perfil técnico',
  'Gravar vídeo aula ensinando a usar o squad (iniciantes)',
  'Publicar squad para acesso via link'
]
WHERE titulo ILIKE '%automatizar seu processo comercial%';
