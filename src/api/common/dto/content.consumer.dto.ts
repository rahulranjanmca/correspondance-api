/**
 * captures details of who is attempting to build content from this API
 */

export class ContentConsumerDto {
  // example: CIM Communications Composer
  // default: NOT_ASSIGNED
  // the name of the application building the content
  system!: string;

  // example: 1.0
  // default: NOT_ASSIGNED
  // the version of the application building the content
  systemVersion!: string;

  // example: IAZ9999
  // default: NOT_ASSIGNED
  // the username of the end user building the content
  user!: string;

  // example: DEV
  // default: NOT_ASSIGNED
  // the staging environment (e.g. DEV, SIT) of the application which is building the content
  stagingEnvironment!: string;
}
