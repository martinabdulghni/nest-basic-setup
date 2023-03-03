import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateUserRequest, ModifyUserRequest } from './dto/create-user.request';
import { UsersService } from './users.service';
import { Roles } from '../roles.decorator';

import { RolesAuthGuard } from '@app/common/auth/roles-auth.guard';
import { Allowances } from '../allowance.decorator';
import { AllowancesAuth } from '@app/common/auth/allowances-auth.guard';
import { UserRole } from 'libs/types/user-status';

@Controller('auth/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AllowancesAuth)
  @Allowances({
    isAuthenticated: false,
  })
  async createUser(@Body() request: CreateUserRequest) {
    return this.usersService.createUser(request);
  }

  @Delete(':id')
  @UseGuards(RolesAuthGuard)
  @Roles(UserRole.Super, UserRole.SuperAdmin)
  async deleteUser(@Param('id') id: string) {
    // TODO: Post to new database before deleting
    return this.usersService.deleteUser(id);
  }

  @Get(':id')
  @UseGuards(RolesAuthGuard)
  @Roles(UserRole.Super, UserRole.SuperAdmin)
  async getUser(@Param('id') id: string) {
    return await this.usersService.getUserById(id);
  }

  @Get()
  @UseGuards(RolesAuthGuard)
  @Roles(UserRole.Super, UserRole.SuperAdmin)
  async getUsers() {
    return await this.usersService.getUsers();
  }

  @Put(':id')
  @UseGuards(RolesAuthGuard)
  @Roles(UserRole.Super, UserRole.SuperAdmin)
  async modifyMyAccount(@Param('id') id: string, @Body() body: ModifyUserRequest) {
    return await this.usersService.modifyUser(id, body);
  }
}
