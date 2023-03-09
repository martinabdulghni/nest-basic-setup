import { Injectable } from '@nestjs/common';
import { MailMessage, Mailman } from '@squareboat/nest-mailman';
import { User } from 'apps/auth/src/users/schemas/user.schema';
import { CreateOrderObject } from 'apps/orders/src/dto/create-order.request';
import { Order } from 'apps/orders/src/schemas/order.schema';

@Injectable()
export class MailService {
  async sendMail(user: User, order: Order) {
    let orderDate: Date = new Date(order.date);
    const _DATE = orderDate.toDateString();
    const mail = MailMessage.init()

      .greeting(`Hello, ${user.name}!`)
      .line('')
      .line(`New Order #${order._id} has been registered`)
      .table(order.items)
      .line(`Date: ${_DATE}`)
      .line('')
      .action('Check invoice', 'https://lory.io')
      .line('')
      .subject(`ORDER REGISTERD; #${order._id}`);
    return (
      Mailman.init()
        //todo: add orders10@lory.io
        .to(user.email) // OR .to(['id1@email.com', 'id2@email.com'])
        .send(mail)
    );
  }
}
