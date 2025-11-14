import { useMutation, useQueryClient } from '@tanstack/react-query';
import { noteService } from '../../services/noteService';
import type { UseNoteCreateReturn } from './types';

export const useNoteCreate = (): UseNoteCreateReturn => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: noteService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  return {
    createNote: mutateAsync,
    isCreating: isPending,
    error: error as Error | null,
  };
};
