/*
  # Add Exodus chapters

  1. Changes
    - Insert verses for Exodus chapters
    - Each verse includes the complete text
    - Version is set to LSG (Louis Segond)

  2. Notes
    - Uses ON CONFLICT to handle duplicates
    - Maintains existing RLS policies
*/

INSERT INTO verses (book, chapter, verse, text, version) VALUES
  -- Exodus 1
  ('Exode', 1, 1, 'Voici les noms des fils d''Israël, venus en Égypte avec Jacob et leur famille:', 'LSG'),
  ('Exode', 1, 2, 'Ruben, Siméon, Lévi, Juda,', 'LSG'),
  ('Exode', 1, 3, 'Issacar, Zabulon, Benjamin,', 'LSG'),
  ('Exode', 1, 4, 'Dan, Nephthali, Gad et Aser.', 'LSG'),
  ('Exode', 1, 5, 'Les personnes issues de Jacob étaient au nombre de soixante-dix en tout. Joseph était alors en Égypte.', 'LSG'),
  ('Exode', 1, 6, 'Joseph mourut, ainsi que tous ses frères et toute cette génération-là.', 'LSG'),
  ('Exode', 1, 7, 'Les enfants d''Israël furent féconds et multiplièrent, ils s''accrurent et devinrent de plus en plus puissants. Et le pays en fut rempli.', 'LSG'),
  ('Exode', 1, 8, 'Il s''éleva sur l''Égypte un nouveau roi, qui n''avait point connu Joseph.', 'LSG'),
  ('Exode', 1, 9, 'Il dit à son peuple: Voilà les enfants d''Israël qui forment un peuple plus nombreux et plus puissant que nous.', 'LSG'),
  ('Exode', 1, 10, 'Allons! montrons-nous habiles à son égard; empêchons qu''il ne s''accroisse, et que, s''il survient une guerre, il ne se joigne à nos ennemis, pour nous combattre et sortir ensuite du pays.', 'LSG'),
  ('Exode', 1, 11, 'Et l''on établit sur lui des chefs de corvées, afin de l''accabler de travaux pénibles. C''est ainsi qu''il bâtit les villes de Pithom et de Ramsès, pour servir de magasins à Pharaon.', 'LSG'),
  ('Exode', 1, 12, 'Mais plus on l''accablait, plus il multipliait et s''accroissait; et l''on prit en aversion les enfants d''Israël.', 'LSG'),
  ('Exode', 1, 13, 'Alors les Égyptiens réduisirent les enfants d''Israël à une dure servitude.', 'LSG'),
  ('Exode', 1, 14, 'Ils leur rendirent la vie amère par de rudes travaux en argile et en briques, et par tous les ouvrages des champs: et c''était avec cruauté qu''ils leur imposaient toutes ces charges.', 'LSG'),
  ('Exode', 1, 15, 'Le roi d''Égypte parla aussi aux sages-femmes des Hébreux, nommées l''une Schiphra, et l''autre Pua.', 'LSG'),
  ('Exode', 1, 16, 'Il leur dit: Quand vous accoucherez les femmes des Hébreux et que vous les verrez sur les sièges, si c''est un garçon, faites-le mourir; si c''est une fille, laissez-la vivre.', 'LSG'),
  ('Exode', 1, 17, 'Mais les sages-femmes craignirent Dieu, et ne firent point ce que leur avait dit le roi d''Égypte; elles laissèrent vivre les enfants.', 'LSG'),
  ('Exode', 1, 18, 'Le roi d''Égypte appela les sages-femmes, et leur dit: Pourquoi avez-vous agi ainsi, et avez-vous laissé vivre les enfants?', 'LSG'),
  ('Exode', 1, 19, 'Les sages-femmes répondirent à Pharaon: C''est que les femmes des Hébreux ne sont pas comme les Égyptiennes; elles sont vigoureuses et elles accouchent avant l''arrivée de la sage-femme.', 'LSG'),
  ('Exode', 1, 20, 'Dieu fit du bien aux sages-femmes; et le peuple multiplia et devint très nombreux.', 'LSG'),
  ('Exode', 1, 21, 'Parce que les sages-femmes avaient eu la crainte de Dieu, Dieu fit prospérer leurs maisons.', 'LSG'),
  ('Exode', 1, 22, 'Alors Pharaon donna cet ordre à tout son peuple: Vous jetterez dans le fleuve tout garçon qui naîtra, et vous laisserez vivre toutes les filles.', 'LSG')
ON CONFLICT (book, chapter, verse, version) DO UPDATE
SET text = EXCLUDED.text;