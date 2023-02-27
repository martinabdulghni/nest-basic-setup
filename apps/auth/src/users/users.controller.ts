import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../current-user.decorator';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { CreateUserRequest, ModifyUserRequest } from './dto/create-user.request';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';
import { Roles } from '../roles.decorator';
import { UserRole } from 'libs/types/roles';
import { RolesAuthGuard } from '@app/common/auth/roles-auth.guard';
@Controller('auth/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() request: CreateUserRequest) {
    return this.usersService.createUser(request);
  }

  @Delete(':id')
  @UseGuards(RolesAuthGuard)
  @Roles(UserRole.Super, UserRole.SuperAdmin)
  async deleteUser(@Param('id') id: string) {
    // TODO: Post to new database before deleting
    this.usersService.deleteUser(id);
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
