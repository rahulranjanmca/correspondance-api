import { ApiProperty } from '@nestjs/swagger';

import { WebBasedInteractionTemplateEntity } from '../entity/interaction.template.entity';
import { WebResponseDataFieldsDto } from './web-responses.data.fields.dto';

export class CsWebResponseSummaryDto extends WebResponseDataFieldsDto {
  constructor(webBasedInteractionTemplateEntity: WebBasedInteractionTemplateEntity) {
    super(webBasedInteractionTemplateEntity);

    if (!webBasedInteractionTemplateEntity) {
      return;
    }

    this.id = webBasedInteractionTemplateEntity._id.toString();
    this.created = webBasedInteractionTemplateEntity.created;
    this.lastUpdated = webBasedInteractionTemplateEntity.lastUpdated;
  }

  // The id of the web response.
  @ApiProperty()
  id!: string;

  // The time when this item was created.
  @ApiProperty()
  created!: string;

  // The time when this item was last updated.
  @ApiProperty()
  lastUpdated!: string;
}
