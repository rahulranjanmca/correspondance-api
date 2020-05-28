import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { AuditRecordEntity } from './api/common/entity/audit.record.entity';
import { ConversationsController } from './api/conversations/conversations.controller';
import { ConversationsModule } from './api/conversations/conversations.module';
import { Conversation } from './api/conversations/entity/conversation.entity';
import { TemplatesController } from './api/templates/templates.controller';
import { TemplatesModule } from './api/templates/templates.module';
import { UtilitiesController } from './api/utilities/utilities.controller';
import { UtilitiesModule } from './api/utilities/utilities.module';
import { WebInquiryController } from './api/web-inquiry/web-inquiry.controller';
import { WebInquiryModule } from './api/web-inquiry/web-inquiry.module';
import { WebBasedInteractionTemplateEntity } from './api/web-responses/entity/interaction.template.entity';
import { WebResponsesController } from './api/web-responses/web-responses.controller';
import { WebResponsesModule } from './api/web-responses/web-responses.module';
describe('AssembleModule', () => {
  it('should assemble all modules', async () => {
    const mongod = new MongoMemoryServer();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          name: 'WM_CCC',
          type: 'mongodb',
          url: await mongod.getUri(),
          entities: [Conversation, AuditRecordEntity],
          synchronize: true
        }),
        TypeOrmModule.forRoot({
          name: 'WM_CRMWBI',
          type: 'mongodb',
          url: await mongod.getUri(),
          entities: [WebBasedInteractionTemplateEntity],
          synchronize: true
        }),
        UtilitiesModule,
        ConversationsModule,
        TemplatesModule,
        WebResponsesModule,
        WebInquiryModule
      ],
      controllers: [],
      providers: []
    }).compile();
    expect(module.get<UtilitiesController>(UtilitiesController)).toBeDefined();
    expect(module.get<ConversationsController>(ConversationsController)).toBeDefined();
    expect(module.get<TemplatesController>(TemplatesController)).toBeDefined();
    expect(module.get<WebInquiryController>(WebInquiryController)).toBeDefined();
    expect(module.get<WebResponsesController>(WebResponsesController)).toBeDefined();
    await mongod.stop();
  });
});
