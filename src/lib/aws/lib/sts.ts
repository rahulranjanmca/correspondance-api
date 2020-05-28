/**
 * @module sts
 */

/* node_modules */
import * as AWS from 'aws-sdk';
/* types */
import { PromiseResult } from 'aws-sdk/lib/request';

/* interfaces */
import { IAWSConfig } from '../../../interfaces/aws';
import { IAPIError } from '../../../interfaces/errors';
/* models */
import { APIError } from '../../../models/errors';
/* libraries */
import logger from '../../logger';
import utils from '../../utils';

/**
 * @class simple token service capabilities
 */
export default class STS {
  /* internals */
  private _simpleTokenService: AWS.STS;

  constructor(awsConfig?: IAWSConfig) {
    if (process.env.NODE_ENV === 'LOCAL') {
      AWS.config.loadFromPath('./sandbox-config.json');
      this._simpleTokenService = new AWS.STS();
    } else {
      this._simpleTokenService = awsConfig
        ? new AWS.STS(
            new AWS.Config({
              accessKeyId: awsConfig.accessKeyId,
              secretAccessKey: awsConfig.secretAccessKey,
              region: awsConfig.region
            })
          )
        : new AWS.STS();
    }
  }

  public async assumeRole(assumeRoleRequest: AWS.STS.AssumeRoleRequest) {
    try {
      logger.debug(`{}AWS::{}STS::#assumeRole::initiating execution`);

      const sendAssumeRoleResponse: PromiseResult<AWS.STS.AssumeRoleResponse, AWS.AWSError> = await this._simpleTokenService
        .assumeRole(assumeRoleRequest)
        .promise();

      logger.debug(`{}AWS::{}STS::#assumeRole::sendAssumeRoleResponse=${utils.common.stringify(sendAssumeRoleResponse)}`);

      logger.info(`{}AWS::{}STS::#assumeRole::successfully executed`);

      return sendAssumeRoleResponse;
    } catch (err) {
      const error: IAPIError = APIError(err);
      logger.error(`{}AWS::{}STS::#assumeRole::error executing::error=${utils.common.stringify(error)}`);
      throw error;
    }
  }

  public get instance() {
    return this._simpleTokenService;
  }
}

// const AWS = require('aws-sdk');

// const logger = require('../../logger/logger');
// const utils = require('../../utils');

// const { APIError } = require('../../../models/errors');

// class STS {
//     constructor () {
//         this._sts = new AWS.STS();
//     }

//     async assumeRole (payload) {
//         try {
//             logger.debug('{}STS::#assumeRole::initiating execution');

//       const _assumeRole = (sts, p) => { // eslint-disable-line
//                 return new Promise((resolve, reject) => {
//                     sts.assumeRole(
//                         {
//                             // DurationSeconds: p.durationSeconds,
//                             // ExternalId: p.externalId,
//                             // Policy: p.policy,
//                             RoleArn: p.roleArn,
//                             RoleSessionName: p.roleSessionName
//                         },
//                         (e, r) => {
//                             if (e) return reject(e);
//                             return resolve(r);
//                         }
//                     );
//                 });
//             };

//             logger.debug(`{}STS::#assumeRole:payload=${ utils.common.stringify(payload) }`);

//             const response = await _assumeRole(this._sts, payload);

//             /*
//         response = {
//           AssumedRoleUser: {
//           Arn: "arn:aws:sts::123456789012:assumed-role/demo/Bob",
//           AssumedRoleId: "ARO123EXAMPLE123:Bob"
//           },
//           Credentials: {
//           AccessKeyId: "AKIAIOSFODNN7EXAMPLE",
//           Expiration: <Date Representation>,
//           SecretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYzEXAMPLEKEY",
//           SessionToken: "AQoDYXdzEPT//////////wEXAMPLEtc764bNrC9SAPBSM22wDOk4x4HIZ8j4FZTwdQWLWsKWHGBuFqwAeMicRXmxfpSPfIeoIYRqTflfKD8YUuwthAx7mSEI/qkPpKPi/kMcGdQrmGdeehM4IC1NtBmUpp2wUE8phUZampKsburEDy0KPkyQDYwT7WZ0wq5VSXDvp75YU9HFvlRd8Tx6q6fE8YQcHNVXAkiY9q6d+xo0rKwT38xVqr7ZD0u0iPPkUL64lIZbqBAz+scqKmlzm8FDrypNC9Yjc8fPOLn9FX9KSYvKTr4rvx3iSIlTJabIQwj2ICCR/oLxBA=="
//           },
//           PackedPolicySize: 6
//         }
//       */

//             logger.info('{}STS::#assumeRole::successfully executed');

//             return response;
//         } catch (err) {
//             const error = APIError(err);
//             logger.error(`{}STS::#assumeRole::error executing::error=${ utils.common.stringify(error) }`);
//             throw error;
//         }
//     }
// }

// module.exports = STS;
