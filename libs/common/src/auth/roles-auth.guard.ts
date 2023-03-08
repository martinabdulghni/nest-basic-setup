import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import jwtDecode from 'jwt-decode';
import { UserRole, UserRoleType } from 'libs/types/user-status';

@Injectable()
export class RolesAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    let request: string;
    if (context.getType() === 'http') {
      request = await context.switchToHttp().getRequest().cookies['Authentication'];
    }
    if (context.getType() === 'rpc') {
      request = context.switchToRpc().getData()['Authentication'];
    }

    try {
      const userRole: Partial<UserRoleType> = await jwtDecode(request)['userRole'];
      let canAccess: boolean = false;
      for (const role of roles) {
        if (userRole[role]) {
          canAccess = true;
        }
      }
      return canAccess;
    } catch (error) {
      throw new UnauthorizedException('No Token Was Provided')
    }
  }
}
