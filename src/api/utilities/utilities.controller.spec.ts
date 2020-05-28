import { Test } from '@nestjs/testing';

import { UtilitiesController } from './utilities.controller';
import { UtilitiesModule } from './utilities.module';

export const mockStringifyEnvFunction = jest.fn();

jest.mock('./utilities.service');

describe('utilities module', () => {
  let utilitiesController: UtilitiesController;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [UtilitiesModule]
    }).compile();

    utilitiesController = module.get<UtilitiesController>(UtilitiesController);
    mockStringifyEnvFunction.mockClear();
  });

  it('should get Health success', async () => {
    expect(utilitiesController.getHealth()).toBe('test_health');
  });

  it('should get StringifyEnv success', async () => {
    mockStringifyEnvFunction.mockReturnValue('test_stringifyEnv');

    expect(await utilitiesController.getStringifyEnv()).toBe('test_stringifyEnv');
    expect(mockStringifyEnvFunction).toBeCalledTimes(1);
  });

  it('should get StringifyEnv failed with exception', async () => {
    const mockError = new Error('test_error');
    mockStringifyEnvFunction.mockImplementation(() => {
      throw mockError;
    });
    try {
      await utilitiesController.getStringifyEnv();
      fail('should not be here');
    } catch (e) {
      expect(e).toBe(mockError);
    }

    expect(mockStringifyEnvFunction).toBeCalledTimes(1);
  });
});
