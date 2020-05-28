/**
 * The form data needed to fill out a form template.
 */

import { Column } from 'typeorm';

export class FormData {
  // The id of the form template this data is for.
  @Column()
  formId!: string;

  // The form data to fill out an instance of the form template.
  @Column()
  data!: object;
}
