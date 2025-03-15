import { useBibleStore } from '../store/bibleStore';
import { Book } from '../types';

const books: Book[] = [
  { id: 'GEN', name: 'Genèse', chaptersCount: 50 },
  { id: 'EXO', name: 'Exode', chaptersCount: 40 },
  // Ajoutez les autres livres ici
];

function BookSelector() {
  const { currentReference, setCurrentReference } = useBibleStore();

  const handleBookChange = (bookName: string) => {
    setCurrentReference({
      ...currentReference,
      book: bookName,
      chapter: 1,
      verse: 1,
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Sélectionner un livre</h2>
      <div className="grid grid-cols-2 gap-2">
        {books.map((book) => (
          <button
            key={book.id}
            onClick={() => handleBookChange(book.name)}
            className={`p-2 rounded ${
              currentReference.book === book.name
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100'
            }`}
          >
            {book.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default BookSelector;