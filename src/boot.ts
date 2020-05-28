/* eslint-disable @typescript-eslint/ban-ts-ignore */
// node_modules
import { SanitizeError } from '@wellmark/wm-lib-error-handler';
import { SSM } from 'aws-sdk';
import awsServerlessExpress from 'aws-serverless-express';
import wait from 'delay';
import dotEnvSafe from 'dotenv-safe';
import open from 'open';
import os from 'os';
import { promisify } from 'util';

/* libraries */
import logger from './lib/logger';

// Utility imports
const stagingEnvironment = require('@wellmark/wm-lib-runtime-environment').stagingEnvironment;

const environmentParse = (path: string) => {
  try {
    logger.debug(`{}Boot::#environmentParse::initiating execution`);
    dotEnvSafe.config({
      sample: path
    });
  } catch (err) {
    if (err.name === 'MissingEnvVarsError') {
      logger.debug(`{}Boot::#environmentParse::successfully executed`);
      return err.missing;
    } else {
      const error = SanitizeError(err);
      logger.error(`{}Boot::#environmentParse::error executing::error=${error}`);
      throw error;
    }
  }
};

const environmentVerify = (path: string) => {
  try {
    dotEnvSafe.config({
      sample: path
    });
  } catch (err) {
    const error = SanitizeError(err);
    logger.error(`{}Boot::#environmentVerify::error executing::error=${error}`);
    throw error;
  }
};

export const load = async (paramstore: string, options: any = {}): Promise<void> => {
  try {
    logger.debug(`{}Boot::#getParametersByPath::initiating execution`);

    const examplePath: string = options.example ? options.example : './.env.example';

    if (options.ssm) {
      let found: AWS.SSM.GetParametersByPathResult | any = {};

      let initial = true;
      let completed = false;

      const ssm = options.awsConfig ? new SSM(options.awsConfig) : new SSM();
      // @ts-ignore
      ssm.getParametersByPath = promisify(ssm.getParametersByPath);

      const env = environmentParse(examplePath);

      while (!completed) {
        if (!found.NextToken) {
          if (initial) {
            logger.debug(`{}SSM::#getParametersByPath::initial fetch`);

            const prms = {
              Path: `/${process.env.NODE_ENV}/${paramstore}/`,
              WithDecryption: true
            };

            found = await ssm.getParametersByPath(prms);

            for (let i = 0; i < found.Parameters.length; i++) {
              const paramaterFound = env.find(
                (e: any) => found.Parameters[i].Name.split('/')[found.Parameters[i].Name.split('/').length - 1] === e
              );
              if (paramaterFound)
                process.env[found.Parameters[i].Name.split('/')[found.Parameters[i].Name.split('/').length - 1]] =
                  found.Parameters[i].Value;
            }

            initial = false;
          } else {
            environmentVerify(examplePath);
            completed = true;
          }
        } else {
          const prms = {
            Path: `/${process.env.NODE_ENV}/${paramstore}/`,
            WithDecryption: true,
            NextToken: found.NextToken
          };

          found = await ssm.getParametersByPath(prms);

          for (let i = 0; i < found.Parameters.length; i++) {
            const paramaterFound = env.find(
              (e: any) => found.Parameters[i].Name.split('/')[found.Parameters[i].Name.split('/').length - 1] === e
            );
            if (paramaterFound)
              process.env[found.Parameters[i].Name.split('/')[found.Parameters[i].Name.split('/').length - 1]] = found.Parameters[i].Value;
          }
        }
      }
    } else {
      environmentVerify(examplePath);
    }

    logger.debug(`{}Boot::#load::successfully executed`);

    return;
  } catch (err) {
    const error = SanitizeError(err);
    logger.error(`{}Boot::#load::error executing::err=${error}`);
    throw error;
  }
};

export const killSelf = async (error: any) => {
  try {
    logger.error(`{}Boot::#killSelf::exiting process due to error::error=${SanitizeError(error)}`);
    if (stagingEnvironment.currentEnvironmentIsHigherThan(stagingEnvironment.LOCAL)) {
      // Let execution continue for logging before killing process
      await wait(2000);
    }
    return process.exit(1);
  } catch (e) {
    console.log(`{}Boot::#killSelf::error executing::forcing exit::error=${e}`);
    return process.exit(1);
  }
};

export const serverless = (event: any, binaryMimeTypes: any, context: any) => {
  return new Promise((_resolve, reject) => {
    try {
      const app = require('./index').default;
      const server = awsServerlessExpress.createServer(app, undefined, binaryMimeTypes);
      awsServerlessExpress.proxy(server, event, context);
    } catch (err) {
      return reject(err);
    }
  });
};

export const isHealthCheck = (event: any) => {
  try {
    return event.path && event.path.split('/')[event.path.split('/').length - 1] === 'api-health';
  } catch (err) {
    throw err;
  }
};

export const bootLocalEnv = (): void => {
  const port = process.env.PORT;

  try {
    const swaggerDoc = process.env.SWAGGER_BASE_PATH;
    console.log(`Your server is listening on port ${port} (http://${os.hostname()}:${port})`);
    console.log(`Swagger-ui is available on http://${os.hostname()}:${port}${swaggerDoc}/docs`);
    open(`http://${os.hostname()}:${port}${swaggerDoc}/docs`, { app: 'chrome' });
  } catch (err) {
    throw err;
  }
};
