/*
  # Création des tables pour l'application Bible

  1. Nouvelles Tables
    - `verses`
      - `id` (uuid, clé primaire)
      - `book` (text, nom du livre)
      - `chapter` (integer, numéro du chapitre)
      - `verse` (integer, numéro du verset)
      - `text` (text, contenu du verset)
    
    - `notes`
      - `id` (uuid, clé primaire)
      - `verse_id` (text, référence au verset)
      - `text` (text, contenu de la note)
      - `created_at` (timestamp avec fuseau horaire)

  2. Sécurité
    - RLS activé sur les deux tables
    - Politiques pour permettre la lecture publique des versets
    - Politiques pour gérer les notes des utilisateurs authentifiés
*/

-- Table des versets
CREATE TABLE verses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book text NOT NULL,
  chapter integer NOT NULL,
  verse integer NOT NULL,
  text text NOT NULL,
  UNIQUE(book, chapter, verse)
);

-- Table des notes
CREATE TABLE notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  verse_id text NOT NULL,
  text text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id)
);

-- Activation RLS
ALTER TABLE verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Politiques pour les versets (lecture publique)
CREATE POLICY "Versets accessibles publiquement"
  ON verses
  FOR SELECT
  TO public
  USING (true);

-- Politiques pour les notes (CRUD pour utilisateurs authentifiés)
CREATE POLICY "Les utilisateurs peuvent lire leurs propres notes"
  ON notes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent créer leurs propres notes"
  ON notes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent mettre à jour leurs propres notes"
  ON notes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent supprimer leurs propres notes"
  ON notes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);