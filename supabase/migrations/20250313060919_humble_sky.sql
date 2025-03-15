/*
  # Import initial des données bibliques

  1. Contenu
    - Import des premiers chapitres de la Genèse
    - Données en français
    - Structure:
      - Livre: Genèse
      - Chapitres: 1-2
      - Versets avec texte complet

  2. Notes
    - Les versets sont insérés uniquement s'ils n'existent pas déjà
    - Utilisation de la clause ON CONFLICT pour éviter les doublons
*/

INSERT INTO verses (book, chapter, verse, text)
VALUES
  ('Genèse', 1, 1, 'Au commencement, Dieu créa les cieux et la terre.'),
  ('Genèse', 1, 2, 'La terre était informe et vide; il y avait des ténèbres à la surface de l''abîme, et l''Esprit de Dieu se mouvait au-dessus des eaux.'),
  ('Genèse', 1, 3, 'Dieu dit: Que la lumière soit! Et la lumière fut.'),
  ('Genèse', 1, 4, 'Dieu vit que la lumière était bonne; et Dieu sépara la lumière d''avec les ténèbres.'),
  ('Genèse', 1, 5, 'Dieu appela la lumière jour, et il appela les ténèbres nuit. Ainsi, il y eut un soir, et il y eut un matin: ce fut le premier jour.'),
  ('Genèse', 2, 1, 'Ainsi furent achevés les cieux et la terre, et toute leur armée.'),
  ('Genèse', 2, 2, 'Dieu acheva au septième jour son œuvre, qu''il avait faite; et il se reposa au septième jour de toute son œuvre, qu''il avait faite.'),
  ('Genèse', 2, 3, 'Dieu bénit le septième jour, et il le sanctifia, parce qu''en ce jour il se reposa de toute son œuvre qu''il avait créée en la faisant.')
ON CONFLICT (book, chapter, verse) DO NOTHING;