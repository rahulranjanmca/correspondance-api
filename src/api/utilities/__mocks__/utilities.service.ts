import { mockStringifyEnvFunction } from '../utilities.controller.spec';

export class UtilitiesService {
  getHealth(): string {
    return 'test_health';
  }

  stringifyEnv(): string {
    return mockStringifyEnvFunction();
  }
}
