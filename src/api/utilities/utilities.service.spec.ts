import { Test, TestingModule } from '@nestjs/testing';

import { UtilitiesModule } from './utilities.module';
import { UtilitiesService } from './utilities.service';

describe('Utilities Service', () => {
  let service: UtilitiesService;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UtilitiesModule],
      providers: [UtilitiesService]
    }).compile();

    service = module.get<UtilitiesService>(UtilitiesService);
    originalEnv = process.env;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should check getHealth', () => {
    expect(service.getHealth()).toEqual({
      status: 'healthy'
    });
  });

  it('should check stringifyEnv', async () => {
    const parent = {
      parentKey1: 'val1',
      parentKey2: 'val2'
    };
    const child = Object.create(parent);
    child.key1 = 'val1';
    child.key2 = 'val2';

    process.env = child;

    expect(service.stringifyEnv()).toEqual(['key1=val1', 'key2=val2']);
  });
});
