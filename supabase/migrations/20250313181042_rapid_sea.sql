/*
  # Mise à jour du dictionnaire biblique

  1. Structure
    - Suppression et recréation de la table dictionary
    - Ajout d'une contrainte unique sur (word, testament)
    - Support des mots en hébreu et en grec
    - Index pour la recherche optimisée

  2. Données
    - Mots de l'Ancien Testament (hébreu)
    - Mots du Nouveau Testament (grec)
    - Distinction claire entre les deux testaments
*/

-- Suppression de la table existante
DROP TABLE IF EXISTS dictionary;

-- Création de la nouvelle table
CREATE TABLE dictionary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  word text NOT NULL,
  definition text NOT NULL,
  testament text NOT NULL,
  hebrew_origin text,
  greek_origin text,
  transliteration text,
  strong_number text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT dictionary_word_testament_key UNIQUE (word, testament)
);

-- Activation RLS
ALTER TABLE dictionary ENABLE ROW LEVEL SECURITY;

-- Politique de lecture publique
CREATE POLICY "Dictionary entries are publicly readable"
  ON dictionary
  FOR SELECT
  TO public
  USING (true);

-- Index pour la recherche
CREATE INDEX dictionary_word_search_idx ON dictionary USING gin(to_tsvector('french', word));
CREATE INDEX dictionary_testament_idx ON dictionary (testament);

-- Insertion des données
INSERT INTO dictionary (word, definition, testament, hebrew_origin, greek_origin, transliteration, strong_number) VALUES
  -- Ancien Testament (Hébreu)
  ('dieu', 'L''Être suprême, créateur et souverain de l''univers', 'old', 'אלהים', null, 'Elohim', 'H430'),
  ('créer', 'Faire exister ce qui n''existait pas auparavant', 'old', 'ברא', null, 'bara', 'H1254'),
  ('ciel', 'La voûte céleste, le firmament', 'old', 'שמים', null, 'shamayim', 'H8064'),
  ('terre', 'Le monde créé, la planète', 'old', 'ארץ', null, 'erets', 'H776'),
  ('lumière-at', 'Clarté physique et spirituelle dans l''Ancien Testament', 'old', 'אור', null, 'or', 'H216'),
  ('esprit-at', 'Souffle divin, force vitale dans l''Ancien Testament', 'old', 'רוח', null, 'ruach', 'H7307'),
  ('eau', 'Élément primordial de la création', 'old', 'מים', null, 'mayim', 'H4325'),
  ('jour', 'Période de lumière, unité de temps', 'old', 'יום', null, 'yom', 'H3117'),
  ('nuit', 'Période d''obscurité', 'old', 'לילה', null, 'layil', 'H3915'),
  ('commencement', 'Le début absolu', 'old', 'ראשית', null, 'reshit', 'H7225'),

  -- Nouveau Testament (Grec)
  ('amour', 'Amour divin, inconditionnel', 'new', null, 'ἀγάπη', 'agape', 'G26'),
  ('grâce', 'Don immérité de Dieu', 'new', null, 'χάρις', 'charis', 'G5485'),
  ('foi', 'Confiance en Dieu', 'new', null, 'πίστις', 'pistis', 'G4102'),
  ('paix', 'État de tranquillité spirituelle', 'new', null, 'εἰρήνη', 'eirene', 'G1515'),
  ('vie', 'Vie éternelle, spirituelle', 'new', null, 'ζωή', 'zoe', 'G2222'),
  ('vérité', 'Réalité divine absolue', 'new', null, 'ἀλήθεια', 'aletheia', 'G225'),
  ('esprit-nt', 'Esprit Saint, présence divine dans le Nouveau Testament', 'new', null, 'πνεῦμα', 'pneuma', 'G4151'),
  ('parole', 'Parole de Dieu', 'new', null, 'λόγος', 'logos', 'G3056'),
  ('lumière-nt', 'Lumière divine, révélation dans le Nouveau Testament', 'new', null, 'φῶς', 'phos', 'G5457'),
  ('gloire', 'Gloire divine, splendeur', 'new', null, 'δόξα', 'doxa', 'G1391');