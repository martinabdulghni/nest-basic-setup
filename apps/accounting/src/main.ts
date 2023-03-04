import { NestFactory } from '@nestjs/core';
import { AccountingModule } from './accounting.module';

async function bootstrap() {
  const app = await NestFactory.create(AccountingModule);
  await app.listen(3000);
}
bootstrap();
