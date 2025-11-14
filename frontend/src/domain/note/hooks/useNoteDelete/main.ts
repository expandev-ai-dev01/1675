import { useMutation, useQueryClient } from '@tanstack/react-query';
import { noteService } from '../../services/noteService';
import type { UseNoteDeleteReturn } from './types';

export const useNoteDelete = (): UseNoteDeleteReturn => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: noteService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  return {
    deleteNote: mutateAsync,
    isDeleting: isPending,
    error: error as Error | null,
  };
};
