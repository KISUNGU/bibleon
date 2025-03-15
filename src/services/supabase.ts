import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';
import { BIBLE_BOOKS } from '../data/bibleStructure';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Les variables d\'environnement VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont requises');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export const getBibleData = async (book: string, chapter: number) => {
  try {
    // Déterminer le testament du livre
    const bookInfo = BIBLE_BOOKS.find(b => b.name === book);
    if (!bookInfo) {
      throw new Error(`Livre non trouvé: ${book}`);
    }

    const { data, error } = await supabase
      .from('verse')
      .select('*')
      .eq('book', book)
      .eq('chapter', chapter)
      .order('verse');

    if (error) {
      console.error('Erreur Supabase:', error);
      throw new Error(`Erreur lors de la récupération des versets: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.warn(`Aucun verset trouvé pour ${book} ${chapter}`);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des versets:', error);
    throw error;
  }
};

export const getRandomVerse = async () => {
  try {
    const { data, error } = await supabase
      .from('verse')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
  } catch (error) {
    console.error('Erreur lors de la récupération du verset aléatoire:', error);
    throw error;
  }
};

export const getCrossReferences = async (book: string, chapter: number, verse: number) => {
  try {
    let query = supabase
      .from('cross_references')
      .select('*')
      .eq('source_book', book)
      .eq('source_chapter', chapter);

    if (verse > 0) {
      query = query.eq('source_verse', verse);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des références croisées:', error);
    throw error;
  }
};

export const getWordDefinition = async (word: string) => {
  try {
    const cleanWord = word.toLowerCase().trim().replace(/[.,;:!?]$/, '');

    const { data, error } = await supabase
      .from('dictionary')
      .select('*')
      .eq('word', cleanWord)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération de la définition:', error);
    throw error;
  }
};

export const getNotes = async (verseId: string) => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('verse_id', verseId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des notes:', error);
    throw error;
  }
};

export const saveNote = async (verseId: string, text: string) => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .insert([{ verse_id: verseId, text }]);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la note:', error);
    throw error;
  }
};