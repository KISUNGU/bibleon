export const BIBLE_BOOKS = [
  // Ancien Testament
  { id: 'GEN', name: 'Genèse', chaptersCount: 50, testament: 'old' },
  { id: 'EXO', name: 'Exode', chaptersCount: 40, testament: 'old' },
  { id: 'LEV', name: 'Lévitique', chaptersCount: 27, testament: 'old' },
  { id: 'NUM', name: 'Nombres', chaptersCount: 36, testament: 'old' },
  { id: 'DEU', name: 'Deutéronome', chaptersCount: 34, testament: 'old' },
  { id: 'JOS', name: 'Josué', chaptersCount: 24, testament: 'old' },
  { id: 'JUG', name: 'Juges', chaptersCount: 21, testament: 'old' },
  { id: 'RUT', name: 'Ruth', chaptersCount: 4, testament: 'old' },
  { id: '1SA', name: '1 Samuel', chaptersCount: 31, testament: 'old' },
  { id: '2SA', name: '2 Samuel', chaptersCount: 24, testament: 'old' },
  { id: '1RO', name: '1 Rois', chaptersCount: 22, testament: 'old' },
  { id: '2RO', name: '2 Rois', chaptersCount: 25, testament: 'old' },
  { id: '1CH', name: '1 Chroniques', chaptersCount: 29, testament: 'old' },
  { id: '2CH', name: '2 Chroniques', chaptersCount: 36, testament: 'old' },
  { id: 'ESD', name: 'Esdras', chaptersCount: 10, testament: 'old' },
  { id: 'NEH', name: 'Néhémie', chaptersCount: 13, testament: 'old' },
  { id: 'EST', name: 'Esther', chaptersCount: 10, testament: 'old' },
  { id: 'JOB', name: 'Job', chaptersCount: 42, testament: 'old' },
  { id: 'PSA', name: 'Psaumes', chaptersCount: 150, testament: 'old' },
  { id: 'PRO', name: 'Proverbes', chaptersCount: 31, testament: 'old' },
  { id: 'ECC', name: 'Ecclésiaste', chaptersCount: 12, testament: 'old' },
  { id: 'CAN', name: 'Cantique', chaptersCount: 8, testament: 'old' },
  { id: 'ESA', name: 'Ésaïe', chaptersCount: 66, testament: 'old' },
  { id: 'JER', name: 'Jérémie', chaptersCount: 52, testament: 'old' },
  { id: 'LAM', name: 'Lamentations', chaptersCount: 5, testament: 'old' },
  { id: 'EZE', name: 'Ézéchiel', chaptersCount: 48, testament: 'old' },
  { id: 'DAN', name: 'Daniel', chaptersCount: 12, testament: 'old' },
  { id: 'OSE', name: 'Osée', chaptersCount: 14, testament: 'old' },
  { id: 'JOE', name: 'Joël', chaptersCount: 3, testament: 'old' },
  { id: 'AMO', name: 'Amos', chaptersCount: 9, testament: 'old' },
  { id: 'ABD', name: 'Abdias', chaptersCount: 1, testament: 'old' },
  { id: 'JON', name: 'Jonas', chaptersCount: 4, testament: 'old' },
  { id: 'MIC', name: 'Michée', chaptersCount: 7, testament: 'old' },
  { id: 'NAH', name: 'Nahum', chaptersCount: 3, testament: 'old' },
  { id: 'HAB', name: 'Habacuc', chaptersCount: 3, testament: 'old' },
  { id: 'SOF', name: 'Sophonie', chaptersCount: 3, testament: 'old' },
  { id: 'AGG', name: 'Aggée', chaptersCount: 2, testament: 'old' },
  { id: 'ZAC', name: 'Zacharie', chaptersCount: 14, testament: 'old' },
  { id: 'MAL', name: 'Malachie', chaptersCount: 4, testament: 'old' },

  // Nouveau Testament
  { id: 'MAT', name: 'Matthieu', chaptersCount: 28, testament: 'new' },
  { id: 'MAR', name: 'Marc', chaptersCount: 16, testament: 'new' },
  { id: 'LUC', name: 'Luc', chaptersCount: 24, testament: 'new' },
  { id: 'JEA', name: 'Jean', chaptersCount: 21, testament: 'new' },
  { id: 'ACT', name: 'Actes', chaptersCount: 28, testament: 'new' },
  { id: 'ROM', name: 'Romains', chaptersCount: 16, testament: 'new' },
  { id: '1CO', name: '1 Corinthiens', chaptersCount: 16, testament: 'new' },
  { id: '2CO', name: '2 Corinthiens', chaptersCount: 13, testament: 'new' },
  { id: 'GAL', name: 'Galates', chaptersCount: 6, testament: 'new' },
  { id: 'EPH', name: 'Éphésiens', chaptersCount: 6, testament: 'new' },
  { id: 'PHI', name: 'Philippiens', chaptersCount: 4, testament: 'new' },
  { id: 'COL', name: 'Colossiens', chaptersCount: 4, testament: 'new' },
  { id: '1TH', name: '1 Thessaloniciens', chaptersCount: 5, testament: 'new' },
  { id: '2TH', name: '2 Thessaloniciens', chaptersCount: 3, testament: 'new' },
  { id: '1TI', name: '1 Timothée', chaptersCount: 6, testament: 'new' },
  { id: '2TI', name: '2 Timothée', chaptersCount: 4, testament: 'new' },
  { id: 'TIT', name: 'Tite', chaptersCount: 3, testament: 'new' },
  { id: 'PHM', name: 'Philémon', chaptersCount: 1, testament: 'new' },
  { id: 'HEB', name: 'Hébreux', chaptersCount: 13, testament: 'new' },
  { id: 'JAC', name: 'Jacques', chaptersCount: 5, testament: 'new' },
  { id: '1PI', name: '1 Pierre', chaptersCount: 5, testament: 'new' },
  { id: '2PI', name: '2 Pierre', chaptersCount: 3, testament: 'new' },
  { id: '1JE', name: '1 Jean', chaptersCount: 5, testament: 'new' },
  { id: '2JE', name: '2 Jean', chaptersCount: 1, testament: 'new' },
  { id: '3JE', name: '3 Jean', chaptersCount: 1, testament: 'new' },
  { id: 'JUD', name: 'Jude', chaptersCount: 1, testament: 'new' },
  { id: 'APO', name: 'Apocalypse', chaptersCount: 22, testament: 'new' }
];