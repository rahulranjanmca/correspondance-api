/* tslint:disable:max-classes-per-file */
import { Body, Controller, HttpStatus, INestApplication, Module, Post, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import supertest from 'supertest';

import { ConversationCreateRequest } from './conversation.create.request.dto';

@Controller('/test')
class TestController {
  @Post('/validation')
  validation(@Body() req: ConversationCreateRequest) {
    return req;
  }
}

@Module({
  imports: [],
  controllers: [TestController],
  providers: []
})
class TestModule {}

describe('ConversationCreateRequest Unit', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await NestFactory.create(TestModule, {
      logger: false
    });
    app.useGlobalPipes(
      new ValidationPipe({
        validationError: { target: false },
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        skipMissingProperties: true,
        whitelist: true,
        forbidNonWhitelisted: true
      })
    );
    await app.init();
  });

  it('request validation', async () => {
    await supertest(app.getHttpServer())
      .post('/test/validation')
      .send({
        caseId: 'case1',
        formId: 'form1',
        formQuantity: [{ formId: 'form1', quantity: 'quantity1' }]
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        statusCode: 400,
        error: 'Bad Request',
        message: [
          {
            value: [{ formId: 'form1', quantity: null }],
            property: 'formQuantity',
            children: [
              {
                value: { formId: 'form1', quantity: null },
                property: '0',
                children: [
                  {
                    value: null,
                    property: 'quantity',
                    children: [],
                    constraints: { isNumber: 'quantity must be a number conforming to the specified constraints' }
                  }
                ]
              }
            ]
          }
        ]
      });
  });

  afterEach(async () => {
    await new Promise(resolve => setTimeout(() => resolve(app.close()), 500));
  });
});
