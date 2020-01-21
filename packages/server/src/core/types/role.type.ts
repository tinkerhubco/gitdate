import { Request } from 'express';

import { Role } from '../enums';

// TODO: Typing
export interface RoleResolver {
  canActivate: (user: any, request: Request) => Promise<boolean> | boolean;
}

export type RoleResolverConstructor = new (...args: any[]) => RoleResolver;
export type RolesArg = Array<RoleResolver | RoleResolverConstructor | Role>;
