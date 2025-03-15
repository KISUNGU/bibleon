/*
  # Add dictionary table for word definitions

  1. New Tables
    - `dictionary`
      - `id` (uuid, primary key)
      - `word` (text, unique)
      - `definition` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `dictionary` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS dictionary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  word text UNIQUE NOT NULL,
  definition text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE dictionary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dictionary entries are publicly readable"
  ON dictionary
  FOR SELECT
  TO public
  USING (true);

-- Initial dictionary entries
INSERT INTO dictionary (word, definition) VALUES
  ('Dieu', 'Être suprême, créateur et maître de l''univers dans les religions monothéistes'),
  ('créa', 'Action de faire exister ce qui n''existait pas auparavant'),
  ('cieux', 'Espace illimité dans lequel se meuvent les astres'),
  ('terre', 'Planète du système solaire habitée par l''homme'),
  ('esprit', 'Principe de la vie incorporelle, de la pensée'),
  ('lumière', 'Agent physique capable d''impressionner l''œil, de rendre les choses visibles'),
  ('ténèbres', 'Absence de lumière; obscurité profonde'),
  ('eaux', 'Substance liquide, incolore, inodore à l''état pur'),
  ('firmament', 'Voûte céleste, ciel visible'),
  ('jour', 'Espace de temps comprenant 24 heures'),
  ('nuit', 'Temps pendant lequel le soleil est sous l''horizon');