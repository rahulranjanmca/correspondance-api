import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getConnectionManager } from 'typeorm';

import { CommonModule } from '../common/common.module';
import { CommonService } from '../common/common.service';
import { AuditRecordEntity } from '../common/entity/audit.record.entity';
import { CatalogEntity } from '../common/entity/catalog.entity';
import { Conversation } from '../conversations/entity/conversation.entity';
import { TemplatesModule } from './templates.module';
import { TemplatesService } from './templates.service';

describe('TemplatesService', () => {
  let service: TemplatesService;
  const mongod = new MongoMemoryServer();
  const mockFunction = jest.fn();
  class MockCommonService {
    async getCatalogList(role: string): Promise<CatalogEntity[]> {
      return mockFunction(role);
    }

    async getTemplateById(instanceId: string): Promise<Record<string, string>> {
      return mockFunction(instanceId);
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
        CommonModule,
        TemplatesModule
      ],
      providers: [TemplatesService]
    })
      .overrideProvider(CommonService)
      .useClass(MockCommonService)
      .compile();

    service = module.get<TemplatesService>(TemplatesService);
  });

  afterEach(async () => {
    await getConnectionManager().connections[0].close();
    await mongod.stop();
  });

  it('should getLetterCatalog success', async () => {
    mockFunction.mockResolvedValue([
      { segment: ['test'], subject: ['test'], audience: ['test'], DocumentType: 'letter' },
      { segment: ['test2'], subject: ['test'], audience: ['test'], DocumentType: 'letter' },
      { segment: ['test3'], subject: ['test'], audience: ['test'], DocumentType: 'form' }
    ]);
    expect(
      await service.getLetterCatalog({ marketSegment: 'test', subject: 'test', audience: 'test', userId: 'test', role: 'test' })
    ).toBeDefined();
  });

  it('should getFormCatalog success', async () => {
    mockFunction.mockResolvedValue([
      { segment: ['test'], state: ['test'], DocumentType: 'letter' },
      { segment: ['test2'], state: ['test'], DocumentType: 'form' },
      { segment: ['test3'], state: ['test'], DocumentType: 'form' }
    ]);

    expect(await service.getFormCatalog({ marketSegment: 'test2', state: 'test', userId: 'test', role: 'form' })).toBeDefined();
  });

  it('should getTemplateById success', async () => {
    mockFunction.mockResolvedValue('');

    expect(await service.getTemplateById('test')).toBeDefined();
  });
});
