import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import * as assert from 'assert';
import { plainToClass } from 'class-transformer';
import { fromStream } from 'file-type';
import { ObjectID } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getConnectionManager, Repository } from 'typeorm';

import { CommonModule } from '../common/common.module';
import { CommonService } from '../common/common.service';
import { UserAndRoleCommonQuery } from '../common/dto/common.query.dto';
import { AuditRecordEntity } from '../common/entity/audit.record.entity';
import { CatalogEntity } from '../common/entity/catalog.entity';
import { ConversationsService } from './conversations.service';
import { ConversationCreateRequest } from './dto/conversation.create.request.dto';
import { ConversationDto } from './dto/conversation.dto';
import { ConversationPreviewRequestDto } from './dto/conversation.preview.request.dto';
import { ConversationUpdateBodyDto } from './dto/conversation.update.body.dto';
import { Conversation } from './entity/conversation.entity';
import { ApprovalStatus } from './enum/approval.status.enum';
import { DocumentStatus } from './enum/document.status.enum';

jest.mock('file-type');

const testCatalogData = [
  {
    name: 'WBCBS - Surrogate Letter- More Information Needed',
    displayName: 'WBCBS - Surrogate Letter- More Information Needed',
    formId: 'no_Approval_template_and_build',
    created: '2020-01-01T00:00:00+0000',
    lastUpdated: '2020-01-01T00:00:00+0000',
    description:
      'This letter is sent to members who have inquired about being a surrogate. The purpose of this letter is to get more information about the arrangement.',
    sourceSystemType: 'GMC',
    configuration: {
      template: 'WFD_DETAILS_NEEDED',
      job: 'JOB_DETAILS_NEEDED',
      templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
    },
    instances: [
      {
        id: 'gmctid:7ae35c41-7a9b-4b93-93e7-ce115d5881f1',
        contentType: 'application/pdf'
      }
    ],
    templateDescriptionAvailable: true,
    subject: ['Benefits'],
    segment: [
      'SGACA',
      'SGGM',
      'SGGF',
      'Large Group',
      'Group Med Supp',
      'Indv MedSupp',
      'Indv U65 ACA',
      'Indv U65 GM',
      'Indv U65 GF',
      'Indv Medicare Adv',
      'FBHBP',
      'Other'
    ],
    audience: ['Member'],
    businessArea: 'Customer Service',
    type: 'Surrogate',
    authorizations: {
      build: ['*'],
      release: ['*']
    },
    data: [],
    owners: [
      {
        name: 'Operations - Correspondence Owners',
        userId: 'operationsCorrespondence@wellmark.com'
      }
    ],
    mailroom: {
      returnEnvelope: false
    }
  },
  {
    name: 'WBCBS - Surrogacy Letter- Benefits decision',
    displayName: 'WBCBS - Surrogacy Letter- Benefits decision',
    formId: 'Approval_template_and_build',
    created: '2020-01-01T00:00:00+0000',
    lastUpdated: '2020-01-01T00:00:00+0000',
    description:
      "This letter is sent to the surrogate describing Wellmark's decision to process benefits as they are outlined in the coverage manual.",
    sourceSystemType: 'GMC',
    configuration: {
      template: 'WFD_DETAILS_NEEDED',
      job: 'JOB_DETAILS_NEEDED',
      templateDescription: 'TEMPLATE_DESCRIPTION_DETAILS_NEEDED'
    },
    instances: [
      {
        id: 'gmctid:7ae35c41-7a9b-4b93-93e7-ce115d5881f1',
        contentType: 'application/pdf'
      }
    ],
    templateDescriptionAvailable: true,
    subject: ['Benefits'],
    segment: [
      'SGACA',
      'SGGM',
      'SGGF',
      'Large Group',
      'Group Med Supp',
      'Indv MedSupp',
      'Indv U65 ACA',
      'Indv U65 GM',
      'Indv U65 GF',
      'Indv Medicare Adv',
      'FBHBP',
      'Other'
    ],
    audience: ['Member'],
    businessArea: 'Customer Service',
    type: 'Surrogate',
    authorizations: {
      build: ['build_user'],
      release: ['CSA', 'CSA-SUPERVISOR', 'LEGAL', 'MARCOM']
    },
    data: [],
    owners: [
      {
        name: 'Operations - Correspondence Owners',
        userId: 'operationsCorrespondence@wellmark.com'
      }
    ],
    mailroom: {
      returnEnvelope: false
    }
  }
];

describe('ConversationsService', () => {
  let service: ConversationsService;
  let conversationRepository: Repository<Conversation>;
  const mongod = new MongoMemoryServer();
  const mockGetCatalogList = jest.fn();
  const mockSendDocumentApprovalOrThrow = jest.fn();
  const mockBuildDocument = jest.fn();
  const mockUploadToS3 = jest.fn();
  const mockDeleteFromS3 = jest.fn();
  const mockDownloadFromS3 = jest.fn();
  const mockSaveAuditRecord = jest.fn();
  const mockSaveErrorAuditRecord = jest.fn();
  const mockSendBuildContent = jest.fn();
  const mockGetConversationFromId = jest.fn();
  class MockCommonService {
    async getCatalogList(role: string): Promise<CatalogEntity[]> {
      return mockGetCatalogList(role);
    }

    async sendDocumentApprovalOrThrow(role: string, caseId: string, userId: string, docId: string): Promise<void> {
      return mockSendDocumentApprovalOrThrow(role, caseId, userId, docId);
    }

    async buildDocument(conversation: Conversation, proof: boolean): Promise<Buffer[]> {
      return mockBuildDocument(conversation, proof);
    }

    async uploadToS3(fileBuffer: Buffer, key: string): Promise<string> {
      return mockUploadToS3(fileBuffer, key);
    }

    async downloadFromS3(fileBuffer: Buffer, key: string): Promise<string> {
      return mockDownloadFromS3(fileBuffer, key);
    }

    async deleteFromS3(key: string): Promise<void> {
      return mockDeleteFromS3(key);
    }

    async saveAuditRecord(operation: string, userId: string, role: string, result: string): Promise<void> {
      mockSaveAuditRecord(operation, userId, role, result);
    }

    async saveErrorAuditRecord(operation: string, userId: string, role: string, error: Error): Promise<Error> {
      return mockSaveErrorAuditRecord(operation, userId, role, error);
    }

    async sendBuildContent(proof: boolean, instanceId: string, userId: string, inputData?: Record<string, string>): Promise<Buffer> {
      return mockSendBuildContent(proof, instanceId, userId, inputData);
    }

    async getConversationById(id: string, query: UserAndRoleCommonQuery, check?: boolean): Promise<Conversation> {
      return mockGetConversationFromId(id, query, check);
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          name: 'WM_CCC',
          type: 'mongodb',
          url: await mongod.getUri(),
          entities: [Conversation, AuditRecordEntity],
          synchronize: true
        }),
        TypeOrmModule.forFeature([Conversation], 'WM_CCC'),
        CommonModule
      ],
      providers: [ConversationsService]
    })
      .overrideProvider(CommonService)
      .useClass(MockCommonService)
      .compile();

    service = module.get<ConversationsService>(ConversationsService);
    conversationRepository = module.get<Repository<Conversation>>(getRepositoryToken(Conversation, 'WM_CCC'));
    mockGetCatalogList.mockResolvedValue(testCatalogData);
    mockSendDocumentApprovalOrThrow.mockResolvedValue(null);
  });

  afterEach(async () => {
    await getConnectionManager().connections[0].close();
    await mongod.stop();

    mockGetCatalogList.mockReset();
    mockSendDocumentApprovalOrThrow.mockReset();
    mockBuildDocument.mockReset();
  });

  async function saveAndGetConversation(data?: Conversation): Promise<Conversation> {
    const initConversation = new Conversation();
    initConversation.userId = 'test_userId';
    initConversation.caseId = 'test_caseId';
    initConversation.role = 'test_role';
    return await conversationRepository.save(Object.assign(initConversation, data));
  }

  async function saveAndGetConversationWithAttachments(data?: Conversation): Promise<Conversation> {
    const initConversation = new Conversation();
    initConversation.userId = 'test_userId';
    initConversation.caseId = 'test_caseId';
    initConversation.role = 'test_role';
    initConversation.attachments = [{ id: 'tt', originalFilename: 'tt', contentType: 'pdf', attachmentLocation: 'tt' }];
    return await conversationRepository.save(Object.assign(initConversation, data));
  }

  describe('', () => {
    it('should ', async () => {});
  });

  describe('create conversation', () => {
    it('should create conversation success with no_Approval_template', async () => {
      const ret = await service.createConversation(
        { userId: 'test_user', role: 'test_role' },
        { caseId: 'test_caseId', formId: 'no_Approval_template_and_build', formQuantity: [] }
      );

      expect(ret.caseId).toBe('test_caseId');
      const db = await conversationRepository.find();
      expect(db.length).toBe(1);
      expect(db[0].approvalChain.length).toBe(1);
      expect(db[0].approvalChain[0].role).toBe('test_role');
    });

    it('should create conversation success with Approval_template', async () => {
      const ret = await service.createConversation(
        { userId: 'test_user', role: 'build_user' },
        { caseId: 'test_caseId', formId: 'Approval_template_and_build', formQuantity: [] }
      );

      expect(ret.caseId).toBe('test_caseId');
      const db = await conversationRepository.find();
      expect(ret.approvalChain.length).toBe(4);
      expect(db.length).toBe(1);
    });

    it('should not create conversation for letterId not match', async () => {
      try {
        await service.createConversation(
          { userId: 'test_user', role: 'test_role' },
          { caseId: 'test_caseId', formId: 'test_letterId', formQuantity: [] }
        );

        assert.fail('should not be here');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message.message).toBe('templateId test_letterId not exists.');
      }
    });

    it('should not create conversation for no access to build', async () => {
      try {
        await service.createConversation(
          { userId: 'test_user', role: 'test_role' },
          { caseId: 'test_caseId', formId: 'Approval_template_and_build', formQuantity: [] }
        );

        assert.fail('should not be here');
      } catch (error) {
        expect(error.message.message).toBe('authorization for build check failed');
      }
    });

    it('should not create conversation for caseId exists', async () => {
      const dbConversation = await saveAndGetConversation();

      try {
        await service.createConversation(
          { userId: dbConversation.userId, role: dbConversation.role },
          { caseId: dbConversation.caseId, formId: 'Approval_template_and_build', formQuantity: [] }
        );

        assert.fail('should not be here');
      } catch (error) {
        expect(error.message.message).toBe(`case id ${dbConversation.caseId} exists.`);
      }
    });
  });

  describe('get conversation', () => {
    it('should get conversation success', async () => {
      const dbConversation = await saveAndGetConversation();

      let ret = await service.findByCaseId(dbConversation.caseId, { userId: dbConversation.userId, role: dbConversation.role });
      expect(ret.id).toBe(dbConversation._id.toString());

      ret = await service.findById(dbConversation._id.toString(), { userId: dbConversation.userId, role: dbConversation.role });
      expect(ret).toBeDefined();

      ret = await service.findByCaseId(dbConversation.caseId, ({} as unknown) as UserAndRoleCommonQuery);
      expect(ret.id).toBe(dbConversation._id.toString());

      ret = await service.findById(dbConversation._id.toString(), ({} as unknown) as UserAndRoleCommonQuery);
      expect(ret).toBeDefined();
    });

    it('should not get conversation success for no data found', async () => {
      try {
        await service.findByCaseId('test_id', { userId: 'test_user', role: 'test_role' });
        assert.fail('should not be here');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message.message).toBe('Requested entity is not found in database');
      }

      try {
        await service.findById('5e9d8677c1d8e521d212cfc6', { userId: 'test_user', role: 'test_role' });
        assert.fail('should not be here');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message.message).toBe('Requested entity is not found in database');
      }
    });

    it('should not get conversation success for use or role not match', async () => {
      const dbConversation = await saveAndGetConversation();

      try {
        await service.findById(dbConversation._id.toString(), { userId: dbConversation.userId + 'test', role: dbConversation.role });
        assert.fail('should not be here');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message.message).toBe('Requested entity is not found in database');
      }

      try {
        await service.findById(dbConversation._id.toString(), { userId: dbConversation.userId, role: dbConversation.role + 'test' });
        assert.fail('should not be here');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message.message).toBe('Requested entity is not found in database');
      }
    });
  });

  describe('update conversation', () => {
    it('should update conversastion success', async () => {
      const initConversation = await saveAndGetConversation();
      const newConversation = new ConversationDto(initConversation);
      newConversation.formQuantity = [
        {
          formId: '123456',
          quantity: 1
        }
      ];

      const ret = await service.updateConversation(
        initConversation._id.toString(),
        ({} as unknown) as UserAndRoleCommonQuery,
        newConversation
      );

      expect(ret.formQuantity).toStrictEqual(newConversation.formQuantity);
      const dbConversation = await conversationRepository.find();
      expect(dbConversation.length).toBe(1);
      expect(dbConversation[0].formQuantity[0]).toEqual(ret.formQuantity[0]);
    });
  });

  describe('approve conversation', () => {
    it('should approve success', async () => {
      const dbConversation = await saveAndGetConversation(({
        role: 'role step 2',
        status: DocumentStatus.draft,
        approvalChain: [
          {
            role: 'role step 1',
            userId: '',
            reason: '',
            status: ApprovalStatus.Approved
          },
          {
            role: 'role step 2',
            userId: '',
            reason: '',
            status: ApprovalStatus.Pending
          }
        ]
      } as unknown) as Conversation);

      try {
        plainToClass(ConversationDto, dbConversation);
        plainToClass(ConversationPreviewRequestDto, dbConversation);
        plainToClass(ConversationUpdateBodyDto, dbConversation);
        plainToClass(ConversationCreateRequest, dbConversation);
      } catch (error) {}

      mockBuildDocument.mockResolvedValue([]);

      const ret = await service.approve(dbConversation._id.toString(), 'test_reason', {
        userId: dbConversation.userId,
        role: dbConversation.role
      });

      expect(ret.id).toBe(dbConversation._id.toString());

      const dbData = await conversationRepository.find();
      expect(dbData.length).toBe(1);
      expect(dbData[0].approvalChain[1].reason).toBe('test_reason');
      expect(dbData[0].approvalChain[1].status).toBe(ApprovalStatus.Approved);
      expect(dbData[0].status).toBe(DocumentStatus.approved);
      expect(mockBuildDocument).toBeCalledTimes(1);
      expect(mockBuildDocument).toBeCalledWith(dbData[0], false);
    });

    it('should approve success for only one step', async () => {
      const dbConversation = await saveAndGetConversation(({
        role: 'role step 1',
        status: DocumentStatus.draft,
        approvalChain: [
          {
            role: 'role step 1',
            userId: '',
            reason: '',
            status: ApprovalStatus.Approved
          }
        ]
      } as unknown) as Conversation);

      mockUploadToS3.mockResolvedValue('test');

      const ret = await service.approve(dbConversation._id.toString(), 'test_reason', {
        userId: dbConversation.userId,
        role: dbConversation.role
      });

      expect(ret.id).toBe(dbConversation._id.toString());

      const dbData = await conversationRepository.find();
      expect(dbData.length).toBe(1);
      expect(dbData[0].approvalChain[0].reason).toBe('test_reason');
      expect(dbData[0].approvalChain[0].status).toBe(ApprovalStatus.Approved);
      expect(dbData[0].status).toBe(DocumentStatus.approved);
      expect(mockBuildDocument).toBeCalledTimes(1);
      expect(mockBuildDocument).toBeCalledWith(dbData[0], false);
    });

    it('should not approve success for not the last step', async () => {
      const dbConversation = await saveAndGetConversation(({
        role: 'role step 1',
        status: DocumentStatus.draft,
        approvalChain: [
          {
            role: 'role step 1',
            userId: '',
            reason: '',
            status: ApprovalStatus.Pending
          },
          {
            role: 'role step 2',
            userId: '',
            reason: '',
            status: ApprovalStatus.Pending
          }
        ]
      } as unknown) as Conversation);

      try {
        await service.approve(dbConversation._id.toString(), 'test_reason', {
          userId: dbConversation.userId,
          role: dbConversation.role
        });
        assert.fail('should not be here');
      } catch (error) {
        expect(error.message.message).toBe(`it's not the time to approve`);
      }
    });

    it('should not approve success for it is not the time to approve', async () => {
      const dbConversation = await saveAndGetConversation(({
        role: 'role step 1',
        status: DocumentStatus.draft,
        approvalChain: []
      } as unknown) as Conversation);

      try {
        await service.approve(dbConversation._id.toString(), 'test_reason', {
          userId: dbConversation.userId,
          role: dbConversation.role
        });
        assert.fail('should not be here');
      } catch (error) {
        expect(error.message.message).toBe(`it's not the time to approve`);
      }
    });

    it('should not approve success for status wrong', async () => {
      const dbConversation = await saveAndGetConversation(({
        role: 'role step 1',
        status: DocumentStatus.approved
      } as unknown) as Conversation);

      try {
        await service.approve(dbConversation._id.toString(), 'test_reason', {
          userId: dbConversation.userId,
          role: dbConversation.role
        });
        assert.fail('should not be here');
      } catch (error) {
        expect(error.message.message).toBe(`can not approve with status ${DocumentStatus.approved}`);
      }
    });

    it('should not approve success for role wrong', async () => {
      const dbConversation = await saveAndGetConversation(({
        role: 'role step 1',
        status: DocumentStatus.draft,
        approvalChain: [
          {
            role: 'role step 1',
            userId: '',
            reason: '',
            status: ApprovalStatus.Approved
          },
          {
            role: 'role step 2',
            userId: '',
            reason: '',
            status: ApprovalStatus.Pending
          }
        ]
      } as unknown) as Conversation);

      try {
        await service.approve(dbConversation._id.toString(), 'test_reason', {
          userId: dbConversation.userId,
          role: dbConversation.role
        });
        assert.fail('should not be here');
      } catch (error) {
        expect(error.message.message).toBe(`last step can't approve by ${dbConversation.role}`);
      }
    });

    it('should not approve success for the last step build failed', async () => {
      const dbConversation = await saveAndGetConversation(({
        role: 'role step 2',
        status: DocumentStatus.draft,
        approvalChain: [
          {
            role: 'role step 1',
            userId: '',
            reason: '',
            status: ApprovalStatus.Approved
          },
          {
            role: 'role step 2',
            userId: '',
            reason: '',
            status: ApprovalStatus.Pending
          }
        ]
      } as unknown) as Conversation);

      mockBuildDocument.mockRejectedValue('call failed');

      try {
        await service.approve(dbConversation._id.toString(), 'test_reason', {
          userId: dbConversation.userId,
          role: dbConversation.role
        });
        assert.fail('should not be here');
      } catch (error) {
        expect(error).toBe('call failed');
      }

      expect(mockBuildDocument).toBeCalledTimes(1);
    });
  });

  describe('approve current step', () => {
    it('should approve current step success', async () => {
      const dbConversation = await saveAndGetConversation(({
        role: 'role step 1',
        status: DocumentStatus.draft,
        approvalChain: [
          {
            role: 'role step 1',
            userId: '',
            reason: '',
            status: ApprovalStatus.Pending
          },
          {
            role: 'role step 2',
            userId: '',
            reason: '',
            status: ApprovalStatus.Pending
          }
        ]
      } as unknown) as Conversation);

      mockSendDocumentApprovalOrThrow.mockResolvedValue(null);

      await service.approveCurrentStep(dbConversation._id.toString(), {
        userId: dbConversation.userId,
        role: dbConversation.role
      });

      const dbData = await conversationRepository.find();
      expect(dbData.length).toBe(1);
      expect(dbData[0].approvalChain[0].status).toBe(ApprovalStatus.Approved);
      expect(dbData[0].status).toBe(DocumentStatus.draft);
      expect(mockSendDocumentApprovalOrThrow).toBeCalledTimes(1);
      expect(mockSendDocumentApprovalOrThrow).toBeCalledWith(
        dbConversation.role,
        dbConversation.caseId,
        dbConversation.userId,
        dbConversation._id.toString()
      );
    });

    it('should not approve current step success for only one step', async () => {
      const dbConversation = await saveAndGetConversation(({
        role: 'role step 1',
        status: DocumentStatus.draft,
        approvalChain: [
          {
            role: 'role step 1',
            userId: '',
            reason: '',
            status: ApprovalStatus.Pending
          }
        ]
      } as unknown) as Conversation);

      mockSendDocumentApprovalOrThrow.mockResolvedValue(null);

      try {
        await service.approveCurrentStep(dbConversation._id.toString(), {
          userId: dbConversation.userId,
          role: dbConversation.role
        });
      } catch (error) {
        expect(error.message.message).toBe(`current step can't approve by ${dbConversation.role}`);
      }

      expect(mockSendDocumentApprovalOrThrow).not.toBeCalled();
    });

    it('should not approve current step success for not draft', async () => {
      const dbConversation = await saveAndGetConversation(({
        role: 'role step 1',
        status: DocumentStatus.approved,
        approvalChain: [
          {
            role: 'role step 1',
            userId: '',
            reason: '',
            status: ApprovalStatus.Pending
          },
          {
            role: 'role step 2',
            userId: '',
            reason: '',
            status: ApprovalStatus.Pending
          }
        ]
      } as unknown) as Conversation);

      mockSendDocumentApprovalOrThrow.mockResolvedValue(null);

      try {
        await service.approveCurrentStep(dbConversation._id.toString(), {
          userId: dbConversation.userId,
          role: dbConversation.role
        });
        assert.fail('should not be here');
      } catch (error) {
        expect(error.message.message).toBe(`can not approve with status ${DocumentStatus.approved}`);
      }
    });

    it('should not approve current step success for exception', async () => {
      const dbConversation = await saveAndGetConversation(({
        role: 'role step 1',
        status: DocumentStatus.draft,
        approvalChain: [
          {
            role: 'role step 1',
            userId: '',
            reason: '',
            status: ApprovalStatus.Pending
          },
          {
            role: 'role step 2',
            userId: '',
            reason: '',
            status: ApprovalStatus.Pending
          }
        ]
      } as unknown) as Conversation);

      mockSendDocumentApprovalOrThrow.mockRejectedValue(Error('test'));
      try {
        await service.approveCurrentStep(dbConversation._id.toString(), {
          userId: dbConversation.userId,
          role: dbConversation.role
        });
        assert.fail('should not be here');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('addAttachment', () => {
    it('should addAttachment success', async () => {
      const dbConversation = await saveAndGetConversation();

      (fromStream as jest.Mock).mockResolvedValue({ mime: 'application/pdf' });

      const ret = await service.addAttachment(
        dbConversation._id.toString(),
        { userId: dbConversation.userId, role: dbConversation.role },
        { contentType: 'application/pdf', originalFilename: 'test.pdf' },
        Buffer.from('test')
      );

      expect(ret).toBeDefined();
    });

    it('should not addAttachment success for get file type failed', async () => {
      const dbConversation = await saveAndGetConversation();

      (fromStream as jest.Mock).mockResolvedValue(undefined);

      try {
        await service.addAttachment(
          dbConversation._id.toString(),
          { userId: dbConversation.userId, role: dbConversation.role },
          { contentType: 'application/pdf', originalFilename: 'test.pdf' },
          Buffer.from('test')
        );
        assert.fail('should not be here');
      } catch (error) {
        expect(error.message.message).toBe('get file type failed');
      }
    });

    it('should not addAttachment success for get file type not match', async () => {
      const dbConversation = await saveAndGetConversation();

      (fromStream as jest.Mock).mockResolvedValue({ mime: 'application/zip' });

      try {
        await service.addAttachment(
          dbConversation._id.toString(),
          { userId: dbConversation.userId, role: dbConversation.role },
          { contentType: 'application/pdf', originalFilename: 'test.pdf' },
          Buffer.from('test')
        );
        assert.fail('should not be here');
      } catch (error) {
        expect(error.message.message).toBe(`the file type application/zip uploaded is not same as defined in contentType application/pdf`);
      }
    });
  });

  describe('getAttachment', () => {
    it('should getAttachment success', async () => {
      const dbConversation = await saveAndGetConversation(({ attachments: [{ id: 'test' }] } as unknown) as Conversation);

      expect(
        await service.getAttachment(dbConversation._id.toString(), { userId: dbConversation.userId, role: dbConversation.role }, 'test')
      ).toBeDefined();
    });

    it('should not getAttachment success for no attachment', async () => {
      const dbConversation = await saveAndGetConversation();

      try {
        expect(
          await service.getAttachment(dbConversation._id.toString(), { userId: dbConversation.userId, role: dbConversation.role }, 'test')
        ).toBeDefined();
        assert.fail('should not be here');
      } catch (error) {
        expect(error.message.message).toBe('Requested entity is not found in database');
      }
    });

    it('should not getAttachment success for not match', async () => {
      const dbConversation = await saveAndGetConversation(({ attachments: [{ id: 'test' }] } as unknown) as Conversation);

      try {
        expect(
          await service.getAttachment(dbConversation._id.toString(), { userId: dbConversation.userId, role: dbConversation.role }, 'test1')
        ).toBeDefined();
        assert.fail('should not be here');
      } catch (error) {
        expect(error.message.message).toBe('Requested entity is not found in database');
      }
    });
  });

  describe('deleteAttachment', () => {
    it('should deleteAttachment success', async () => {
      const dbConversation = await saveAndGetConversation(({ attachments: [{ id: 'test' }] } as unknown) as Conversation);
      mockDeleteFromS3.mockResolvedValue('');

      try {
        await service.deleteAttachment(dbConversation._id.toString(), { userId: dbConversation.userId, role: dbConversation.role }, 'test');
      } catch (error) {
        assert.fail('should not be here');
      }
    });

    it('should not deleteAttachment success for no attachment', async () => {
      const dbConversation = await saveAndGetConversation();

      try {
        await service.deleteAttachment(dbConversation._id.toString(), { userId: dbConversation.userId, role: dbConversation.role }, 'test');
        assert.fail('should not be here');
      } catch (error) {
        expect(error.message.message).toBe('Requested entity is not found in database');
      }
    });

    it('should not deleteAttachment success for not match', async () => {
      const dbConversation = await saveAndGetConversation(({ attachments: [{ id: 'test' }] } as unknown) as Conversation);

      try {
        await service.deleteAttachment(
          dbConversation._id.toString(),
          { userId: dbConversation.userId, role: dbConversation.role },
          'test2'
        );
        assert.fail('should not be here');
      } catch (error) {
        expect(error.message.message).toBe('Requested entity is not found in database');
      }
    });

    it('should not deleteAttachment success for id invalid', async () => {
      try {
        await service.deleteAttachment('test', { userId: 'dbConversation.userId', role: 'dbConversation.role' }, 'test2');
        assert.fail('should not be here');
      } catch (error) {
        expect(error.message.message).toBe('id is invalid');
      }
    });
  });

  describe('cancel', () => {
    it('should cancel success', async () => {
      const dbConversation = await saveAndGetConversation(({
        role: 'role step 1',
        status: DocumentStatus.draft,
        approvalChain: [
          {
            role: 'role step 1',
            userId: '',
            reason: '',
            status: ApprovalStatus.Pending
          },
          {
            role: 'role step 2',
            userId: '',
            reason: '',
            status: ApprovalStatus.Pending
          }
        ]
      } as unknown) as Conversation);

      expect(
        await service.cancel(dbConversation._id.toString(), { userId: dbConversation.userId, role: dbConversation.role })
      ).toBeDefined();
    });

    it('should cancel success failed for canceled', async () => {
      const dbConversation = await saveAndGetConversation(({
        role: 'role step 1',
        status: DocumentStatus.cancelled,
        approvalChain: [
          {
            role: 'role step 1',
            userId: '',
            reason: '',
            status: ApprovalStatus.Pending
          },
          {
            role: 'role step 2',
            userId: '',
            reason: '',
            status: ApprovalStatus.Pending
          }
        ]
      } as unknown) as Conversation);

      try {
        await service.cancel(dbConversation._id.toString(), { userId: dbConversation.userId, role: dbConversation.role });
        assert.fail('should not be here');
      } catch (error) {
        expect(error.message.message).toBe(`can not cancel with status ${DocumentStatus.cancelled}`);
      }
    });
  });

  describe('reject', () => {
    it('should reject success', async () => {
      const dbConversation = await saveAndGetConversation(({
        role: 'role step 1',
        status: DocumentStatus.draft,
        approvalChain: [
          {
            role: 'role step 1',
            userId: '',
            reason: '',
            status: ApprovalStatus.Approved
          }
        ]
      } as unknown) as Conversation);

      expect(
        await service.reject(dbConversation._id.toString(), 'test', { userId: dbConversation.userId, role: dbConversation.role })
      ).toBeDefined();
    });

    it('should reject success failed for not draft', async () => {
      const dbConversation = await saveAndGetConversation(({
        role: 'role step 1',
        status: DocumentStatus.cancelled,
        approvalChain: [
          {
            role: 'role step 1',
            userId: '',
            reason: '',
            status: ApprovalStatus.Pending
          },
          {
            role: 'role step 2',
            userId: '',
            reason: '',
            status: ApprovalStatus.Pending
          }
        ]
      } as unknown) as Conversation);

      try {
        await service.reject(dbConversation._id.toString(), 'test', { userId: dbConversation.userId, role: dbConversation.role });
        assert.fail('should not be here');
      } catch (error) {
        expect(error.message.message).toBe(`can not reject with status ${DocumentStatus.cancelled}`);
      }
    });

    it('should reject success failed for not last step', async () => {
      const dbConversation = await saveAndGetConversation(({
        role: 'role step 1',
        status: DocumentStatus.draft,
        approvalChain: [
          {
            role: 'role step 1',
            userId: '',
            reason: '',
            status: ApprovalStatus.Pending
          },
          {
            role: 'role step 2',
            userId: '',
            reason: '',
            status: ApprovalStatus.Pending
          }
        ]
      } as unknown) as Conversation);

      try {
        await service.reject(dbConversation._id.toString(), 'test', { userId: dbConversation.userId, role: dbConversation.role });
        assert.fail('should not be here');
      } catch (error) {
        expect(error.message.message).toBe(`it's not the time to reject`);
      }
    });

    it('should reject success failed for role not match', async () => {
      const dbConversation = await saveAndGetConversation(({
        role: 'role step 1',
        status: DocumentStatus.draft,
        approvalChain: [
          {
            role: 'role step 1',
            userId: '',
            reason: '',
            status: ApprovalStatus.Pending
          }
        ]
      } as unknown) as Conversation);

      try {
        await service.reject(dbConversation._id.toString(), 'test', { userId: dbConversation.userId, role: 'test' });
        assert.fail('should not be here');
      } catch (error) {
        expect(error.message.message).toBe(`last step can't reject by test`);
      }
    });

    it('should reject with attachments', async () => {
      mockDeleteFromS3.mockResolvedValue({});
      const dbConversation = await saveAndGetConversationWithAttachments(({
        role: 'role step 1',
        status: DocumentStatus.draft,
        approvalChain: [
          {
            role: 'role step 1',
            userId: '',
            reason: '',
            status: ApprovalStatus.Approved
          }
        ]
      } as unknown) as Conversation);

      expect(
        await service.reject(dbConversation._id.toString(), 'test', {
          userId: dbConversation.userId,
          role: dbConversation.role
        })
      ).toBeDefined();
    });
  });

  describe('download', () => {
    it('should download success', async () => {
      const dbConversation = await saveAndGetConversation();
      mockBuildDocument.mockResolvedValue([]);

      expect(
        await service.download(dbConversation._id.toString(), {
          userId: dbConversation.userId,
          role: dbConversation.role,
          isProof: 'true',
          inputData: '{}'
        })
      ).toBeDefined();
    });

    it('should not download success for build failed', async () => {
      const dbConversation = await saveAndGetConversation();
      mockBuildDocument.mockRejectedValue(Error('test'));

      try {
        await service.download(dbConversation._id.toString(), {
          userId: dbConversation.userId,
          role: dbConversation.role,
          isProof: 'true',
          inputData: '{}'
        });
        assert.fail('should not be here');
      } catch (error) {
        expect(error.message.message).toBe('test');
      }
    });
  });

  it('should preview success', async () => {
    const dbConversation = await saveAndGetConversation();
    mockSendBuildContent.mockResolvedValue('test');

    expect(
      await service.preview(
        dbConversation._id.toString(),
        { userId: dbConversation.userId, role: dbConversation.role },
        { inputData: {}, instance: { id: 'test', contentType: 'test' } }
      )
    ).toBeDefined();
  });

  it('DownloadAttachment for conversation with no attachments', async () => {
    const dbConversation = await saveAndGetConversation();
    try {
      await service.downloadAttachment(
        dbConversation._id.toString(),
        {
          userId: dbConversation.userId,
          role: dbConversation.role
        },
        'test'
      );
      assert.fail('should not be here');
    } catch (error) {
      console.log(error.message.message);
      expect(error.message.message).toBe('Requested entity is not found in database');
    }
  });

  it('DownloadAttachment for conversation with no matching attachmentid', async () => {
    const dbConversation = await saveAndGetConversationWithAttachments();
    try {
      await service.downloadAttachment(
        dbConversation._id.toString(),
        {
          userId: dbConversation.userId,
          role: dbConversation.role
        },
        'test'
      );
      assert.fail('should not be here');
    } catch (error) {
      console.log(error.message.message);
      expect(error.message.message).toBe('Requested entity is not found in database');
    }
  });

  it('DownloadAttachment success with attachment', async () => {
    const dbConversation = await saveAndGetConversationWithAttachments();
    mockDownloadFromS3.mockResolvedValue(Buffer.from('test'));
    expect(
      await service.downloadAttachment(
        dbConversation._id.toString(),
        {
          userId: dbConversation.userId,
          role: dbConversation.role
        },
        'tt'
      )
    ).toBeDefined();
  });
});

describe('ConversationsService with failure', () => {
  let service: ConversationsService;
  let conversationRepository: Repository<Conversation>;
  const mongod = new MongoMemoryServer();
  const mockSendDocumentApprovalOrThrow = jest.fn();
  const mockSave = jest.fn();
  const mockFindOne = jest.fn();

  class MockCommonService {
    async sendDocumentApprovalOrThrow(role: string, caseId: string, userId: string, docId: string): Promise<void> {
      return mockSendDocumentApprovalOrThrow(role, caseId, userId, docId);
    }
  }

  class MockConversationRepository {
    async save(conv: Conversation): Promise<void> {
      return mockSave(conv);
    }

    async findOne(id: string): Promise<Conversation> {
      return mockFindOne(id);
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          name: 'WM_CCC',
          type: 'mongodb',
          url: await mongod.getUri(),
          entities: [Conversation, AuditRecordEntity],
          synchronize: true
        }),
        TypeOrmModule.forFeature([Conversation], 'WM_CCC'),
        CommonModule
      ],
      providers: [ConversationsService]
    })
      .overrideProvider(CommonService)
      .useClass(MockCommonService)
      .overrideProvider(getRepositoryToken(Conversation, 'WM_CCC'))
      .useClass(MockConversationRepository)
      .compile();

    service = module.get<ConversationsService>(ConversationsService);
    conversationRepository = module.get<Repository<Conversation>>(getRepositoryToken(Conversation, 'WM_CCC'));
    mockSendDocumentApprovalOrThrow.mockResolvedValue(null);
  });

  afterEach(async () => {
    await getConnectionManager().connections[0].close();
    await mongod.stop();

    mockSendDocumentApprovalOrThrow.mockReset();
  });

  async function saveAndGetConversation(data?: Conversation): Promise<Conversation> {
    const initConversation = new Conversation();
    initConversation.userId = 'test_userId';
    initConversation.caseId = 'test_caseId';
    initConversation.role = 'test_role';
    return await conversationRepository.save(Object.assign(initConversation, data));
  }

  it('approve current step success should fail save', async () => {
    mockSave.mockResolvedValue({ _id: ObjectID.createFromTime(new Date().getTime()), userId: 'test', role: 'test' });
    const dbConversation = await saveAndGetConversation(({
      role: 'role step 1',
      status: DocumentStatus.draft,
      approvalChain: [
        {
          role: 'role step 1',
          userId: '',
          reason: '',
          status: ApprovalStatus.Pending
        },
        {
          role: 'role step 2',
          userId: '',
          reason: '',
          status: ApprovalStatus.Pending
        }
      ]
    } as unknown) as Conversation);

    mockSendDocumentApprovalOrThrow.mockResolvedValue('');
    mockSave.mockRejectedValue('test');
    mockFindOne.mockResolvedValue({
      userId: dbConversation.userId,
      role: dbConversation.role,
      status: 'draft',
      _id: ObjectID.createFromTime(new Date().getTime()),
      approvalChain: [
        { status: 'Pending', role: 'test' },
        { status: 'Pending', role: 'test' }
      ]
    });
    try {
      await service.approveCurrentStep(dbConversation._id.toString(), {
        userId: dbConversation.userId,
        role: dbConversation.role
      });
    } catch (e) {
      expect(e).toEqual('test');
    }
  });
});
