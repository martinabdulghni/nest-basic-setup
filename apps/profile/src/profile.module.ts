import { AuthModule, DatabaseModule, RmqModule } from '@app/common';
import { RolesAuthGuard } from '@app/common/auth/roles-auth.guard';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'apps/auth/src/users/schemas/user.schema';
import { UsersRepository } from 'apps/auth/src/users/users.repository';
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
    AuthModule,
    RmqModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService, UsersRepository, RolesAuthGuard],
  exports: [ProfileService],
})
export class ProfileModule {}
