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
    const fileContent = fs.readFileSync('./data/louis-segond-formatted.json', 'utf-8');
    const bibleData = JSON.parse(fileContent);

    if (!bibleData.Testaments?.[0]?.Books) {
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

    // Traiter chaque livre
    for (const book of books) {
      if (!book.Name || !book.Chapters) continue;

      const bookInfo = BIBLE_BOOKS.find(b => b.name === book.Name);
      if (!bookInfo) continue;

      console.log(`\nTraitement de ${book.Name}...`);

      // Traiter chaque chapitre
      for (const chapter of book.Chapters) {
        if (!chapter.Verses) continue;

        const chapterNum = chapter.ID || 1;
        let versesInChapter = 0;

        // Traiter chaque verset
        for (let i = 0; i < chapter.Verses.length; i++) {
          const verse = chapter.Verses[i];
          if (!verse.Text) continue;

          const verseNum = verse.ID || (i + 1);
          const text = verse.Text.trim();

          try {
            stmt.run([
              `${book.Name}_${chapterNum}_${verseNum}`,
              book.Name,
              chapterNum,
              verseNum,
              text,
              'LSG',
              bookInfo.testament
            ]);
            versesInChapter++;
            totalVerses++;
          } catch (error) {
            console.error(`Erreur lors de l'insertion du verset ${book.Name} ${chapterNum}:${verseNum}:`, error);
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
    process.exit(1);
  }
}

// Lancer l'importation
importBibleData().catch(error => {
  console.error('Erreur fatale:', error);
  process.exit(1);
});