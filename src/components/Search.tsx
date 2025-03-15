import { useState } from 'react';
import { useQuery } from 'react-query';
import { supabase } from '../services/supabase';
import { Verse } from '../types';
import { useNavigate } from 'react-router-dom';
import { useBibleStore } from '../store/bibleStore';

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { setCurrentReference } = useBibleStore();

  const { data: results, isLoading } = useQuery<Verse[]>(
    ['search', searchTerm],
    async () => {
      if (!searchTerm.trim()) return [];
      
      const { data, error } = await supabase
        .from('verses')
        .select('*')
        .ilike('text', `%${searchTerm}%`)
        .limit(20);

      if (error) throw error;
      return data;
    },
    {
      enabled: searchTerm.length > 2,
    }
  );

  const handleVerseClick = (verse: Verse) => {
    setCurrentReference({
      book: verse.book,
      chapter: verse.chapter,
      verse: verse.verse,
    });
    navigate('/book');
  };

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      <div className="mb-6">
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher dans la Bible..."
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {isLoading && searchTerm.length > 2 && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      <div className="space-y-4">
        {results?.map((verse) => (
          <button
            key={verse.id}
            onClick={() => handleVerseClick(verse)}
            className="w-full text-left p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="font-semibold text-blue-600 mb-2">
              {verse.book} {verse.chapter}:{verse.verse}
            </div>
            <p className="text-gray-700">{verse.text}</p>
          </button>
        ))}
      </div>

      {searchTerm.length > 2 && results?.length === 0 && !isLoading && (
        <div className="text-center text-gray-500 mt-8">
          Aucun résultat trouvé pour "{searchTerm}"
        </div>
      )}
    </div>
  );
}

export default Search;