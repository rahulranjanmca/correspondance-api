/**
 * @module s3
 */

/* node_modules */
/* modules */
import { SanitizeError } from '@wellmark/wm-lib-error-handler';
import * as AWS from 'aws-sdk';

/* types */
import { IAWSConfig } from '../../../interfaces/aws';
/* libraries */
import logger from '../../logger';
import utils from '../../utils';

/**
 * @class simple systems manager capabilities
 */
export default class SSM {
  /* internals */
  private _simpleSystemsManager: AWS.SSM;

  constructor(awsConfig?: IAWSConfig) {
    if (process.env.NODE_ENV === 'LOCAL') {
      AWS.config.loadFromPath('./sandbox-config.json');
      this._simpleSystemsManager = new AWS.SSM();
    } else {
      this._simpleSystemsManager = awsConfig
        ? new AWS.SSM(
            new AWS.Config({
              accessKeyId: awsConfig.accessKeyId,
              secretAccessKey: awsConfig.secretAccessKey,
              region: awsConfig.region
            })
          )
        : new AWS.SSM();
    }
  }

  public async getParametersByPath(path: string): Promise<{ name: string; value: string }[]> {
    try {
      logger.debug(`{}AWS::{}SSM::#getParametersByPath::initiating execution`);

      const _getParametersByPath = (s: AWS.SSM, p: AWS.SSM.GetParametersByPathRequest): Promise<AWS.SSM.GetParametersByPathResult> => {
        return new Promise((resolve, reject) => {
          s.getParametersByPath(p, (e: AWS.AWSError, d: AWS.SSM.GetParametersByPathResult) => {
            if (e) return reject(e);
            return resolve(d);
          });
        });
      };

      let found: AWS.SSM.GetParametersByPathResult | any = {};

      let initial = true;
      let completed = false;

      const params: { name: string; value: string }[] = [];

      while (!completed) {
        if (!found.NextToken) {
          if (initial) {
            const prms: { Path: string; WithDecryption: boolean } = {
              Path: path,
              WithDecryption: true
            };

            found = await _getParametersByPath(this._simpleSystemsManager, prms);

            found.Parameters.map((param: any) => {
              params.push({
                name: param.Name.split('/')[param.Name.split('/').length - 1],
                value: param.Value
              });
            });
            initial = false;
          } else {
            completed = true;
          }
        } else {
          const prms: { Path: string; WithDecryption: boolean; NextToken: string } = {
            Path: path,
            WithDecryption: true,
            NextToken: found.NextToken
          };

          found = await _getParametersByPath(this._simpleSystemsManager, prms);

          found.Parameters.map((param: { Name: string; Value: string }) => {
            params.push({
              name: param.Name.split('/')[param.Name.split('/').length - 1],
              value: param.Value
            });
          });
        }
      }

      logger.info(`{}AWS::{}SSM::#getParametersByPath::successfully executed`);

      return params;
    } catch (err) {
      const error = SanitizeError(err);
      logger.error(`{}AWS::{}SSM::#getParametersByPath::error executing::err=${utils.common.stringify(error)}`);
      throw error;
    }
  }

  public get instance() {
    return this._simpleSystemsManager;
  }
}
