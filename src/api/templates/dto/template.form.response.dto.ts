/**
 * class TemplateResponse
 */

import { IsArray } from 'class-validator';

import { CatalogEntity } from '../../common/entity/catalog.entity';
import { TemplateResponseDto } from './template.response.dto';

export class TemplateFormResponseDto extends TemplateResponseDto {
  constructor(catalog: CatalogEntity) {
    super(catalog);

    this.state = catalog.state;
  }

  // The state of the form.
  @IsArray()
  state!: string[];
}
