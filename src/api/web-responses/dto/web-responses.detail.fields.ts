/**
 * Complete data fields associated with a web response, including the content.
 */

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsObject, IsString } from 'class-validator';

import { WebBasedInteractionTemplateEntity } from '../entity/interaction.template.entity';
import { WebResponseDataFieldsDto } from './web-responses.data.fields.dto';

//Represents a wbi instance.
export class WbiInstance {
  // The id of the instance.
  @ApiProperty({ example: ':60fe9fd7-0d79-4233-8ea7-81867a712288' })
  id!: string;

  // The content type.
  @ApiProperty({ example: 'text/plain;charset=UTF-8' })
  contentType!: string;
}

export class WbiOwner {
  @ApiProperty({ example: 'Operations - Correspondence Owners' })
  name!: string;

  @ApiProperty({ example: 'operationsCorrespondence@wellmark.com' })
  userId!: string;
}

export class WbiAuthorization {
  @ApiProperty({ example: ['*'] })
  build!: string[];

  @ApiProperty({ example: ['*'] })
  release!: string[];
}

export class CsWebResponseDetailFields extends WebResponseDataFieldsDto {
  constructor(webBasedInteractionTemplateEntity: WebBasedInteractionTemplateEntity) {
    super(webBasedInteractionTemplateEntity);

    if (!webBasedInteractionTemplateEntity) {
      return;
    }

    this.formId = webBasedInteractionTemplateEntity.formId;
    this.content = webBasedInteractionTemplateEntity.content;
    this.configuration = webBasedInteractionTemplateEntity.configuration;
    this.sourceSystemType = webBasedInteractionTemplateEntity.sourceSystemType;
    this.instances = webBasedInteractionTemplateEntity.instances;
    this.templateDescriptionAvailable = webBasedInteractionTemplateEntity.templateDescriptionAvailable;
    this.segment = webBasedInteractionTemplateEntity.segment;
    this.businessArea = webBasedInteractionTemplateEntity.businessArea;
    this.subtype = webBasedInteractionTemplateEntity.subtype;
    this.authorizations = webBasedInteractionTemplateEntity.authorizations;
    this.data = webBasedInteractionTemplateEntity.data;
    this.owners = webBasedInteractionTemplateEntity.owners;
    this.mailroom = webBasedInteractionTemplateEntity.mailroom;
  }

  @ApiProperty({ example: 'NOT_APPLICABLE' })
  @IsString()
  formId!: string;

  // The actual content of the Web Response.
  @ApiProperty({
    example:
      'Thank you for your recent inquiry. We conducted a review of the claim you referenced. The outcome is as follows: ____________________.'
  })
  @IsString()
  content!: string;

  // An object that specifies the configuration for this web response.
  @ApiProperty({ type: Object })
  @IsObject()
  configuration!: Record<string, string>;

  @ApiProperty({ example: 'WBI' })
  @IsString()
  sourceSystemType!: string;

  @ApiProperty({ type: [WbiInstance] })
  @IsArray()
  @Type(() => WbiInstance)
  instances!: WbiInstance[];

  @ApiProperty()
  @IsBoolean()
  templateDescriptionAvailable!: boolean;

  @ApiProperty()
  @IsArray()
  segment!: string[];

  @ApiProperty()
  @IsArray()
  businessArea!: string[];

  @ApiProperty()
  @IsArray()
  subtype!: string[];

  @ApiProperty({ type: WbiAuthorization })
  @Type(() => WbiAuthorization)
  authorizations!: WbiAuthorization;

  @ApiProperty({ type: [Object] })
  @IsArray()
  @Type(() => Object)
  data!: Record<string, string>[];

  @ApiProperty({ type: [WbiOwner] })
  @IsArray()
  @Type(() => WbiOwner)
  owners!: WbiOwner[];

  @ApiProperty()
  mailroom!: Record<string, string>;
}
