export interface UseNoteDeleteReturn {
  deleteNote: (id: number) => Promise<{ idNote: number }>;
  isDeleting: boolean;
  error: Error | null;
}
