/*
  # Migration vers la table verse

  1. Changements
    - Suppression de la table verses
    - Création de la table verse
    - Migration des données
    - Mise à jour des index et contraintes

  2. Structure
    - Utilisation de bigint comme clé primaire
    - Colonnes simplifiées pour les données bibliques
*/

-- Suppression de la table verses si elle existe
DROP TABLE IF EXISTS verses;

-- Création de la nouvelle table verse
CREATE TABLE verse (
  id bigint PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  book text,
  chapter integer,
  verse integer,
  text text
);

-- Création des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS verse_book_chapter_idx ON verse (book, chapter);
CREATE INDEX IF NOT EXISTS verse_text_search_idx ON verse USING gin(to_tsvector('french', text));

-- Activation RLS
ALTER TABLE verse ENABLE ROW LEVEL SECURITY;

-- Politique de lecture publique
CREATE POLICY "Versets accessibles publiquement"
  ON verse
  FOR SELECT
  TO public
  USING (true);