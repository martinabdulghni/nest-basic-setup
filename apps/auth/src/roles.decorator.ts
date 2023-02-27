import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'libs/types/roles';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
