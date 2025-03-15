export interface Verse {
  id: number;
  book: string | null;
  chapter: number | null;
  verse: number | null;
  text: string | null;
  created_at: string;
}

export interface BibleReference {
  book: string;
  chapter: number;
  verse: number;
}

export interface Note {
  id: string;
  verse_id: string;
  text: string;
  created_at: string;
}

export interface Book {
  id: string;
  name: string;
  chaptersCount: number;
  testament: 'old' | 'new';
}

export interface CrossReference {
  id: string;
  source_book: string;
  source_chapter: number;
  source_verse: number;
  target_book: string;
  target_chapter: number;
  target_verse: string;
  created_at: string;
}

export interface WordDefinition {
  id: string;
  word: string;
  definition: string;
  hebrew_origin?: string;
  transliteration?: string;
  strong_number?: string;
  created_at: string;
}