import { JwtAuthGuard } from '@app/common';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateOrderRequest } from './dto/create-order.request';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(@Body() request: CreateOrderRequest, @Req() req: any) {
    return this.ordersService.createOrder(request, req.cookies?.Authentication);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getOrders() {
    return this.ordersService.getOrders();
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOrder(@Param('id') id: string) {
    return this.ordersService.getOrder(id);
  }
}
