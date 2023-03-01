import { RolesAuthGuard } from '@app/common/auth/roles-auth.guard';
import { Body, Controller, Get, Param, Put, Req, Res, UseGuards } from '@nestjs/common';
import { Roles } from 'apps/auth/src/roles.decorator';
import { CreateUserRequest, ModifyProfileRequest, ModifyUserRequest } from 'apps/auth/src/users/dto/create-user.request';
import { Request } from 'express';
import { UserRole } from 'libs/types/roles';
import { ProfileService } from './profile.service';
import { Response } from 'express';
import { UserBasic } from 'apps/auth/src/users/schemas/user.schema';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * Get Profile By Token Payload
   *
   * @async
   * @api {Get}
   * @param {Request} request
   * @returns {Promise<UserBasic>}
   */
  @Get()
  @UseGuards(RolesAuthGuard)
  @Roles(UserRole.User)
  async getProfileByTokenPayLoad(@Req() request: Request): Promise<UserBasic> {
    return await this.profileService.getProfile(request);
  }

  /**
   * Modify User By Token Payload
   *
   * @async
   * @param {Response} response
   * @param {Request} request
   * @param {ModifyProfileRequest} body
   * @returns {Promise<UserBasic>}
   * @api {Put}
   */
  @Put()
  @UseGuards(RolesAuthGuard)
  @Roles(UserRole.User)
  async modifyUserByTokenLoad(@Res({ passthrough: true }) response: Response, @Req() request: Request, @Body() body: ModifyProfileRequest): Promise<UserBasic> {
    return await this.profileService.modifyProfile(response, request, body);
  }
}
