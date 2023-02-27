import { RolesAuthGuard } from '@app/common/auth/roles-auth.guard';
import { Body, Controller, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'apps/auth/src/roles.decorator';
import { CreateUserRequest } from 'apps/auth/src/users/dto/create-user.request';
import { UserRole } from 'libs/types/roles';
import { ProfileService } from './profile.service';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Put(':id')
  @UseGuards(RolesAuthGuard)
  @Roles(UserRole.Super, UserRole.Admin)
  async modifyUser(@Param('id') id: string, @Body() body: CreateUserRequest, @Req() request: Request) {
    return await this.profileService.modifyMyAccount(id, body, request);
  }
}
