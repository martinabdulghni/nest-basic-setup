import { RolesAuthGuard } from '@app/common/auth/roles-auth.guard';
import { Body, Controller, Get, Param, Put, Req, Res, UseGuards } from '@nestjs/common';
import { Roles } from 'apps/auth/src/roles.decorator';
import { CreateUserRequest, ModifyProfileRequest, ModifyUserRequest } from 'apps/auth/src/users/dto/create-user.request';
import { Request } from 'express';
import { UserRole } from 'libs/types/roles';
import { ProfileService } from './profile.service';
import { Response } from 'express';
import { User, UserBasic } from 'apps/auth/src/users/schemas/user.schema';
import { JwtAuthGuard } from '@app/common';
import { CurrentUser } from 'apps/auth/src/current-user.decorator';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * Get User Profile by Authentication Token
   *
   * @async
   * @param {UserBasic} user
   * @returns {Promise<UserBasic>}
   * @api {Put}
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesAuthGuard)
  @Roles(UserRole.User)
  async getProfile(@CurrentUser() user: User): Promise<UserBasic> {
    return await this.profileService.getProfile(user);
  }

  /**
   * Modify User Profile depends on @param {UserBasic}.
   *
   * @async
   * @param {Response} response
   * @param {UserBasic} user
   * @param {ModifyProfileRequest} body
   * @returns {Promise<UserBasic>}
   */
  @Put()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesAuthGuard)
  @Roles(UserRole.User)
  async modifyUserByTokenLoad(@Res({ passthrough: true }) response: Response, @CurrentUser() user: User, @Body() body: ModifyProfileRequest): Promise<UserBasic> {
    return await this.profileService.modifyProfile(response, user, body);
  }
}
