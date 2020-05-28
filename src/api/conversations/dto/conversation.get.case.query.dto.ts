/**
 * class ConversationDownloadQueryDto
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { UserAndRoleCommonQuery } from '../../common/dto/common.query.dto';

export class ConversationGetCaseQueryDto extends UserAndRoleCommonQuery {
  // Whether to generate a proof version of the document.
  @ApiProperty()
  @IsNotEmpty()
  caseId!: string;
}
