import { useQuery } from '@tanstack/react-query';
import { noteService } from '../../services/noteService';
import type { UseNoteListOptions, UseNoteListReturn } from './types';

export const useNoteList = (options: UseNoteListOptions = {}): UseNoteListReturn => {
  const { filters } = options;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['notes', filters],
    queryFn: () => noteService.list(filters),
  });

  return {
    notes: data,
    isLoading,
    error: error as Error | null,
    refetch,
  };
};
