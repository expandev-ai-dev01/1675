/**
 * @api {get} /api/v1/internal/note List Notes
 * @apiName ListNotes
 * @apiGroup Note
 * @apiVersion 1.0.0
 *
 * @apiDescription Lists all notes for the authenticated account with optional filtering and ordering
 *
 * @apiParam {String} [filtroCor] Optional color filter (hexadecimal format)
 * @apiParam {String} [ordem] Sort order (data_criacao_asc, data_criacao_desc, titulo_asc, titulo_desc)
 *
 * @apiSuccess {Array} data Array of notes
 * @apiSuccess {Number} data.idNote Note identifier
 * @apiSuccess {String} data.titulo Note title
 * @apiSuccess {String} data.conteudo Note content
 * @apiSuccess {String} data.cor Note color code
 * @apiSuccess {Date} data.dataCriacao Creation timestamp
 * @apiSuccess {Date} data.dataAtualizacao Last update timestamp
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { noteList, noteCreate, noteGet, noteUpdate, noteDelete } from '@/services/note';

const securable = 'NOTE';

const listParamsSchema = z.object({
  filtroCor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i)
    .optional(),
  ordem: z.enum(['data_criacao_asc', 'data_criacao_desc', 'titulo_asc', 'titulo_desc']).optional(),
});

export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const [validated, error] = await operation.read(req, listParamsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await noteList({
      ...validated.credential,
      ...validated.params,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {post} /api/v1/internal/note Create Note
 * @apiName CreateNote
 * @apiGroup Note
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new note with the specified parameters
 *
 * @apiParam {String} titulo Note title (3-100 characters)
 * @apiParam {String} conteudo Note content (1-5000 characters)
 * @apiParam {String} [cor] Optional color code (defaults to #FFFFFF)
 *
 * @apiSuccess {Number} idNote Generated note identifier
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
const createBodySchema = z.object({
  titulo: z.string().min(3).max(100),
  conteudo: z.string().min(1).max(5000),
  cor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i)
    .optional(),
});

export async function createHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'CREATE' }]);

  const [validated, error] = await operation.create(req, createBodySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await noteCreate({
      ...validated.credential,
      ...validated.params,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {get} /api/v1/internal/note/:id Get Note
 * @apiName GetNote
 * @apiGroup Note
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves a specific note by its identifier
 *
 * @apiParam {Number} id Note identifier
 *
 * @apiSuccess {Number} idNote Note identifier
 * @apiSuccess {String} titulo Note title
 * @apiSuccess {String} conteudo Note content
 * @apiSuccess {String} cor Note color code
 * @apiSuccess {Date} dataCriacao Creation timestamp
 * @apiSuccess {Date} dataAtualizacao Last update timestamp
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} NotFoundError Note not found
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
const getParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const [validated, error] = await operation.read(req, getParamsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await noteGet({
      ...validated.credential,
      idNote: validated.params.id,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(404).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {put} /api/v1/internal/note/:id Update Note
 * @apiName UpdateNote
 * @apiGroup Note
 * @apiVersion 1.0.0
 *
 * @apiDescription Updates an existing note with new values
 *
 * @apiParam {Number} id Note identifier
 * @apiParam {String} titulo Updated note title (3-100 characters)
 * @apiParam {String} conteudo Updated note content (1-5000 characters)
 * @apiParam {String} cor Updated color code
 *
 * @apiSuccess {Number} idNote Updated note identifier
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} NotFoundError Note not found
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
const updateParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
  titulo: z.string().min(3).max(100),
  conteudo: z.string().min(1).max(5000),
  cor: z.string().regex(/^#[0-9A-F]{6}$/i),
});

export async function updateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'UPDATE' }]);

  const [validated, error] = await operation.update(req, updateParamsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await noteUpdate({
      ...validated.credential,
      idNote: validated.params.id,
      titulo: validated.params.titulo,
      conteudo: validated.params.conteudo,
      cor: validated.params.cor,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {delete} /api/v1/internal/note/:id Delete Note
 * @apiName DeleteNote
 * @apiGroup Note
 * @apiVersion 1.0.0
 *
 * @apiDescription Permanently deletes a note from the system
 *
 * @apiParam {Number} id Note identifier
 *
 * @apiSuccess {Number} idNote Deleted note identifier
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} NotFoundError Note not found
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
const deleteParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'DELETE' }]);

  const [validated, error] = await operation.delete(req, deleteParamsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await noteDelete({
      ...validated.credential,
      idNote: validated.params.id,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(404).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}
