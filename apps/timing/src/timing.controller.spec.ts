import { Test, TestingModule } from '@nestjs/testing';
import { TimingController } from './timing.controller';
import { TimingService } from './timing.service';

describe('TimingController', () => {
  let timingController: TimingController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TimingController],
      providers: [TimingService],
    }).compile();

    timingController = app.get<TimingController>(TimingController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(timingController.getHello()).toBe('Hello World!');
    });
  });
});
