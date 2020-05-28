import { ArgumentsHost, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as assert from 'assert';
import { Response } from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getConnectionManager } from 'typeorm';

import { CommonModule } from '../common/common.module';
import { CommonService } from '../common/common.service';
import { AuditRecordEntity } from '../common/entity/audit.record.entity';
import { ErrorFilter } from '../common/filter/error.filter';
import { CsWebResponseDetail } from './dto/web-responses.detail.dto';
import { CsWebResponseDetailFields } from './dto/web-responses.detail.fields';
import { WebResponsesGetQueryDto } from './dto/web-responses.get.query.dto';
import { CsWebResponseSummaryDto } from './dto/web-responses.response.summary.dto';
import { WebBasedInteractionTemplateEntity } from './entity/interaction.template.entity';
import { WebResponsesController } from './web-responses.controller';
import { WebResponsesModule } from './web-responses.module';
import { WebResponsesService } from './web-responses.service';
import { templateDetailFields } from './web-responses.service.spec';

describe('WebResponses Controller', () => {
  let controller: WebResponsesController;
  const mongod = new MongoMemoryServer();
  const mockFunction = jest.fn();
  class MockWebResponsesService {
    async get(
      query: WebResponsesGetQueryDto
    ): Promise<{
      data: CsWebResponseSummaryDto[];
      page: number;
      perPage: number;
      nextPage: number;
      prevPage: number;
      totalPages: number;
    }> {
      return await mockFunction(query);
    }

    async getById(id: string): Promise<CsWebResponseDetail> {
      return await mockFunction(id);
    }

    async updateById(id: string, body: CsWebResponseDetailFields): Promise<CsWebResponseDetail> {
      return await mockFunction(id, body);
    }

    async deleteById(id: string): Promise<void> {
      return await mockFunction(id);
    }

    async create(body: CsWebResponseDetailFields): Promise<CsWebResponseDetail> {
      return await mockFunction(body);
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          name: 'WM_CCC',
          type: 'mongodb',
          url: await mongod.getUri(),
          entities: [AuditRecordEntity],
          synchronize: true,
          useUnifiedTopology: true
        }),
        TypeOrmModule.forRoot({
          name: 'WM_CRMWBI',
          type: 'mongodb',
          url: await mongod.getUri(),
          entities: [WebBasedInteractionTemplateEntity],
          synchronize: true,
          useUnifiedTopology: true
        }),
        TypeOrmModule.forFeature([WebBasedInteractionTemplateEntity], 'WM_CRMWBI'),
        CommonModule,
        WebResponsesModule
      ],
      providers: [WebResponsesService],
      controllers: [WebResponsesController]
    })
      .overrideProvider(WebResponsesService)
      .useClass(MockWebResponsesService)
      .compile();

    controller = module.get<WebResponsesController>(WebResponsesController);
  });

  afterEach(async () => {
    for (const connection of getConnectionManager().connections) {
      await connection.close();
    }

    await mongod.stop();

    mockFunction.mockReset();
  });

  describe('create', () => {
    it('should create success', async () => {
      mockFunction.mockResolvedValue({});
      expect(await controller.create(Object.assign({}, templateDetailFields), { user: { userId: 'test', userRole: 'admin' } }));
      expect(mockFunction).toBeCalledTimes(1);
    });

    it('should not create success for denying', async () => {
      try {
        expect(await controller.create(Object.assign({}, templateDetailFields), { user: { userId: 'test', userRole: 'test' } }));
        assert.fail('should not be here');
      } catch (error) {
        expect(error.message.message).toBe('Not allowed to perform the action');
      }

      expect(mockFunction).toBeCalledTimes(0);
    });
  });

  it('should get success', async () => {
    mockFunction.mockResolvedValue({ data: [], page: 1, perPage: 2, nextPage: 3, prevPage: 4, total: 5, totalPages: 6 });
    const mockResponse = ({ set: () => mockResponse, send: () => {} } as unknown) as Response;

    expect(await controller.get(({} as unknown) as WebResponsesGetQueryDto, mockResponse));
  });

  it('should getById success', async () => {
    mockFunction.mockResolvedValue({});
    expect(await controller.getById('test'));
    expect(mockFunction).toBeCalledTimes(1);
  });

  it('should delete success', async () => {
    mockFunction.mockResolvedValue({});
    expect(await controller.deleteById('test', { user: { userId: 'test', userRole: 'admin' } }));
    expect(mockFunction).toBeCalledTimes(1);
  });

  it('should updateById success', async () => {
    mockFunction.mockResolvedValue({});
    expect(await controller.updateById('test', Object.assign({}, templateDetailFields), { user: { userId: 'test', userRole: 'admin' } }));
    expect(mockFunction).toBeCalledTimes(1);
  });

  describe('ErrorFilter', () => {
    const response = {
      status: () => response,
      send: () => response
    };

    const ctx = { getResponse: () => response };
    it('should ErrorFilter success for Error', async () => {
      const filter = new ErrorFilter();

      filter.catch(Error('test'), ({ switchToHttp: () => ctx } as unknown) as ArgumentsHost);

      filter.catch(new UnauthorizedException('test'), ({ switchToHttp: () => ctx } as unknown) as ArgumentsHost);

      filter.catch(CommonService.getHttpError('test', HttpStatus.INTERNAL_SERVER_ERROR), ({
        switchToHttp: () => ctx
      } as unknown) as ArgumentsHost);

      filter.catch(('test' as unknown) as Error, ({ switchToHttp: () => ctx } as unknown) as ArgumentsHost);
    });
  });
});
