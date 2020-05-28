/**
 * class FormQuantity
 */

import { Column } from 'typeorm';

export class FormQuantity {
  // The id of the form template.
  @Column()
  formId!: string;

  // The quantity of forms to include
  @Column()
  quantity!: number;
}
