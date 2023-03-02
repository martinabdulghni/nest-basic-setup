import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AllowanceType } from 'libs/types/allowance';

@Injectable()
export class AllowancesAuth implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ACTION_NAME: string = context.getHandler().name;
    const ACCESS_KEYS: AllowanceType = this.reflector.get<AllowanceType>('allowances', context.getHandler())[0];

    //! LOGIN ACTION
    if (ACTION_NAME === 'login') {
      // Should not be authenticated.
      if (!ACCESS_KEYS.isAuthenticated) {
        let request: string;
        if (context.getType() === 'http') {
          request = await context.switchToHttp().getRequest().cookies['Authentication'];
        }
        if (context.getType() === 'rpc') {
          request = await context.switchToRpc().getData().cookies['Authentication'];
        }
        if(request !==undefined) {
          throw new ForbiddenException('Already signed in!')
        }
        return true;
      }
    }
  }
}
