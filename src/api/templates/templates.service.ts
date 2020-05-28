/**
 * the service for templates
 */

import { Injectable } from '@nestjs/common';

import { CommonService } from '../common/common.service';
import { TemplateFormQueryDto } from './dto/template.form.query.dto';
import { TemplateFormResponseDto } from './dto/template.form.response.dto';
import { TemplateLetterQueryDto } from './dto/template.letter.query.dto';
import { TemplateLetterResponseDto } from './dto/template.letter.response.dto';

@Injectable()
export class TemplatesService {
  private readonly commonService: CommonService;
  constructor(commonService: CommonService) {
    this.commonService = commonService;
  }

  /**
   * get Template By Id from document api
   * @param id Template id
   */
  async getTemplateById(id: string): Promise<Record<string, string>> {
    return await this.commonService.getTemplateById(id);
  }

  private doesContain(list: string[], keyword: string): boolean {
    return !keyword || (list && list.indexOf(keyword) >= 0);
  }

  /**
   * get Letter Catalog from document api
   * @param query TemplateFormQueryDto
   */
  async getLetterCatalog(query: TemplateLetterQueryDto): Promise<TemplateLetterResponseDto[]> {
    const catalogList = await this.commonService.getCatalogList(query.role);
    const ret: TemplateLetterResponseDto[] = [];

    for (const catalog of catalogList) {
      if (catalog.DocumentType !== 'letter') {
        continue;
      }

      if (
        this.doesContain(catalog.audience, query.audience) &&
        this.doesContain(catalog.subject, query.subject) &&
        this.doesContain(catalog.segment, query.marketSegment)
      ) {
        ret.push(new TemplateLetterResponseDto(catalog));
      }
    }

    return ret;
  }

  /**
   * get Form Catalog from document api
   * @param query TemplateFormQueryDto
   */
  async getFormCatalog(query: TemplateFormQueryDto): Promise<TemplateFormResponseDto[]> {
    const catalogList = await this.commonService.getCatalogList(query.role);
    const ret: TemplateFormResponseDto[] = [];

    for (const catalog of catalogList) {
      if (catalog.DocumentType !== 'form') {
        continue;
      }

      if (this.doesContain(catalog.state, query.state) && this.doesContain(catalog.segment, query.marketSegment)) {
        ret.push(new TemplateFormResponseDto(catalog));
      }
    }

    return ret;
  }
}
