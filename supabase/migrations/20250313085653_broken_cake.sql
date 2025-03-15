/*
  # Create popular verses table

  1. New Tables
    - `popular_verses`
      - `id` (uuid, primary key)
      - `book` (text, not null)
      - `chapter` (integer, not null)
      - `verse` (integer, not null)
      - `count` (integer, default 0)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `popular_verses` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS popular_verses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book text NOT NULL,
  chapter integer NOT NULL,
  verse integer NOT NULL,
  count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT popular_verses_reference_unique UNIQUE (book, chapter, verse)
);

ALTER TABLE popular_verses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Popular verses are publicly readable"
  ON popular_verses
  FOR SELECT
  TO public
  USING (true);