/*
  # Mise à jour de la table des versets

  1. Nouvelle Table
    - `verses`
      - `id` (uuid, clé primaire)
      - `book` (text, non null)
      - `chapter` (integer, non null)
      - `verse` (integer, non null)
      - `text` (text, non null)
      - `version` (text, non null, défaut 'LSG')
      - `created_at` (timestamptz, défaut now())
    
  2. Index
    - Index unique sur (book, chapter, verse, version)
    - Index de recherche plein texte sur le texte
    - Index sur la version
*/

-- Création de la table des versets s'il n'existe pas déjà
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

-- Création des index s'ils n'existent pas déjà
CREATE INDEX IF NOT EXISTS verses_text_search_idx ON verses USING gin(to_tsvector('french', text));
CREATE INDEX IF NOT EXISTS verses_version_idx ON verses (version);

-- Activation de la sécurité au niveau des lignes
ALTER TABLE verses ENABLE ROW LEVEL SECURITY;

-- Suppression de la politique existante si elle existe
DROP POLICY IF EXISTS "Versets accessibles publiquement" ON verses;

-- Création de la politique de lecture publique
CREATE POLICY "Versets accessibles publiquement"
  ON verses
  FOR SELECT
  TO public
  USING (true);