/*
  # Add initial cross references data

  1. Data Addition
    - Add cross references for Genesis 1:1-3
    - Each reference connects a source verse to a target verse
    - Format: source (book, chapter, verse) -> target (book, chapter, verse)

  2. Security
    - Uses existing RLS policy for public read access
*/

INSERT INTO cross_references 
  (source_book, source_chapter, source_verse, target_book, target_chapter, target_verse)
VALUES
  -- Genèse 1:1 références
  ('Genèse', 1, 1, 'Genèse', 1, '3'),
  ('Genèse', 1, 1, 'Genèse', 1, '7'),
  ('Genèse', 1, 1, 'Nombres', 6, '5-6'),
  ('Genèse', 1, 1, 'Psaumes', 17, '15'),
  ('Genèse', 1, 1, 'Matthieu', 5, '9'),
  ('Genèse', 1, 1, 'Luc', 3, '1'),

  -- Genèse 1:2 références
  ('Genèse', 1, 2, 'Galates', 6, '6'),
  ('Genèse', 1, 2, 'Galates', 6, '7'),
  ('Genèse', 1, 2, 'Galates', 6, '8'),
  ('Genèse', 1, 2, '1 Jean', 2, '2'),

  -- Genèse 1:3 références
  ('Genèse', 1, 3, 'Apocalypse', 2, '1'),
  ('Genèse', 1, 3, 'Apocalypse', 3, '1'),
  ('Genèse', 1, 3, 'Apocalypse', 6, '1');