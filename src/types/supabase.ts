export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      verse: {
        Row: {
          id: number
          book: string | null
          chapter: number | null
          verse: number | null
          text: string | null
          created_at: string
        }
        Insert: {
          id?: number
          book?: string | null
          chapter?: number | null
          verse?: number | null
          text?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          book?: string | null
          chapter?: number | null
          verse?: number | null
          text?: string | null
          created_at?: string
        }
      }
      dictionary: {
        Row: {
          id: string
          word: string
          definition: string
          testament: string
          hebrew_origin: string | null
          greek_origin: string | null
          transliteration: string | null
          strong_number: string | null
          created_at: string
        }
        Insert: {
          id?: string
          word: string
          definition: string
          testament: string
          hebrew_origin?: string | null
          greek_origin?: string | null
          transliteration?: string | null
          strong_number?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          word?: string
          definition?: string
          testament?: string
          hebrew_origin?: string | null
          greek_origin?: string | null
          transliteration?: string | null
          strong_number?: string | null
          created_at?: string
        }
      }
    }
  }
}