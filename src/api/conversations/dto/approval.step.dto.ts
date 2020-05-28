/**
 * Represents a step in the approval chain for a given conversation.
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

import { ApprovalStatus } from '../enum/approval.status.enum';

export class ApprovalStepDto {
  // The role that is needed for this particular step of approval.
  @ApiProperty()
  @IsString()
  role!: string;

  // If this step has already been completed, then this is the id of the user that completed the step.
  @ApiProperty()
  @IsString()
  userId!: string;

  // Any notes on why this step was approved or rejected.
  @ApiProperty()
  @IsString()
  reason!: string;

  // The status of the step.
  @ApiProperty({ enum: ['Pending', 'Approved', 'Rejected'] })
  @IsEnum(ApprovalStatus)
  status!: ApprovalStatus;
}
