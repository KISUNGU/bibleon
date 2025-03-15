/*
  # Mise à jour de la table du dictionnaire

  1. Modifications
    - Ajout des colonnes manquantes à la table dictionary
    - Mise à jour des données du dictionnaire avec les définitions hébraïques

  2. Sécurité
    - Maintien de la politique de lecture publique
*/

-- Ajout des colonnes manquantes à la table dictionary
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'dictionary' AND column_name = 'hebrew_origin'
  ) THEN
    ALTER TABLE dictionary ADD COLUMN hebrew_origin text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'dictionary' AND column_name = 'transliteration'
  ) THEN
    ALTER TABLE dictionary ADD COLUMN transliteration text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'dictionary' AND column_name = 'strong_number'
  ) THEN
    ALTER TABLE dictionary ADD COLUMN strong_number text;
  END IF;
END $$;

-- Mise à jour des données du dictionnaire
INSERT INTO dictionary (word, definition, hebrew_origin, transliteration, strong_number) VALUES
  ('Dieu', 'L''Être suprême, créateur et souverain de l''univers', 'אלהים', 'Elohim', 'H430'),
  ('créer', 'Faire exister ce qui n''existait pas auparavant, action divine de création', 'ברא', 'bara', 'H1254'),
  ('ciel', 'La voûte céleste, le firmament, la demeure de Dieu', 'שמים', 'shamayim', 'H8064'),
  ('terre', 'Le monde créé, la planète, le sol', 'ארץ', 'erets', 'H776'),
  ('lumière', 'Clarté physique et spirituelle, symbole de la présence divine', 'אור', 'or', 'H216'),
  ('esprit', 'Souffle divin, force vitale, présence de Dieu', 'רוח', 'ruach', 'H7307'),
  ('eau', 'Élément primordial de la création, symbole de vie', 'מים', 'mayim', 'H4325'),
  ('jour', 'Période de lumière, unité de temps divine', 'יום', 'yom', 'H3117'),
  ('nuit', 'Période d''obscurité, temps de repos', 'לילה', 'layil', 'H3915'),
  ('commencement', 'Le début absolu, l''origine divine', 'ראשית', 'reshit', 'H7225'),
  ('parole', 'Expression divine créatrice, commandement de Dieu', 'דבר', 'davar', 'H1697'),
  ('bénédiction', 'Faveur divine, don de Dieu', 'ברכה', 'berakah', 'H1293'),
  ('gloire', 'Manifestation de la présence divine, splendeur de Dieu', 'כבוד', 'kavod', 'H3519'),
  ('saint', 'Consacré à Dieu, séparé pour Dieu', 'קדוש', 'qadosh', 'H6918'),
  ('vie', 'Existence donnée par Dieu, force vitale', 'חיים', 'chayyim', 'H2416'),
  ('âme', 'Principe de vie, personne entière', 'נפש', 'nephesh', 'H5315'),
  ('paix', 'État de plénitude, harmonie avec Dieu', 'שלום', 'shalom', 'H7965'),
  ('amour', 'Attachement profond, bonté divine', 'אהבה', 'ahavah', 'H160'),
  ('vérité', 'Ce qui est conforme à la réalité divine', 'אמת', 'emet', 'H571'),
  ('sagesse', 'Intelligence divine, discernement spirituel', 'חכמה', 'chokmah', 'H2451')
ON CONFLICT (word) DO UPDATE
SET 
  definition = EXCLUDED.definition,
  hebrew_origin = EXCLUDED.hebrew_origin,
  transliteration = EXCLUDED.transliteration,
  strong_number = EXCLUDED.strong_number;