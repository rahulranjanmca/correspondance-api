/**
 * The form data needed to fill out a form template.
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNotEmptyObject } from 'class-validator';

export class FormDataDto {
  // The id of the form template this data is for.
  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  formId!: string;

  // The form data to fill out an instance of the form template.
  @ApiProperty()
  @IsNotEmptyObject()
  data!: object;
}
