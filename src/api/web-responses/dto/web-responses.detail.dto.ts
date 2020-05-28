import { ApiProperty } from '@nestjs/swagger';

import { WebBasedInteractionTemplateEntity } from '../entity/interaction.template.entity';
import { CsWebResponseDetailFields } from './web-responses.detail.fields';

export class CsWebResponseDetail extends CsWebResponseDetailFields {
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
