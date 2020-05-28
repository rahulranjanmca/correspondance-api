/**
 * Any additional comments/reason for rejection.
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ReasonBodyDto {
  // Any additional comments/reason for rejection.
  @ApiProperty()
  @IsNotEmpty()
  reason!: string;
}
