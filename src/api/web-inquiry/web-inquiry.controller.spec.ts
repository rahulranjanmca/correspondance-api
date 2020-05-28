import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payload } from 'aws-sdk/clients/iotdata';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getConnectionManager } from 'typeorm';

import { CommonService } from '../common/common.service';
import { AuditRecordEntity } from '../common/entity/audit.record.entity';
import { Conversation } from '../conversations/entity/conversation.entity';
import { WebInquiryResponseFields } from './dto/web-inquiry.contact.status.detail.dto copy';
import { WebInquiryDetailDto } from './dto/web-inquiry.detail.dto';
import { WebInquiryController } from './web-inquiry.controller';
import { WebInquiryModule } from './web-inquiry.module';

describe('WebInquiry Controller', () => {
  let controller: WebInquiryController;
  const mongod = new MongoMemoryServer();
  const mockFunction = jest.fn();
  class MockCommonService {
    async sendWebInquiryGet(id: string, payload: Payload): Promise<WebInquiryDetailDto[]> {
      return mockFunction(id, payload);
    }

    async sendWebInquiryPatch(id: string, body: WebInquiryResponseFields, payload: Payload): Promise<void> {
      return mockFunction(id, body, payload);
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
        WebInquiryModule
      ]
    })
      .overrideProvider(CommonService)
      .useClass(MockCommonService)
      .compile();

    controller = module.get<WebInquiryController>(WebInquiryController);
  });

  afterEach(async () => {
    await getConnectionManager().connections[0].close();
    await mongod.stop();

    mockFunction.mockReset();
  });

  it('should getById success', async () => {
    expect(controller).toBeDefined();
    mockFunction.mockResolvedValue({});
    expect(await controller.getById('test', { user: { userId: 'test', userRole: 'test' } })).toBeDefined();
    expect(mockFunction).toBeCalledTimes(1);
  });

  it('should update success', async () => {
    expect(controller).toBeDefined();
    mockFunction.mockResolvedValue({});
    await controller.update('test', ({} as unknown) as WebInquiryResponseFields, { user: { userId: 'test', userRole: 'test' } });
    expect(mockFunction).toBeCalledTimes(1);
  });
});
