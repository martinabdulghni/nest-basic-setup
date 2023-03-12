import { DatabaseModule, AuthModule, RmqModule, RmqService } from '@app/common';
import { RolesAuthGuard } from '@app/common/auth/roles-auth.guard';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailmanModule } from '@squareboat/nest-mailman';
import { User, UserSchema } from 'apps/auth/src/users/schemas/user.schema';
import { UsersRepository } from 'apps/auth/src/users/users.repository';
import * as Joi from 'joi';
import filesystem, { mailSchema } from '../filesystem';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [filesystem],
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        RABBIT_MQ_MAIL_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/mail/.env',
    }),
    MailmanModule.register(mailSchema),
    MailmanModule.registerAsync({
      imports: [ConfigService],
      useFactory: (config: ConfigService) => {
        return config.get('mailman');
      },
      inject: [ConfigService],
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
    RmqModule,
  ],

  controllers: [MailController],
  providers: [MailService, UsersRepository, RolesAuthGuard],
})
export class MailModule {}
