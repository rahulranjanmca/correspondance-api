/**
 * @module s3
 */

/* node_modules */
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
export default class S3 {
  /* internals */
  private _simpleStorageService: AWS.S3;

  constructor(awsConfig?: IAWSConfig) {
    if (process.env.NODE_ENV === 'LOCAL') {
      AWS.config.loadFromPath('./sandbox-config.json');
      this._simpleStorageService = new AWS.S3();
    } else {
      this._simpleStorageService = awsConfig
        ? new AWS.S3(
            new AWS.Config({
              accessKeyId: awsConfig.accessKeyId,
              secretAccessKey: awsConfig.secretAccessKey,
              region: awsConfig.region
            })
          )
        : new AWS.S3();
    }
  }

  /**
   * @public
   * @async
   * @method putObject
   * @description this method allows the ability to put
   * (upload) an object/file in a specific s3 bucket
   * @param params {{ bucket: string, key: string, file: Buffer | string , contentType: string, }} bucket name, filename, file data, content type of file
   * @returns {Promise<PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>>} aws put object result
   * @throws standaradized api error
   */
  public async putObject(params: {
    bucket: string;
    key: string;
    file: Buffer | string;
    contentType: string;
  }): Promise<PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>> {
    try {
      logger.debug(`{}AWS::{}S3::#putObject::initiating execution`);

      let f: Buffer | undefined = undefined;

      if (params.file instanceof Buffer) {
        f = params.file;
      } else if (typeof params.file === 'string') {
        f = Buffer.from(params.file, 'base64');
      } else {
        f = new Buffer(params.file);
      }

      const prms: AWS.S3.PutObjectRequest = {
        Bucket: params.bucket,
        Key: params.key,
        Body: f as Buffer,
        ContentType: params.contentType
      };

      const result: PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError> = await this._simpleStorageService.putObject(prms).promise();

      logger.info(`{}AWS::{}S3::#putObject::successfully executed`);

      return result;
    } catch (err) {
      const error = SanitizeError(err);
      logger.error(`{}AWS::{}S3::#putObject::error executing::error=${utils.common.stringify(error)}`);
      throw error;
    }
  }

  public async deleteObject(params: { bucket: string; key: string }): Promise<PromiseResult<AWS.S3.DeleteObjectOutput, AWS.AWSError>> {
    try {
      logger.debug(`{}AWS::{}S3::#deleteObject::initiating execution`);

      const prms: AWS.S3.PutObjectRequest = {
        Bucket: params.bucket,
        Key: params.key
      };

      const result = await this._simpleStorageService.deleteObject(prms).promise();

      logger.info(`{}AWS::{}S3::#deleteObject::successfully executed`);

      return result;
    } catch (err) {
      const error = SanitizeError(err);
      logger.error(`{}AWS::{}S3::#deleteObject::error executing::error=${error}`);
      throw error;
    }
  }

  public async getObject(params: { bucket: string; key: string }): Promise<PromiseResult<AWS.S3.GetObjectOutput, AWS.AWSError>> {
    try {
      logger.debug(`{}AWS::{}S3::#getObject::initiating execution`);

      const prms: AWS.S3.GetObjectRequest = {
        Bucket: params.bucket,
        Key: params.key
      };

      const result = await this._simpleStorageService.getObject(prms).promise();

      logger.info(`{}AWS::{}S3::#getObject::successfully executed`);

      return result;
    } catch (err) {
      const error = SanitizeError(err);
      logger.error(`{}AWS::{}S3::#getObject::error executing::error=${error}`);
      throw error;
    }
  }

  public get instance(): AWS.S3 {
    return this._simpleStorageService;
  }
}
