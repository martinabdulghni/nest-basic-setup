import { AuthModule, DatabaseModule, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Billing, billingSchema } from './schemas/billing.schema';
import { BillingRepository } from './billing.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        MONGODB_URI: Joi.string().required(),
        RABBIT_MQ_BILLING_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/billing/.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Billing.name, schema: billingSchema }]),
    RmqModule,
    AuthModule,
  ],
  controllers: [BillingController],
  providers: [BillingService, BillingRepository],
})
export class BillingModule {}
