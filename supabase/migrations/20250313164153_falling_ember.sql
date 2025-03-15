/*
  # Reset and prepare database for full Bible import

  1. Changes
    - Drop and recreate verses table
    - Add necessary indexes
    - Enable RLS
    - Set up public read policy

  2. Security
    - Maintain existing security policies
    - Enable public read access
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