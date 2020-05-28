import { SanitizeError } from '@wellmark/wm-lib-error-handler';

import { bootstrap } from './app';
import { killSelf, load } from './boot';
import logger from './lib/logger';

const paramStore = process.env.PARAM_STORE as string;

/* This is for local development. index.local.ts was removed and index.ts was moved
to app.ts for the bootstrapper. Still left is to deploy the lambda and ECS functions and test */
(async () => {
  try {
    logger.info('###Booting from local environment');
    logger.debug(`Trying to load params from ${paramStore}`);
    await load(`node-starter-api`, { ssm: false });

    await bootstrap();
  } catch (err) {
    console.log(JSON.stringify({ ...err, message: err.message, stack: err.stack }));
    const processError = SanitizeError(err);

    killSelf(processError);
    process.exit(0);
  }
})();
