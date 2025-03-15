import initSqlJs from 'sql.js';
import { Verse } from '../types';

let db: any = null;

async function initDatabase() {
  if (db) return;
  
  const SQL = await initSqlJs();
  const response = await fetch('/bible.db');
  const buffer = await response.arrayBuffer();
  db = new SQL.Database(new Uint8Array(buffer));
}

export const getBibleData = async (book: string, chapter: number): Promise<Verse[]> => {
  try {
    await initDatabase();
    
    const stmt = db.prepare(`
      SELECT * FROM verses 
      WHERE book = ? AND chapter = ? AND version = 'LSG'
      ORDER BY verse
    `);
    
    const verses: Verse[] = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      verses.push(row as Verse);
    }
    stmt.free();
    
    return verses;
  } catch (error) {
    console.error('Erreur lors de la récupération des versets:', error);
    return [];
  }
};

export const insertVerse = async (verse: Verse) => {
  try {
    await initDatabase();
    
    const testament = verse.book === 'Genèse' ? 'old' : 'new'; // Logique simplifiée
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO verses (id, book, chapter, verse, text, version, testament)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run([
      `${verse.book}_${verse.chapter}_${verse.verse}`,
      verse.book,
      verse.chapter,
      verse.verse,
      verse.text,
      verse.version || 'LSG',
      testament
    ]);
    
    stmt.free();
  } catch (error) {
    console.error('Erreur lors de l\'insertion du verset:', error);
  }
};