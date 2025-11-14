import { useNavigate } from 'react-router-dom';
import { useNoteCreate } from '@/domain/note/hooks/useNoteCreate';
import { NoteForm } from '@/domain/note/components/NoteForm';
import type { CreateNoteDto } from '@/domain/note/types';

export const NoteCreatePage = () => {
  const navigate = useNavigate();
  const { createNote, isCreating } = useNoteCreate();

  const handleSubmit = async (data: CreateNoteDto) => {
    try {
      await createNote(data);
      navigate('/notes');
    } catch (error: unknown) {
      console.error('Erro ao criar nota:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/notes')}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Voltar para lista
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Nova Nota</h1>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <NoteForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/notes')}
          isSubmitting={isCreating}
        />
      </div>
    </div>
  );
};

export default NoteCreatePage;
