/**
 * the service for conversation model
 */

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { fromStream } from 'file-type';
import { ObjectID } from 'mongodb';
import { Duplex } from 'stream';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import logger from '../../lib/logger';
import { CommonService } from '../common/common.service';
import { UserAndRoleCommonQuery } from '../common/dto/common.query.dto';
import { CatalogEntity } from '../common/entity/catalog.entity';
import { AttachmentDto } from './dto/attachment.dto';
import { AttachmentRequestBodyDto } from './dto/attachment.request.body.dto';
import { ConversationCreateRequest } from './dto/conversation.create.request.dto';
import { ConversationDownloadQueryDto } from './dto/conversation.download.query.dto';
import { ConversationDto } from './dto/conversation.dto';
import { ConversationPreviewRequestDto } from './dto/conversation.preview.request.dto';
import { ConversationUpdateBodyDto } from './dto/conversation.update.body.dto';
import { ApprovalStep } from './entity/approval.entity';
import { Attachment } from './entity/attachment.entity';
import { Conversation } from './entity/conversation.entity';
import { ApprovalStatus } from './enum/approval.status.enum';
import { DocumentStatus } from './enum/document.status.enum';

@Injectable()
export class ConversationsService {
  private readonly conversationRepository: Repository<Conversation>;
  private readonly commonService: CommonService;
  constructor(@InjectRepository(Conversation, 'WM_CCC') conversationRepository: Repository<Conversation>, commonService: CommonService) {
    this.conversationRepository = conversationRepository;
    this.commonService = commonService;
  }

  /**
   * add attachment
   * @param id conversation id
   * @param query UserAndRoleCommonQuery
   * @param body AttachmentDto
   */
  async addAttachment(id: string, query: UserAndRoleCommonQuery, body: AttachmentRequestBodyDto, buffer: Buffer): Promise<AttachmentDto> {
    const conversation = await this.getConversationById(id, query, false);
    if (!conversation.attachments) {
      conversation.attachments = [];
    }

    const stream = new Duplex();
    stream.push(buffer);
    stream.push(null);

    const fileType = await fromStream(stream);
    if (!fileType) {
      throw CommonService.getHttpError('get file type failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (fileType.mime !== body.contentType) {
      throw CommonService.getHttpError(
        `the file type ${fileType.mime} uploaded is not same as defined in contentType ${body.contentType}`,
        HttpStatus.BAD_REQUEST
      );
    }

    const attachment = new AttachmentDto();

    attachment.id = uuid();
    attachment.attachmentLocation = await this.commonService.uploadToS3(buffer, attachment.id, body.contentType);
    attachment.contentType = body.contentType;
    attachment.originalFilename = body.originalFilename;

    conversation.attachments.push(attachment);

    await this.conversationRepository.save(conversation);

    await this.commonService.saveAuditRecord('add attachment', query.userId, query.role, 'success');

    return attachment;
  }

  /**
   * get attachment by id
   * @param id conversation id
   * @param query UserAndRoleCommonQuery
   * @param attachmentId attachment id
   */
  async getAttachment(id: string, query: UserAndRoleCommonQuery, attachmentId: string): Promise<AttachmentDto> {
    const conversation = await this.getConversationById(id, query, false);
    if (!conversation.attachments) {
      throw CommonService.getHttpError('Requested entity is not found in database', HttpStatus.NOT_FOUND);
    }

    for (const attachment of conversation.attachments) {
      if (attachment.id !== attachmentId) {
        continue;
      }

      return attachment;
    }

    throw CommonService.getHttpError('Requested entity is not found in database', HttpStatus.NOT_FOUND);
  }

  /**
   * download attachment by id
   * @param id conversation id
   * @param query UserAndRoleCommonQuery
   * @param attachmentId attachment id
   */
  async downloadAttachment(id: string, query: UserAndRoleCommonQuery, attachmentId: string): Promise<Buffer> {
    const conversation = await this.getConversationById(id, query, false);
    if (!conversation.attachments) {
      throw CommonService.getHttpError('Requested entity is not found in database', HttpStatus.NOT_FOUND);
    }

    for (const attachment of conversation.attachments) {
      if (attachment.id !== attachmentId) {
        continue;
      }

      return this.commonService.downloadFromS3(attachment.id);
    }

    throw CommonService.getHttpError('Requested entity is not found in database', HttpStatus.NOT_FOUND);
  }

  /**
   * delete attachment
   * @param id conversation id
   * @param query UserAndRoleCommonQuery
   * @param attachmentId attachment id
   */
  async deleteAttachment(id: string, query: UserAndRoleCommonQuery, attachmentId: string): Promise<void> {
    const conversation = await this.getConversationById(id, query, false);
    if (!conversation.attachments) {
      throw CommonService.getHttpError('Requested entity is not found in database', HttpStatus.NOT_FOUND);
    }

    const leftAttachments = conversation.attachments.filter((value: Attachment) => value.id !== attachmentId);
    if (leftAttachments.length === conversation.attachments.length) {
      throw CommonService.getHttpError('Requested entity is not found in database', HttpStatus.NOT_FOUND);
    }

    conversation.attachments = leftAttachments;

    await this.commonService.deleteFromS3(attachmentId);

    await this.conversationRepository.save(conversation);

    await this.commonService.saveAuditRecord(`delete attachment ${id}`, query.userId, query.role, 'success');
  }

  /**
   * find By CaseId
   * @param caseId case id
   * @param query UserAndRoleCommonQuery
   */
  async findByCaseId(caseId: string, query: UserAndRoleCommonQuery): Promise<ConversationDto> {
    const conversation = await this.conversationRepository.findOne(Object.assign({ caseId }, query));
    if (!conversation) {
      throw CommonService.getHttpError('Requested entity is not found in database', HttpStatus.NOT_FOUND);
    }

    return new ConversationDto(conversation);
  }

  /**
   * find By conversation Id
   * @param id conversation Id
   * @param query UserAndRoleCommonQuery
   */
  async findById(id: string, query: UserAndRoleCommonQuery): Promise<ConversationDto> {
    return new ConversationDto(await this.getConversationById(id, query));
  }

  /**
   * get Conversation By Id
   * @param id Conversation id
   * @param query UserAndRoleCommonQuery
   */
  private async getConversationById(id: string, query: UserAndRoleCommonQuery, check?: boolean): Promise<Conversation> {
    if (!ObjectID.isValid(id)) {
      throw CommonService.getHttpError('id is invalid', HttpStatus.BAD_REQUEST);
    }

    const conversation = await this.conversationRepository.findOne(id);
    if (!conversation) {
      throw CommonService.getHttpError('Requested entity is not found in database', HttpStatus.NOT_FOUND);
    }

    if (check === false) {
      return conversation;
    }

    if (query.userId && conversation.userId !== query.userId) {
      throw CommonService.getHttpError('Requested entity is not found in database', HttpStatus.NOT_FOUND);
    }

    if (query.role && conversation.role !== query.role) {
      throw CommonService.getHttpError('Requested entity is not found in database', HttpStatus.NOT_FOUND);
    }

    return conversation;
  }

  /**
   * set conversation Approval Chain by catalog
   * @param conversation conversation entity
   * @param formId
   * @param builderRole the role who create conversation
   * @param catalogList whole catalog list for the builder role
   */
  private static setApprovalChain(conversation: Conversation, formId: string, builderRole: string, catalogList: CatalogEntity[]): void {
    for (const catalog of catalogList) {
      if (formId !== catalog.formId) {
        continue;
      }

      // forbidden to build
      if (['*'].toString() !== catalog.authorizations.build.toString() && catalog.authorizations.build.indexOf(builderRole) < 0) {
        throw CommonService.getHttpError('authorization for build check failed', HttpStatus.FORBIDDEN);
      }

      conversation.approvalChain = [];

      // no need to approval, use the input user role
      if (['*'].toString() === catalog.authorizations.release.toString()) {
        conversation.approvalChain.push(new ApprovalStep(builderRole));
      } else {
        for (const releaseRole of catalog.authorizations.release) {
          conversation.approvalChain.push(new ApprovalStep(releaseRole));
        }
      }

      return;
    }

    throw CommonService.getHttpError(`templateId ${formId} not exists.`, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  /**
   * create Conversation
   * @param query UserAndRoleCommonQuery
   * @param body ConversationCreateRequest
   */
  async createConversation(query: UserAndRoleCommonQuery, body: ConversationCreateRequest): Promise<ConversationDto> {
    const dbConversation = await this.conversationRepository.findOne(Object.assign({ caseId: body.caseId }, query));
    if (dbConversation) {
      throw CommonService.getHttpError(`case id ${body.caseId} exists.`, HttpStatus.BAD_REQUEST);
    }

    const conversation = new Conversation();

    conversation.caseId = body.caseId;
    conversation.formQuantity = body.formQuantity;
    conversation.formId = body.formId;
    conversation.userId = query.userId;
    conversation.role = query.role;
    conversation.status = DocumentStatus.draft;

    const catalogList = await this.commonService.getCatalogList(query.role);

    if (body.formId) {
      ConversationsService.setApprovalChain(conversation, body.formId, query.role, catalogList);
    }

    const ret = new ConversationDto(await this.conversationRepository.save(conversation));

    await this.commonService.saveAuditRecord(`add conversation`, query.userId, query.role, 'success');

    return ret;
  }

  /**
   * update Conversation
   * @param id Conversation id
   * @param query UserAndRoleCommonQuery
   * @param body ConversationDto
   */
  async updateConversation(id: string, query: UserAndRoleCommonQuery, body: ConversationUpdateBodyDto): Promise<ConversationDto> {
    const conversation = await this.getConversationById(id, query, false);

    Object.assign(conversation, body);

    // only build document for form conversation
    if (conversation.formQuantity && conversation.formQuantity.length > 0) {
      const buffer = await this.commonService.buildDocument(conversation, false);
      conversation.finalVersionS3Url = await this.commonService.uploadToS3(buffer, uuid());
    }

    const ret = new ConversationDto(await this.conversationRepository.save(conversation));

    await this.commonService.saveAuditRecord(`update conversation ${id}`, query.userId, query.role, 'success');

    return ret;
  }

  /**
   * get Last Approval Step for approval.
   * @param approvalStepList ApprovalStep list
   */
  private static getLastApprovalStep(approvalStepList: ApprovalStep[]): ApprovalStep {
    if (approvalStepList.length === 1) {
      return approvalStepList[0];
    }

    if (approvalStepList.length > 1 && approvalStepList[approvalStepList.length - 2].status === ApprovalStatus.Approved) {
      return approvalStepList[approvalStepList.length - 1];
    }

    return (null as unknown) as ApprovalStep;
  }

  /**
   * get Current Approval Step for approval roles
   * @param approvalStepList
   */
  private static getCurrentApprovalStep(approvalStepList: ApprovalStep[]): ApprovalStep {
    if (approvalStepList.length > 1) {
      for (let i = 0; i < approvalStepList.length - 1; i++) {
        if (approvalStepList[i].status === ApprovalStatus.Pending) {
          return approvalStepList[i];
        }
      }
    }

    return (null as unknown) as ApprovalStep;
  }

  /**
   * approve Current Step
   * @param id conversation id
   * @param reason the reason for approve
   * @param query UserAndRoleCommonQuery
   */
  async approveCurrentStep(id: string, query: UserAndRoleCommonQuery): Promise<void> {
    const conversation = await this.getConversationById(id, query, false);

    if (conversation.status !== DocumentStatus.draft) {
      throw CommonService.getHttpError(`can not approve with status ${conversation.status}`, HttpStatus.FORBIDDEN);
    }

    const currentStep = ConversationsService.getCurrentApprovalStep(conversation.approvalChain);
    if (!currentStep || currentStep.role !== query.role) {
      throw CommonService.getHttpError(`current step can't approve by ${query.role}`, HttpStatus.FORBIDDEN);
    }

    currentStep.reason = '';
    currentStep.status = ApprovalStatus.Approved;
    currentStep.userId = query.userId;

    await this.commonService.sendDocumentApprovalOrThrow(query.role, conversation.caseId, query.userId, conversation._id.toString());

    try {
      // update data
      await this.conversationRepository.save(conversation);
    } catch (error) {
      logger.error(error);
      throw error;
    }

    await this.commonService.saveAuditRecord(`request approval conversation ${id}`, query.userId, query.role, 'success');
  }

  /**
   * final approve
   * @param id conversation id
   * @param reason the reason for approve
   * @param query UserAndRoleCommonQuery
   */
  async approve(id: string, reason: string, query: UserAndRoleCommonQuery): Promise<ConversationDto> {
    const conversation = await this.getConversationById(id, query, false);

    if (conversation.status !== DocumentStatus.draft && conversation.status !== DocumentStatus.rejected) {
      throw CommonService.getHttpError(`can not approve with status ${conversation.status}`, HttpStatus.FORBIDDEN);
    }

    const lastStep = ConversationsService.getLastApprovalStep(conversation.approvalChain);
    if (!lastStep) {
      throw CommonService.getHttpError(`it's not the time to approve`, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (lastStep.role !== query.role) {
      throw CommonService.getHttpError(`last step can't approve by ${query.role}`, HttpStatus.FORBIDDEN);
    }

    lastStep.reason = reason;
    lastStep.status = ApprovalStatus.Approved;
    lastStep.userId = query.userId;
    conversation.status = DocumentStatus.approved;

    // build document
    const buffer = await this.commonService.buildDocument(conversation, false);

    conversation.finalVersionS3Url = await this.commonService.uploadToS3(buffer, uuid());

    // update data
    const ret = new ConversationDto(await this.conversationRepository.save(conversation));

    await this.commonService.saveAuditRecord(`approval conversation ${id}`, query.userId, query.role, 'success');

    return ret;
  }

  /**
   * cancel conversation
   * @param id conversation id
   * @param query UserAndRoleCommonQuery
   */
  async cancel(id: string, query: UserAndRoleCommonQuery): Promise<ConversationDto> {
    const conversation = await this.getConversationById(id, query, false);

    if (conversation.status === DocumentStatus.cancelled) {
      throw CommonService.getHttpError(`can not cancel with status ${conversation.status}`, HttpStatus.FORBIDDEN);
    }

    conversation.status = DocumentStatus.cancelled;

    // update data
    const ret = new ConversationDto(await this.conversationRepository.save(conversation));

    await this.commonService.saveAuditRecord(`cancel conversation ${id}`, query.userId, query.role, 'success');

    return ret;
  }

  /**
   * reject conversation
   * @param id conversation id
   * @param reason the reason for approve
   * @param query UserAndRoleCommonQuery
   */
  async reject(id: string, reason: string, query: UserAndRoleCommonQuery): Promise<ConversationDto> {
    const conversation = await this.getConversationById(id, query, false);

    if (conversation.status !== DocumentStatus.draft) {
      throw CommonService.getHttpError(`can not reject with status ${conversation.status}`, HttpStatus.FORBIDDEN);
    }

    const lastStep = ConversationsService.getLastApprovalStep(conversation.approvalChain);
    if (!lastStep) {
      throw CommonService.getHttpError(`it's not the time to reject`, HttpStatus.FORBIDDEN);
    }

    if (lastStep.role !== query.role) {
      throw CommonService.getHttpError(`last step can't reject by ${query.role}`, HttpStatus.FORBIDDEN);
    }

    lastStep.reason = reason;
    lastStep.status = ApprovalStatus.Rejected;
    lastStep.userId = query.userId;
    conversation.status = DocumentStatus.rejected;

    // delete all attachment before the final build
    if (conversation.attachments) {
      for (const attachment of conversation.attachments) {
        await this.commonService.deleteFromS3(attachment.id);
      }
    }

    conversation.attachments = [];

    // update data
    const ret = new ConversationDto(await this.conversationRepository.save(conversation));

    await this.commonService.saveAuditRecord(`reject conversation ${id}`, query.userId, query.role, 'success');

    return ret;
  }

  /**
   * download
   * @param id conversation id
   * @param query ConversationDownloadQueryDto
   */
  async download(id: string, query: ConversationDownloadQueryDto): Promise<Buffer> {
    const conversation = await this.getConversationById(id, query, false);

    try {
      const ret = await this.commonService.buildDocument(conversation, query.isProof === 'true', JSON.parse(query.inputData));

      await this.commonService.saveAuditRecord(`download conversation ${id}`, query.userId, query.role, 'success');

      return ret;
    } catch (error) {
      logger.error(error);
      throw CommonService.getHttpError(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * preview
   * @param id conversation id
   * @param query ConversationDownloadQueryDto
   */
  async preview(id: string, query: UserAndRoleCommonQuery, body: ConversationPreviewRequestDto): Promise<Buffer> {
    const conversation = await this.getConversationById(id, query, false);

    const ret = await this.commonService.sendBuildContent(
      true,
      body.instance.id,
      conversation.userId,
      body.inputData as Record<string, string>
    );

    await this.commonService.saveAuditRecord(`preview conversation ${id}`, query.userId, query.role, 'success');

    return ret;
  }
}
