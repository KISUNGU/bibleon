/*
  # Mise à jour du dictionnaire avec support hébreu et grec

  1. Modifications
    - Ajout des colonnes testament et greek_origin
    - Mise à jour des données avec support complet pour l'hébreu et le grec
    - Utilisation de transactions pour les insertions
*/

-- Ajout des colonnes pour le support AT/NT
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS testament text;
ALTER TABLE dictionary ADD COLUMN IF NOT EXISTS greek_origin text;

-- Mise à jour des données existantes pour l'Ancien Testament
UPDATE dictionary SET testament = 'old' WHERE hebrew_origin IS NOT NULL;

-- Fonction pour insérer les données du dictionnaire
CREATE OR REPLACE FUNCTION insert_dictionary_data() RETURNS void AS $$
BEGIN
  -- Ancien Testament (Hébreu)
  INSERT INTO dictionary (word, definition, testament, hebrew_origin, greek_origin, transliteration, strong_number)
  VALUES
    ('Dieu', 'L''Être suprême, créateur et souverain de l''univers', 'old', 'אלהים', null, 'Elohim', 'H430'),
    ('créer', 'Faire exister ce qui n''existait pas auparavant', 'old', 'ברא', null, 'bara', 'H1254'),
    ('ciel', 'La voûte céleste, le firmament', 'old', 'שמים', null, 'shamayim', 'H8064'),
    ('terre', 'Le monde créé, la planète', 'old', 'ארץ', null, 'erets', 'H776'),
    ('lumière', 'Clarté physique et spirituelle', 'old', 'אור', null, 'or', 'H216'),
    ('esprit', 'Souffle divin, force vitale', 'old', 'רוח', null, 'ruach', 'H7307'),
    ('eau', 'Élément primordial de la création', 'old', 'מים', null, 'mayim', 'H4325'),
    ('jour', 'Période de lumière, unité de temps', 'old', 'יום', null, 'yom', 'H3117'),
    ('nuit', 'Période d''obscurité', 'old', 'לילה', null, 'layil', 'H3915'),
    ('commencement', 'Le début absolu', 'old', 'ראשית', null, 'reshit', 'H7225')
  ON CONFLICT (word) DO UPDATE
  SET 
    definition = EXCLUDED.definition,
    testament = EXCLUDED.testament,
    hebrew_origin = EXCLUDED.hebrew_origin,
    greek_origin = EXCLUDED.greek_origin,
    transliteration = EXCLUDED.transliteration,
    strong_number = EXCLUDED.strong_number;

  -- Nouveau Testament (Grec)
  INSERT INTO dictionary (word, definition, testament, hebrew_origin, greek_origin, transliteration, strong_number)
  VALUES
    ('amour', 'Amour divin, inconditionnel', 'new', null, 'ἀγάπη', 'agape', 'G26'),
    ('grâce', 'Don immérité de Dieu', 'new', null, 'χάρις', 'charis', 'G5485'),
    ('foi', 'Confiance en Dieu', 'new', null, 'πίστις', 'pistis', 'G4102'),
    ('paix', 'État de tranquillité spirituelle', 'new', null, 'εἰρήνη', 'eirene', 'G1515'),
    ('vie', 'Vie éternelle, spirituelle', 'new', null, 'ζωή', 'zoe', 'G2222'),
    ('vérité', 'Réalité divine absolue', 'new', null, 'ἀλήθεια', 'aletheia', 'G225'),
    ('esprit', 'Esprit Saint, présence divine', 'new', null, 'πνεῦμα', 'pneuma', 'G4151'),
    ('parole', 'Parole de Dieu', 'new', null, 'λόγος', 'logos', 'G3056'),
    ('lumière', 'Lumière divine, révélation', 'new', null, 'φῶς', 'phos', 'G5457'),
    ('gloire', 'Gloire divine, splendeur', 'new', null, 'δόξα', 'doxa', 'G1391')
  ON CONFLICT (word) DO UPDATE
  SET 
    definition = EXCLUDED.definition,
    testament = EXCLUDED.testament,
    hebrew_origin = EXCLUDED.hebrew_origin,
    greek_origin = EXCLUDED.greek_origin,
    transliteration = EXCLUDED.transliteration,
    strong_number = EXCLUDED.strong_number;
END;
$$ LANGUAGE plpgsql;

-- Exécuter la fonction
SELECT insert_dictionary_data();