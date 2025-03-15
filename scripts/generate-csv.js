import fs from 'fs';
import { BIBLE_BOOKS } from './bibleStructure.js';

// Fonction pour générer le contenu initial de la Genèse
function generateGenesisContent() {
  return [
    { book: 'Genèse', chapter: 1, verse: 1, text: 'Au commencement, Dieu créa les cieux et la terre.' },
    { book: 'Genèse', chapter: 1, verse: 2, text: 'La terre était informe et vide; il y avait des ténèbres à la surface de l\'abîme, et l\'Esprit de Dieu se mouvait au-dessus des eaux.' },
    { book: 'Genèse', chapter: 1, verse: 3, text: 'Dieu dit: Que la lumière soit! Et la lumière fut.' },
    { book: 'Genèse', chapter: 1, verse: 4, text: 'Dieu vit que la lumière était bonne; et Dieu sépara la lumière d\'avec les ténèbres.' },
    { book: 'Genèse', chapter: 1, verse: 5, text: 'Dieu appela la lumière jour, et il appela les ténèbres nuit. Ainsi, il y eut un soir, et il y eut un matin: ce fut le premier jour.' }
  ];
}

// Fonction pour générer le contenu de base pour chaque livre
function generateBasicContent(book, chaptersCount) {
  const verses = [];
  for (let chapter = 1; chapter <= chaptersCount; chapter++) {
    for (let verse = 1; verse <= 30; verse++) { // Supposons une moyenne de 30 versets par chapitre
      verses.push({
        book,
        chapter,
        verse,
        text: `${book} chapitre ${chapter}, verset ${verse}.`
      });
    }
  }
  return verses;
}

async function generateCsvFile() {
  console.log('Génération du fichier CSV...');

  // Créer le dossier data s'il n'existe pas
  if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data');
  }

  // Ouvrir le fichier en écriture
  const writeStream = fs.createWriteStream('./data/louis-segond-transformed.csv');
  
  // Écrire l'en-tête
  writeStream.write('book,chapter,verse,text\n');

  // Générer le contenu pour chaque livre
  for (const book of BIBLE_BOOKS) {
    console.log(`Génération du contenu pour ${book.name}...`);
    
    const verses = book.name === 'Genèse' 
      ? generateGenesisContent()
      : generateBasicContent(book.name, book.chaptersCount);

    // Écrire chaque verset
    verses.forEach(verse => {
      writeStream.write(`"${verse.book}",${verse.chapter},${verse.verse},"${verse.text}"\n`);
    });
  }

  // Fermer le fichier
  writeStream.end();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      console.log('Fichier CSV généré avec succès !');
      resolve();
    });
    writeStream.on('error', reject);
  });
}

// Exécuter la génération
generateCsvFile().catch(console.error);