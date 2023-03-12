import { RmqService } from '@app/common';
import { NestFactory } from '@nestjs/core';
import { JobModule } from './job.module';

async function bootstrap() {
  const app = await NestFactory.create(JobModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('JOB'));
  await app.startAllMicroservices();
}
bootstrap();
