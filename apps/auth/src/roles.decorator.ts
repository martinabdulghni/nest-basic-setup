import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'libs/types/user-status';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
