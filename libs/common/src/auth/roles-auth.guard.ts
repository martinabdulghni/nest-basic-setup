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
    try {
      let request: string;
      if (context.getType() === 'http') {
        request = await context.switchToHttp().getRequest().cookies['Authentication'];
      }
      if (context.getType() === 'rpc') {
        request = await context.switchToRpc().getData().cookies['Authentication'];
      }
      const userRole: Partial<UserRoleType> = await jwtDecode(request)['userRole'];

      let canAccess: boolean = false;
      for (const role of roles) {
        if (userRole[role]) {
          canAccess = true;
        }
      }
      return canAccess ? true : false;
    } catch (error) {
      throw new UnauthorizedException('Token unvaild');
    }
  }
}
