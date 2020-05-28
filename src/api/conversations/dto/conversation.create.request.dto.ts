/**
 * class ConversationCreateRequest
 */

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

import { FormQuantityDto } from './form.quantity.dto';

export class ConversationCreateRequest {
  // The case id of the conversation, if applicable
  @ApiProperty({ example: 'test caseId' })
  @IsNotEmpty()
  caseId!: string;

  // The form id of the template
  @ApiProperty({ example: 'B-2317902' })
  @IsNotEmpty()
  formId!: string;

  // A request for a conversation, containing the type and quantity of forms to use.
  @ApiProperty({ type: [FormQuantityDto] })
  @Type(() => FormQuantityDto)
  @ValidateNested()
  formQuantity!: FormQuantityDto[];
}
