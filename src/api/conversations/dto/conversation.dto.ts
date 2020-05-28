/**
 * class ConversationDto
 */

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';

import { Conversation } from '../entity/conversation.entity';
import { DocumentStatus } from '../enum/document.status.enum';
import { DocumentType } from '../enum/document.type.enum';
import { ApprovalStepDto } from './approval.step.dto';
import { AttachmentDto } from './attachment.dto';
import { FormQuantityDto } from './form.quantity.dto';

export class ConversationDto {
  constructor(dbConversation: Conversation) {
    if (!dbConversation || !(dbConversation instanceof Conversation)) {
      return;
    }

    this.id = dbConversation._id.toString();
    this.caseId = dbConversation.caseId;
    this.formQuantity = dbConversation.formQuantity;
    this.formId = dbConversation.formId;
    this.status = dbConversation.status;
    this.attachments = dbConversation.attachments;
    this.approvalChain = dbConversation.approvalChain;
  }

  // The id of the conversation.
  @ApiProperty()
  @IsMongoId()
  id!: string;

  // The case id associated with this conversation.
  @ApiProperty()
  @IsNotEmpty()
  caseId!: string;

  // The id of the letter/form template being used.
  @ApiProperty()
  @IsNotEmpty()
  formId!: string;

  // The type of the document. Possible values are, letter or form
  @ApiProperty({ enum: DocumentType })
  @IsEnum(DocumentType)
  documentType!: string;

  @ApiProperty({ enum: DocumentStatus })
  @IsEnum(DocumentStatus)
  status!: string;

  // A request for a conversation, containing the type and quantity of forms to use.
  @ApiProperty({ type: [FormQuantityDto] })
  @IsArray()
  @Type(() => FormQuantityDto)
  formQuantity!: FormQuantityDto[];

  // A list of default attachments that are automatically included in the conversation. They cannot be deleted.
  @ApiProperty({ type: [AttachmentDto] })
  @IsArray()
  @Type(() => AttachmentDto)
  attachments!: AttachmentDto[];

  // The approval chain for this conversation
  @ApiProperty({ type: [ApprovalStepDto] })
  @IsArray()
  @Type(() => ApprovalStepDto)
  approvalChain!: ApprovalStepDto[];
}
