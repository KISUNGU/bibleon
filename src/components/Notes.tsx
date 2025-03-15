import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getNotes, saveNote } from '../services/supabase';
import { Note } from '../types';

interface NotesProps {
  verseId: string;
}

function Notes({ verseId }: NotesProps) {
  const [newNote, setNewNote] = useState('');
  const queryClient = useQueryClient();

  const { data: notes } = useQuery<Note[]>(['notes', verseId], () =>
    getNotes(verseId)
  );

  const mutation = useMutation(
    (text: string) => saveNote(verseId, text),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['notes', verseId]);
        setNewNote('');
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim()) {
      mutation.mutate(newNote);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Notes</h2>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Ajouter une note..."
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Sauvegarder
        </button>
      </form>

      <div className="space-y-4">
        {notes?.map((note) => (
          <div key={note.id} className="p-3 bg-gray-100 rounded">
            <p>{note.text}</p>
            <span className="text-sm text-gray-500">
              {new Date(note.created_at).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notes;