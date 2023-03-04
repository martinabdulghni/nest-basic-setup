import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateJobRequest } from './dto/create-job.request';
import { JobService } from './job.service';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  getCrons() {
    return this.jobService.getCrons();
  }
  @Post()
  createCrone(@Body() body: CreateJobRequest) {
    return this.jobService.addCronJob(body.name, body.seconds);
  }
  @Post(':name')
  deleteCron(@Param('name') name: string) {
    return this.jobService.deleteCron(name);
  }
}
