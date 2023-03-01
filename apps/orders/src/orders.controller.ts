import { JwtAuthGuard } from '@app/common';
import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'apps/auth/src/current-user.decorator';
import { User } from 'apps/auth/src/users/schemas/user.schema';
import { CreateOrderRequest } from './dto/create-order.request';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(@Body() request: CreateOrderRequest, @Req() req: any, @CurrentUser() user: User) {
    return this.ordersService.createOrder(request, req.cookies?.Authentication, user);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getOrders(@CurrentUser() user: User) {
    return user;
    //return this.ordersService.getOrders(user);
  }
  // @Get('order/:id')
  // @UseGuards(JwtAuthGuard)
  // async getOrder(@Param('id') id: string, @CurrentUser() user: User) {
  //   return this.ordersService.getOrder(id, user);
  // }

  // @Put('order/:id')
  // @UseGuards(JwtAuthGuard)
  // async modifyOrder(@Param('id') id: string, @CurrentUser() user: User, @Body() request: CreateOrderRequest) {
  //   return this.ordersService.modifyOrder(id, user, request);
  // }

  // @Get()
  // @UseGuards(JwtAuthGuard)
  // async getUserOrders(@CurrentUser() user: User) {
  //   return this.ordersService.getUserOrders(user);
  // }
}
