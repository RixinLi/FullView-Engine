import { SetMetadata } from '@nestjs/common';
import { PolicyHandler } from '../interface/IPolicyHandler.interface';
import { Role } from './auth.constants';

// 设置一些标识符 用于修饰方法
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// 设置ROLE权限
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const CHECK_POLICIES_KEY = 'check_policy';
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
