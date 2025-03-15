/*
  # Create verses table for Bible data

  1. New Tables
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

-- Create verses table
CREATE TABLE IF NOT EXISTS verses (
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
CREATE INDEX IF NOT EXISTS verses_text_search_idx ON verses USING gin(to_tsvector('french', text));
CREATE INDEX IF NOT EXISTS verses_version_idx ON verses (version);

-- Enable RLS
ALTER TABLE verses ENABLE ROW LEVEL SECURITY;

-- Create public read policy
CREATE POLICY "Versets accessibles publiquement"
  ON verses
  FOR SELECT
  TO public
  USING (true);

-- Insert initial data for Genesis chapter 1
INSERT INTO verses (book, chapter, verse, text) VALUES
  ('Genèse', 1, 1, 'Au commencement, Dieu créa les cieux et la terre.'),
  ('Genèse', 1, 2, 'La terre était informe et vide; il y avait des ténèbres à la surface de l''abîme, et l''Esprit de Dieu se mouvait au-dessus des eaux.'),
  ('Genèse', 1, 3, 'Dieu dit: Que la lumière soit! Et la lumière fut.'),
  ('Genèse', 1, 4, 'Dieu vit que la lumière était bonne; et Dieu sépara la lumière d''avec les ténèbres.'),
  ('Genèse', 1, 5, 'Dieu appela la lumière jour, et il appela les ténèbres nuit. Ainsi, il y eut un soir, et il y eut un matin: ce fut le premier jour.')
ON CONFLICT (book, chapter, verse, version) DO UPDATE
SET text = EXCLUDED.text;