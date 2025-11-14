import { Request } from 'express';
import { z } from 'zod';
import { ApiError } from '@/middleware/error';

export interface SecurityCheck {
  securable: string;
  permission: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
}

export interface ValidatedRequest<T = any> {
  credential: {
    idAccount: number;
    idUser: number;
  };
  params: T;
}

export class CrudController {
  private securityChecks: SecurityCheck[];

  constructor(securityChecks: SecurityCheck[]) {
    this.securityChecks = securityChecks;
  }

  private async validateSecurity(
    req: Request,
    permission: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE'
  ): Promise<{ idAccount: number; idUser: number } | null> {
    const idAccount = parseInt(req.headers['x-account-id'] as string) || 1;
    const idUser = parseInt(req.headers['x-user-id'] as string) || 1;

    if (!idAccount || !idUser) {
      return null;
    }

    return { idAccount, idUser };
  }

  private async validateParams<T>(
    req: Request,
    schema: z.ZodSchema<T>
  ): Promise<[T | null, ApiError | null]> {
    try {
      const params = {
        ...req.params,
        ...req.query,
        ...req.body,
      };

      const validated = await schema.parseAsync(params);
      return [validated, null];
    } catch (error: any) {
      const validationError: ApiError = {
        name: 'ValidationError',
        message: 'Validation failed',
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        details: error.errors,
      };
      return [null, validationError];
    }
  }

  async create<T>(
    req: Request,
    schema: z.ZodSchema<T>
  ): Promise<[ValidatedRequest<T> | null, ApiError | null]> {
    const credential = await this.validateSecurity(req, 'CREATE');
    if (!credential) {
      const error: ApiError = {
        name: 'UnauthorizedError',
        message: 'Unauthorized access',
        statusCode: 401,
        code: 'UNAUTHORIZED',
      };
      return [null, error];
    }

    const [params, validationError] = await this.validateParams(req, schema);
    if (validationError) {
      return [null, validationError];
    }

    return [{ credential, params: params! }, null];
  }

  async read<T>(
    req: Request,
    schema: z.ZodSchema<T>
  ): Promise<[ValidatedRequest<T> | null, ApiError | null]> {
    const credential = await this.validateSecurity(req, 'READ');
    if (!credential) {
      const error: ApiError = {
        name: 'UnauthorizedError',
        message: 'Unauthorized access',
        statusCode: 401,
        code: 'UNAUTHORIZED',
      };
      return [null, error];
    }

    const [params, validationError] = await this.validateParams(req, schema);
    if (validationError) {
      return [null, validationError];
    }

    return [{ credential, params: params! }, null];
  }

  async update<T>(
    req: Request,
    schema: z.ZodSchema<T>
  ): Promise<[ValidatedRequest<T> | null, ApiError | null]> {
    const credential = await this.validateSecurity(req, 'UPDATE');
    if (!credential) {
      const error: ApiError = {
        name: 'UnauthorizedError',
        message: 'Unauthorized access',
        statusCode: 401,
        code: 'UNAUTHORIZED',
      };
      return [null, error];
    }

    const [params, validationError] = await this.validateParams(req, schema);
    if (validationError) {
      return [null, validationError];
    }

    return [{ credential, params: params! }, null];
  }

  async delete<T>(
    req: Request,
    schema: z.ZodSchema<T>
  ): Promise<[ValidatedRequest<T> | null, ApiError | null]> {
    const credential = await this.validateSecurity(req, 'DELETE');
    if (!credential) {
      const error: ApiError = {
        name: 'UnauthorizedError',
        message: 'Unauthorized access',
        statusCode: 401,
        code: 'UNAUTHORIZED',
      };
      return [null, error];
    }

    const [params, validationError] = await this.validateParams(req, schema);
    if (validationError) {
      return [null, validationError];
    }

    return [{ credential, params: params! }, null];
  }
}

export const successResponse = <T>(data: T) => ({
  success: true,
  data,
  timestamp: new Date().toISOString(),
});

export const errorResponse = (message: string, code?: string) => ({
  success: false,
  error: {
    code: code || 'ERROR',
    message,
  },
  timestamp: new Date().toISOString(),
});

export { StatusGeneralError } from '@/middleware/error';
