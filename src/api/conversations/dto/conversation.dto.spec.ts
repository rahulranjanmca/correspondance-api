/* tslint:disable:max-classes-per-file */
import { Body, Controller, HttpStatus, INestApplication, Module, Post, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ObjectID } from 'bson';
import supertest from 'supertest';

import { ConversationDto } from './conversation.dto';

@Controller('/test')
class TestController {
  @Post('/validation')
  validation(@Body() req: ConversationDto) {
    return req;
  }
}

@Module({
  imports: [],
  controllers: [TestController],
  providers: []
})
class TestModule {}

describe('ConversationDto Unit', () => {
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
    const mongoId = new ObjectID();
    await supertest(app.getHttpServer())
      .post('/test/validation')
      .send({
        id: mongoId,
        caseId: 'case1',
        formId: 'form1',
        documentType: 'letter',
        status: 'draft',
        formQuantity: [],
        attachments: [],
        approvalChain: []
      })
      .expect(HttpStatus.CREATED);
  });

  afterEach(async () => {
    await new Promise(resolve => setTimeout(() => resolve(app.close()), 500));
  });
});
