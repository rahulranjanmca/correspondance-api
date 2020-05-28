/* tslint:disable:max-classes-per-file */
import { Body, Controller, HttpStatus, INestApplication, Module, Post, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import supertest from 'supertest';

import { ConversationPreviewRequestDto } from './conversation.preview.request.dto';

@Controller('/test')
class TestController {
  @Post('/validation')
  validation(@Body() req: ConversationPreviewRequestDto) {
    return req;
  }
}

@Module({
  imports: [],
  controllers: [TestController],
  providers: []
})
class TestModule {}

describe('ConversationPreviewRequestDto Unit', () => {
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
        instance: {},
        inputData: {}
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        statusCode: 400,
        error: 'Bad Request',
        message: [{ value: {}, property: 'instance', constraints: { whitelistValidation: 'property instance should not exist' } }]
      });
  });

  afterEach(async () => {
    await new Promise(resolve => setTimeout(() => resolve(app.close()), 500));
  });
});
