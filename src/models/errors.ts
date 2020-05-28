/* interfaces */
import { IAPIError } from '../interfaces/errors';

/* eslint-disable @typescript-eslint/no-explicit-any */
const APIError = (error: any): IAPIError => {
  const _error: IAPIError = {
    title: error.message || error.title || 'uncaught exception',
    statusCode: error.statusCode || 500,
    source: {
      pointer: error.pointer || undefined,
      param: error.param || undefined
    },
    detail: error.stack || error.detail || undefined
  };

  if (process.env.NODE_ENV === 'PREP' || process.env.NODE_ENV === 'PROD') _error.detail = undefined;

  return _error;
};

class CorsError extends Error {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  constructor(...params: any[]) {
    super(...params);
    this.message = 'Not allowed by CORS';
  }
}

export { APIError, CorsError };
