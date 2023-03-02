import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import JwtAuthGuard from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from './users/schemas/user.schema';
import { Request } from 'express';
import { RolesAuthGuard } from '@app/common/auth/roles-auth.guard';
import { UserRole } from 'libs/types/roles';
import { Roles } from './roles.decorator';
import { AllowancesAuth } from '@app/common/auth/allowances-auth.guard';
import { Allowances } from './allowance.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @UseGuards(AllowancesAuth)
  @Allowances({
    isAuthenticated: false,
  })
  async login(@CurrentUser() user: User, @Res({ passthrough: true }) response: Response) {
    return await this.authService.login(user, response);
  }

  @UseGuards(RolesAuthGuard)
  @Roles(UserRole.User)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response, @Req() request: Request) {
    return await this.authService.logout(request, response);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('validate_user')
  async validateUser(@CurrentUser() user: User) {
    return user;
  }
}
