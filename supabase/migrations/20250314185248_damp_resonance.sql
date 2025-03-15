/*
  # Update verse table structure

  1. Changes
    - Safely modify existing verse table
    - Add missing columns if needed
    - Create necessary indexes
    - Enable RLS and policies
*/

-- Drop the verses table if it exists (it's the old table we don't need)
DROP TABLE IF EXISTS verses;

-- Add missing columns to verse table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'verse' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE verse ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'verse' AND column_name = 'book'
  ) THEN
    ALTER TABLE verse ADD COLUMN book text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'verse' AND column_name = 'chapter'
  ) THEN
    ALTER TABLE verse ADD COLUMN chapter integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'verse' AND column_name = 'verse'
  ) THEN
    ALTER TABLE verse ADD COLUMN verse integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'verse' AND column_name = 'text'
  ) THEN
    ALTER TABLE verse ADD COLUMN text text;
  END IF;
END $$;

-- Create or replace indexes
DROP INDEX IF EXISTS verse_book_chapter_idx;
CREATE INDEX verse_book_chapter_idx ON verse (book, chapter);

DROP INDEX IF EXISTS verse_text_search_idx;
CREATE INDEX verse_text_search_idx ON verse USING gin(to_tsvector('french', text));

-- Enable RLS if not already enabled
ALTER TABLE verse ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Versets accessibles publiquement" ON verse;

-- Create new policy
CREATE POLICY "Versets accessibles publiquement"
  ON verse
  FOR SELECT
  TO public
  USING (true);