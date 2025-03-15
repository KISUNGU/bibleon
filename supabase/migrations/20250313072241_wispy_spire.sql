/*
  # Add Cross References Table

  1. New Tables
    - `cross_references`
      - `id` (uuid, primary key)
      - `source_book` (text)
      - `source_chapter` (integer)
      - `source_verse` (integer)
      - `target_book` (text)
      - `target_chapter` (integer)
      - `target_verse` (text)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `cross_references` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS cross_references (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_book text NOT NULL,
  source_chapter integer NOT NULL,
  source_verse integer NOT NULL,
  target_book text NOT NULL,
  target_chapter integer NOT NULL,
  target_verse text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cross_references ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cross references are publicly readable"
  ON cross_references
  FOR SELECT
  TO public
  USING (true);