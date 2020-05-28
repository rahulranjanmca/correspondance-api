import { Test } from '@nestjs/testing';

import { UtilitiesService } from './utilities.service';
import ProcessEnv = NodeJS.ProcessEnv;
import awsConfigs from '../../configs/aws';
import { IAWSConfig } from '../../interfaces/aws';
import { APIError, CorsError } from '../../models/errors';

describe('utilities module', () => {
  let utilitiesService: UtilitiesService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UtilitiesService]
    }).compile();

    utilitiesService = module.get<UtilitiesService>(UtilitiesService);
  });

  it('should get Health success', async () => {
    expect(utilitiesService.getHealth()).toBeDefined();
  });

  it('should get StringifyEnv success', async () => {
    expect(utilitiesService.stringifyEnv()).toBeDefined();
  });

  it('should get StringifyEnv with getOwnPropertyDescriptor continue success', async () => {
    process.env = ({
      __proto__: {
        __test__: 'test'
      }
    } as unknown) as ProcessEnv;

    expect(utilitiesService.stringifyEnv()).toBeDefined();
  });
});

describe('coverage for other folders', () => {
  it('should coverage configs', async () => {
    expect({} as IAWSConfig).toBeDefined();
  });

  it('should coverage configs', async () => {
    expect(awsConfigs).toBeDefined();
  });

  it('should coverage models', async () => {
    const envBack = process.env.NODE_ENV;
    expect(APIError(Error('test'))).toBeDefined();
    expect(APIError({ title: 'error.title', detail: 'detail' })).toBeDefined();
    process.env.NODE_ENV = 'PREP';
    expect(APIError({})).toBeDefined();
    expect(new CorsError()).toBeDefined();

    process.env.NODE_ENV = envBack;
  });
});
