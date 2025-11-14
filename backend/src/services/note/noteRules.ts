/**
 * @summary
 * Business logic services for note management operations.
 * Handles CRUD operations by calling stored procedures.
 *
 * @module noteRules
 */
import { dbRequest, ExpectedReturn } from '@/utils/database';
import {
  NoteCreateRequest,
  NoteUpdateRequest,
  NoteListRequest,
  NoteGetRequest,
  NoteDeleteRequest,
  NoteEntity,
  NoteCreateResult,
  NoteOperationResult,
} from './noteTypes';

/**
 * @summary
 * Creates a new note with the specified parameters.
 *
 * @function noteCreate
 * @module note
 *
 * @param {NoteCreateRequest} params - Note creation parameters
 * @param {number} params.idAccount - Account identifier
 * @param {string} params.titulo - Note title
 * @param {string} params.conteudo - Note content
 * @param {string} [params.cor] - Optional color code
 *
 * @returns {Promise<NoteCreateResult>} Created note identifier
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {BusinessRuleError} When business rules are violated
 * @throws {DatabaseError} When database operation fails
 *
 * @example
 * const result = await noteCreate({
 *   idAccount: 1,
 *   titulo: 'My First Note',
 *   conteudo: 'This is the content of my note',
 *   cor: '#FF5733'
 * });
 */
export async function noteCreate(params: NoteCreateRequest): Promise<NoteCreateResult> {
  const result = await dbRequest(
    '[functional].[spNoteCreate]',
    {
      idAccount: params.idAccount,
      titulo: params.titulo,
      conteudo: params.conteudo,
      cor: params.cor || '#FFFFFF',
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Lists all notes for an account with optional filtering and ordering.
 *
 * @function noteList
 * @module note
 *
 * @param {NoteListRequest} params - List parameters
 * @param {number} params.idAccount - Account identifier
 * @param {string} [params.filtroCor] - Optional color filter
 * @param {string} [params.ordem] - Sort order
 *
 * @returns {Promise<NoteEntity[]>} Array of notes
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 *
 * @example
 * const notes = await noteList({
 *   idAccount: 1,
 *   filtroCor: '#FF5733',
 *   ordem: 'data_criacao_desc'
 * });
 */
export async function noteList(params: NoteListRequest): Promise<NoteEntity[]> {
  const result = await dbRequest(
    '[functional].[spNoteList]',
    {
      idAccount: params.idAccount,
      filtroCor: params.filtroCor || null,
      ordem: params.ordem || 'data_criacao_desc',
    },
    ExpectedReturn.Multi
  );

  return result;
}

/**
 * @summary
 * Retrieves a specific note by its identifier.
 *
 * @function noteGet
 * @module note
 *
 * @param {NoteGetRequest} params - Get parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idNote - Note identifier
 *
 * @returns {Promise<NoteEntity>} Note details
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {NotFoundError} When note does not exist
 * @throws {DatabaseError} When database operation fails
 *
 * @example
 * const note = await noteGet({
 *   idAccount: 1,
 *   idNote: 123
 * });
 */
export async function noteGet(params: NoteGetRequest): Promise<NoteEntity> {
  const result = await dbRequest(
    '[functional].[spNoteGet]',
    {
      idAccount: params.idAccount,
      idNote: params.idNote,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Updates an existing note with new values.
 *
 * @function noteUpdate
 * @module note
 *
 * @param {NoteUpdateRequest} params - Update parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idNote - Note identifier
 * @param {string} params.titulo - Updated title
 * @param {string} params.conteudo - Updated content
 * @param {string} params.cor - Updated color code
 *
 * @returns {Promise<NoteOperationResult>} Updated note identifier
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {NotFoundError} When note does not exist
 * @throws {BusinessRuleError} When business rules are violated
 * @throws {DatabaseError} When database operation fails
 *
 * @example
 * const result = await noteUpdate({
 *   idAccount: 1,
 *   idNote: 123,
 *   titulo: 'Updated Title',
 *   conteudo: 'Updated content',
 *   cor: '#00FF00'
 * });
 */
export async function noteUpdate(params: NoteUpdateRequest): Promise<NoteOperationResult> {
  const result = await dbRequest(
    '[functional].[spNoteUpdate]',
    {
      idAccount: params.idAccount,
      idNote: params.idNote,
      titulo: params.titulo,
      conteudo: params.conteudo,
      cor: params.cor,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Permanently deletes a note from the system.
 *
 * @function noteDelete
 * @module note
 *
 * @param {NoteDeleteRequest} params - Delete parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idNote - Note identifier
 *
 * @returns {Promise<NoteOperationResult>} Deleted note identifier
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {NotFoundError} When note does not exist
 * @throws {DatabaseError} When database operation fails
 *
 * @example
 * const result = await noteDelete({
 *   idAccount: 1,
 *   idNote: 123
 * });
 */
export async function noteDelete(params: NoteDeleteRequest): Promise<NoteOperationResult> {
  const result = await dbRequest(
    '[functional].[spNoteDelete]',
    {
      idAccount: params.idAccount,
      idNote: params.idNote,
    },
    ExpectedReturn.Single
  );

  return result;
}
