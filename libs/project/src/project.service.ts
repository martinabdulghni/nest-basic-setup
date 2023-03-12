import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from 'apps/auth/src/users/schemas/user.schema';
import { MAIL_SERVICE } from 'apps/orders/src/constans/services';
import { Order } from 'apps/orders/src/schemas/order.schema';
import { lastValueFrom } from 'rxjs';
import { CreateProjectObject, ProjectObject } from './dto/create-project.request';
import { Request } from 'express';
import { ClientSession } from 'mongoose';
import { ProjectRepository } from './project.repository';
import { Project } from './schemas/project.schema';
import { ProjectType } from 'libs/types/project';

@Injectable()
export class ProjectService {
  constructor(@Inject(MAIL_SERVICE) private mailClient: ClientProxy, private readonly projectRepository: ProjectRepository) {}

  async createProject(body: ProjectObject, user: User, req: Request) {
    const token = req.cookies.Authentication;
    const session: ClientSession = await this.projectRepository.startTransaction();
    const project: CreateProjectObject = this.createProjectObject(body, user);

    try {
      const newProject: Project = await this.projectRepository.create(project, {
        session,
        timestamps: true,
      });

      try {
        //* MAIL SERVICE:
        await this.callMailService(token, newProject);
        //* JOB SERVICE:
        //await this.callJobService(token, newOrder);
      } catch (error) {
        throw new NotFoundException('project not found.');
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  }

  private createProjectObject(body: ProjectObject, user: User): CreateProjectObject {
    return {
      name: body.name,
      address: body.address,
      address2: body.address2,
      city: body.city,
      createdBy: user._id.toString(),
      date: new Date(),
      email: body.email,
      momsRegNum: body.momsRegNum,
      phoneNum: body.phoneNum,
      postNum: body.postNum,
      type: ProjectType.new,
    };
  }

  private async callMailService(authentication: string, project: Project) {
    return await lastValueFrom(
      this.mailClient.emit('create_mail_new_porject', {
        Authentication: authentication,
        project: project,
      }),
    );
  }
}
