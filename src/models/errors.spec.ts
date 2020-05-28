import { APIError, CorsError } from './errors';

describe('Error models', () => {
  it('should get CorsError message', () => {
    const err = new CorsError();
    expect(err.message).toBe('Not allowed by CORS');
  });

  it('should get APIError', () => {
    const err = APIError({});
    expect(err.title).toBe('uncaught exception');
    expect(err.statusCode).toBe(500);
    process.env.NODE_ENV = 'PROD';
    const prodErr = APIError({ detail: 'detail' });
    expect(prodErr.detail).toBeUndefined();
  });
});
