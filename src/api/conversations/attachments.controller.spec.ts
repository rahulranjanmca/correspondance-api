import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Response } from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { PassThrough } from 'stream';
import { getConnectionManager } from 'typeorm';

import { CommonModule } from '../common/common.module';
import { UserAndRoleCommonQuery } from '../common/dto/common.query.dto';
import { AuditRecordEntity } from '../common/entity/audit.record.entity';
import { AttachmentsController } from './attachments.controller';
import { ConversationsService } from './conversations.service';
import { AttachmentDto } from './dto/attachment.dto';
import { AttachmentRequestBodyDto } from './dto/attachment.request.body.dto';
import { Conversation } from './entity/conversation.entity';

describe('Attachments Controller', () => {
  let controller: AttachmentsController;
  const mongod = new MongoMemoryServer();
  const mockFunction = jest.fn();
  const mockResponseSet = jest.fn();

  class MockResponse extends PassThrough {
    set(params: Record<string, string>) {
      mockResponseSet(params);
    }
  }

  class MockConversationsService {
    async addAttachment(id: string, query: UserAndRoleCommonQuery, body: AttachmentRequestBodyDto, buffer: Buffer): Promise<AttachmentDto> {
      return mockFunction(id, query, body, buffer);
    }

    async getAttachment(id: string, query: UserAndRoleCommonQuery, attachmentId: string): Promise<AttachmentDto> {
      return mockFunction(id, query, attachmentId);
    }

    async deleteAttachment(id: string, query: UserAndRoleCommonQuery, attachmentId: string): Promise<void> {
      return mockFunction(id, query, attachmentId);
    }

    async downloadAttachment(id: string, query: UserAndRoleCommonQuery, attachmentId: string): Promise<Buffer> {
      return mockFunction(id, query, attachmentId);
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
          synchronize: true,
          useUnifiedTopology: true
        }),
        TypeOrmModule.forFeature([Conversation], 'WM_CCC'),
        CommonModule
      ],
      controllers: [AttachmentsController],
      providers: [ConversationsService]
    })
      .overrideProvider(ConversationsService)
      .useClass(MockConversationsService)
      .compile();

    controller = module.get<AttachmentsController>(AttachmentsController);
  });

  afterEach(async () => {
    await getConnectionManager().connections[0].close();
    await mongod.stop();
  });

  it('should addAttachments success', async () => {
    mockFunction.mockResolvedValue('');
    expect(
      await controller.addAttachments('test', ({} as unknown) as UserAndRoleCommonQuery, ({} as unknown) as AttachmentRequestBodyDto, {
        buffer: Buffer.from('test')
      })
    ).toBeDefined();

    mockFunction.mockRejectedValue('test');
    try {
      await controller.addAttachments('test', ({} as unknown) as UserAndRoleCommonQuery, ({} as unknown) as AttachmentRequestBodyDto, {
        buffer: Buffer.from('test')
      });
    } catch (error) {
      expect(error).toBeDefined();
    }

    mockFunction.mockRejectedValue('test');
    try {
      await controller.addAttachments(
        'test',
        ({} as unknown) as UserAndRoleCommonQuery,
        ({} as unknown) as AttachmentRequestBodyDto,
        (undefined as unknown) as { buffer: Buffer }
      );
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should get Attachments success', async () => {
    mockFunction.mockResolvedValue('');
    expect(await controller.get('test', 'test', ({} as unknown) as UserAndRoleCommonQuery)).toBeDefined();

    mockFunction.mockRejectedValue('test');
    try {
      await controller.get('test', 'test', ({} as unknown) as UserAndRoleCommonQuery);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should deleteAttachment success', async () => {
    mockFunction.mockResolvedValue('');
    await controller.deleteAttachments('test', 'test', ({} as unknown) as UserAndRoleCommonQuery);

    mockFunction.mockRejectedValue('test');
    try {
      await controller.deleteAttachments('test', 'test', ({} as unknown) as UserAndRoleCommonQuery);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should download fail', async () => {
    mockFunction.mockRejectedValue('test');

    try {
      await controller.download('test', 'test', ({} as unknown) as UserAndRoleCommonQuery, ({} as unknown) as Response);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should download success', async () => {
    mockFunction.mockResolvedValue(Buffer.from('test'));
    const mockedResponse = new MockResponse();

    await controller.download('test', 'test', ({} as unknown) as UserAndRoleCommonQuery, (mockedResponse as unknown) as Response);

    expect(mockResponseSet).toBeCalled();
  });
});
