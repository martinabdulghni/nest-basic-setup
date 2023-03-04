import { Controller, Get } from '@nestjs/common';
import { DeleteService } from './delete.service';

@Controller()
export class DeleteController {
  constructor(private readonly deleteService: DeleteService) {}

  @Get()
  getHello(): string {
    return this.deleteService.getHello();
  }
}
