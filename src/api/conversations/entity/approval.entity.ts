/**
 * Represents a step in the approval chain for a given conversation.
 */

import { Column } from 'typeorm';

import { ApprovalStatus } from '../enum/approval.status.enum';

export class ApprovalStep {
  constructor(role: string) {
    this.role = role;
    this.userId = '';
    this.reason = '';
    this.status = ApprovalStatus.Pending;
  }

  // The role that is needed for this particular step of approval.
  @Column()
  role!: string;

  // If this step has already been completed, then this is the id of the user that completed the step.
  @Column()
  userId!: string;

  // Any notes on why this step was approved or rejected.
  @Column()
  reason!: string;

  // The status of the step.
  @Column({ enum: ApprovalStatus })
  status!: ApprovalStatus;
}
