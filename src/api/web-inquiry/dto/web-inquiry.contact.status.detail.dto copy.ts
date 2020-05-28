/*
 * A simple object providing the details of a response to a web inquiry.
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

import { WebResponsesType } from '../../web-responses/enum/web-responses.type.enum';

export class WebInquiryResponseFields {
  // User id of the responder
  @ApiProperty()
  @IsNotEmpty()
  userId!: string;

  // The case id
  @IsNotEmpty()
  @ApiProperty()
  caseId!: string;

  // The type of response
  @IsNotEmpty()
  @IsEnum(WebResponsesType)
  @ApiProperty({ enum: WebResponsesType })
  type!: WebResponsesType;

  // The text content.
  @IsNotEmpty()
  @ApiProperty({
    example:
      'Thank you for your recent inquiry. We conducted a review of the claim you referenced. The outcome is as follows: Review was successful.'
  })
  content!: string;
}
