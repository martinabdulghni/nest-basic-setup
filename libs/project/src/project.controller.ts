import { JwtAuthGuard } from '@app/common';
import { RolesAuthGuard } from '@app/common/auth/roles-auth.guard';
import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'apps/auth/src/current-user.decorator';
import { Roles } from 'apps/auth/src/roles.decorator';
import { User } from 'apps/auth/src/users/schemas/user.schema';
import { OrderItemArray } from 'apps/orders/src/dto/create-order.request';
import { UserRole } from 'libs/types/user-status';
import { ProjectObject } from './dto/create-project.request';
import { ProjectService } from './project.service';
import { Request } from 'express';



@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesAuthGuard)
  @Roles(UserRole.Super, UserRole.SuperAdmin, UserRole.Admin)
  @Post()
  async createProject(@Body() body: ProjectObject, @Req() req: Request, @CurrentUser() user: User) {
    return await this.projectService.createProject(body, user, req);
  }

  // @Get('all')
  // @UseGuards(JwtAuthGuard)
  // @UseGuards(RolesAuthGuard)
  // @Roles(UserRole.Super, UserRole.SuperAdmin, UserRole.Admin)
  // async getOrders() {
  //   return await this.projectService.getOrders();
  // }
  // @Get(':id')
  // @UseGuards(JwtAuthGuard)
  // @UseGuards(RolesAuthGuard)
  // @Roles(UserRole.Super, UserRole.SuperAdmin, UserRole.Admin)
  // async getOrder(@Param('id') id: string) {
  //   return await this.projectService.getOrder(id);
  // }

  // @Put(':id')
  // @UseGuards(JwtAuthGuard)
  // @UseGuards(RolesAuthGuard)
  // @Roles(UserRole.Super, UserRole.SuperAdmin, UserRole.Admin)
  // async modifyOrder(@Param('id') id: string, @Body() request: OrderItemArray) {
  //   return await this.projectService.modifyOrder(id, request);
  // }

  // @Delete('order/:id')
  // @UseGuards(JwtAuthGuard)
  // @UseGuards(RolesAuthGuard)
  // @Roles(UserRole.Super, UserRole.SuperAdmin)
  // async deleteOrder(@Param('id') id: string) {
  //   return await this.projectService.deleteOrder(id);
  // }
}
