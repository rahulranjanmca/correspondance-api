import { APIError, CorsError } from './errors';

describe('errors', () => {
  describe('APIError', () => {
    it('should create APIError success', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const apiError = APIError({});
      expect(apiError).toBeDefined();
    });

    it('should create APIError success in PREP env', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const nodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'PREP';
      const apiError = APIError({});
      expect(apiError).toBeDefined();
      expect(apiError.detail).toBeUndefined();
      process.env.NODE_ENV = nodeEnv;
    });
  });

  describe('CorsError', () => {
    it('should create CorsError success', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const corsError = new CorsError({});
      expect(corsError).toBeDefined();
      expect(corsError.message).toBe('Not allowed by CORS');
    });
  });
});
