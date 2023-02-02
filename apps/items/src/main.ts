import { RmqService } from '@app/common';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ItemsModule } from './items.module';

async function bootstrap() {
  const app = await NestFactory.create(ItemsModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('ITEMS'));
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}
bootstrap();
