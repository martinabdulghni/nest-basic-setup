import { RolesAuthGuard } from '@app/common/auth/roles-auth.guard';
import { Body, Controller, Get, Param, Put, Req, Res, UseGuards } from '@nestjs/common';
import { Roles } from 'apps/auth/src/roles.decorator';
import { CreateUserRequest, ModifyProfileRequest, ModifyUserRequest } from 'apps/auth/src/users/dto/create-user.request';
import { Request } from 'express';
import { UserRole } from 'libs/types/roles';
import { ProfileService } from './profile.service';
import { Response } from 'express';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @UseGuards(RolesAuthGuard)
  @Roles(UserRole.User)
  async getUserData(@Req() request: Request) {
    return await this.profileService.getProfile(request);
  }

  /**
   * @api {Put} / Modify user profile
   * ...
   */
  @Put()
  @UseGuards(RolesAuthGuard)
  @Roles(UserRole.User)
  async modifyUser(@Res({ passthrough: true }) response: Response, @Req() request: Request, @Body() body: ModifyProfileRequest) {
    return await this.profileService.modifyProfile(response, request, body);
  }
}
