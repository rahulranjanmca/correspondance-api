/**
 * class TemplateResponse
 */

import { IsArray, IsBoolean, IsString } from 'class-validator';

import { CatalogEntity } from '../../common/entity/catalog.entity';

export class TemplateResponseDto {
  constructor(catalog: CatalogEntity) {
    this.id = catalog.formId;
    this.name = catalog.name;
    this.displayName = catalog.displayName;
    this.description = catalog.description;
    this.marketSegment = catalog.segment;
    this.templateAvailable = catalog.templateDescriptionAvailable;
    this.instances = catalog.instances;
  }
  // Id of the Template
  @IsString()
  id!: string;

  //The name of the Template
  @IsString()
  name!: string;

  //The display name of the template.
  @IsString()
  displayName!: string;

  //The description of the template.
  @IsString()
  description!: string;

  // The market segment(s) of the template.
  @IsArray()
  marketSegment!: string[];

  // Indicates whether a template description is available to retrieve.
  @IsBoolean()
  templateAvailable!: boolean;

  instances!: { id: string; contentType: string }[];
}
