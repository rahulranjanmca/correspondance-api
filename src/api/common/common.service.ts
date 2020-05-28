import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { ValidationError } from 'class-validator';
import { fromFile } from 'file-type';
import { promises as pfs } from 'fs';
import * as fs from 'fs';
import path from 'path';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import logger from '../../lib/logger';
import { merge } from '../../lib/utils/easy-pdf-merge';
import { Conversation } from '../conversations/entity/conversation.entity';
import { WebInquiryResponseFields } from '../web-inquiry/dto/web-inquiry.contact.status.detail.dto copy';
import { WebInquiryDetailDto } from '../web-inquiry/dto/web-inquiry.detail.dto';
import { WmCccErrorDto } from './dto/error.dto';
import { TransactionalContentRequestDto } from './dto/transactional.content.request.dto';
import { AuditRecordEntity } from './entity/audit.record.entity';
import { CatalogEntity } from './entity/catalog.entity';
import { Payload } from './interface/payload.interface';

interface QuestionDetail {
  correspondenceNumber: string;
  xrefCorrespondenceNumber: string;
  modifiedDate: string;
  submissionDate: string;
  contactName: string;
  typeOfInquiry: string;
  certificateNumber: string;
  wellmarkID: string;
  memberFirstName: string;
  memberLastName: string;
  patientAccountNumber: string;
  memberPlanCode: string;
  groupNumber: string;
  groupName: string;
  billingUnit: string;
  patientRelation: string;
  patientDOB: string;
  patientFirstName: string;
  patientLastName: string;
  patientGender: string;
  taskEmail: string;
  iCN: string;
  sCCF: string;
  dateOfService: string;
  question: string;
  response: string;
  status: string;
  submitterContactName: string;
  submitterPhone: string;
  submitterNPI: string;
  submitterProviderName: string;
  renderingProviderName: string;
  submitterProviderId: string;
  submitterProviderState: string;
  submitterProviderTaxId: string;
  submitterProviderZip: string;
  ownerFirstName: string;
  repeatReply: string;
  caseID: string;
  xrefCaseID: string;
  documents: Record<string, string>;
  statusDetails: {
    statusDetail: {
      actionType: string;
      actionTakenOn: string;
      activityData: string;
      CSA: string;
    }[];
  };
  facetsIndicator: string;
  inquiryTypeCode: string;
  unreadIndicator: true;
}

@Injectable()
export class CommonService {
  private readonly httpService: HttpService;
  private readonly auditRecordEntityRepository: Repository<AuditRecordEntity>;
  private readonly documentApiRoot: string;
  private readonly dynamicsRoot: string;
  private readonly lcaRoot: string;
  private readonly contactRoot: string;
  private readonly cacheThresholds: number;
  private readonly objectStoreType: string;
  private readonly catalogCache: Record<string, { catchTime: number; cacheDate: CatalogEntity[] }> = {};
  private readonly s3: S3;
  private readonly bucket: string;
  private readonly tempPath: string;
  private readonly jwtService: JwtService;

  constructor(
    httpService: HttpService,
    @InjectRepository(AuditRecordEntity, 'WM_CCC') auditRecordEntityRepository: Repository<AuditRecordEntity>,
    jwtService: JwtService
  ) {
    this.httpService = httpService;
    this.auditRecordEntityRepository = auditRecordEntityRepository;
    // for dotenv-safe should never undefined
    this.documentApiRoot = process.env.WM_CCC_ROOT_URI_DOCUMENT_API || '';
    this.dynamicsRoot = process.env.WM_CC_ROOT_URI_DYNAMICS_ROOT || '';
    this.lcaRoot = process.env.WM_CC_ROOT_URI_LCA_ROOT || '';
    this.cacheThresholds = Number(process.env.WM_CCC_CACHE_THRESHOLDS);
    this.objectStoreType = process.env.WM_CCC_OBJECT_STORAGE_TYPE || '';
    this.bucket = process.env.WM_CCC_OBJECT_STORAGE_S3_BUCKET || '';
    this.tempPath = process.env.WM_CC_TEMPORARY_PATH || '';
    this.contactRoot = process.env.WM_CRMWBI_ROOT_URI_CONTACT_API || '';
    this.jwtService = jwtService;

    this.s3 = new S3({
      apiVersion: '2006-03-01',
      accessKeyId: process.env.WM_CCC_OBJECT_STORAGE_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.WM_CCC_OBJECT_STORAGE_S3_SECRET_ACCESS_KEY,
      region: process.env.WM_CCC_OBJECT_STORAGE_S3_REGION || '',
      params: {
        Bucket: this.bucket
      },
      signatureVersion: 'v4'
    });

    if (!fs.existsSync(this.tempPath)) {
      fs.mkdirSync(this.tempPath);
    }
  }

  /**
   * save one Audit Record
   * @param operation operation
   * @param userId userId operation
   * @param role user role operation
   * @param result operation result
   */
  async saveAuditRecord(operation: string, userId: string, role: string, result: string): Promise<void> {
    const auditRecordEntity = new AuditRecordEntity();
    auditRecordEntity.operation = operation;
    auditRecordEntity.userId = userId;
    auditRecordEntity.role = role;
    auditRecordEntity.result = result;
    auditRecordEntity.time = new Date();
    await this.auditRecordEntityRepository.save(auditRecordEntity);
  }

  /**
   * save Audit Record with error info
   * @param operation operation
   * @param userId userId operation
   * @param role user role operation
   * @param error error object
   */
  async saveErrorAuditRecord(operation: string, userId: string, role: string, error: Error): Promise<Error> {
    if (error instanceof HttpException) {
      await this.saveAuditRecord(operation, userId, role, `failed with error ${error.message.message}`);
      return error;
    } else {
      await this.saveAuditRecord(operation, userId, role, `failed with error ${error.message}`);
      return CommonService.getHttpError(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * get Catalog List from document api or catch
   * @param role user role for request
   */
  async getCatalogList(role: string): Promise<CatalogEntity[]> {
    // not exceeded thresholds, use cache data.
    if (this.catalogCache[role] && Date.now() - this.catalogCache[role].catchTime < this.cacheThresholds) {
      return this.catalogCache[role].cacheDate;
    }

    let response;
    try {
      response = await this.httpService.get(`${this.documentApiRoot}/catalog?role=${role}`).toPromise();
    } catch (error) {
      logger.error('send catalog failed', error.message);
      throw CommonService.getHttpError(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (!response || response.status !== 200 || !response.data) {
      throw CommonService.getHttpError('send catalog failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // set catch date
    this.catalogCache[role] = { catchTime: Date.now(), cacheDate: response.data };

    return response.data;
  }

  /**
   * get Template By Id from document api
   * @param instanceId instance Id
   */
  async getTemplateById(instanceId: string): Promise<Record<string, string>> {
    let response;
    try {
      response = await this.httpService
        .get<Record<string, string>>(`${this.documentApiRoot}/catalog/template/${instanceId}/description`)
        .toPromise();
    } catch (error) {
      logger.error('send template description', error.message);
      throw CommonService.getHttpError(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (!response || response.status !== 200 || !response.data) {
      throw CommonService.getHttpError('send template failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return response.data;
  }

  /**
   * get common error for throw
   * @param message
   * @param statusCode
   */
  static getHttpError(message: string, statusCode: number): HttpException {
    return new HttpException(new WmCccErrorDto(message), statusCode);
  }

  /**
   * throw BadRequest Error
   * @param errors
   */
  static throwBadRequestError(errors: ValidationError[]): void {
    if (!errors || errors.length === 0) {
      return;
    }

    const messages: string[] = [];

    for (const error of errors) {
      for (const key in error.constraints) {
        messages.push(error.constraints[key]);
      }
    }

    throw CommonService.getHttpError(messages.join(', '), HttpStatus.BAD_REQUEST);
  }

  /**
   * send the document approval to SRM, will throw error if send failed.
   * @param role role to approval
   * @param caseId case id
   * @param userId user id to approval
   * @param docId conversation id
   */
  async sendDocumentApprovalOrThrow(role: string, caseId: string, userId: string, docId: string): Promise<void> {
    let response;
    try {
      response = await this.httpService
        .post(`${this.dynamicsRoot}/queue/documentApproval/${role}`, {
          link: `${this.lcaRoot}/approve?user=${userId}&role=${role}&communicationId=${docId}`,
          case: caseId
        })
        .toPromise();
    } catch (error) {
      logger.error('send documentApproval failed with error', error.message);
      throw CommonService.getHttpError(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (!response || response.status !== 200) {
      throw CommonService.getHttpError('send documentApproval failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * send build message to document api then decode.
   * @param instanceId template id
   * @param proof is proof
   */
  async sendBuildContent(proof: boolean, instanceId: string, userId: string, inputData?: Record<string, string>): Promise<Buffer> {
    let response;
    try {
      response = await this.httpService
        .post<{ item: { content: string } }>(
          `${this.documentApiRoot}/content/build`,
          new TransactionalContentRequestDto(proof, instanceId, userId, inputData ? inputData : {})
        )
        .toPromise();
    } catch (error) {
      logger.error('send content/build failed', error.message);
      throw CommonService.getHttpError(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (!response || response.status !== 200 || !response.data || !response.data.item || !response.data.item.content) {
      throw CommonService.getHttpError('send content/build failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // decode here
    const buffer = Buffer.from(response.data.item.content, 'base64');

    return buffer;
  }

  /**
   * use conversion to build document.
   * @param conversation conversation entity
   * @param proof is proof
   */
  async buildDocument(conversation: Conversation, proof: boolean, inputData?: Record<string, string>): Promise<Buffer> {
    const formIdList: string[] = [];

    if (conversation.formId) {
      formIdList.push(conversation.formId);
    } else if (conversation.formQuantity) {
      conversation.formQuantity.forEach(value => {
        formIdList.push(value.formId);
      });
    }

    const selectedCatalogList: CatalogEntity[] = [];
    const catalogList = await this.getCatalogList(conversation.role);
    for (const formId of formIdList) {
      for (const _catalog of catalogList) {
        if (_catalog.formId !== formId) {
          continue;
        }

        selectedCatalogList.push(_catalog);
        break;
      }
    }

    if (selectedCatalogList.length === 0) {
      throw CommonService.getHttpError('Requested catalog is not found in database', HttpStatus.NOT_FOUND);
    }

    const fileNames: string[] = [];

    try {
      for (const catalog of selectedCatalogList) {
        for (const instance of catalog.instances) {
          const built = await this.sendBuildContent(proof, instance.id, conversation.userId, inputData);
          const fileName = path.join(this.tempPath, uuid());
          fileNames.push(fileName);
          await pfs.writeFile(fileName, built);

          const fileType = await fromFile(fileName);
          if (!fileType) {
            throw CommonService.getHttpError('get file type failed', HttpStatus.INTERNAL_SERVER_ERROR);
          }

          if (fileType.mime !== 'application/pdf') {
            throw CommonService.getHttpError(
              `get built file type ${fileType.mime} from document api is not application/pdf`,
              HttpStatus.INTERNAL_SERVER_ERROR
            );
          }
        }
      }

      if (conversation.attachments) {
        for (const attachment of conversation.attachments) {
          if (attachment.contentType !== 'application/pdf') {
            // only merge pdf file. the file type checking has finished when upload.
            continue;
          }

          const download = await this.downloadFromS3(attachment.id);
          const fileName = path.join(this.tempPath, uuid());
          await pfs.writeFile(fileName, download);
          fileNames.push(fileName);
        }
      }

      if (fileNames.length === 1) {
        return await pfs.readFile(fileNames[0]);
      }

      const outputFileName = path.join(this.tempPath, uuid());
      try {
        await merge(fileNames, outputFileName);
      } catch (error) {
        throw CommonService.getHttpError(
          error.message ? `merge pdf files failed with error ${error.message}` : 'merge pdf files failed',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      return await pfs.readFile(outputFileName);
    } finally {
      for (const filePath of fileNames) {
        await pfs.unlink(filePath);
      }
    }
  }

  async downloadFromS3(key: string): Promise<Buffer> {
    if (this.objectStoreType === 'S3') {
      const ret = await this.s3
        .getObject({
          Bucket: this.bucket,
          Key: key
        })
        .promise();

      return ret.Body as Buffer;
    } else {
      return await pfs.readFile(path.join(this.tempPath, key));
    }
  }

  /**
   * upload To S3
   * @param fileBuffer
   * @param key
   * @param contentType
   */
  async uploadToS3(fileBuffer: Buffer, key: string, contentType?: string): Promise<string> {
    if (this.objectStoreType === 'S3') {
      const ret = await this.s3
        .upload({
          ContentType: contentType,
          ACL: 'public-read',
          Bucket: this.bucket,
          Key: key,
          Body: fileBuffer
        })
        .promise();

      return ret.Location;
    } else {
      const filePath = path.join(this.tempPath, key);
      await pfs.writeFile(filePath, fileBuffer);
      return filePath;
    }
  }

  /**
   * delete from S3
   * @param fileBuffer
   * @param key
   * @param contentType
   */
  async deleteFromS3(key: string): Promise<void> {
    if (this.objectStoreType === 'S3') {
      try {
        await this.s3
          .deleteObject({
            Bucket: this.bucket,
            Key: key
          })
          .promise();
      } catch (error) {
        logger.error('deleteFromS3 failed with error', error);
        throw CommonService.getHttpError('delete From S3 failed', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } else {
      const filePath = path.join(this.tempPath, key);
      await pfs.unlink(filePath);
    }
  }

  /**
   * send Web Inquiry message to get WebInquiry
   * @param id Web Inquiry id
   */
  async sendWebInquiryGet(id: string, payload: Payload): Promise<WebInquiryDetailDto[]> {
    let response;
    try {
      response = await this.httpService
        .get<QuestionDetail[]>(`${this.contactRoot}/web-inquiry/${id}?includeParentInquiries=true`, {
          headers: { Authorization: `bearer ${this.sign((payload as unknown) as Record<string, string>)}` }
        })
        .toPromise();
    } catch (error) {
      logger.error('send web-inquiry get failed', error.message);
      throw CommonService.getHttpError(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (!response || response.status !== 200 || !response.data) {
      throw CommonService.getHttpError('send web-inquiry get failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    function setNotMatchProperty(des: Record<string, string>, desKey: string, src: Record<string, string>, srcKey: string): void {
      if (src[srcKey]) {
        des[desKey] = src[srcKey];
        delete src[srcKey];
      }
    }

    const ret: WebInquiryDetailDto[] = [];

    for (const questionDetail of response.data) {
      const webInquiryDetail = new WebInquiryDetailDto();

      // handle the not match property.
      setNotMatchProperty(
        (webInquiryDetail as unknown) as Record<string, string>,
        'wellmarkId',
        (questionDetail as unknown) as Record<string, string>,
        'wellmarkID'
      );
      setNotMatchProperty(
        (webInquiryDetail as unknown) as Record<string, string>,
        'patientDob',
        (questionDetail as unknown) as Record<string, string>,
        'patientDOB'
      );
      setNotMatchProperty(
        (webInquiryDetail as unknown) as Record<string, string>,
        'icn',
        (questionDetail as unknown) as Record<string, string>,
        'iCN'
      );
      setNotMatchProperty(
        (webInquiryDetail as unknown) as Record<string, string>,
        'sccf',
        (questionDetail as unknown) as Record<string, string>,
        'sCCF'
      );
      setNotMatchProperty(
        (webInquiryDetail as unknown) as Record<string, string>,
        'submitterNpi',
        (questionDetail as unknown) as Record<string, string>,
        'submitterNPI'
      );
      setNotMatchProperty(
        (webInquiryDetail as unknown) as Record<string, string>,
        'caseId',
        (questionDetail as unknown) as Record<string, string>,
        'caseID'
      );
      setNotMatchProperty(
        (webInquiryDetail as unknown) as Record<string, string>,
        'wellmarkId',
        (questionDetail as unknown) as Record<string, string>,
        'wellmarkID'
      );
      if (questionDetail.statusDetails && questionDetail.statusDetails.statusDetail) {
        webInquiryDetail.statusDetails = [];
        for (const statusDetail of questionDetail.statusDetails.statusDetail) {
          webInquiryDetail.statusDetails.push({
            actionType: statusDetail.actionType,
            actionTakenOn: statusDetail.actionTakenOn,
            activityData: statusDetail.activityData,
            csa: statusDetail.CSA
          });
        }

        delete questionDetail.statusDetails;
      }

      Object.assign(webInquiryDetail, questionDetail);

      ret.push(webInquiryDetail);
    }

    return ret;
  }

  /**
   * send Web Inquiry message to create a new response to the current thread in the web inquiry.
   * @param id Web Inquiry id
   * @param body WebInquiryResponseFields
   */
  async sendWebInquiryPatch(id: string, body: WebInquiryResponseFields, payload: Payload): Promise<void> {
    let response;
    try {
      response = await this.httpService
        .put<void>(`${this.contactRoot}/web-inquiry/${id}`, body, {
          headers: { Authorization: `bearer ${this.sign((payload as unknown) as Record<string, string>)}` }
        })
        .toPromise();
    } catch (error) {
      logger.error('send web-inquiry patch failed', error.message);
      throw CommonService.getHttpError(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (!response || response.status !== 201) {
      throw CommonService.getHttpError('send web-inquiry patch failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * use payload object to make a sign
   * @param payload the payload to sign
   */
  sign(payload: Record<string, string>): string {
    return this.jwtService.sign(payload);
  }
}
