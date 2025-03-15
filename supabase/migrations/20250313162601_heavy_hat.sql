/*
  # Set up Bible database with verses table and initial data

  1. Tables
    - `verses`
      - `id` (uuid, primary key)
      - `book` (text, not null)
      - `chapter` (integer, not null)
      - `verse` (integer, not null)
      - `text` (text, not null)
      - `version` (text, not null, default 'LSG')
      - `created_at` (timestamptz, default now())

  2. Indexes
    - Unique index on (book, chapter, verse, version)
    - Full-text search index on text
    - Index on version

  3. Security
    - Enable RLS
    - Add policy for public read access
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS verses;

-- Create verses table
CREATE TABLE verses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book text NOT NULL,
  chapter integer NOT NULL,
  verse integer NOT NULL,
  text text NOT NULL,
  version text NOT NULL DEFAULT 'LSG',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT verses_book_chapter_verse_version_key UNIQUE (book, chapter, verse, version)
);

-- Create indexes
CREATE INDEX verses_text_search_idx ON verses USING gin(to_tsvector('french', text));
CREATE INDEX verses_version_idx ON verses (version);

-- Enable RLS
ALTER TABLE verses ENABLE ROW LEVEL SECURITY;

-- Create public read policy
CREATE POLICY "Versets accessibles publiquement"
  ON verses
  FOR SELECT
  TO public
  USING (true);

-- Insert initial data for Genesis chapters 1-2
INSERT INTO verses (book, chapter, verse, text, version) VALUES
  ('Genèse', 1, 1, 'Au commencement, Dieu créa les cieux et la terre.', 'LSG'),
  ('Genèse', 1, 2, 'La terre était informe et vide; il y avait des ténèbres à la surface de l''abîme, et l''Esprit de Dieu se mouvait au-dessus des eaux.', 'LSG'),
  ('Genèse', 1, 3, 'Dieu dit: Que la lumière soit! Et la lumière fut.', 'LSG'),
  ('Genèse', 1, 4, 'Dieu vit que la lumière était bonne; et Dieu sépara la lumière d''avec les ténèbres.', 'LSG'),
  ('Genèse', 1, 5, 'Dieu appela la lumière jour, et il appela les ténèbres nuit. Ainsi, il y eut un soir, et il y eut un matin: ce fut le premier jour.', 'LSG'),
  ('Genèse', 1, 6, 'Dieu dit: Qu''il y ait une étendue entre les eaux, et qu''elle sépare les eaux d''avec les eaux.', 'LSG'),
  ('Genèse', 1, 7, 'Et Dieu fit l''étendue, et il sépara les eaux qui sont au-dessous de l''étendue d''avec les eaux qui sont au-dessus de l''étendue. Et cela fut ainsi.', 'LSG'),
  ('Genèse', 1, 8, 'Dieu appela l''étendue ciel. Ainsi, il y eut un soir, et il y eut un matin: ce fut le second jour.', 'LSG'),
  ('Genèse', 1, 9, 'Dieu dit: Que les eaux qui sont au-dessous du ciel se rassemblent en un seul lieu, et que le sec paraisse. Et cela fut ainsi.', 'LSG'),
  ('Genèse', 1, 10, 'Dieu appela le sec terre, et il appela l''amas des eaux mers. Dieu vit que cela était bon.', 'LSG'),
  ('Genèse', 2, 1, 'Ainsi furent achevés les cieux et la terre, et toute leur armée.', 'LSG'),
  ('Genèse', 2, 2, 'Dieu acheva au septième jour son œuvre, qu''il avait faite: et il se reposa au septième jour de toute son œuvre, qu''il avait faite.', 'LSG'),
  ('Genèse', 2, 3, 'Dieu bénit le septième jour, et il le sanctifia, parce qu''en ce jour il se reposa de toute son œuvre qu''il avait créée en la faisant.', 'LSG'),
  ('Genèse', 2, 4, 'Voici les origines des cieux et de la terre, quand ils furent créés.', 'LSG'),
  ('Genèse', 2, 5, 'Lorsque l''Éternel Dieu fit une terre et des cieux, aucun arbuste des champs n''était encore sur la terre, et aucune herbe des champs ne germait encore.', 'LSG')
ON CONFLICT (book, chapter, verse, version) DO UPDATE
SET text = EXCLUDED.text;