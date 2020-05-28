/**
 * class Conversation
 */

import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

import { ApprovalStep } from './approval.entity';
import { Attachment } from './attachment.entity';
import { FormQuantity } from './form.quantity.entity';

@Entity()
export class Conversation {
  @ObjectIdColumn()
  _id!: ObjectID;

  @Column()
  userId!: string;

  @Column()
  role!: string;

  @Column()
  caseId!: string;

  @Column()
  formId!: string;

  @Column()
  status!: string;

  @Column(() => FormQuantity)
  formQuantity!: FormQuantity[];

  @Column(() => ApprovalStep)
  approvalChain!: ApprovalStep[];

  @Column(() => Attachment)
  attachments!: Attachment[];

  @Column()
  finalVersionS3Url!: string;
}
