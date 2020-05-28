import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilitiesService {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  getHealth(): any {
    const healthObject: any = {};
    healthObject.status = 'healthy';
    return healthObject;
  }

  stringifyEnv(): Array<string> {
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
