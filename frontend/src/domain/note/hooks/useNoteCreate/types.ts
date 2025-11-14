import type { CreateNoteDto } from '../../types';

export interface UseNoteCreateReturn {
  createNote: (data: CreateNoteDto) => Promise<{ idNote: number }>;
  isCreating: boolean;
  error: Error | null;
}
