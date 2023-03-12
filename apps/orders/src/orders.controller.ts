import { JwtAuthGuard } from '@app/common';
import { RolesAuthGuard } from '@app/common/auth/roles-auth.guard';
import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'apps/auth/src/current-user.decorator';
import { Roles } from 'apps/auth/src/roles.decorator';
import { User } from 'apps/auth/src/users/schemas/user.schema';
import { Request } from 'express';
import { UserRole } from 'libs/types/user-status';
import { OrderItemArray } from './dto/create-order.request';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesAuthGuard)
  @Roles(UserRole.Super, UserRole.SuperAdmin, UserRole.Admin)
  @Post()
  async createOrder(@Body() body: OrderItemArray, @Req() req: Request, @CurrentUser() user: User) {
    return await this.ordersService.createOrder(body, user, req);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesAuthGuard)
  @Roles(UserRole.Super, UserRole.SuperAdmin, UserRole.Admin)
  async getOrders() {
    return await this.ordersService.getOrders();
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesAuthGuard)
  @Roles(UserRole.Super, UserRole.SuperAdmin, UserRole.Admin)
  async getOrder(@Param('id') id: string) {
    return await this.ordersService.getOrder(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesAuthGuard)
  @Roles(UserRole.Super, UserRole.SuperAdmin, UserRole.Admin)
  async modifyOrder(@Param('id') id: string, @Body() request: OrderItemArray) {
    return await this.ordersService.modifyOrder(id, request);
  }

  @Delete('order/:id')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesAuthGuard)
  @Roles(UserRole.Super, UserRole.SuperAdmin)
  async deleteOrder(@Param('id') id: string) {
    return await this.ordersService.deleteOrder(id);
  }
}
