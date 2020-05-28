import { Module } from '@nestjs/common';

import { UtilitiesModule } from './api/utilities/utilities.module';
import { ConversationsModule } from './api/conversations/conversations.module';
import { TemplatesModule } from './api/templates/templates.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './api/conversations/entity/conversation.entity';
import { AuditRecordEntity } from './api/common/entity/audit.record.entity';
import { WebBasedInteractionTemplateEntity } from './api/web-responses/entity/interaction.template.entity';
import { WebResponsesModule } from './api/web-responses/web-responses.module';
import { WebInquiryModule } from './api/web-inquiry/web-inquiry.module';

@Module({
  imports: [TypeOrmModule.forRootAsync(
    {
      name: 'WM_CCC',
      useFactory: () => ({
        name: 'WM_CCC',
        type: 'mongodb',
        host: process.env.WM_CCC_DATASTORE_HOST,
        port: Number(process.env.WM_CCC_DATASTORE_PORT),
        database: process.env.WM_CCC_DATASTORE_DB_NAME,
        // username: process.env.WM_CCC_DATASTORE_USER,
        // password: process.env.WM_CCC_DATASTORE_PASSWORD,
        entities: [Conversation, AuditRecordEntity],
        synchronize: true,
      }),
    }),
  TypeOrmModule.forRootAsync(
    {
      name: 'WM_CRMWBI',
      useFactory: () => ({
        name: 'WM_CRMWBI',
        type: 'mongodb',
        host: process.env.WM_CRMWBI_DATASTORE_HOST,
        port: Number(process.env.WM_CRMWBI_DATASTORE_PORT),
        database: process.env.WM_CRMWBI_DATASTORE_DB_NAME,
        // username: process.env.WM_CRMWBI_DATASTORE_USER,
        // password: process.env.WM_CRMWBI_DATASTORE_PASSWORD,
        entities: [WebBasedInteractionTemplateEntity],
        synchronize: true,
      }),
    }),
    UtilitiesModule, ConversationsModule, TemplatesModule, WebResponsesModule, WebInquiryModule],
  controllers: [],
  providers: []
})
export class AppModule { }
