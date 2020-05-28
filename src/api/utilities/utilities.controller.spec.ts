import { Test, TestingModule } from '@nestjs/testing';
import * as assert from 'assert';

import { UtilitiesController } from './utilities.controller';
import { UtilitiesModule } from './utilities.module';
import { UtilitiesService } from './utilities.service';
jest.mock('./utilities.service');

describe('UtilitiesController', () => {
  let controller: UtilitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UtilitiesModule]
    }).compile();

    controller = module.get<UtilitiesController>(UtilitiesController);
    (UtilitiesService.prototype.getHealth as jest.Mock).mockClear();
    (UtilitiesService.prototype.stringifyEnv as jest.Mock).mockClear();
  });

  it('should getHealth success', () => {
    const status = 'healthy';
    (UtilitiesService.prototype.getHealth as jest.Mock).mockReturnValue(status);
    const result = controller.getHealth();

    expect(result).toBe(status);
  });

  it('should getStringifyEnv success', async () => {
    const copiedEnv = Object.assign({}, process.env);
    (UtilitiesService.prototype.stringifyEnv as jest.Mock).mockReturnValue(copiedEnv);
    const result = await controller.getStringifyEnv();

    expect(result).toBeDefined();
  });

  it('should getStringifyEnv fail', async () => {
    (UtilitiesService.prototype.stringifyEnv as jest.Mock).mockImplementation(() => {
      throw Error('test');
    });
    try {
      await controller.getStringifyEnv();
      assert.fail('should not be here');
    } catch (error) {
      expect(error.message).toBe('test');
    }
  });
});
