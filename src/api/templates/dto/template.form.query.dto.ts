/**
 * class TemplateFormQueryDto
 */

import { ApiProperty } from '@nestjs/swagger';

import { UserAndRoleCommonQuery } from '../../common/dto/common.query.dto';

export class TemplateFormQueryDto extends UserAndRoleCommonQuery {
  // Filter by market segment
  @ApiProperty({ example: 'SGGM', required: false })
  marketSegment!: string;

  // Filter by state.
  @ApiProperty({ example: 'Other', required: false })
  state!: string;
}
