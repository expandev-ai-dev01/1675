import { useQuery } from '@tanstack/react-query';
import { noteService } from '../../services/noteService';
import type { UseNoteDetailOptions, UseNoteDetailReturn } from './types';

export const useNoteDetail = (options: UseNoteDetailOptions): UseNoteDetailReturn => {
  const { id } = options;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['note', id],
    queryFn: () => noteService.getById(id),
    enabled: !!id,
  });

  return {
    note: data,
    isLoading,
    error: error as Error | null,
    refetch,
  };
};
