import fs from 'fs';
import initSqlJs from 'sql.js';
import { BIBLE_BOOKS } from './bibleStructure.js';

async function importBibleData() {
  console.log('Début de l\'importation des données bibliques...');

  try {
    // Initialiser SQL.js
    const SQL = await initSqlJs();
    const db = new SQL.Database();

    // Lire le fichier JSON
    const bibleData = JSON.parse(
      fs.readFileSync('./data/louis-segond-formatted.json', 'utf-8')
    );

    console.log('Fichier JSON chargé. Vérification de la structure...');

    // Vérifier la structure du fichier
    if (!bibleData.Testaments || !Array.isArray(bibleData.Testaments) || !bibleData.Testaments[0]?.Books) {
      throw new Error('Structure JSON invalide: Testaments ou Books manquants');
    }

    // Créer la table et les index
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
    const books = bibleData.Testaments[0].Books;
    console.log(`Nombre de livres trouvés: ${books.length}`);

    // Parcourir les livres
    for (const book of books) {
      if (!book.Name || !book.Chapters) {
        console.warn('Livre invalide détecté, structure incorrecte');
        continue;
      }

      const bookName = book.Name;
      const bookInfo = BIBLE_BOOKS.find(b => b.name === bookName);
      
      if (!bookInfo) {
        console.warn(`Livre non trouvé dans la structure: ${bookName}`);
        continue;
      }

      console.log(`\nTraitement de ${bookName}...`);
      console.log(`Nombre de chapitres: ${book.Chapters.length}`);

      // Parcourir les chapitres
      for (let chapterIndex = 0; chapterIndex < book.Chapters.length; chapterIndex++) {
        const chapter = book.Chapters[chapterIndex];
        const chapterNum = chapter.ID || (chapterIndex + 1);
        
        if (!chapter.Verses || !Array.isArray(chapter.Verses)) {
          console.warn(`Structure de chapitre invalide pour ${bookName} chapitre ${chapterNum}`);
          continue;
        }

        let versesInChapter = 0;
        
        // Parcourir les versets
        for (let verseIndex = 0; verseIndex < chapter.Verses.length; verseIndex++) {
          const verse = chapter.Verses[verseIndex];
          if (!verse.Text) {
            console.warn(`Verset invalide détecté dans ${bookName} ${chapterNum}:${verseIndex + 1}`);
            continue;
          }

          const verseNum = verse.ID || (verseIndex + 1);
          const text = verse.Text.replace(/\s+/g, ' ').trim();
          
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
importBibleData().catch(console.error);