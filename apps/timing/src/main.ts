import { NestFactory } from '@nestjs/core';
import { TimingModule } from './timing.module';

async function bootstrap() {
  const app = await NestFactory.create(TimingModule);
  await app.listen(3000);
}
bootstrap();
