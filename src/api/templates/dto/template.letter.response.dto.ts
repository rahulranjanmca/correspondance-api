/**
 * class TemplateResponse
 */

import { IsArray } from 'class-validator';

import { CatalogEntity } from '../../common/entity/catalog.entity';
import { TemplateResponseDto } from './template.response.dto';

export class TemplateLetterResponseDto extends TemplateResponseDto {
  constructor(catalog: CatalogEntity) {
    super(catalog);

    this.audience = catalog.audience;
    this.subject = catalog.subject;
  }

  // The audience of the letter
  @IsArray()
  audience!: string[];

  // The subject of the letter.
  @IsArray()
  subject!: string[];
}
