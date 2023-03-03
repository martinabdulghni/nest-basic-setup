import { JwtAuthGuard, RmqService } from '@app/common';
import { RolesAuthGuard } from '@app/common/auth/roles-auth.guard';
import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'apps/auth/src/current-user.decorator';
import { Roles } from 'apps/auth/src/roles.decorator';
import { User } from 'apps/auth/src/users/schemas/user.schema';
import { UserRole } from 'libs/types/user-status';
import { CreateItemRequest } from './dto/create-item.request';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  protected readonly logger = new Logger(ItemsController.name);

  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesAuthGuard)
  @Roles(UserRole.Super, UserRole.SuperAdmin, UserRole.Admin)
  async createItem(@Body() request: CreateItemRequest, @Req() req: any, @CurrentUser() user: User) {
    return await this.itemsService.createItem(request, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesAuthGuard)
  @Roles(UserRole.Super, UserRole.SuperAdmin, UserRole.Admin)
  async getItems() {
    return await this.itemsService.getItems();
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesAuthGuard)
  @Roles(UserRole.Super, UserRole.SuperAdmin, UserRole.Admin)
  async modifyItem(@Param('id') id: string, @Body() request: CreateItemRequest) {
    return await this.itemsService.modifyItem(id, request);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesAuthGuard)
  @Roles(UserRole.Super, UserRole.SuperAdmin)
  async deleteItem(@Param('id') id: string) {
    return await this.itemsService.deletItem(id);
  }
}
