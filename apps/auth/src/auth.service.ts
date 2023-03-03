import { ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { UserConnectionStatus, UserRoleType } from 'libs/types/user-status';
import { User } from './users/schemas/user.schema';
import { UsersRepository } from './users/users.repository';

export interface TokenPayload {
  userId: string;
  userRole: UserRoleType;
}

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository, private readonly configService: ConfigService, private readonly jwtService: JwtService) {}

  async login(user: User, response: Response) {
    let userRoles = this.getUserRoles(user);
    const tokenPayload: TokenPayload = {
      userId: user._id.toString(),
      userRole: userRoles,
    };

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + this.configService.get('JWT_EXPIRATION'));

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });

    try {
      await this.usersRepository.findOneAndUpdate(
        {
          _id: user._id,
        },
        {
          $set: {
            userConnectionStatus: UserConnectionStatus.Online,
            lastLoggedIn: new Date(),
          },
        },
      );
    } catch (err) {}

    return { status: HttpStatus.OK, userId: user._id };
  }

  async logout(request: Request, response: Response) {
    try {
      await this.usersRepository.findOneAndUpdate(
        {
          _id: request.cookies['userId'],
        },
        {
          $set: {
            userConnectionStatus: UserConnectionStatus.Offline,
            lastLoggedIn: new Date(),
          },
        },
      );
    } catch (err) {}
    response.clearCookie('Authentication');
    return { status: HttpStatus.OK, userStatus: 'Logged out!' };
  }

  getUserRoles(user: User): Object {
    let userRoles: Object = {};
    let userRolesArray: Array<Object> = Object.keys(user.userRole)
      .filter((key) => user.userRole[key] === true)
      .map((roles) => {
        let userRoles = {};
        userRoles[roles] = true;
        return userRoles;
      });

    for (let i = 0; i < userRolesArray.length; i++) {
      Object.assign(userRoles, userRolesArray[i]);
    }
    return userRoles;
  }
}
