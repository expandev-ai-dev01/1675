import { useMutation, useQueryClient } from '@tanstack/react-query';
import { noteService } from '../../services/noteService';
import type { UseNoteUpdateReturn } from './types';

export const useNoteUpdate = (): UseNoteUpdateReturn => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => noteService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['note'] });
    },
  });

  return {
    updateNote: (id, data) => mutateAsync({ id, data }),
    isUpdating: isPending,
    error: error as Error | null,
  };
};
