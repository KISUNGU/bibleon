import fs from 'fs';
import { parse } from 'csv-parse';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Les variables d\'environnement VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont requises');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function importCsvData() {
  console.log('Début de l\'importation des données depuis le CSV...');

  const records = [];
  const parser = fs
    .createReadStream('./data/louis-segond-transformed.csv')
    .pipe(parse({
      columns: true,
      delimiter: ',',
      skip_empty_lines: true
    }));

  for await (const record of parser) {
    records.push({
      book: record.book,
      chapter: parseInt(record.chapter, 10),
      verse: parseInt(record.verse, 10),
      text: record.text.trim(),
      version: 'LSG'
    });

    // Insérer par lots de 100 versets
    if (records.length === 100) {
      try {
        const { error } = await supabase
          .from('verses')
          .upsert(records, {
            onConflict: 'book,chapter,verse,version',
            ignoreDuplicates: false
          });

        if (error) {
          console.error('Erreur lors de l\'insertion du lot:', error);
        } else {
          console.log(`Lot de ${records.length} versets inséré avec succès`);
        }
      } catch (error) {
        console.error('Erreur lors de l\'insertion:', error);
      }

      records.length = 0; // Vider le tableau
      await new Promise(resolve => setTimeout(resolve, 100)); // Petite pause pour éviter de surcharger
    }
  }

  // Insérer les versets restants
  if (records.length > 0) {
    try {
      const { error } = await supabase
        .from('verses')
        .upsert(records, {
          onConflict: 'book,chapter,verse,version',
          ignoreDuplicates: false
        });

      if (error) {
        console.error('Erreur lors de l\'insertion du dernier lot:', error);
      } else {
        console.log(`Dernier lot de ${records.length} versets inséré avec succès`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'insertion:', error);
    }
  }

  console.log('Importation terminée !');
}

// Lancer l'importation
importCsvData().catch(console.error);