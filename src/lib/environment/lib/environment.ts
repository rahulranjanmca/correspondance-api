/* modules */
import { SanitizeError } from '@wellmark/wm-lib-error-handler';
/* node_modules */
import _ from 'lodash';

/* libraries */
import logger from '../../logger';
import utils from '../../utils';

/* file constants */
let ALREADY_WARNED_ABOUT_CONTEXT_LOGGING_FAILURE = false;
const DEFAULT_ENABLED_MDC = true;
const DEFAULT_REQ_RES_LOGGING_ENABLED = false;

let cachedMdcSetting: any;

const _mappedDiagnosticContextEnabled = () => {
  try {
    logger.debug(`{}Environment::#mappedDiagnosticContextEnabled::initiating execution`);

    if (_.isNil(cachedMdcSetting)) {
      cachedMdcSetting = DEFAULT_ENABLED_MDC;
      try {
        cachedMdcSetting = utils.common.stringToBoolean(process.env.WML_ENABLE_MDC_LOGGING, DEFAULT_ENABLED_MDC);
      } catch (err) {
        if (!ALREADY_WARNED_ABOUT_CONTEXT_LOGGING_FAILURE) {
          console.error(
            `Failed to determine whether this instance should enable diagnostic content logging, defaulting to ${DEFAULT_ENABLED_MDC}`
          );
          ALREADY_WARNED_ABOUT_CONTEXT_LOGGING_FAILURE = true;
        }
      }
    }

    logger.info(`{}Environment::#mappedDiagnosticContextEnabled::successfully executed`);

    return cachedMdcSetting;
  } catch (err) {
    const error = SanitizeError(err);
    logger.error(`{}Environment::#mappedDiagnosticContextEnabled::error executing::error=${utils.common.stringify(err)}`);
    throw error;
  }
};

const _enableForcedWaitMiddleware = () => {
  const DEFAULT_ENABLE = false;
  let result = DEFAULT_ENABLE;
  try {
    result = utils.common.stringToBoolean(process.env.ENABLE_WAITING_MIDDLEWARE, DEFAULT_ENABLE);
    if ((result && process.env.NODE_ENV === 'PREP') || process.env.NODE_ENV === 'PROD') {
      console.warn('Setting ENABLE_WAITING_MIDDLEWARE is set to true, forcing to false for production environment');
      result = DEFAULT_ENABLE;
    }
  } catch (err) {
    console.error(`Failed to determine whether this instance should introduce artificial wait, defaulting to ${DEFAULT_ENABLE}`);
  }
  return result;
};

const _enableReqResLogging = () => {
  let result = DEFAULT_REQ_RES_LOGGING_ENABLED;
  try {
    result = utils.common.stringToBoolean(process.env.REQ_RES_LOGGING_ENABLED, DEFAULT_REQ_RES_LOGGING_ENABLED);
  } catch (err) {
    console.error(`Failed to determine whether this instance should use req/res logging, defaulting to ${DEFAULT_REQ_RES_LOGGING_ENABLED}`);
  }
  return result;
};

const _parse = (path: string) => {
  try {
    logger.trace(`{}Environment::#parse::initiating execution`);
    require('dotenv-safe').config({
      sample: path
    });
    return;
  } catch (err) {
    if (err.name === 'MissingEnvVarsError') {
      logger.trace(`{}Environment::#parse::successfully executed`);
      return err.missing;
    } else {
      const error = SanitizeError(err);
      logger.error(`{}Environment::#parse::error executing::error=${utils.common.stringify(err)}`);
      throw error;
    }
  }
};

const _verify = () => {
  try {
    require('dotenv-safe').config();
    return;
  } catch (err) {
    const error = SanitizeError(err);
    logger.error(`{}Environment::#verify::error executing::error=${utils.common.stringify(err)}`);
    throw error;
  }
};

export default class Environment {
  public mappedDiagnosticContextEnabled = _mappedDiagnosticContextEnabled;
  public enableForcedWaitMiddleware = _enableForcedWaitMiddleware;
  public enableReqResLogging = _enableReqResLogging;
  public parse = _parse;
  public verify = _verify;
}
