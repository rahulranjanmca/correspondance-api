/*
 * A single status detail regarding a Web Inquiry.
 */

import { ApiProperty } from '@nestjs/swagger';

export class ContactStatusDetailDto {
  @ApiProperty()
  actionType!: string;

  @ApiProperty()
  actionTakenOn!: string;

  @ApiProperty()
  activityData!: string;

  @ApiProperty()
  csa!: string;
}
