import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilitiesService {
  getHealth(): string {
    const health = 'healthy';
    return health;
  }

  stringifyEnv(): string[] {
    const envVariables = [];
    const env = process.env;

    for (const key in env) {
      if (!Object.getOwnPropertyDescriptor(env, key)) continue;
      const obj = env[key];

      envVariables.push(`${key}=${obj}`);
    }
    return envVariables;
  }
}
