import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { ScheduleModule } from '@nestjs/schedule';
import { RolesAuthGuard } from '@app/common/auth/roles-auth.guard';
import { UsersRepository } from 'apps/auth/src/users/users.repository';
import { DatabaseModule, AuthModule, RmqModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'apps/auth/src/users/schemas/user.schema';
import { Order, orderSchema } from 'apps/orders/src/schemas/order.schema';
import { CronService } from './cron/cron.service';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        RABBIT_MQ_JOB_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/job/.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Order.name, schema: orderSchema }]),
    AuthModule,
    RmqModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [JobController],
  providers: [JobService, CronService, UsersRepository, RolesAuthGuard, CronService],
})
export class JobModule {}
