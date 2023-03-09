import { JwtAuthGuard, RmqService } from '@app/common';
import { RolesAuthGuard } from '@app/common/auth/roles-auth.guard';
import { Controller, UseGuards } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { CurrentUser } from 'apps/auth/src/current-user.decorator';
import { Roles } from 'apps/auth/src/roles.decorator';
import { User } from 'apps/auth/src/users/schemas/user.schema';
import { CreateOrderObject } from 'apps/orders/src/dto/create-order.request';
import { Order } from 'apps/orders/src/schemas/order.schema';
import { UserRole } from 'libs/types/user-status';
import { MailService } from './mail.service';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService, private readonly rmqService: RmqService) {}

  @EventPattern('send_mail')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesAuthGuard)
  @Roles(UserRole.User)
  async sendMail(@CurrentUser() user: User, @Payload('order') order: Order, @Ctx() context: RmqContext) {
    await this.mailService.sendMail(user, order);
    return this.rmqService.ack(context);
  }
}
