/**
 * class ConversationDownloadQueryDto
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString, IsJSON } from 'class-validator';

import { UserAndRoleCommonQuery } from '../../common/dto/common.query.dto';

export class ConversationDownloadQueryDto extends UserAndRoleCommonQuery {
  // Whether to generate a proof version of the document.
  @ApiProperty({ type: Boolean, example: true })
  @IsBooleanString()
  isProof!: string;

  @ApiProperty({ example: '{}' })
  @IsJSON()
  inputData!: string;
}
