import sql from 'mssql';
import { config } from '@/config';

export enum ExpectedReturn {
  Single = 'single',
  Multi = 'multi',
  None = 'none',
}

export interface IRecordSet<T = any> extends Array<T> {
  columns: any;
  recordset: T[];
}

let pool: sql.ConnectionPool | null = null;

export const getPool = async (): Promise<sql.ConnectionPool> => {
  if (!pool) {
    pool = await sql.connect({
      server: config.database.server,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.database,
      options: config.database.options,
    });
  }
  return pool;
};

export const dbRequest = async (
  routine: string,
  parameters: { [key: string]: any },
  expectedReturn: ExpectedReturn,
  transaction?: sql.Transaction,
  resultSetNames?: string[]
): Promise<any> => {
  try {
    const currentPool = await getPool();
    const request = transaction ? new sql.Request(transaction) : new sql.Request(currentPool);

    Object.keys(parameters).forEach((key) => {
      request.input(key, parameters[key]);
    });

    const result = await request.execute(routine);

    if (expectedReturn === ExpectedReturn.None) {
      return null;
    }

    if (expectedReturn === ExpectedReturn.Single) {
      return result.recordset[0] || null;
    }

    if (expectedReturn === ExpectedReturn.Multi) {
      if (resultSetNames && resultSetNames.length > 0) {
        const namedResults: { [key: string]: IRecordSet } = {};
        resultSetNames.forEach((name, index) => {
          namedResults[name] = result.recordsets[index] as IRecordSet;
        });
        return namedResults;
      }
      return result.recordsets as IRecordSet<any>[];
    }

    return result.recordset;
  } catch (error: any) {
    console.error('Database error:', {
      routine,
      error: error.message,
      number: error.number,
    });
    throw error;
  }
};

export const beginTransaction = async (): Promise<sql.Transaction> => {
  const currentPool = await getPool();
  const transaction = new sql.Transaction(currentPool);
  await transaction.begin();
  return transaction;
};

export const commitTransaction = async (transaction: sql.Transaction): Promise<void> => {
  await transaction.commit();
};

export const rollbackTransaction = async (transaction: sql.Transaction): Promise<void> => {
  await transaction.rollback();
};
