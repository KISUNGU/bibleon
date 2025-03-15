import initSqlJs from 'sql.js';
import fs from 'fs';

async function showDatabaseStructure() {
  try {
    // Initialiser SQL.js
    const SQL = await initSqlJs();
    
    // Vérifier si le fichier de base de données existe
    if (!fs.existsSync('bible.db')) {
      console.error('La base de données n\'existe pas encore. Veuillez d\'abord importer les données.');
      process.exit(1);
    }

    // Charger la base de données
    const filebuffer = fs.readFileSync('bible.db');
    const db = new SQL.Database(new Uint8Array(filebuffer));

    // Obtenir la structure des tables
    console.log('\n=== STRUCTURE DE LA BASE DE DONNÉES ===\n');
    
    const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table'")[0];
    
    for (const table of tables.values) {
      const tableName = table[0];
      console.log(`\nTable: ${tableName}`);
      console.log('------------------------');
      
      // Obtenir les informations sur les colonnes
      const columns = db.exec(`PRAGMA table_info(${tableName})`)[0];
      console.log('Colonnes:');
      for (const col of columns.values) {
        const [cid, name, type, notnull, dflt_value, pk] = col;
        console.log(`  - ${name} (${type})${notnull ? ' NOT NULL' : ''}${pk ? ' PRIMARY KEY' : ''}${dflt_value ? ` DEFAULT ${dflt_value}` : ''}`);
      }
      
      // Obtenir les index
      const indexes = db.exec(`SELECT name, sql FROM sqlite_master WHERE type='index' AND tbl_name='${tableName}'`)[0];
      if (indexes) {
        console.log('\nIndex:');
        for (const idx of indexes.values) {
          console.log(`  - ${idx[0]}`);
          console.log(`    ${idx[1]}`);
        }
      }
      
      // Compter le nombre d'enregistrements
      const count = db.exec(`SELECT COUNT(*) FROM ${tableName}`)[0].values[0][0];
      console.log(`\nNombre d'enregistrements: ${count}`);
    }

    db.close();
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

showDatabaseStructure().catch(console.error);