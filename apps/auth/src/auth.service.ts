import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserStatus } from 'libs/types/status';
import { User } from './users/schemas/user.schema';
import { UsersRepository } from './users/users.repository';

export interface TokenPayload {
  userId: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository, private readonly configService: ConfigService, private readonly jwtService: JwtService) {}

  async login(user: User, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString(),
    };

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + this.configService.get('JWT_EXPIRATION'));

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });

    response.cookie('USER_EMAIL', user.email, {
      httpOnly: true,
      expires,
    });

    await this.userStatus(user.email, UserStatus.Online);
  }

  async userStatus(user: string, status: UserStatus) {
    try {
      await this.usersRepository.findOneAndUpdate(
        {
          email: user,
        },
        {
          $set: {
            status: status,
            lastLoggedIn: new Date(),
          },
        },
      );
    } catch (err) {}
  }

  async logout(email: string, response: Response) {
    this.userStatus(email, UserStatus.Offline);
    response.clearCookie('Authentication');
    response.clearCookie('USER_EMAIL');
    return email;
  }

  isLoggedIn(email: string): boolean {
    if (email) {
      return true;
    }
    throw new ForbiddenException();
  }
}
