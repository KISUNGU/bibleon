/*
  # Correction de la structure de la Bible

  1. Structure
    - Réinitialisation de la table des versets
    - Ajout des contraintes pour séparer l'Ancien et le Nouveau Testament
    - Création d'index pour optimiser les requêtes
    - Ajout de triggers pour la validation des données

  2. Données
    - Insertion des versets de la Genèse (début de l'Ancien Testament)
    - Respect de l'ordre chronologique des livres
*/

-- Suppression de la table existante
DROP TABLE IF EXISTS verses;

-- Création de la nouvelle table avec une structure améliorée
CREATE TABLE verses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book text NOT NULL,
  chapter integer NOT NULL,
  verse integer NOT NULL,
  text text NOT NULL,
  version text NOT NULL DEFAULT 'LSG',
  testament text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT verses_book_chapter_verse_version_key UNIQUE (book, chapter, verse, version)
);

-- Activation RLS
ALTER TABLE verses ENABLE ROW LEVEL SECURITY;

-- Politique de lecture publique
CREATE POLICY "Versets accessibles publiquement"
  ON verses
  FOR SELECT
  TO public
  USING (true);

-- Index pour optimiser les recherches
CREATE INDEX verses_text_search_idx ON verses USING gin(to_tsvector('french', text));
CREATE INDEX verses_version_idx ON verses (version);
CREATE INDEX verses_testament_idx ON verses (testament);
CREATE INDEX verses_book_order_idx ON verses (testament, book, chapter, verse);

-- Contrainte pour valider le testament
ALTER TABLE verses ADD CONSTRAINT verses_testament_check 
  CHECK (testament IN ('old', 'new'));

-- Fonction pour valider la cohérence des livres par testament
CREATE OR REPLACE FUNCTION check_book_testament()
RETURNS trigger AS $$
BEGIN
  -- Validation pour l'Ancien Testament
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
    RAISE EXCEPTION 'Livre invalide pour l''Ancien Testament: %', NEW.book;
  END IF;

  -- Validation pour le Nouveau Testament
  IF NEW.testament = 'new' AND NEW.book NOT IN (
    'Matthieu', 'Marc', 'Luc', 'Jean', 'Actes',
    'Romains', '1 Corinthiens', '2 Corinthiens',
    'Galates', 'Éphésiens', 'Philippiens', 'Colossiens',
    '1 Thessaloniciens', '2 Thessaloniciens',
    '1 Timothée', '2 Timothée', 'Tite', 'Philémon',
    'Hébreux', 'Jacques', '1 Pierre', '2 Pierre',
    '1 Jean', '2 Jean', '3 Jean', 'Jude', 'Apocalypse'
  ) THEN
    RAISE EXCEPTION 'Livre invalide pour le Nouveau Testament: %', NEW.book;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Création du trigger de validation
CREATE TRIGGER check_book_testament_trigger
  BEFORE INSERT OR UPDATE ON verses
  FOR EACH ROW
  EXECUTE FUNCTION check_book_testament();

-- Insertion des premiers versets de la Genèse
INSERT INTO verses (book, chapter, verse, text, version, testament) VALUES
  ('Genèse', 1, 1, 'Au commencement, Dieu créa les cieux et la terre.', 'LSG', 'old'),
  ('Genèse', 1, 2, 'La terre était informe et vide; il y avait des ténèbres à la surface de l''abîme, et l''Esprit de Dieu se mouvait au-dessus des eaux.', 'LSG', 'old'),
  ('Genèse', 1, 3, 'Dieu dit: Que la lumière soit! Et la lumière fut.', 'LSG', 'old'),
  ('Genèse', 1, 4, 'Dieu vit que la lumière était bonne; et Dieu sépara la lumière d''avec les ténèbres.', 'LSG', 'old'),
  ('Genèse', 1, 5, 'Dieu appela la lumière jour, et il appela les ténèbres nuit. Ainsi, il y eut un soir, et il y eut un matin: ce fut le premier jour.', 'LSG', 'old')
ON CONFLICT (book, chapter, verse, version) DO UPDATE
SET text = EXCLUDED.text, testament = EXCLUDED.testament;