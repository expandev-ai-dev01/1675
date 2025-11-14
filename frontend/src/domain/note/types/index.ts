export interface Note {
  idNote: number;
  titulo: string;
  conteudo: string;
  cor: string;
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface CreateNoteDto {
  titulo: string;
  conteudo: string;
  cor?: string;
}

export interface UpdateNoteDto {
  titulo: string;
  conteudo: string;
  cor?: string;
}

export interface NoteListParams {
  filtroCor?: string;
  ordem?: 'data_criacao_asc' | 'data_criacao_desc' | 'titulo_asc' | 'titulo_desc';
}
