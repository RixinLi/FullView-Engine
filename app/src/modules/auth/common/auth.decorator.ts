import { SetMetadata } from '@nestjs/common';
import { Role } from './role.enum';



// 设置一些标识符 用于修饰方法
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);


// 设置ROLE权限
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);


