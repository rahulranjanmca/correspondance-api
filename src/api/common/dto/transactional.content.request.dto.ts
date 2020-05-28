/**
 * class TransactionalContentRequestDto
 */

import { ContentConsumerDto } from './content.consumer.dto';

export class TransactionalContentRequestDto {
  constructor(proof: boolean, templateId: string, userId: string, inputData: Record<string, string>) {
    this.consumer = new ContentConsumerDto();
    this.ttl = 40;
    this.decodeNonBinaryResponseContent = true;
    this.includeContentInResponse = true;
    this.includeDownloadUrlInResponse = false;
    this.proof = proof;
    this.templateId = templateId;
    this.inputData = inputData;
    // for dotenv-safe should never undefined
    this.consumer.stagingEnvironment = process.env.NODE_ENV!;
    this.consumer.system = 'CCA';
    this.consumer.systemVersion = '1.0';
    this.consumer.user = userId;
  }

  // example: gmctid:610d58ad-aa25-409e-9135-12a7f48b95b3
  // the id of the template we're building
  templateId!: string;

  // example: 1
  // time for the generated content to 'live' in the content system temp storage, in hours
  ttl!: number;

  // default: false
  // example: false
  // whether to build the document in "proof" mode, which will allow blanks in non-required fields
  proof!: boolean;

  // default: false
  // example: true
  // whether to include a url to download the generated content
  includeDownloadUrlInResponse!: boolean;

  // default: true
  // example: true
  // whether you want the content returned as part of the service response
  includeContentInResponse!: boolean;

  // default: false
  // example: false
  // whether you want text-type content (e.g. html, plain text) decoded from base64 representation
  decodeNonBinaryResponseContent!: boolean;

  // the object model comprising the input data used to build the document/content
  inputData!: Record<string, string>;

  // captures details of who is attempting to build content from this API
  consumer!: ContentConsumerDto;
}
