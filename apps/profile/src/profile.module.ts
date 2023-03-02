import { AuthModule, DatabaseModule, RmqModule } from '@app/common';
import { RolesAuthGuard } from '@app/common/auth/roles-auth.guard';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'apps/auth/src/users/schemas/user.schema';
import { UsersRepository } from 'apps/auth/src/users/users.repository';
import { OrdersRepository } from 'apps/orders/src/orders.repository';
import { Order, orderSchema } from 'apps/orders/src/schemas/order.schema';
import * as Joi from 'joi';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        RABBIT_MQ_PROFILE_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/profile/.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Order.name, schema: orderSchema }]),
    AuthModule,
    RmqModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService, UsersRepository, RolesAuthGuard, OrdersRepository],
  exports: [ProfileService],
})
export class ProfileModule {}
