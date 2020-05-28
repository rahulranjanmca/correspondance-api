import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Response } from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getConnectionManager } from 'typeorm';

import { CommonModule } from '../common/common.module';
import { CommonService } from '../common/common.service';
import { UserAndRoleCommonQuery } from '../common/dto/common.query.dto';
import { AuditRecordEntity } from '../common/entity/audit.record.entity';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { ConversationCreateRequest } from './dto/conversation.create.request.dto';
import { ConversationDownloadQueryDto } from './dto/conversation.download.query.dto';
import { ConversationDto } from './dto/conversation.dto';
import { ConversationGetCaseQueryDto } from './dto/conversation.get.case.query.dto';
import { ConversationPreviewRequestDto } from './dto/conversation.preview.request.dto';
import { ConversationUpdateBodyDto } from './dto/conversation.update.body.dto';
import { ReasonBodyDto } from './dto/reason.body.dto';
import { Conversation } from './entity/conversation.entity';

describe('Conversations Controller', () => {
  let controller: ConversationsController;
  const mongod = new MongoMemoryServer();
  const mockFunction = jest.fn();
  class MockConversationsService {
    async findByCaseId(caseId: string, query: UserAndRoleCommonQuery): Promise<ConversationDto> {
      return mockFunction(caseId, query);
    }

    async findById(id: string, query: UserAndRoleCommonQuery): Promise<ConversationDto> {
      return mockFunction(id, query);
    }

    async createConversation(query: UserAndRoleCommonQuery, body: ConversationCreateRequest): Promise<ConversationDto> {
      return mockFunction(query, body);
    }

    async updateConversation(id: string, query: UserAndRoleCommonQuery, body: ConversationUpdateBodyDto): Promise<ConversationDto> {
      return mockFunction(id, query, query, body);
    }

    async approveCurrentStep(id: string, query: UserAndRoleCommonQuery): Promise<void> {
      return mockFunction(id, query, query);
    }

    async approve(id: string, reason: string, query: UserAndRoleCommonQuery): Promise<ConversationDto> {
      return mockFunction(id, reason, query);
    }

    async cancel(id: string, query: UserAndRoleCommonQuery): Promise<ConversationDto> {
      return mockFunction(id, query);
    }

    async reject(id: string, reason: string, query: UserAndRoleCommonQuery): Promise<ConversationDto> {
      return mockFunction(id, reason, query);
    }

    async download(id: string, query: ConversationDownloadQueryDto): Promise<Buffer> {
      return mockFunction(id, query);
    }

    async preview(id: string, query: UserAndRoleCommonQuery, body: ConversationPreviewRequestDto): Promise<Buffer> {
      return mockFunction(id, query, body);
    }
  }

  class MockCommonService {
    async saveErrorAuditRecord(_operation: string, _userId: string, _role: string, error: Error): Promise<Error> {
      if (error instanceof HttpException) {
        return error;
      } else {
        return CommonService.getHttpError(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  beforeEach(async () => {
    process.env.WM_CCC_OBJECT_STORAGE_TYPE = 'LOCAL';
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
      controllers: [ConversationsController],
      providers: [ConversationsService]
    })
      .overrideProvider(ConversationsService)
      .useClass(MockConversationsService)
      .overrideProvider(CommonService)
      .useClass(MockCommonService)
      .compile();

    controller = module.get<ConversationsController>(ConversationsController);
  });

  afterEach(async () => {
    await getConnectionManager().connections[0].close();
    await mongod.stop();

    mockFunction.mockReset();
  });

  it('should approve', async () => {
    mockFunction.mockResolvedValue('');
    expect(await controller.approve('test', ({} as unknown) as UserAndRoleCommonQuery, ({} as unknown) as ReasonBodyDto)).toBeDefined();

    mockFunction.mockRejectedValue('test');
    try {
      await controller.approve('test', ({} as unknown) as UserAndRoleCommonQuery, ({} as unknown) as ReasonBodyDto);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should cancel', async () => {
    mockFunction.mockResolvedValue('');
    expect(await controller.cancel('test', ({} as unknown) as UserAndRoleCommonQuery)).toBeDefined();

    mockFunction.mockRejectedValue('test');
    try {
      await controller.cancel('test', ({} as unknown) as UserAndRoleCommonQuery);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should create', async () => {
    mockFunction.mockResolvedValue('');
    expect(await controller.create(({} as unknown) as UserAndRoleCommonQuery, ({} as unknown) as ConversationCreateRequest)).toBeDefined();

    mockFunction.mockRejectedValue('test');
    try {
      await controller.create(({} as unknown) as UserAndRoleCommonQuery, ({} as unknown) as ConversationCreateRequest);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should download', async () => {
    mockFunction.mockResolvedValue(Buffer.from('test'));
    const responseSet = jest.fn();
    await controller.download(
      'test',
      ({} as unknown) as ConversationDownloadQueryDto,
      ({
        write: jest.fn(),
        on: jest.fn(),
        set: responseSet,
        once: jest.fn(),
        emit: jest.fn(),
        end: jest.fn()
      } as unknown) as Response
    );
    expect(responseSet).toBeCalledTimes(1);

    mockFunction.mockRejectedValue('test');
    try {
      await controller.download('test', ({} as unknown) as ConversationDownloadQueryDto, ({} as unknown) as Response);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should getByCaseId', async () => {
    mockFunction.mockResolvedValue('');
    expect(await controller.getByCaseId(({} as unknown) as ConversationGetCaseQueryDto)).toBeDefined();

    mockFunction.mockRejectedValue('test');
    try {
      await controller.getByCaseId(({} as unknown) as ConversationGetCaseQueryDto);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should getById', async () => {
    mockFunction.mockResolvedValue('');
    expect(await controller.getById(({} as unknown) as UserAndRoleCommonQuery, 'test')).toBeDefined();

    mockFunction.mockRejectedValue('test');
    try {
      await controller.getById(({} as unknown) as UserAndRoleCommonQuery, 'test');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should preview', async () => {
    mockFunction.mockResolvedValue(Buffer.from('test'));
    const responseSet = jest.fn();

    await controller.preview(
      'test',
      ({} as unknown) as UserAndRoleCommonQuery,
      ({} as unknown) as ConversationPreviewRequestDto,
      ({
        write: jest.fn(),
        on: jest.fn(),
        set: responseSet,
        once: jest.fn(),
        emit: jest.fn(),
        end: jest.fn()
      } as unknown) as Response
    );
    expect(responseSet).toBeCalledTimes(1);

    mockFunction.mockRejectedValue('test');
    try {
      await controller.preview(
        'test',
        ({} as unknown) as UserAndRoleCommonQuery,
        ({} as unknown) as ConversationPreviewRequestDto,
        ({} as unknown) as Response
      );
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should reject', async () => {
    mockFunction.mockResolvedValue('');
    expect(await controller.reject('test', ({} as unknown) as UserAndRoleCommonQuery, ({} as unknown) as ReasonBodyDto)).toBeDefined();

    mockFunction.mockRejectedValue('test');
    try {
      await controller.reject('test', ({} as unknown) as UserAndRoleCommonQuery, ({} as unknown) as ReasonBodyDto);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should requestApproval', async () => {
    mockFunction.mockResolvedValue('');
    await controller.requestApproval('test', ({} as unknown) as UserAndRoleCommonQuery);

    mockFunction.mockRejectedValue('test');
    try {
      await controller.requestApproval('test', ({} as unknown) as UserAndRoleCommonQuery);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should update', async () => {
    mockFunction.mockResolvedValue('');
    const conversationUpdateBodyDto = plainToClass(ConversationUpdateBodyDto, { formQuantity: [] });
    expect(await controller.update('test', ({} as unknown) as UserAndRoleCommonQuery, conversationUpdateBodyDto)).toBeDefined();

    mockFunction.mockRejectedValue('test');
    try {
      await controller.update('test', ({} as unknown) as UserAndRoleCommonQuery, ({} as unknown) as ConversationUpdateBodyDto);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
