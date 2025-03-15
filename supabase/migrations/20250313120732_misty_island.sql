/*
  # Import des données de la Bible Louis Segond

  1. Nouvelles Tables
    - Mise à jour de la table `verses` avec les données de la Bible Louis Segond
    - Ajout d'un index de recherche plein texte

  2. Sécurité
    - Maintien de la politique de sécurité existante pour l'accès public aux versets
*/

-- Création de l'index de recherche plein texte
CREATE INDEX IF NOT EXISTS verses_text_search_idx ON verses USING gin(to_tsvector('french', text));

-- Insertion des données des versets
INSERT INTO verses (book, chapter, verse, text) VALUES
('Genèse', 1, 1, 'Au commencement, Dieu créa les cieux et la terre.'),
('Genèse', 1, 2, 'La terre était informe et vide; il y avait des ténèbres à la surface de l''abîme, et l''Esprit de Dieu se mouvait au-dessus des eaux.'),
('Genèse', 1, 3, 'Dieu dit: Que la lumière soit! Et la lumière fut.'),
('Genèse', 1, 4, 'Dieu vit que la lumière était bonne; et Dieu sépara la lumière d''avec les ténèbres.'),
('Genèse', 1, 5, 'Dieu appela la lumière jour, et il appela les ténèbres nuit. Ainsi, il y eut un soir, et il y eut un matin: ce fut le premier jour.')
ON CONFLICT (book, chapter, verse) DO UPDATE
SET text = EXCLUDED.text;

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