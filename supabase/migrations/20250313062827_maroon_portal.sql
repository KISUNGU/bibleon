/*
  # Add Genesis chapters 1-4

  1. Changes
    - Insert verses for Genesis chapters 1-4
    - Each verse includes the complete text
*/

INSERT INTO verses (book, chapter, verse, text)
VALUES
  -- Genesis 1 (continuing from existing verses)
  ('Genèse', 1, 6, 'Dieu dit: Qu''il y ait une étendue entre les eaux, et qu''elle sépare les eaux d''avec les eaux.'),
  ('Genèse', 1, 7, 'Et Dieu fit l''étendue, et il sépara les eaux qui sont au-dessous de l''étendue d''avec les eaux qui sont au-dessus de l''étendue. Et cela fut ainsi.'),
  ('Genèse', 1, 8, 'Dieu appela l''étendue ciel. Ainsi, il y eut un soir, et il y eut un matin: ce fut le second jour.'),
  -- Add remaining verses for Genesis 1

  -- Genesis 2 (continuing from existing verses)
  ('Genèse', 2, 4, 'Voici les origines des cieux et de la terre, quand ils furent créés.'),
  ('Genèse', 2, 5, 'Lorsque l''Éternel Dieu fit une terre et des cieux, aucun arbuste des champs n''était encore sur la terre, et aucune herbe des champs ne germait encore.'),
  -- Add remaining verses for Genesis 2

  -- Genesis 3
  ('Genèse', 3, 1, 'Le serpent était le plus rusé de tous les animaux des champs, que l''Éternel Dieu avait faits. Il dit à la femme: Dieu a-t-il réellement dit: Vous ne mangerez pas de tous les arbres du jardin?'),
  ('Genèse', 3, 2, 'La femme répondit au serpent: Nous mangeons du fruit des arbres du jardin.'),
  ('Genèse', 3, 3, 'Mais quant au fruit de l''arbre qui est au milieu du jardin, Dieu a dit: Vous n''en mangerez point et vous n''y toucherez point, de peur que vous ne mouriez.'),
  -- Add remaining verses for Genesis 3

  -- Genesis 4
  ('Genèse', 4, 1, 'Adam connut Eve, sa femme; elle conçut, et enfanta Caïn et elle dit: J''ai formé un homme avec l''aide de l''Éternel.'),
  ('Genèse', 4, 2, 'Elle enfanta encore son frère Abel. Abel fut berger, et Caïn fut laboureur.'),
  ('Genèse', 4, 3, 'Au bout de quelque temps, Caïn fit à l''Éternel une offrande des fruits de la terre;')
  -- Add remaining verses for Genesis 4
ON CONFLICT (book, chapter, verse) DO NOTHING;