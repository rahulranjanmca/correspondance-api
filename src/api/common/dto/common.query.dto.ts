/**
 * class UserAndRoleCommonQuery
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserAndRoleCommonQuery {
  // The current logged-in user
  @ApiProperty({ required: true, example: 'test userId' })
  @IsNotEmpty()
  userId!: string;

  // The role of logged-in user
  @ApiProperty({ required: true, example: 'test role' })
  @IsNotEmpty()
  role!: string;
}
