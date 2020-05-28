import { NestFactory } from '@nestjs/core';
import { MockModule } from './mock.module';

async function bootstrap() {
  const app = await NestFactory.create(MockModule);
  await app.listen(3001);
}
bootstrap();
