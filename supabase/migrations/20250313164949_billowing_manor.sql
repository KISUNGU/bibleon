/*
  # Fix verses table and data

  1. Changes
    - Drop and recreate verses table with proper structure
    - Add necessary indexes
    - Enable RLS
    - Insert initial data for Genesis 1
    
  2. Security
    - Maintain public read access
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS verses;

-- Create verses table with proper structure
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

-- Create necessary indexes
CREATE INDEX verses_text_search_idx ON verses USING gin(to_tsvector('french', text));
CREATE INDEX verses_version_idx ON verses (version);
CREATE INDEX verses_book_chapter_idx ON verses (book, chapter);

-- Enable RLS
ALTER TABLE verses ENABLE ROW LEVEL SECURITY;

-- Create public read policy
CREATE POLICY "Versets accessibles publiquement"
  ON verses
  FOR SELECT
  TO public
  USING (true);

-- Insert initial data for Genesis 1
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
  ('Genèse', 1, 10, 'Dieu appela le sec terre, et il appela l''amas des eaux mers. Dieu vit que cela était bon.', 'LSG')
ON CONFLICT (book, chapter, verse, version) DO UPDATE
SET text = EXCLUDED.text;