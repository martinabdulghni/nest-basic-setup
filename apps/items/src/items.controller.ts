import { JwtAuthGuard, RmqService } from '@app/common';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateItemRequest } from './dto/create-item.request';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  constructor(
    private readonly itemsService: ItemsService,
    private readonly rmqService: RmqService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(@Body() request: CreateItemRequest, @Req() req: any) {
    return this.itemsService.createItem(request, req.cookies?.Authentication);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getOrders() {
    return this.itemsService.getItems();
  }
}
