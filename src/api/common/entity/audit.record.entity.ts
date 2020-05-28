/**
 * class AuditRecordEntity
 */

import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class AuditRecordEntity {
  @ObjectIdColumn()
  _id!: ObjectID;

  @Column()
  operation!: string;

  @Column()
  userId!: string;

  @Column()
  role!: string;

  @Column()
  result!: string;

  @Column()
  time!: Date;
}
