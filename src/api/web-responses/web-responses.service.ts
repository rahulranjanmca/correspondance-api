import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { ObjectID } from 'mongodb';
import { MongoRepository } from 'typeorm';

import { CommonService } from '../common/common.service';
import { CsWebResponseDetail } from './dto/web-responses.detail.dto';
import { CsWebResponseDetailFields } from './dto/web-responses.detail.fields';
import { WebResponsesGetQueryDto } from './dto/web-responses.get.query.dto';
import { CsWebResponseSummaryDto } from './dto/web-responses.response.summary.dto';
import { WebBasedInteractionTemplateEntity } from './entity/interaction.template.entity';

@Injectable()
export class WebResponsesService {
  private readonly webBasedInteractionTemplateEntityRepository: MongoRepository<WebBasedInteractionTemplateEntity>;

  constructor(
    @InjectRepository(WebBasedInteractionTemplateEntity, 'WM_CRMWBI')
    webBasedInteractionTemplateEntityRepository: MongoRepository<WebBasedInteractionTemplateEntity>
  ) {
    this.webBasedInteractionTemplateEntityRepository = webBasedInteractionTemplateEntityRepository;
  }

  /**
   * get getTemplate list by filers
   * @param query WebResponsesGetQueryDto
   */
  async get(
    query: WebResponsesGetQueryDto
  ): Promise<{
    data: CsWebResponseSummaryDto[];
    page: number;
    perPage: number;
    nextPage: number;
    prevPage: number;
    total: number;
    totalPages: number;
  }> {
    const data: CsWebResponseSummaryDto[] = [];
    let page: number;
    let perPage: number;
    let nextPage: number;
    let prevPage: number;
    let totalPages: number;
    let skip: number;
    let take: number;
    const condition = this.getFindCondition(query);

    const total = await this.webBasedInteractionTemplateEntityRepository.count(condition);
    if (total === 0) {
      return { data: [], page: 0, perPage: 0, nextPage: 0, prevPage: 0, total, totalPages: 0 };
    }

    // If perPage not present, then it means all entities should be returned.
    if (!query.perPage) {
      page = 1;
      perPage = 0;
      nextPage = 0;
      prevPage = 0;
      totalPages = 1;
      skip = 0;
      take = total;
    } else {
      totalPages = Math.ceil(total / query.perPage);
      if (totalPages < query.page) {
        page = totalPages;
      } else {
        page = query.page;
      }

      skip = query.perPage * (page - 1);
      take = query.perPage;
      perPage = query.perPage;
      nextPage = page === totalPages ? page : page + 1;
      prevPage = page === 1 ? 1 : page - 1;
    }

    for (const template of await this.webBasedInteractionTemplateEntityRepository.find({ where: condition, skip, take })) {
      data.push(new CsWebResponseSummaryDto(template));
    }

    return { data, page, perPage, nextPage, prevPage, total, totalPages };
  }

  /**
   * get Template By Id
   * @param id template id
   */
  async getById(id: string): Promise<CsWebResponseDetail> {
    return new CsWebResponseDetail(await this.getTemplateEntityById(id));
  }

  /**
   * update getTemplate By Id
   * @param id template id
   * @param body CsWebResponseDetailFields
   */
  async updateById(id: string, body: CsWebResponseDetailFields, userId: string): Promise<CsWebResponseDetail> {
    const entity = await this.getTemplateEntityById(id);

    // handle the not match property.
    if (body.subjects) {
      entity.subject = body.subjects;
      delete body.subjects;
    }

    Object.assign(entity, body);

    entity.lastUpdateUser = userId;
    entity.lastUpdated = new Date().toISOString();

    return new CsWebResponseDetail(await this.webBasedInteractionTemplateEntityRepository.save(entity));
  }

  /**
   * delete getTemplate By Id
   * @param id template id
   */
  async deleteById(id: string): Promise<void> {
    await this.webBasedInteractionTemplateEntityRepository.remove(await this.getTemplateEntityById(id));
  }

  /**
   * get getTemplate By Id
   * @param id template id
   */
  private async getTemplateEntityById(id: string): Promise<WebBasedInteractionTemplateEntity> {
    if (!ObjectID.isValid(id)) {
      throw CommonService.getHttpError('id is invalid', HttpStatus.BAD_REQUEST);
    }

    const template = await this.webBasedInteractionTemplateEntityRepository.findOne(id);
    if (!template) {
      throw CommonService.getHttpError('Requested entity is not found in database', HttpStatus.NOT_FOUND);
    }

    return template;
  }

  /**
   * get find condition by
   * @param id template id
   */
  private getFindCondition(query: WebResponsesGetQueryDto): Record<string, string> {
    const queryMap: Record<string, string> = {};

    if (query.audience) {
      queryMap.audience = query.audience;
    }
    if (query.state) {
      queryMap.state = query.state;
    }
    if (query.type) {
      queryMap.type = query.type;
    }
    if (query.subject) {
      queryMap.subject = query.subject;
    }

    return queryMap;
  }

  /**
   * create template
   * @param body CsWebResponseDetailFields
   * @param userId the user who create template
   */
  async create(body: CsWebResponseDetailFields, userId: string): Promise<CsWebResponseDetail> {
    const entity = new WebBasedInteractionTemplateEntity(body, userId);
    const errors = await validate(entity);
    if (errors.length > 0) {
      CommonService.throwBadRequestError(errors);
    }

    return new CsWebResponseDetail(await this.webBasedInteractionTemplateEntityRepository.save(entity));
  }
}
