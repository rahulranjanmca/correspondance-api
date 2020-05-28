import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, Min } from 'class-validator';

import { WebResponsesAudience } from '../enum/web-responses.audience.enum';
import { WebResponsesState } from '../enum/web-responses.state.enum';
import { WebResponsesSubject } from '../enum/web-responses.subject.enum';
import { WebResponsesType } from '../enum/web-responses.type.enum';

export class WebResponsesGetQueryDto {
  // Filter by type
  @ApiProperty({ enum: WebResponsesType, required: false })
  @IsEnum(WebResponsesType)
  type: WebResponsesType | undefined;

  // Filter by subject.
  @ApiProperty({ enum: WebResponsesSubject, required: false })
  @IsEnum(WebResponsesSubject)
  subject: WebResponsesSubject | undefined;

  // Filter by audience.
  @ApiProperty({ enum: WebResponsesAudience, required: false })
  @IsEnum(WebResponsesAudience)
  audience!: WebResponsesAudience | undefined;

  // Filter by state
  @ApiProperty({ enum: WebResponsesState, required: false })
  @IsEnum(WebResponsesState)
  state!: WebResponsesState | undefined;

  // The page number. 1 based.
  @ApiProperty({ type: Number, required: false })
  @Transform(v => Number(v))
  @IsNumber()
  @Min(1)
  page = 1;

  // The number of entities shown in one page. If not present, then it means all entities should be returned.
  @ApiProperty({ type: Number, required: false })
  @Transform(v => Number(v))
  @IsNumber()
  @Min(1)
  perPage: number | undefined;
}
