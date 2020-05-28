import { Test, TestingModule } from '@nestjs/testing';
import * as assert from 'assert';

import { UtilitiesController } from './utilities.controller';
import { UtilitiesService } from './utilities.service';

describe('Utilities Controller', () => {
  let controller: UtilitiesController;
  const mockFunction = jest.fn();
  class MockUtilitiesService {
    getHealth(): Record<string, string> {
      return mockFunction();
    }
    stringifyEnv(): string[] {
      return mockFunction();
    }
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UtilitiesController],
      providers: [UtilitiesService]
    })
      .overrideProvider(UtilitiesService)
      .useClass(MockUtilitiesService)
      .compile();

    controller = module.get<UtilitiesController>(UtilitiesController);
  });

  it('should getHealth success', async () => {
    mockFunction.mockReturnValue({ status: 'healthy' });
    expect(controller.getHealth()).toStrictEqual({ status: 'healthy' });
  });

  it('should getStringifyEnv success', async () => {
    mockFunction.mockReturnValue(['env=test']);
    expect(await controller.getStringifyEnv()).toStrictEqual(['env=test']);
  });

  it('should not getStringifyEnv success', async () => {
    mockFunction.mockImplementation(() => {
      throw Error('testError');
    });
    try {
      await controller.getStringifyEnv();
      assert.fail('should not be here');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
