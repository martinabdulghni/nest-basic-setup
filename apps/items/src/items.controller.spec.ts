import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

describe('ItemsController', () => {
  let itemsController: ItemsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [ItemsService],
    }).compile();

    itemsController = app.get<ItemsController>(ItemsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(itemsController.getHello()).toBe('Hello World!');
    });
  });
});
