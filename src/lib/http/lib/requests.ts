/* node_modules */
import * as request from 'request';

/* interfaces */
import { IAPIError } from '../../../interfaces/errors';
/* models */
import { APIError } from '../../../models/errors';
/* libraries */
import logger from '../../logger';
import utils from '../../utils';

export default class Requests {
  private _request = request;

  public async post(uri: string, options: request.CoreOptions | any = {}): Promise<request.Response> {
    try {
      logger.debug(`{}HTTP::{}Requests::#post::initiating execution`);

      const _post = (re: any, u: string, o: request.CoreOptions): Promise<request.Response> => {
        return new Promise((resolve, reject) => {
          re.post(u, o, (e: any, r: request.Response) => {
            if (e) return reject(e);
            return resolve(r);
          });
        });
      };

      const response: request.Response = await _post(this._request, uri, options);

      logger.info(`{}HTTP::{}Requests::#post::successfully executed`);

      return response;
    } catch (err) {
      const error: IAPIError = APIError(err);
      logger.error(`{}HTTP::{}Requests::#post::error executing::error=${utils.common.stringify(error)}`);
      throw error;
    }
  }

  public async get(uri: string, options: request.CoreOptions | any = {}): Promise<request.Response> {
    try {
      logger.debug(`{}HTTP::{}Requests::#get::initiating execution`);

      const _get = (re: any, u: string, o: request.CoreOptions): Promise<request.Response> => {
        return new Promise((resolve, reject) => {
          re.get(u, o, (e: any, r: request.Response) => {
            if (e) return reject(e);
            return resolve(r);
          });
        });
      };

      const response: request.Response = await _get(this._request, uri, options);

      logger.info(`{}HTTP::{}Requests::#get::successfully executed`);

      return response;
    } catch (err) {
      const error: IAPIError = APIError(err);
      logger.error(`{}HTTP::{}Requests::#get::error executing::error=${utils.common.stringify(error)}`);
      throw error;
    }
  }
}
