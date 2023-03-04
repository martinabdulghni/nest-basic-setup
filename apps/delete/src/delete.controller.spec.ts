import { Test, TestingModule } from '@nestjs/testing';
import { DeleteController } from './delete.controller';
import { DeleteService } from './delete.service';

describe('DeleteController', () => {
  let deleteController: DeleteController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DeleteController],
      providers: [DeleteService],
    }).compile();

    deleteController = app.get<DeleteController>(DeleteController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(deleteController.getHello()).toBe('Hello World!');
    });
  });
});
