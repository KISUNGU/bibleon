import { XMLParser } from 'fast-xml-parser';
import initSqlJs from 'sql.js';
import { BIBLE_BOOKS } from './bibleStructure.js';
import fs from 'fs';

const XML_FILE = './data/bible.xml';

async function importXmlBible() {
  console.log('Début de l\'importation de la Bible depuis XML...');

  try {
    // Vérifier si le fichier XML existe
    if (!fs.existsSync(XML_FILE)) {
      throw new Error(`Le fichier XML n'existe pas. Veuillez d'abord exécuter 'npm run download-xml'`);
    }

    // Lire le fichier XML
    console.log('Lecture du fichier XML...');
    const xmlData = fs.readFileSync(XML_FILE, 'utf-8');

    if (!xmlData) {
      throw new Error('Fichier XML vide');
    }

    // Parser le XML
    console.log('Analyse du fichier XML...');
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: 'text',
      parseAttributeValue: true,
      trimValues: true
    });
    
    const bible = parser.parse(xmlData);

    if (!bible?.bible?.b) {
      throw new Error('Structure XML invalide: bible.b manquant');
    }

    // Initialiser SQL.js
    console.log('Initialisation de la base de données...');
    const SQL = await initSqlJs();
    const db = new SQL.Database();

    // Créer la structure de la base de données
    db.run(`
      CREATE TABLE IF NOT EXISTS verses (
        id TEXT PRIMARY KEY,
        book TEXT NOT NULL,
        chapter INTEGER NOT NULL,
        verse INTEGER NOT NULL,
        text TEXT NOT NULL,
        version TEXT NOT NULL DEFAULT 'LSG',
        testament TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(book, chapter, verse, version)
      );

      CREATE INDEX IF NOT EXISTS idx_verses_book_chapter 
      ON verses(book, chapter);

      CREATE INDEX IF NOT EXISTS idx_verses_testament 
      ON verses(testament);

      CREATE INDEX IF NOT EXISTS idx_verses_version 
      ON verses(version);
    `);

    // Préparer la requête d'insertion
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO verses (id, book, chapter, verse, text, version, testament)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    let totalVerses = 0;
    const books = Array.isArray(bible.bible.b) ? bible.bible.b : [bible.bible.b];

    // Parcourir les livres
    console.log('Importation des versets...');
    for (const book of books) {
      const bookName = book['@_n'];
      const bookInfo = BIBLE_BOOKS.find(b => b.name === bookName);
      
      if (!bookInfo) {
        console.warn(`Livre non reconnu: ${bookName}`);
        continue;
      }

      console.log(`\nTraitement de ${bookName}...`);

      const chapters = Array.isArray(book.c) ? book.c : [book.c];
      
      // Parcourir les chapitres
      for (const chapter of chapters) {
        const chapterNum = parseInt(chapter['@_n'], 10);
        if (isNaN(chapterNum)) {
          console.warn(`Numéro de chapitre invalide pour ${bookName}`);
          continue;
        }

        let versesInChapter = 0;
        const verses = Array.isArray(chapter.v) ? chapter.v : [chapter.v];

        // Parcourir les versets
        for (const verse of verses) {
          const verseNum = parseInt(verse['@_n'], 10);
          if (isNaN(verseNum)) {
            console.warn(`Numéro de verset invalide dans ${bookName} ${chapterNum}`);
            continue;
          }

          const text = (verse.text || '').toString().trim();
          if (!text) {
            console.warn(`Texte manquant pour ${bookName} ${chapterNum}:${verseNum}`);
            continue;
          }

          try {
            stmt.run([
              `${bookName}_${chapterNum}_${verseNum}`,
              bookName,
              chapterNum,
              verseNum,
              text,
              'LSG',
              bookInfo.testament
            ]);
            versesInChapter++;
            totalVerses++;
          } catch (error) {
            console.error(`Erreur lors de l'insertion du verset ${bookName} ${chapterNum}:${verseNum}:`, error);
          }
        }

        console.log(`  Chapitre ${chapterNum}: ${versesInChapter} versets importés`);
      }
    }

    stmt.free();

    // Sauvegarder la base de données
    console.log('\nSauvegarde de la base de données...');
    const data = db.export();
    fs.writeFileSync('bible.db', Buffer.from(data));

    console.log('\nImportation terminée avec succès !');
    console.log(`Total des versets importés: ${totalVerses}`);

    // Vérifier l'importation
    const result = db.exec('SELECT COUNT(*) as count FROM verses')[0];
    console.log(`Nombre de versets dans la base: ${result.values[0][0]}`);

    db.close();
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
    console.error('Détails:', error.stack);
    process.exit(1);
  }
}

// Lancer l'importation
importXmlBible().catch(console.error);