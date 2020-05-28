/**
 * class TemplateLetterQueryDto
 */

import { ApiProperty } from '@nestjs/swagger';

import { UserAndRoleCommonQuery } from '../../common/dto/common.query.dto';

export class TemplateLetterQueryDto extends UserAndRoleCommonQuery {
  // Filter by market segment.
  @ApiProperty({ example: 'SGGF', required: false })
  marketSegment!: string;

  // Filter by subject.
  @ApiProperty({ example: 'Benefits', required: false })
  subject!: string;

  // Filter by audience.
  @ApiProperty({ example: 'Member', required: false })
  audience!: string;
}
