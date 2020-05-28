import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import * as assert from 'assert';
import { plainToClass } from 'class-transformer';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getConnectionManager, Repository } from 'typeorm';

import { CommonModule } from '../common/common.module';
import { CommonService } from '../common/common.service';
import { AuditRecordEntity } from '../common/entity/audit.record.entity';
import { WebResponseDataFieldsDto } from './dto/web-responses.data.fields.dto';
import { CsWebResponseDetail } from './dto/web-responses.detail.dto';
import { CsWebResponseDetailFields } from './dto/web-responses.detail.fields';
import { WebResponsesGetQueryDto } from './dto/web-responses.get.query.dto';
import { CsWebResponseSummaryDto } from './dto/web-responses.response.summary.dto';
import { WebBasedInteractionTemplateEntity } from './entity/interaction.template.entity';
import { WebResponsesService } from './web-responses.service';

export const templateDetailFields = ({
  name: 'string',
  displayName: 'string',
  subjects: ['All Subjects'],
  audience: 'Member',
  state: ['IA'],
  type: 'Update',
  formId: 'NOT_APPLICABLE',
  content:
    'Thank you for your recent inquiry. We conducted a review of the claim you referenced. The outcome is as follows: ____________________.',
  configuration: {},
  sourceSystemType: 'WBI',
  instances: [
    {
      id: ':60fe9fd7-0d79-4233-8ea7-81867a712288',
      contentType: 'text/plain;charset=UTF-8'
    }
  ],
  templateDescriptionAvailable: true,
  segment: ['string'],
  businessArea: ['string'],
  subtype: ['string'],
  authorizations: {
    build: ['*'],
    release: ['*']
  },
  data: [{}],
  owners: [
    {
      name: 'Operations - Correspondence Owners',
      userId: 'operationsCorrespondence@wellmark.com'
    }
  ],
  mailroom: {}
} as unknown) as CsWebResponseDetailFields;

describe('WebResponsesService', () => {
  let service: WebResponsesService;
  const mongod = new MongoMemoryServer();
  let webBasedInteractionTemplateEntity: Repository<WebBasedInteractionTemplateEntity>;

  class MockCommonService {}
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          name: 'WM_CCC',
          type: 'mongodb',
          url: await mongod.getUri(),
          entities: [AuditRecordEntity],
          synchronize: true
        }),
        TypeOrmModule.forRoot({
          name: 'WM_CRMWBI',
          type: 'mongodb',
          url: await mongod.getUri(),
          entities: [WebBasedInteractionTemplateEntity],
          synchronize: true
        }),
        TypeOrmModule.forFeature([WebBasedInteractionTemplateEntity], 'WM_CRMWBI'),
        CommonModule
      ],
      providers: [WebResponsesService]
    })
      .overrideProvider(CommonService)
      .useClass(MockCommonService)
      .compile();

    service = module.get<WebResponsesService>(WebResponsesService);
    webBasedInteractionTemplateEntity = module.get<Repository<WebBasedInteractionTemplateEntity>>(
      getRepositoryToken(WebBasedInteractionTemplateEntity, 'WM_CRMWBI')
    );
  });

  afterEach(async () => {
    for (const connection of getConnectionManager().connections) {
      await connection.close();
    }

    await mongod.stop();
  });

  async function saveAndGetTemplate(): Promise<WebBasedInteractionTemplateEntity> {
    return await webBasedInteractionTemplateEntity.save(({
      name: 'Language Assistance: Croatian',
      displayName: 'Language Assistance: Croatian',
      formId: 'NOT_APPLICABLE',
      created: '2020-01-01T00:00:00+0000',
      lastUpdated: '2020-01-01T00:00:00+0000',
      description: '',
      sourceSystemType: 'WBI',
      configuration: {},
      instances: [
        {
          id: 'wbiid:60fe9fd7-0d79-4233-8ea7-81867a7eb288',
          contentType: 'text/plain;charset=UTF-8'
        }
      ],
      templateDescriptionAvailable: false,
      subject: ['All Subjects'],
      segment: [],
      audience: ['Member'],
      businessArea: [],
      state: ['IA', 'SD'],
      type: 'Update',
      subtype: '',
      content:
        'Hvala Vam Å¡to ste kontaktirali Wellmark Blue Cross i Blue Shield. OÄ\u008dekujte telefonski poziv KorisniÄ\u008dke sluÅ¾be druÅ¡tva Wellmark tijekom sljedeÄ‡eg radnog dana. English: Thank you for contacting Wellmark Blue Cross and Blue Shield. Please expect a telephone call from Wellmark Customer Service within the next business day. Ako uspijemo s Vama stupiti u kontakt putem telefona, u razgovor Ä‡emo ukljuÄ\u008diti prevoditelja za hrvatski jezik kako bismo mogli odgovoriti na VaÅ¡e pitanje. English: If we are able to reach you by telephone, we will include a Croatian interpreter so we are able to answer your question. Ako nakon nekoliko pokuÅ¡aja ne uspijemo s Vama stupiti u kontakt putem telefona, na VaÅ¡ Ä‡emo upit odgovoriti pisanim putem na hrvatskom jeziku. NaÅ¡ odgovor trebao bi stiÄ‡i u roku od sedam (7) dana. English: If we are unable to reach you by phone after several attempts, we will answer your inquiry in writing in Croatian. Our response may take up to seven (7) days. Ako Vam odgovor treba ranije i imate moguÄ‡nost nazvati Wellmark od ponedjeljka do petka izmeÄ‘u 7:30 i 17 sati, rado Ä‡emo Vam pomoÄ‡i na hrvatskom jeziku. KorisniÄ\u008dku sluÅ¾bu druÅ¡tva Wellmark nazovite na broj . Odaberite opciju â€žSvi ostali jeziciâ€\u009d. Kako bi mogao odgovoriti na VaÅ¡a pitanja, djelatnik KorisniÄ\u008dke sluÅ¾be koji odgovori na VaÅ¡ poziv u razgovor Ä‡e ukljuÄ\u008diti prevoditelja za hrvatski jezik.',
      authorizations: {
        build: ['*'],
        release: ['*']
      },
      data: [],
      owners: [
        {
          name: 'Operations - Correspondence Owners',
          userId: 'operationsCorrespondence@wellmark.com'
        }
      ],
      mailroom: {}
    } as unknown) as WebBasedInteractionTemplateEntity);
  }

  describe('create', () => {
    it('should create success', async () => {
      const ret = await service.create(Object.assign({}, templateDetailFields), 'test');

      // for coverage
      new WebResponseDataFieldsDto((undefined as unknown) as WebBasedInteractionTemplateEntity);
      new CsWebResponseDetail((undefined as unknown) as WebBasedInteractionTemplateEntity);
      new CsWebResponseSummaryDto((undefined as unknown) as WebBasedInteractionTemplateEntity);
      new CsWebResponseDetailFields((undefined as unknown) as WebBasedInteractionTemplateEntity);
      plainToClass(CsWebResponseDetailFields, templateDetailFields);

      expect(ret).toBeDefined();
      expect(await webBasedInteractionTemplateEntity.count()).toBe(1);
    });

    it('should not create success for validate failed', async () => {
      try {
        await service.create(({} as unknown) as CsWebResponseDetailFields, 'test');
        fail('should not here');
      } catch (e) {
        expect(e).toBeDefined();
      }
    });
  });

  describe('deleteById', () => {
    it('should deleteById success', async () => {
      const db = await saveAndGetTemplate();

      await service.deleteById(db._id.toString());

      expect(await webBasedInteractionTemplateEntity.count()).toBe(0);
    });
  });

  describe('getById', () => {
    it('should getById success', async () => {
      const db = await saveAndGetTemplate();

      expect(await service.getById(db._id.toString())).toBeDefined();

      expect(await webBasedInteractionTemplateEntity.count()).toBe(1);
    });

    it('should not getById success for not exist', async () => {
      await saveAndGetTemplate();

      try {
        await service.getById('5eab9cfb23e1ed077348bdb0');
        assert.fail('should not be here');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message.message).toBe('Requested entity is not found in database');
      }
      expect(await webBasedInteractionTemplateEntity.count()).toBe(1);
    });

    it('should not getById success for id invalid', async () => {
      await saveAndGetTemplate();

      try {
        await service.getById('test');
        assert.fail('should not be here');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message.message).toBe('id is invalid');
      }
      expect(await webBasedInteractionTemplateEntity.count()).toBe(1);
    });
  });

  describe('updateById', () => {
    it('should updateById success', async () => {
      const db = await saveAndGetTemplate();

      expect(await service.updateById(db._id.toString(), Object.assign({}, templateDetailFields), 'test')).toBeDefined();

      expect(await webBasedInteractionTemplateEntity.count()).toBe(1);
    });

    it('should updateById success for no subject', async () => {
      const db = await saveAndGetTemplate();

      const body = Object.assign({}, templateDetailFields);
      delete body.subjects;
      expect(await service.updateById(db._id.toString(), body, 'test')).toBeDefined();

      expect(await webBasedInteractionTemplateEntity.count()).toBe(1);
    });
  });

  describe('get list', () => {
    it('should get list success for no filter', async () => {
      await saveAndGetTemplate();
      const ret = await service.get(({} as unknown) as WebResponsesGetQueryDto);
      expect(ret.data.length).toBe(1);

      expect(await webBasedInteractionTemplateEntity.count()).toBe(1);
    });

    it('should get list success for all filter', async () => {
      await saveAndGetTemplate();

      const ret = await service.get(
        plainToClass(WebResponsesGetQueryDto, {
          type: 'Update',
          subject: 'All Subjects',
          audience: 'Member',
          state: 'IA',
          page: '1',
          perPage: '2'
        })
      );
      expect(ret.data.length).toBe(1);

      expect(await webBasedInteractionTemplateEntity.count()).toBe(1);
    });

    it('should get list success for perPage not present', async () => {
      await saveAndGetTemplate();

      const ret = await service.get(
        plainToClass(WebResponsesGetQueryDto, { type: 'Update', subject: 'All Subjects', audience: 'Member', state: 'IA', page: '1' })
      );
      expect(ret.data.length).toBe(1);

      expect(await webBasedInteractionTemplateEntity.count()).toBe(1);
    });

    it('should get list success for request page bigger than total page', async () => {
      await saveAndGetTemplate();

      const ret = await service.get(
        plainToClass(WebResponsesGetQueryDto, {
          type: 'Update',
          subject: 'All Subjects',
          audience: 'Member',
          state: 'IA',
          page: '4',
          perPage: '2'
        })
      );
      expect(ret.data.length).toBe(1);

      expect(await webBasedInteractionTemplateEntity.count()).toBe(1);
    });

    it('should get list success for request page bigger than total page', async () => {
      await saveAndGetTemplate();

      const ret = await service.get(
        plainToClass(WebResponsesGetQueryDto, {
          type: 'Update',
          subject: 'All Subjects',
          audience: 'Member',
          state: 'IA',
          page: '4',
          perPage: '2'
        })
      );
      expect(ret.data.length).toBe(1);

      expect(await webBasedInteractionTemplateEntity.count()).toBe(1);
    });

    it('should get list success for request page is the first and last', async () => {
      await saveAndGetTemplate();

      const ret = await service.get(
        plainToClass(WebResponsesGetQueryDto, {
          type: 'Update',
          subject: 'All Subjects',
          audience: 'Member',
          state: 'IA',
          page: '1',
          perPage: '1'
        })
      );
      expect(ret.data.length).toBe(1);

      expect(await webBasedInteractionTemplateEntity.count()).toBe(1);
    });

    it('should get list success for request page is the middle page', async () => {
      await saveAndGetTemplate();
      await saveAndGetTemplate();
      await saveAndGetTemplate();

      const ret = await service.get(
        plainToClass(WebResponsesGetQueryDto, {
          type: 'Update',
          subject: 'All Subjects',
          audience: 'Member',
          state: 'IA',
          page: '2',
          perPage: '1'
        })
      );
      expect(ret.data.length).toBe(1);

      expect(await webBasedInteractionTemplateEntity.count()).toBe(3);
    });

    it('should not get list success for no data', async () => {
      const ret = await service.get(
        plainToClass(WebResponsesGetQueryDto, {
          type: 'Update',
          subject: 'All Subjects',
          audience: 'Member',
          state: 'SD',
          page: '2',
          perPage: '1'
        })
      );
      expect(ret.data.length).toBe(0);

      expect(await webBasedInteractionTemplateEntity.count()).toBe(0);
    });
  });
});
