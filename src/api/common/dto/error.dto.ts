/**
 * class WmCccErrorDto
 */

import { ApiProperty } from '@nestjs/swagger';

export class WmCccErrorDto {
  constructor(message: string) {
    this.message = message;
  }

  @ApiProperty()
  message!: string;
}
