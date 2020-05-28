/* libraries */
import { ServerResponse } from 'http';

import { IAPIError } from '../../interfaces/errors';
/* models */
import { APIError, CorsError } from '../../models/errors';
import logger from '../logger';
import utils from '../utils';

/* file constants */
const SCHEMA_VALIDATION_FAILED = 'SCHEMA_VALIDATION_FAILED';
const PATTERN = 'PATTERN';
const AUTHORIZATION = 'AUTHORIZATION';
const REQUIRED = 'REQUIRED';

export default function(err: any, res: ServerResponse) {
  try {
    let statusCode = 500;
    if (err.code === SCHEMA_VALIDATION_FAILED || err.code === PATTERN) {
      statusCode = 400;
    } else if ((err.paramName === AUTHORIZATION.toLowerCase() && err.code === REQUIRED) || err instanceof CorsError) {
      statusCode = 401;
    }
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = statusCode;
    logger.error(`Error return by default handler: ${utils.common.stringify(APIError(err))}`);
    return res.end(utils.common.stringify(APIError(err)));
  } catch (err) {
    const error: IAPIError = APIError(err);

    logger.error(`Error when handling error in the default handler: ${utils.common.stringify(APIError(error))}`);

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = error.statusCode;
    return res.end(utils.common.stringify(APIError(err)));
  }
}
