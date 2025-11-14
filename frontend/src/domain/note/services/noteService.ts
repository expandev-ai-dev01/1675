import { authenticatedClient } from '@/core/lib/api';
import type { Note, CreateNoteDto, UpdateNoteDto, NoteListParams } from '../types';
import type { ApiResponse } from '@/core/types';

export const noteService = {
  async list(params?: NoteListParams): Promise<Note[]> {
    const response = await authenticatedClient.get<ApiResponse<Note[]>>('/note', { params });
    return response.data.data;
  },

  async getById(id: number): Promise<Note> {
    const response = await authenticatedClient.get<ApiResponse<Note>>(`/note/${id}`);
    return response.data.data;
  },

  async create(data: CreateNoteDto): Promise<{ idNote: number }> {
    const response = await authenticatedClient.post<ApiResponse<{ idNote: number }>>('/note', data);
    return response.data.data;
  },

  async update(id: number, data: UpdateNoteDto): Promise<{ idNote: number }> {
    const response = await authenticatedClient.put<ApiResponse<{ idNote: number }>>(
      `/note/${id}`,
      data
    );
    return response.data.data;
  },

  async delete(id: number): Promise<{ idNote: number }> {
    const response = await authenticatedClient.delete<ApiResponse<{ idNote: number }>>(
      `/note/${id}`
    );
    return response.data.data;
  },
};
