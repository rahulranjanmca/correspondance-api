/* tslint:disable:max-classes-per-file */
import { Body, Controller, HttpStatus, INestApplication, Module, Post, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import supertest from 'supertest';

import { ConversationUpdateBodyDto } from './conversation.update.body.dto';

@Controller('/test')
class TestController {
  @Post('/validation')
  validation(@Body() req: ConversationUpdateBodyDto) {
    return req;
  }
}

@Module({
  imports: [],
  controllers: [TestController],
  providers: []
})
class TestModule {}

describe('ConversationUpdateBody Unit', () => {
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
        formQuantity: [{ formId: 'form1', quantity: 2 }]
      })
      .expect(HttpStatus.CREATED);
  });

  afterEach(async () => {
    await new Promise(resolve => setTimeout(() => resolve(app.close()), 500));
  });
});
