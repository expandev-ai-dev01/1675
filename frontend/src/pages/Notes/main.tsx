import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNoteList } from '@/domain/note/hooks/useNoteList';
import { useNoteDelete } from '@/domain/note/hooks/useNoteDelete';
import { NoteCard } from '@/domain/note/components/NoteCard';
import { ColorFilter } from '@/domain/note/components/ColorFilter';
import { SortSelector, SortOrder } from '@/domain/note/components/SortSelector';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';

export const NotesPage = () => {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<SortOrder>('data_criacao_desc');

  const { notes, isLoading, error, refetch } = useNoteList({
    filters: {
      filtroCor: selectedColor,
      ordem: sortOrder,
    },
  });

  const { deleteNote, isDeleting } = useNoteDelete();

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta nota?')) {
      try {
        await deleteNote(id);
        refetch();
      } catch (error: unknown) {
        console.error('Erro ao excluir nota:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar notas</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Minhas Notas</h1>
        <button
          onClick={() => navigate('/notes/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Nova Nota
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <ColorFilter selectedColor={selectedColor} onColorChange={setSelectedColor} />
        <SortSelector value={sortOrder} onChange={setSortOrder} />
      </div>

      {notes && notes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhuma nota encontrada</p>
          <button
            onClick={() => navigate('/notes/new')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Criar primeira nota
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes?.map((note) => (
            <NoteCard
              key={note.idNote}
              note={note}
              onEdit={(id) => navigate(`/notes/${id}/edit`)}
              onDelete={handleDelete}
              onClick={(id) => navigate(`/notes/${id}`)}
            />
          ))}
        </div>
      )}

      {isDeleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      )}
    </div>
  );
};

export default NotesPage;
