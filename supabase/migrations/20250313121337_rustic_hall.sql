/*
  # Ajout de la version de la Bible

  1. Modifications
    - Ajout de la colonne 'version' à la table 'verses'
    - Mise à jour de la contrainte unique pour inclure la version
    - Création d'un index sur la version

  2. Sécurité
    - Maintien de la politique de lecture publique
*/

-- Ajout de la colonne version si elle n'existe pas déjà
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'verses' AND column_name = 'version'
  ) THEN
    ALTER TABLE verses ADD COLUMN version text NOT NULL DEFAULT 'LSG';
  END IF;
END $$;

-- Suppression de l'ancienne contrainte unique si elle existe
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'verses_book_chapter_verse_key'
  ) THEN
    ALTER TABLE verses DROP CONSTRAINT verses_book_chapter_verse_key;
  END IF;
END $$;

-- Création de la nouvelle contrainte unique incluant la version
ALTER TABLE verses ADD CONSTRAINT verses_book_chapter_verse_version_key 
  UNIQUE (book, chapter, verse, version);

-- Création d'un index sur la version
CREATE INDEX IF NOT EXISTS verses_version_idx ON verses (version);

-- Vérification de la politique de sécurité
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'verses' 
    AND policyname = 'Versets accessibles publiquement'
  ) THEN
    CREATE POLICY "Versets accessibles publiquement"
      ON verses
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;