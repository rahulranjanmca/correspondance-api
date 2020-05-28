import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsString } from 'class-validator';

import { WebBasedInteractionTemplateEntity } from '../entity/interaction.template.entity';
import { WebResponsesAudience } from '../enum/web-responses.audience.enum';
import { WebResponsesState } from '../enum/web-responses.state.enum';
import { WebResponsesSubject } from '../enum/web-responses.subject.enum';
import { WebResponsesType } from '../enum/web-responses.type.enum';

export class WebResponseDataFieldsDto {
  constructor(webBasedInteractionTemplateEntity: WebBasedInteractionTemplateEntity) {
    if (!webBasedInteractionTemplateEntity) {
      return;
    }

    this.name = webBasedInteractionTemplateEntity.name;
    this.displayName = webBasedInteractionTemplateEntity.displayName;
    this.subjects = webBasedInteractionTemplateEntity.subject;
    this.audience = webBasedInteractionTemplateEntity.audience;
    this.state = webBasedInteractionTemplateEntity.state;
    this.type = webBasedInteractionTemplateEntity.type;
  }

  // The name of the web response.
  @ApiProperty()
  @IsString()
  name!: string;

  // Display-friendly name of the web response.
  @ApiProperty()
  @IsString()
  displayName!: string;

  // The subjects of the web response.
  @ApiProperty({ enum: WebResponsesSubject, isArray: true })
  @IsArray()
  @IsEnum(WebResponsesSubject, { each: true })
  subjects!: WebResponsesSubject[];

  // The audience of the web response.
  @ApiProperty({ enum: WebResponsesAudience })
  @IsEnum(WebResponsesAudience)
  audience!: WebResponsesAudience;

  // The states of the web response.
  @ApiProperty({ enum: WebResponsesState, isArray: true })
  @IsArray()
  @IsEnum(WebResponsesState, { each: true })
  state!: WebResponsesState[];

  // The type of the web response.
  @ApiProperty({ enum: WebResponsesType })
  @IsEnum(WebResponsesType)
  type!: WebResponsesType;
}
