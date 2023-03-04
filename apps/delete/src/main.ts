import { NestFactory } from '@nestjs/core';
import { DeleteModule } from './delete.module';

async function bootstrap() {
  const app = await NestFactory.create(DeleteModule);
  await app.listen(3000);
}
bootstrap();
