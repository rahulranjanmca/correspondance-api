/* eslint-disable @typescript-eslint/no-explicit-any */
/* libraries */
import logger from '../logger';

/*
 * Extremely simple express middleware to introduce configurable forced waits into request chain to simulate slow responses; intended use
 * is to collaborate with clientside developers to properly handle slower-than-acceptable API responses.
 */
const DEFAULT_WAIT_MS = 1000;

export default function(wait: number = DEFAULT_WAIT_MS, err: any) {
  return function(_req: any, _res: any, next: any) {
    if (process.env.NODE_ENV === 'PROD') {
      logger.warn('Cannot use waiting middleware in production environment');
    } else {
      logger.debug(`Forced wait middleware; waiting for ${wait} ms`);
      setTimeout(next, wait, err);
    }
  };
}
