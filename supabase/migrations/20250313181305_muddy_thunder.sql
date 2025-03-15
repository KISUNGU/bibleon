/*
  # Restructuration des données bibliques

  1. Modifications
    - Réorganisation des versets par testament
    - Respect de l'ordre chronologique des livres
    - Séparation claire entre Ancien et Nouveau Testament

  2. Structure
    - Ajout d'une colonne testament pour identifier AT/NT
    - Maintien de l'ordre des livres
*/

-- Ajout de la colonne testament si elle n'existe pas
ALTER TABLE verses ADD COLUMN IF NOT EXISTS testament text;

-- Mise à jour du testament pour tous les livres
UPDATE verses SET testament = 
  CASE 
    WHEN book IN (
      'Genèse', 'Exode', 'Lévitique', 'Nombres', 'Deutéronome',
      'Josué', 'Juges', 'Ruth', '1 Samuel', '2 Samuel',
      '1 Rois', '2 Rois', '1 Chroniques', '2 Chroniques',
      'Esdras', 'Néhémie', 'Esther', 'Job', 'Psaumes',
      'Proverbes', 'Ecclésiaste', 'Cantique', 'Ésaïe',
      'Jérémie', 'Lamentations', 'Ézéchiel', 'Daniel',
      'Osée', 'Joël', 'Amos', 'Abdias', 'Jonas',
      'Michée', 'Nahum', 'Habacuc', 'Sophonie',
      'Aggée', 'Zacharie', 'Malachie'
    ) THEN 'old'
    WHEN book IN (
      'Matthieu', 'Marc', 'Luc', 'Jean', 'Actes',
      'Romains', '1 Corinthiens', '2 Corinthiens',
      'Galates', 'Éphésiens', 'Philippiens', 'Colossiens',
      '1 Thessaloniciens', '2 Thessaloniciens',
      '1 Timothée', '2 Timothée', 'Tite', 'Philémon',
      'Hébreux', 'Jacques', '1 Pierre', '2 Pierre',
      '1 Jean', '2 Jean', '3 Jean', 'Jude', 'Apocalypse'
    ) THEN 'new'
  END;

-- Création d'un index sur le testament
CREATE INDEX IF NOT EXISTS verses_testament_idx ON verses (testament);

-- Création d'un index composite pour l'ordre des livres
CREATE INDEX IF NOT EXISTS verses_book_order_idx ON verses (testament, book, chapter, verse);

-- Mise à jour des contraintes pour assurer l'intégrité des données
ALTER TABLE verses DROP CONSTRAINT IF EXISTS verses_testament_check;
ALTER TABLE verses ADD CONSTRAINT verses_testament_check 
  CHECK (testament IN ('old', 'new'));

-- Ajout d'une contrainte pour s'assurer que les livres correspondent au bon testament
CREATE OR REPLACE FUNCTION check_book_testament()
RETURNS trigger AS $$
BEGIN
  IF NEW.testament = 'old' AND NEW.book NOT IN (
    'Genèse', 'Exode', 'Lévitique', 'Nombres', 'Deutéronome',
    'Josué', 'Juges', 'Ruth', '1 Samuel', '2 Samuel',
    '1 Rois', '2 Rois', '1 Chroniques', '2 Chroniques',
    'Esdras', 'Néhémie', 'Esther', 'Job', 'Psaumes',
    'Proverbes', 'Ecclésiaste', 'Cantique', 'Ésaïe',
    'Jérémie', 'Lamentations', 'Ézéchiel', 'Daniel',
    'Osée', 'Joël', 'Amos', 'Abdias', 'Jonas',
    'Michée', 'Nahum', 'Habacuc', 'Sophonie',
    'Aggée', 'Zacharie', 'Malachie'
  ) THEN
    RAISE EXCEPTION 'Livre invalide pour l''Ancien Testament';
  END IF;

  IF NEW.testament = 'new' AND NEW.book NOT IN (
    'Matthieu', 'Marc', 'Luc', 'Jean', 'Actes',
    'Romains', '1 Corinthiens', '2 Corinthiens',
    'Galates', 'Éphésiens', 'Philippiens', 'Colossiens',
    '1 Thessaloniciens', '2 Thessaloniciens',
    '1 Timothée', '2 Timothée', 'Tite', 'Philémon',
    'Hébreux', 'Jacques', '1 Pierre', '2 Pierre',
    '1 Jean', '2 Jean', '3 Jean', 'Jude', 'Apocalypse'
  ) THEN
    RAISE EXCEPTION 'Livre invalide pour le Nouveau Testament';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Création du trigger pour vérifier la cohérence des données
DROP TRIGGER IF EXISTS check_book_testament_trigger ON verses;
CREATE TRIGGER check_book_testament_trigger
  BEFORE INSERT OR UPDATE ON verses
  FOR EACH ROW
  EXECUTE FUNCTION check_book_testament();