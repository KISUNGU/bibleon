import { useState } from 'react';
import { useBibleStore } from '../store/bibleStore';
import { getBibleData, getCrossReferences } from '../services/supabase';
import { Verse, Book, CrossReference } from '../types';
import { FaChevronDown, FaChevronUp, FaChevronLeft, FaChevronRight, FaBook, FaDownload } from 'react-icons/fa';
import { BIBLE_BOOKS } from '../data/bibleStructure';
import { useQuery } from 'react-query';
import VerseDetail from './VerseDetail';

function BibleViewer() {
  const { currentReference, setCurrentReference } = useBibleStore();
  const [expandedReferences, setExpandedReferences] = useState<Set<string>>(new Set());
  const [isSelectingBook, setIsSelectingBook] = useState(false);
  const [isSelectingChapter, setIsSelectingChapter] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [selectedTestament, setSelectedTestament] = useState<'old' | 'new' | null>(null);
  
  const { data: verses, isPreviousData, isLoading, error } = useQuery<Verse[]>(
    ['verses', currentReference.book, currentReference.chapter],
    () => getBibleData(currentReference.book, currentReference.chapter),
    {
      keepPreviousData: true,
      staleTime: 5000,
      retry: 3,
      refetchOnWindowFocus: false
    }
  );

  const { data: allReferences } = useQuery<CrossReference[]>(
    ['allRefs', currentReference.book, currentReference.chapter],
    () => getCrossReferences(currentReference.book, currentReference.chapter, 0),
    {
      enabled: !!verses?.length,
      staleTime: 5000
    }
  );

  const { data: referenceVerses } = useQuery<Verse[]>(
    ['referenceVerses', expandedReferences],
    async () => {
      if (expandedReferences.size === 0) return [];
      const promises = Array.from(expandedReferences).map(async (refId) => {
        const ref = allReferences?.find(r => r.id === refId);
        if (!ref) return null;
        const verses = await getBibleData(ref.target_book, ref.target_chapter);
        return verses?.find(v => v.verse === parseInt(ref.target_verse, 10));
      });
      const results = await Promise.all(promises);
      return results.filter((v): v is Verse => v !== null);
    },
    {
      enabled: expandedReferences.size > 0,
    }
  );

  const currentBook = BIBLE_BOOKS.find(book => book.name === currentReference.book);

  const navigateChapter = (direction: 'prev' | 'next') => {
    if (!currentBook) return;
    
    const newChapter = direction === 'next' 
      ? currentReference.chapter + 1 
      : currentReference.chapter - 1;

    if (newChapter > 0 && newChapter <= currentBook.chaptersCount) {
      setCurrentReference({
        ...currentReference,
        chapter: newChapter,
        verse: 1
      });
      setExpandedReferences(new Set());
    } else if (direction === 'next' && newChapter > currentBook.chaptersCount) {
      // Trouver le prochain livre dans le même testament
      const currentTestament = currentBook.testament;
      const nextBook = BIBLE_BOOKS.find(
        book => book.testament === currentTestament && 
        BIBLE_BOOKS.indexOf(book) > BIBLE_BOOKS.indexOf(currentBook)
      );
      
      if (nextBook) {
        setCurrentReference({
          book: nextBook.name,
          chapter: 1,
          verse: 1
        });
      }
    } else if (direction === 'prev' && newChapter < 1) {
      // Trouver le livre précédent dans le même testament
      const currentTestament = currentBook.testament;
      const prevBook = [...BIBLE_BOOKS]
        .reverse()
        .find(
          book => book.testament === currentTestament && 
          BIBLE_BOOKS.indexOf(book) < BIBLE_BOOKS.indexOf(currentBook)
        );
      
      if (prevBook) {
        setCurrentReference({
          book: prevBook.name,
          chapter: prevBook.chaptersCount,
          verse: 1
        });
      }
    }
  };

  const navigateVerse = (direction: 'prev' | 'next') => {
    if (!verses) return;
    const currentIndex = verses.findIndex(v => v.verse === currentReference.verse);
    if (direction === 'next' && currentIndex < verses.length - 1) {
      setCurrentReference({
        ...currentReference,
        verse: verses[currentIndex + 1].verse
      });
    } else if (direction === 'prev' && currentIndex > 0) {
      setCurrentReference({
        ...currentReference,
        verse: verses[currentIndex - 1].verse
      });
    }
  };

  const navigateDetailVerse = (direction: 'prev' | 'next') => {
    if (!verses || !selectedVerse) return;
    const currentIndex = verses.findIndex(v => v.id === selectedVerse.id);
    if (direction === 'next' && currentIndex < verses.length - 1) {
      setSelectedVerse(verses[currentIndex + 1]);
    } else if (direction === 'prev' && currentIndex > 0) {
      setSelectedVerse(verses[currentIndex - 1]);
    }
  };

  const handleBookSelect = (book: Book) => {
    setCurrentReference({
      book: book.name,
      chapter: 1,
      verse: 1
    });
    setIsSelectingBook(false);
    setSelectedTestament(null);
    setExpandedReferences(new Set());
  };

  const handleChapterSelect = (chapter: number) => {
    setCurrentReference({
      ...currentReference,
      chapter,
      verse: 1
    });
    setIsSelectingChapter(false);
    setExpandedReferences(new Set());
  };

  return (
    <div className="max-w-screen-xl mx-auto">
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateVerse('prev')}
              disabled={currentReference.verse <= 1}
              className="p-1 rounded-full hover:bg-gray-100/50 disabled:opacity-30 disabled:cursor-not-allowed text-gray-500/80"
            >
              <FaChevronLeft size={16} />
            </button>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => {
                  setIsSelectingBook(true);
                  setIsSelectingChapter(false);
                  setSelectedTestament(null);
                }}
                className="flex items-center space-x-1 hover:bg-gray-100/50 rounded px-2 py-1"
              >
                <FaBook className="text-gray-500" size={14} />
                <span className="text-xl font-semibold text-gray-800">
                  {currentReference.book}
                </span>
                <FaChevronDown className="text-gray-500" size={14} />
              </button>
              <button
                onClick={() => {
                  setIsSelectingChapter(true);
                  setIsSelectingBook(false);
                }}
                className="flex items-center space-x-1 hover:bg-gray-100/50 rounded px-2 py-1"
              >
                <span className="text-xl font-semibold text-gray-800">
                  {currentReference.chapter}:{currentReference.verse}
                </span>
                <FaChevronDown className="text-gray-500" size={14} />
              </button>
            </div>

            <button
              onClick={() => navigateVerse('next')}
              disabled={!verses || currentReference.verse >= verses.length}
              className="p-1 rounded-full hover:bg-gray-100/50 disabled:opacity-30 disabled:cursor-not-allowed text-gray-500/80"
            >
              <FaChevronRight size={16} />
            </button>
          </div>

          <div className="text-sm text-gray-500">Louis Segond 1910</div>
        </div>

        {isSelectingBook && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 w-64 z-50">
            {!selectedTestament ? (
              <div className="p-2 space-y-2">
                <button
                  onClick={() => setSelectedTestament('old')}
                  className="w-full text-left px-4 py-3 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                >
                  <h3 className="font-semibold text-amber-900">Ancien Testament</h3>
                  <p className="text-sm text-amber-700">39 livres</p>
                </button>
                <button
                  onClick={() => setSelectedTestament('new')}
                  className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <h3 className="font-semibold text-blue-900">Nouveau Testament</h3>
                  <p className="text-sm text-blue-700">27 livres</p>
                </button>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto p-2">
                <div className="flex items-center justify-between mb-2 pb-2 border-b">
                  <h3 className="font-semibold text-gray-700">
                    {selectedTestament === 'old' ? 'Ancien Testament' : 'Nouveau Testament'}
                  </h3>
                  <button
                    onClick={() => setSelectedTestament(null)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Retour
                  </button>
                </div>
                <div className="space-y-1">
                  {BIBLE_BOOKS
                    .filter(book => book.testament === selectedTestament)
                    .map(book => (
                      <button
                        key={book.id}
                        onClick={() => handleBookSelect(book)}
                        className={`w-full text-left px-3 py-2 rounded text-sm ${
                          book.name === currentReference.book
                            ? 'bg-blue-100 text-blue-700'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {book.name}
                      </button>
                    ))
                  }
                </div>
              </div>
            )}
          </div>
        )}

        {isSelectingChapter && currentBook && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 w-64 z-50">
            <div className="max-h-96 overflow-y-auto p-2">
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: currentBook.chaptersCount }, (_, i) => i + 1).map(chapter => (
                  <button
                    key={chapter}
                    onClick={() => handleChapterSelect(chapter)}
                    className={`p-2 text-center rounded hover:bg-gray-100 ${
                      chapter === currentReference.chapter ? 'bg-blue-100 text-blue-700' : ''
                    }`}
                  >
                    {chapter}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
      
      <div className="px-4 py-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            Une erreur est survenue lors du chargement des versets.
          </div>
        ) : verses && verses.length > 0 ? (
          <div className={`space-y-0.5 transition-opacity duration-300 ${isPreviousData ? 'opacity-50' : 'opacity-100'}`}>
            {verses.map((verse) => {
              const verseRefs = allReferences?.filter(
                ref => 
                  ref.source_book === verse.book && 
                  ref.source_chapter === verse.chapter && 
                  ref.source_verse === verse.verse
              );
              const referencesCount = verseRefs?.length || 0;

              return (
                <div
                  key={verse.id}
                  className={`bg-white/80 backdrop-blur-sm transition-all ${
                    verse.verse === currentReference.verse ? 'ring-1 ring-blue-500/50' : ''
                  }`}
                >
                  <div className="flex items-start p-2">
                    <span className="flex items-center justify-center min-w-[2rem] h-6 mr-2 rounded bg-gray-100/70 text-gray-600">
                      {verse.verse}
                    </span>
                    <button
                      onClick={() => setSelectedVerse(verse)}
                      className="text-gray-700 leading-relaxed flex-1 text-left hover:text-blue-600"
                    >
                      {verse.text}
                    </button>
                    {referencesCount > 0 && (
                      <button
                        onClick={() => {
                          const newSet = new Set(expandedReferences);
                          if (verseRefs) {
                            verseRefs.forEach(ref => {
                              if (expandedReferences.has(ref.id)) {
                                newSet.delete(ref.id);
                              } else {
                                newSet.add(ref.id);
                              }
                            });
                          }
                          setExpandedReferences(newSet);
                        }}
                        className="ml-2 px-2 py-1 text-sm bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors flex items-center"
                      >
                        {referencesCount}
                        <span className="ml-1">
                          {verseRefs?.some(ref => expandedReferences.has(ref.id)) ? (
                            <FaChevronUp size={10} />
                          ) : (
                            <FaChevronDown size={10} />
                          )}
                        </span>
                      </button>
                    )}
                  </div>

                  {verseRefs?.some(ref => expandedReferences.has(ref.id)) && (
                    <div className="px-3 pb-3 pt-1 border-t border-gray-100/50">
                      <div className="bg-gray-50/70 p-2 rounded text-sm">
                        <div className="space-y-2">
                          {verseRefs.map(ref => (
                            <div key={ref.id} className="bg-white/50 rounded p-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-blue-600">
                                  {ref.target_book} {ref.target_chapter}:{ref.target_verse}
                                </span>
                              </div>
                              {expandedReferences.has(ref.id) && referenceVerses?.map(refVerse => (
                                refVerse && ref.target_book === refVerse.book &&
                                ref.target_chapter === refVerse.chapter &&
                                parseInt(ref.target_verse, 10) === refVerse.verse && (
                                  <p key={refVerse.id} className="text-gray-600 text-sm mt-1">
                                    {refVerse.text}
                                  </p>
                                )
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Aucun verset trouvé pour {currentReference.book} {currentReference.chapter}
          </div>
        )}
      </div>

      <footer className="fixed bottom-16 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <div className="flex items-center justify-between p-2 max-w-screen-xl mx-auto">
          <button
            onClick={() => navigateChapter('prev')}
            disabled={currentReference.chapter <= 1}
            className="px-3 py-1.5 bg-blue-500/80 hover:bg-blue-600/80 text-white text-sm rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <div className="flex items-center">
              <FaChevronLeft className="mr-1" size={12} />
              <span>Précédent</span>
            </div>
          </button>

          <button
            onClick={() => setShowDownloadOptions(!showDownloadOptions)}
            className="px-3 py-1.5 bg-green-500/80 hover:bg-green-600/80 text-white text-sm rounded transition-colors flex items-center"
          >
            <FaDownload className="mr-1" size={12} />
            <span>Télécharger</span>
          </button>

          <button
            onClick={() => navigateChapter('next')}
            disabled={!currentBook || currentReference.chapter >= currentBook.chaptersCount}
            className="px-3 py-1.5 bg-blue-500/80 hover:bg-blue-600/80 text-white text-sm rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <div className="flex items-center">
              <span>Suivant</span>
              <FaChevronRight className="ml-1" size={12} />
            </div>
          </button>
        </div>
      </footer>

      {selectedVerse && (
        <VerseDetail
          verse={selectedVerse}
          onClose={() => setSelectedVerse(null)}
          onNavigate={navigateDetailVerse}
        />
      )}
    </div>
  );
}

export default BibleViewer;