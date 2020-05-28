/**
 * @module ses
 */

/* node_modules */
/* modules */
import { SanitizeError } from '@wellmark/wm-lib-error-handler';
import * as AWS from 'aws-sdk';
/* types */
import { PromiseResult } from 'aws-sdk/lib/request';

/* interfaces */
import { IAWSConfig } from '../../../interfaces/aws';
/* libraries */
import logger from '../../logger';
import utils from '../../utils';

/**
 * @class simple storage service capabilities
 */
export default class SES {
  /* internals */
  private _simpleEmailService: AWS.SES;

  constructor(awsConfig?: IAWSConfig) {
    if (process.env.NODE_ENV === 'LOCAL') {
      AWS.config.loadFromPath('./sandbox-config.json');
      this._simpleEmailService = new AWS.SES();
    } else {
      if (awsConfig) {
        const c: AWS.SES.Types.ClientConfiguration = {};

        c.accessKeyId = awsConfig.accessKeyId;
        c.secretAccessKey = awsConfig.secretAccessKey;
        c.region = awsConfig.region;

        if (awsConfig.sessionToken) c.sessionToken = awsConfig.sessionToken;

        this._simpleEmailService = new AWS.SES(c);
      } else {
        this._simpleEmailService = new AWS.SES();
      }
    }
  }

  public async sendRawEmail(
    sendRawEmailRequest: AWS.SES.SendRawEmailRequest
  ): Promise<PromiseResult<AWS.SES.SendRawEmailResponse, AWS.AWSError>> {
    try {
      logger.debug(`{}AWS::{}SES::#sendRawEmail::initiating execution`);

      const sendRawEmailResponse = await this._simpleEmailService.sendRawEmail(sendRawEmailRequest).promise();

      logger.debug(`{}AWS::{}SES::#sendRawEmail::sendRawEmailResponse=${utils.common.stringify(sendRawEmailResponse)}`);

      logger.info(`{}AWS::{}SES::#sendRawEmail::successfully executed`);

      return sendRawEmailResponse;
    } catch (err) {
      const error = SanitizeError(err);
      logger.error(`{}AWS::{}SES::#sendRawEmail::error executing::error=${utils.common.stringify(error)}`);
      throw error;
    }
  }

  public get instance(): AWS.SES {
    return this._simpleEmailService;
  }
}
