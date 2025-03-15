/*
  # Insertion des données de la Bible

  1. Données
    - Insertion des versets de la Bible Louis Segond (LSG)
    - Insertion des versets de la Bible Martin (MAR)
    
  2. Optimisation
    - Utilisation de DO blocks pour gérer les insertions
    - Gestion des conflits avec ON CONFLICT
*/

-- Fonction pour nettoyer le texte des versets
CREATE OR REPLACE FUNCTION clean_verse_text(text_input text)
RETURNS text AS $$
BEGIN
  RETURN regexp_replace(
    regexp_replace(text_input, E'[\\n\\r]+', ' ', 'g'),
    E'\\s+', ' ', 'g'
  );
END;
$$ LANGUAGE plpgsql;

-- Bible Louis Segond
DO $$
BEGIN
  -- Genèse 1
  INSERT INTO verses (book, chapter, verse, text, version) VALUES
  ('Genèse', 1, 1, clean_verse_text('Au commencement, Dieu créa les cieux et la terre.'), 'LSG'),
  ('Genèse', 1, 2, clean_verse_text('La terre était informe et vide; il y avait des ténèbres à la surface de l''abîme, et l''Esprit de Dieu se mouvait au-dessus des eaux.'), 'LSG'),
  ('Genèse', 1, 3, clean_verse_text('Dieu dit: Que la lumière soit! Et la lumière fut.'), 'LSG'),
  ('Genèse', 1, 4, clean_verse_text('Dieu vit que la lumière était bonne; et Dieu sépara la lumière d''avec les ténèbres.'), 'LSG'),
  ('Genèse', 1, 5, clean_verse_text('Dieu appela la lumière jour, et il appela les ténèbres nuit. Ainsi, il y eut un soir, et il y eut un matin: ce fut le premier jour.'), 'LSG'),
  ('Genèse', 1, 6, clean_verse_text('Dieu dit: Qu''il y ait une étendue entre les eaux, et qu''elle sépare les eaux d''avec les eaux.'), 'LSG'),
  ('Genèse', 1, 7, clean_verse_text('Et Dieu fit l''étendue, et il sépara les eaux qui sont au-dessous de l''étendue d''avec les eaux qui sont au-dessus de l''étendue. Et cela fut ainsi.'), 'LSG'),
  ('Genèse', 1, 8, clean_verse_text('Dieu appela l''étendue ciel. Ainsi, il y eut un soir, et il y eut un matin: ce fut le second jour.'), 'LSG'),
  ('Genèse', 1, 9, clean_verse_text('Dieu dit: Que les eaux qui sont au-dessous du ciel se rassemblent en un seul lieu, et que le sec paraisse. Et cela fut ainsi.'), 'LSG'),
  ('Genèse', 1, 10, clean_verse_text('Dieu appela le sec terre, et il appela l''amas des eaux mers. Dieu vit que cela était bon.'), 'LSG')
  ON CONFLICT (book, chapter, verse, version) DO UPDATE
  SET text = EXCLUDED.text;
END $$;

-- Bible Martin
DO $$
BEGIN
  -- Genèse 1
  INSERT INTO verses (book, chapter, verse, text, version) VALUES
  ('Genèse', 1, 1, clean_verse_text('Au commencement Dieu créa les Cieux et la Terre.'), 'MAR'),
  ('Genèse', 1, 2, clean_verse_text('Et la Terre était sans forme, et vide, et les ténèbres étaient sur la face de l''abîme, et l''Esprit de Dieu se mouvait sur le dessus des eaux.'), 'MAR'),
  ('Genèse', 1, 3, clean_verse_text('Et Dieu dit: Que la lumière soit; et la lumière fut.'), 'MAR'),
  ('Genèse', 1, 4, clean_verse_text('Et Dieu vit que la lumière était bonne; et Dieu sépara la lumière des ténèbres.'), 'MAR'),
  ('Genèse', 1, 5, clean_verse_text('Et Dieu nomma la lumière, Jour; et les ténèbres, Nuit. Ainsi fut le soir, ainsi fut le matin; ce fut le premier jour.'), 'MAR'),
  ('Genèse', 1, 6, clean_verse_text('Puis Dieu dit: Qu''il y ait une étendue entre les eaux, et qu''elle sépare les eaux d''avec les eaux.'), 'MAR'),
  ('Genèse', 1, 7, clean_verse_text('Dieu donc fit l''étendue, et sépara les eaux qui sont au-dessous de l''étendue, d''avec celles qui sont au-dessus de l''étendue; et il fut ainsi.'), 'MAR'),
  ('Genèse', 1, 8, clean_verse_text('Et Dieu nomma l''étendue, Cieux. Ainsi fut le soir, ainsi fut le matin; ce fut le second jour.'), 'MAR'),
  ('Genèse', 1, 9, clean_verse_text('Puis Dieu dit: Que les eaux qui sont au-dessous des cieux soient rassemblées en un lieu, et que le sec paraisse; et il fut ainsi.'), 'MAR'),
  ('Genèse', 1, 10, clean_verse_text('Et Dieu nomma le sec, Terre; et il nomma l''amas des eaux, Mers; et Dieu vit que cela était bon.'), 'MAR')
  ON CONFLICT (book, chapter, verse, version) DO UPDATE
  SET text = EXCLUDED.text;
END $$;