import { Injectable } from '@nestjs/common';

import { HealthDto } from './dto/health.dto';

@Injectable()
export class UtilitiesService {
  getHealth(): HealthDto {
    const healthObject: HealthDto = {
      status: 'healthy'
    };
    return healthObject;
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
