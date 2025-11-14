import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useNoteDetail } from '@/domain/note/hooks/useNoteDetail';
import { useNoteDelete } from '@/domain/note/hooks/useNoteDelete';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';

export const NoteDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const noteId = parseInt(id || '0', 10);

  const { note, isLoading, error } = useNoteDetail({ id: noteId });
  const { deleteNote, isDeleting } = useNoteDelete();

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir esta nota?')) {
      try {
        await deleteNote(noteId);
        navigate('/notes');
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

  if (error || !note) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Nota não encontrada</p>
          <button
            onClick={() => navigate('/notes')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Voltar para lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/notes')}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Voltar para lista
        </button>
      </div>

      <div className="rounded-lg border-2 p-6" style={{ backgroundColor: note.cor }}>
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{note.titulo}</h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/notes/${noteId}/edit`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Editar
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-700 whitespace-pre-wrap">{note.conteudo}</p>
        </div>

        <div className="text-sm text-gray-600 space-y-1">
          <p>Criado em: {format(new Date(note.dataCriacao), 'dd/MM/yyyy HH:mm')}</p>
          {note.dataAtualizacao && (
            <p>Atualizado em: {format(new Date(note.dataAtualizacao), 'dd/MM/yyyy HH:mm')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;
