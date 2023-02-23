import { Controller, ForbiddenException, Post, Req, Res, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import JwtAuthGuard from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from './users/schemas/user.schema';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() user: User, @Res({ passthrough: true }) response: Response) {
    await this.authService.login(user, response);
    response.send(user);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response, @Req() request: Request) {
    const USER_EMAIL = request.cookies['USER_EMAIL'];
    if (this.authService.isLoggedIn(USER_EMAIL)) {
      return await this.authService.logout(USER_EMAIL, response);
    }
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('validate_user')
  async validateUser(@CurrentUser() user: User) {
    return user;
  }
}
