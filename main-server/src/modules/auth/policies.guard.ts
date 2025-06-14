import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppAbility, CaslAbilityFactory } from './casl/casl-ability.factory';
import { PolicyHandler } from './interface/IPolicyHandler.interface';
import { CHECK_POLICIES_KEY } from './common/auth.decorator';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(CHECK_POLICIES_KEY, context.getHandler()) || [];

    const request = context.switchToHttp().getRequest();

    // console.log(request.user);

    const ability = this.caslAbilityFactory.createForUser(request.user) as AppAbility;

    const hasPermission = policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability, request)
    );

    if (!hasPermission) {
      throw new ForbiddenException('You do not have permission to perform this action');
    }
    return true;
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility, request: any) {
    if (typeof handler === 'function') {
      return handler(ability, request);
    }
    return handler.handle(ability, request);
  }
}
