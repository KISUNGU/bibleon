import axios from 'axios';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const BIBLE_BOOKS = {
  'Genèse': 50,
  'Exode': 40,
  'Lévitique': 27,
  'Nombres': 36,
  'Deutéronome': 34,
  'Josué': 24,
  'Juges': 21,
  'Ruth': 4,
  '1 Samuel': 31,
  '2 Samuel': 24,
  '1 Rois': 22,
  '2 Rois': 25,
  '1 Chroniques': 29,
  '2 Chroniques': 36,
  'Esdras': 10,
  'Néhémie': 13,
  'Esther': 10,
  'Job': 42,
  'Psaumes': 150,
  'Proverbes': 31,
  'Ecclésiaste': 12,
  'Cantique': 8,
  'Ésaïe': 66,
  'Jérémie': 52,
  'Lamentations': 5,
  'Ézéchiel': 48,
  'Daniel': 12,
  'Osée': 14,
  'Joël': 3,
  'Amos': 9,
  'Abdias': 1,
  'Jonas': 4,
  'Michée': 7,
  'Nahum': 3,
  'Habacuc': 3,
  'Sophonie': 3,
  'Aggée': 2,
  'Zacharie': 14,
  'Malachie': 4,
  'Matthieu': 28,
  'Marc': 16,
  'Luc': 24,
  'Jean': 21,
  'Actes': 28,
  'Romains': 16,
  '1 Corinthiens': 16,
  '2 Corinthiens': 13,
  'Galates': 6,
  'Éphésiens': 6,
  'Philippiens': 4,
  'Colossiens': 4,
  '1 Thessaloniciens': 5,
  '2 Thessaloniciens': 3,
  '1 Timothée': 6,
  '2 Timothée': 4,
  'Tite': 3,
  'Philémon': 1,
  'Hébreux': 13,
  'Jacques': 5,
  '1 Pierre': 5,
  '2 Pierre': 3,
  '1 Jean': 5,
  '2 Jean': 1,
  '3 Jean': 1,
  'Jude': 1,
  'Apocalypse': 22
};

async function fetchBibleData() {
  console.log('Début du téléchargement des données bibliques...');

  const bibleData = {
    "Abbreviation": "LSG",
    "Language": "fr",
    "VersionDate": "20121010000000",
    "Copyright": "Domaine public",
    "Guid": "HyNH7VrWRUquc8gg22gQ6w",
    "Testaments": [
      {
        "Books": []
      }
    ]
  };

  try {
    // Créer le dossier data s'il n'existe pas
    mkdirSync(join(process.cwd(), 'data'), { recursive: true });

    // Parcourir tous les livres
    for (const [bookName, chaptersCount] of Object.entries(BIBLE_BOOKS)) {
      console.log(`Téléchargement de ${bookName}...`);
      
      const book = {
        "Name": bookName,
        "Chapters": []
      };

      // Parcourir tous les chapitres du livre
      for (let chapterNum = 1; chapterNum <= chaptersCount; chapterNum++) {
        console.log(`  Chapitre ${chapterNum}`);
        
        try {
          const response = await axios.get(`https://bible-api.github.io/bible-api/lsg/${encodeURIComponent(bookName)}/${chapterNum}`);
          
          const chapter = {
            "ID": chapterNum,
            "Verses": []
          };

          // Convertir les versets au nouveau format
          for (const [verseNum, text] of Object.entries(response.data)) {
            chapter.Verses.push({
              "ID": parseInt(verseNum),
              "Text": text
            });
          }

          // Trier les versets par ID
          chapter.Verses.sort((a, b) => a.ID - b.ID);
          book.Chapters.push(chapter);
          
          // Attendre un peu entre chaque requête
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Erreur lors du téléchargement de ${bookName} ${chapterNum}:`, error.message);
          continue;
        }
      }

      // Trier les chapitres par ID
      book.Chapters.sort((a, b) => a.ID - b.ID);
      bibleData.Testaments[0].Books.push(book);
    }

    // Sauvegarder les données dans un fichier JSON
    writeFileSync(
      join(process.cwd(), 'data', 'bible-lsg.json'),
      JSON.stringify(bibleData, null, 2),
      'utf-8'
    );

    console.log('Téléchargement terminé avec succès !');
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    process.exit(1);
  }
}

// Lancer le téléchargement
fetchBibleData().catch(console.error);