/**
 * The metadata regarding an attachment.
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AttachmentRequestBodyDto {
  // The file name of the attachment
  @ApiProperty()
  @IsNotEmpty()
  originalFilename!: string;

  // The mime type of the uploaded attachment
  @ApiProperty()
  @IsNotEmpty()
  contentType!: string;
}
