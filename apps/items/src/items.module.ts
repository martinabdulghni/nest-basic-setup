import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import * as Joi from 'joi';
import { AuthModule, DatabaseModule, RmqModule } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Items, itemsSchema } from './schemas/items.schema';
import { ItemRepository } from './items.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        RABBIT_MQ_ITEMS_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/items/.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Items.name, schema: itemsSchema }]),
    AuthModule,
    RmqModule,
  ],
  controllers: [ItemsController],
  providers: [ItemsService, ItemRepository],
})
export class ItemsModule {}
