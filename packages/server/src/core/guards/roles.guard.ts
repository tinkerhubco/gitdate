import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { RolesArg, RoleResolver, RoleResolverConstructor } from '../types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public canActivate(context: ExecutionContext) {
    const reflectorHandler = context.getHandler();
    const httpRequest = context.getArgByIndex(0);
    const roles = this.reflector.get<RolesArg>('roles', reflectorHandler);

    if (!roles) {
      // If no @Roles provided, let's not allow it by default.
      // Use the EveryoneRole so they will be cautious
      return false;
    }

    const user = httpRequest.accessToken && httpRequest.accessToken.user;
    const userRoles = (user && user.roles) || [];

    // AccessTokenStrategy
    // RoleResolverStrategy
    const basicStrategyAuthResult = this.basicStrategy(userRoles, roles);

    if (!basicStrategyAuthResult) {
      const roleResolverAuthResult = this.roleResolverStrategy(
        roles,
        user,
        httpRequest
      );
      return roleResolverAuthResult;
    }
    return true;
  }

  private basicStrategy(userRoles: any[], roles: any[]): boolean {
    return userRoles.some(userRole =>
      roles.find(role => role.name === userRole.name)
    );
  }

  private async roleResolverStrategy(
    roles: RolesArg,
    user: any,
    request: Request
  ) {
    const roleResolvers = roles.filter(
      role => typeof role !== 'string'
    ) as Array<RoleResolverConstructor>;

    const roleResolversResult = await Promise.all(
      roleResolvers
        .map(roleResolver => new roleResolver())
        .map(roleResolver => roleResolver.canActivate(user, request))
    );
    return roleResolversResult.some(Boolean);
  }
}
