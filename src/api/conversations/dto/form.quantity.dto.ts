/**
 * class FormQuantityDto
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class FormQuantityDto {
  // The id of the form template.
  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  formId!: string;

  // The quantity of forms to include
  @ApiProperty({ example: 1 })
  @IsNumber()
  quantity!: number;
}
