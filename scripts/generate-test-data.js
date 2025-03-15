import fs from 'fs';
import { BIBLE_BOOKS } from './bibleStructure.js';

function generateTestBible() {
  console.log('Génération des données de test...');

  const bible = {
    Testaments: [{
      Books: BIBLE_BOOKS.map(book => ({
        Name: book.name,
        Chapters: Array.from({ length: book.chaptersCount }, (_, chapterIndex) => ({
          ID: chapterIndex + 1,
          Verses: Array.from({ length: 30 }, (_, verseIndex) => ({
            ID: verseIndex + 1,
            Text: `${book.name} chapitre ${chapterIndex + 1}, verset ${verseIndex + 1}.`
          }))
        }))
      }))
    }]
  };

  // Ajouter quelques versets connus pour la Genèse
  if (bible.Testaments[0].Books[0].Name === 'Genèse') {
    bible.Testaments[0].Books[0].Chapters[0].Verses[0].Text = 
      'Au commencement, Dieu créa les cieux et la terre.';
    bible.Testaments[0].Books[0].Chapters[0].Verses[1].Text = 
      'La terre était informe et vide; il y avait des ténèbres à la surface de l\'abîme, et l\'Esprit de Dieu se mouvait au-dessus des eaux.';
    bible.Testaments[0].Books[0].Chapters[0].Verses[2].Text = 
      'Dieu dit: Que la lumière soit! Et la lumière fut.';
  }

  // Créer le dossier data s'il n'existe pas
  if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data');
  }

  // Sauvegarder le fichier
  fs.writeFileSync(
    './data/louis-segond-formatted.json',
    JSON.stringify(bible, null, 2),
    'utf-8'
  );

  console.log('Données de test générées avec succès !');
  console.log('Fichier créé: ./data/louis-segond-formatted.json');
}

generateTestBible();