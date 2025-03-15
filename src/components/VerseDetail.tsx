import { useState } from 'react';
import { useQuery } from 'react-query';
import { Verse, WordDefinition } from '../types';
import { FaArrowLeft, FaShare, FaChevronLeft, FaChevronRight, FaCheck } from 'react-icons/fa';
import { getWordDefinition } from '../services/supabase';

interface VerseDetailProps {
  verse: Verse;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

function VerseDetail({ verse, onClose, onNavigate }: VerseDetailProps) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  const { data: definition, isLoading } = useQuery<WordDefinition | null>(
    ['definition', selectedWord],
    async () => {
      if (!selectedWord) return null;
      return getWordDefinition(selectedWord);
    },
    {
      enabled: !!selectedWord,
    }
  );

  const handleShare = async () => {
    const shareText = `${verse.book} ${verse.chapter}:${verse.verse} - ${verse.text}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${verse.book} ${verse.chapter}:${verse.verse}`,
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        setShowCopiedMessage(true);
        setTimeout(() => setShowCopiedMessage(false), 2000);
      }
    } catch (error) {
      console.error('Sharing failed:', error);
    }
  };

  const handleWordClick = (word: string) => {
    const cleanWord = word.replace(/[.,;:!?]$/, '').toLowerCase();
    setSelectedWord(cleanWord);
  };

  const renderVerseText = () => {
    return verse.text.split(' ').map((word, index) => (
      <span key={index} className="inline-block">
        <button
          onClick={() => handleWordClick(word)}
          className={`px-0.5 rounded transition-colors hover:bg-blue-100 ${
            selectedWord === word.replace(/[.,;:!?]$/, '').toLowerCase()
              ? 'bg-blue-100 text-blue-700' 
              : ''
          }`}
        >
          {word}
        </button>
        {index < verse.text.split(' ').length - 1 ? ' ' : ''}
      </span>
    ));
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      {/* En-tête */}
      <header className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <FaArrowLeft className="text-gray-600" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800">
          {verse.book} {verse.chapter}:{verse.verse}
        </h2>
        <div className="relative">
          <button
            onClick={handleShare}
            className="p-2 hover:bg-blue-50 rounded-full text-blue-500"
            title={navigator.share ? "Partager" : "Copier"}
          >
            {showCopiedMessage ? <FaCheck /> : <FaShare />}
          </button>
          {showCopiedMessage && (
            <div className="absolute right-0 top-full mt-2 px-3 py-1 bg-gray-800 text-white text-sm rounded shadow-lg whitespace-nowrap">
              Copié !
            </div>
          )}
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Verset exploité */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <p className="text-xl leading-relaxed text-gray-700">
            {renderVerseText()}
          </p>
        </div>

        {/* Dictionnaire */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Dictionnaire biblique</h3>
          </div>
          
          {selectedWord ? (
            <div className="p-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : definition ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700">Mot sélectionné</h4>
                    <p className="text-xl text-blue-600 mt-1">{definition.word}</p>
                  </div>
                  
                  {definition.hebrew_origin && (
                    <div>
                      <h4 className="font-medium text-gray-700">Hébreu</h4>
                      <div className="mt-1 space-y-1">
                        <p className="text-lg font-hebrew">{definition.hebrew_origin}</p>
                        {definition.transliteration && (
                          <p className="text-sm text-gray-600">
                            Translittération: {definition.transliteration}
                          </p>
                        )}
                        {definition.strong_number && (
                          <p className="text-sm text-gray-600">
                            Strong: {definition.strong_number}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium text-gray-700">Définition</h4>
                    <p className="text-gray-600 mt-1 leading-relaxed">
                      {definition.definition}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Aucune définition trouvée pour "{selectedWord}"
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Cliquez sur un mot du verset pour voir sa définition
            </div>
          )}
        </div>

        {/* Navigation entre versets */}
        <div className="flex justify-center space-x-8 mt-8">
          <button
            onClick={() => onNavigate('prev')}
            className="p-3 hover:bg-gray-100 rounded-full text-gray-600"
            title="Verset précédent"
          >
            <FaChevronLeft size={24} />
          </button>
          <button
            onClick={() => onNavigate('next')}
            className="p-3 hover:bg-gray-100 rounded-full text-gray-600"
            title="Verset suivant"
          >
            <FaChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerseDetail;