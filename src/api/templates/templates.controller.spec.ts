import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getConnectionManager } from 'typeorm';

import { AuditRecordEntity } from '../common/entity/audit.record.entity';
import { Conversation } from '../conversations/entity/conversation.entity';
import { TemplateFormQueryDto } from './dto/template.form.query.dto';
import { TemplateFormResponseDto } from './dto/template.form.response.dto';
import { TemplateLetterQueryDto } from './dto/template.letter.query.dto';
import { TemplateLetterResponseDto } from './dto/template.letter.response.dto';
import { TemplatesController } from './templates.controller';
import { TemplatesModule } from './templates.module';
import { TemplatesService } from './templates.service';

describe('Templates Controller', () => {
  let controller: TemplatesController;
  const mongod = new MongoMemoryServer();
  const mockFunction = jest.fn();
  class MockTemplateService {
    async getFormCatalog(query: TemplateFormQueryDto): Promise<TemplateFormResponseDto[]> {
      return mockFunction(query);
    }
    async getLetterCatalog(query: TemplateLetterQueryDto): Promise<TemplateLetterResponseDto[]> {
      return mockFunction(query);
    }

    async getTemplateById(id: string): Promise<Record<string, string>> {
      return mockFunction(id);
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
        TemplatesModule
      ]
    })
      .overrideProvider(TemplatesService)
      .useClass(MockTemplateService)
      .compile();

    controller = module.get<TemplatesController>(TemplatesController);
  });

  afterEach(async () => {
    await getConnectionManager().connections[0].close();
    await mongod.stop();
  });

  it('should getForms success', async () => {
    mockFunction.mockResolvedValue('');
    expect(await controller.getForms(({} as unknown) as TemplateFormQueryDto)).toBeDefined();
  });

  it('should getForms success', async () => {
    mockFunction.mockResolvedValue('');
    expect(await controller.getLetters(({} as unknown) as TemplateLetterQueryDto)).toBeDefined();
  });

  it('should getForms success', async () => {
    mockFunction.mockResolvedValue('');
    expect(await controller.getForms(({} as unknown) as TemplateFormQueryDto)).toBeDefined();
  });

  it('should getTemplateDescriptionsById success', async () => {
    mockFunction.mockResolvedValue('');
    expect(await controller.getTemplateDescriptionsById('test')).toBeDefined();
  });
});
