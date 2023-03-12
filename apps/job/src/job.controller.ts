import { JwtAuthGuard, RmqService } from '@app/common';
import { RolesAuthGuard } from '@app/common/auth/roles-auth.guard';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { CurrentUser } from 'apps/auth/src/current-user.decorator';
import { Roles } from 'apps/auth/src/roles.decorator';
import { User } from 'apps/auth/src/users/schemas/user.schema';
import { Order } from 'apps/orders/src/schemas/order.schema';
import { UserRole } from 'libs/types/user-status';
import { CreateJobRequest } from './dto/create-job.request';
import { JobService } from './job.service';

@Controller()
export class JobController {
  constructor(private readonly jobService: JobService, private readonly rmqService: RmqService) {}

  @EventPattern('create_job_queue')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesAuthGuard)
  @Roles(UserRole.SuperAdmin, UserRole.Super, UserRole.Admin)
  async createJob(@CurrentUser() user: User, @Payload('order') order: Order, @Ctx() context: RmqContext) {
    await this.jobService.createJobQueue(user, order);
    //todo: assign to?, project?, estimatedTime?,
    //return this.rmqService.ack(context);
  }

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
