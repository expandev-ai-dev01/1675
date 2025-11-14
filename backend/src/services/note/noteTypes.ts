/**
 * @interface NoteEntity
 * @description Represents a note entity in the system
 *
 * @property {number} idNote - Unique note identifier
 * @property {number} idAccount - Associated account identifier
 * @property {string} titulo - Note title (3-100 characters)
 * @property {string} conteudo - Note content (1-5000 characters)
 * @property {string} cor - Hexadecimal color code for visual categorization
 * @property {Date} dataCriacao - Creation timestamp
 * @property {Date | null} dataAtualizacao - Last modification timestamp
 */
export interface NoteEntity {
  idNote: number;
  idAccount: number;
  titulo: string;
  conteudo: string;
  cor: string;
  dataCriacao: Date;
  dataAtualizacao: Date | null;
}

/**
 * @interface NoteCreateRequest
 * @description Request parameters for creating a new note
 *
 * @property {number} idAccount - Account identifier
 * @property {string} titulo - Note title
 * @property {string} conteudo - Note content
 * @property {string} [cor] - Optional color code (defaults to #FFFFFF)
 */
export interface NoteCreateRequest {
  idAccount: number;
  titulo: string;
  conteudo: string;
  cor?: string;
}

/**
 * @interface NoteUpdateRequest
 * @description Request parameters for updating an existing note
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idNote - Note identifier
 * @property {string} titulo - Updated note title
 * @property {string} conteudo - Updated note content
 * @property {string} cor - Updated color code
 */
export interface NoteUpdateRequest {
  idAccount: number;
  idNote: number;
  titulo: string;
  conteudo: string;
  cor: string;
}

/**
 * @interface NoteListRequest
 * @description Request parameters for listing notes
 *
 * @property {number} idAccount - Account identifier
 * @property {string} [filtroCor] - Optional color filter
 * @property {string} [ordem] - Sort order (data_criacao_asc, data_criacao_desc, titulo_asc, titulo_desc)
 */
export interface NoteListRequest {
  idAccount: number;
  filtroCor?: string;
  ordem?: string;
}

/**
 * @interface NoteGetRequest
 * @description Request parameters for retrieving a specific note
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idNote - Note identifier
 */
export interface NoteGetRequest {
  idAccount: number;
  idNote: number;
}

/**
 * @interface NoteDeleteRequest
 * @description Request parameters for deleting a note
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idNote - Note identifier
 */
export interface NoteDeleteRequest {
  idAccount: number;
  idNote: number;
}

/**
 * @interface NoteCreateResult
 * @description Result of note creation operation
 *
 * @property {number} idNote - Generated note identifier
 */
export interface NoteCreateResult {
  idNote: number;
}

/**
 * @interface NoteOperationResult
 * @description Result of note update or delete operation
 *
 * @property {number} idNote - Affected note identifier
 */
export interface NoteOperationResult {
  idNote: number;
}
