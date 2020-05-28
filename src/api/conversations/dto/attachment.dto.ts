/**
 * The metadata regarding an attachment.
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AttachmentDto {
  // The id of the attachment
  @ApiProperty()
  @IsUUID()
  id!: string;

  // The file name of the attachment
  @ApiProperty()
  @IsNotEmpty()
  originalFilename!: string;

  // The mime type of the uploaded attachment
  @ApiProperty()
  @IsNotEmpty()
  contentType!: string;

  // URL to where the attachment is stored
  @ApiProperty()
  @IsNotEmpty()
  attachmentLocation!: string;
}
