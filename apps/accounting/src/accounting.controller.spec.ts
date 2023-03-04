import { Test, TestingModule } from '@nestjs/testing';
import { AccountingController } from './accounting.controller';
import { AccountingService } from './accounting.service';

describe('AccountingController', () => {
  let accountingController: AccountingController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AccountingController],
      providers: [AccountingService],
    }).compile();

    accountingController = app.get<AccountingController>(AccountingController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(accountingController.getHello()).toBe('Hello World!');
    });
  });
});
