/**
 * ConversationsModule
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from '../common/common.module';
import { AttachmentsController } from './attachments.controller';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { Conversation } from './entity/conversation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation], 'WM_CCC'), CommonModule],
  controllers: [ConversationsController, AttachmentsController],
  providers: [ConversationsService]
})
export class ConversationsModule {}
