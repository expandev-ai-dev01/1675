import { useParams, useNavigate } from 'react-router-dom';
import { useNoteDetail } from '@/domain/note/hooks/useNoteDetail';
import { useNoteUpdate } from '@/domain/note/hooks/useNoteUpdate';
import { NoteForm } from '@/domain/note/components/NoteForm';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import type { UpdateNoteDto } from '@/domain/note/types';

export const NoteEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const noteId = parseInt(id || '0', 10);

  const { note, isLoading, error } = useNoteDetail({ id: noteId });
  const { updateNote, isUpdating } = useNoteUpdate();

  const handleSubmit = async (data: UpdateNoteDto) => {
    try {
      await updateNote(noteId, data);
      navigate(`/notes/${noteId}`);
    } catch (error: unknown) {
      console.error('Erro ao atualizar nota:', error);
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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(`/notes/${noteId}`)}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Voltar para nota
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Editar Nota</h1>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <NoteForm
          initialData={{
            titulo: note.titulo,
            conteudo: note.conteudo,
            cor: note.cor,
          }}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/notes/${noteId}`)}
          isSubmitting={isUpdating}
        />
      </div>
    </div>
  );
};

export default NoteEditPage;
