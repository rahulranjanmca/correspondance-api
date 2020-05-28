/**
 * class ConversationDto
 */

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';

import { FormQuantityDto } from './form.quantity.dto';

export class ConversationUpdateBodyDto {
  // A request for a conversation, containing the type and quantity of forms to use.
  @ApiProperty({ type: [FormQuantityDto] })
  @IsArray()
  @Type(() => FormQuantityDto)
  formQuantity!: FormQuantityDto[];
}
