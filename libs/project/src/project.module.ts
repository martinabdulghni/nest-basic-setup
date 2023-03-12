import { DatabaseModule, RmqModule, AuthModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MAIL_SERVICE } from 'apps/orders/src/constans/services';
import * as Joi from 'joi';
import { ProjectController } from './project.controller';
import { ProjectRepository } from './project.repository';
import { ProjectService } from './project.service';
import { Project, projectSchema } from './schemas/project.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: './apps/project/.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Project.name, schema: projectSchema }]),

    RmqModule.register({ name: MAIL_SERVICE }),
    AuthModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository],
})
export class ProjectModule {}
