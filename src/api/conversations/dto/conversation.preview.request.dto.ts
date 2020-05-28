/**
 * class ConversationCreateRequest
 */

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsObject } from 'class-validator';

// Data that will come from catalog.instances
export class InstanceDto {
  @ApiProperty()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({ required: false })
  contentType!: string;
}

export class ConversationPreviewRequestDto {
  // The case id of the conversation, if applicable
  @ApiProperty({ type: InstanceDto })
  @Type(() => InstanceDto)
  instance!: InstanceDto;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  inputData!: Record<string, string>;
}
