import { DatabaseModule, RmqModule, AuthModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsModule } from 'apps/items/src/items.module';
import { ItemRepository } from 'apps/items/src/items.repository';
import { ItemsService } from 'apps/items/src/items.service';
import { Items, itemsSchema } from 'apps/items/src/schemas/items.schema';
import * as Joi from 'joi';
import { BILLING_SERVICE, ITEMS_SERVICE, MAIL_SERVICE } from './constans/services';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';
import { Order, orderSchema } from './schemas/order.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: './apps/orders/.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Order.name, schema: orderSchema }]),
    MongooseModule.forFeature([{ name: Items.name, schema: itemsSchema }]),

    RmqModule.register({ name: BILLING_SERVICE }),
    RmqModule.register({ name: MAIL_SERVICE }),
    RmqModule.register({ name: ITEMS_SERVICE }),
    AuthModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository, ItemRepository],
})
export class OrdersModule {}
