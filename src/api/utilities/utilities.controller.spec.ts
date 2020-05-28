import { Test, TestingModule } from '@nestjs/testing';

import { HealthDto } from './dto/health.dto';
import { UtilitiesController } from './utilities.controller';
import { UtilitiesModule } from './utilities.module';
import { UtilitiesService } from './utilities.service';

describe('Utilities Controller', () => {
  let controller: UtilitiesController;
  const mockFunction = jest.fn();
  class MockUtilitiesService {
    getHealth(): HealthDto {
      return { status: 'healthy' };
    }

    async stringifyEnv(): Promise<string[]> {
      return mockFunction();
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UtilitiesModule],
      providers: [UtilitiesService]
    })
      .overrideProvider(UtilitiesService)
      .useClass(MockUtilitiesService)
      .compile();

    controller = module.get<UtilitiesController>(UtilitiesController);
  });

  it('should check getHealth api to return success', () => {
    const health = controller.getHealth();
    expect(health).toEqual({ status: 'healthy' });
  });

  it('should check stringifyEnv api to return success', async () => {
    const mockEnv = {
      key1: 'val1',
      key2: 'val2'
    };
    mockFunction.mockResolvedValue(mockEnv);
    const env = await controller.getStringifyEnv();
    expect(env).toEqual(mockEnv);
  });

  it('should check stringifyEnv api to catch errors', async () => {
    mockFunction.mockRejectedValue('error');
    try {
      await controller.getStringifyEnv();
    } catch (err) {
      expect(err).toEqual('error');
    }
  });
});
