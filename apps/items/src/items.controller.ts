import { JwtAuthGuard, RmqService } from '@app/common';
import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'apps/auth/src/current-user.decorator';
import { User } from 'apps/auth/src/users/schemas/user.schema';
import { CreateItemRequest } from './dto/create-item.request';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  protected readonly logger = new Logger(ItemsController.name);

  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createItem(
    @Body() request: CreateItemRequest,
    @Req() req: any,
    @CurrentUser() user: User,
  ) {
    return await this.itemsService.createItem(
      request,
      req.cookies?.Authentication,
      user,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getItems(@CurrentUser() user: User) {
    return this.itemsService.getItems(user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async modifyItem(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() request: CreateItemRequest,
  ) {
    return this.itemsService.modifyItem(id, user, request);
  }
}
