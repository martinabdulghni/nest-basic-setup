import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Project } from './schemas/project.schema';

@Injectable()
export class ProjectRepository extends AbstractRepository<Project> {
  protected readonly logger = new Logger(ProjectRepository.name);

  constructor(@InjectModel(Project.name) orderModel: Model<Project>, @InjectConnection() connection: Connection) {
    super(orderModel, connection);
  }
}
