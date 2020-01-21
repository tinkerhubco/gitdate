import { SetMetadata } from '@nestjs/common';

import { RolesArg } from '../types';

export const Roles = (...roles: RolesArg) => SetMetadata('roles', roles);
