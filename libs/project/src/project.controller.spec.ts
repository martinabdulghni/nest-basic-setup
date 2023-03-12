import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

describe('ProjectController', () => {
  let projectController: ProjectController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [ProjectService],
    }).compile();

    projectController = app.get<ProjectController>(ProjectController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(projectController.getHello()).toBe('Hello World!');
    });
  });
});
