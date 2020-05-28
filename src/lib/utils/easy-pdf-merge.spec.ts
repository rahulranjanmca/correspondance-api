import { merge } from './easy-pdf-merge';

jest.mock('easy-pdf-merge');

describe('', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const _merge = require('easy-pdf-merge');

  it('should merge success', async () => {
    (_merge as jest.Mock).mockImplementation((_sourceFiles: string[], _destFilePath: string, fn: (err: string) => void) => {
      fn((undefined as unknown) as string);
    });

    await merge(['test1', 'test2'], 'test');
  });

  it('should not merge success for error', async () => {
    (_merge as jest.Mock).mockImplementation((_sourceFiles: string[], _destFilePath: string, fn: (err: string) => void) => {
      fn('test');
    });

    try {
      await merge(['test1', 'test2'], 'test');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
