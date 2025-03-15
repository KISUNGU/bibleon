import { getBibleData as getDataFromDb } from './database';
import { Verse } from '../types';

export const getBibleVerses = (book: string, chapter: number): Verse[] => {
  try {
    return getDataFromDb(book, chapter);
  } catch (error) {
    console.error('Erreur lors du chargement des versets:', error);
    return [];
  }
};