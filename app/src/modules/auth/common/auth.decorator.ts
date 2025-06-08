import { SetMetadata } from '@nestjs/common';



// 设置一些标识符 用于修饰方法
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// 设置一些标识符 用于修饰方法
export const IS_PRIVATE_KEY = 'isPrivate';
export const Private = () => SetMetadata(IS_PUBLIC_KEY, false);


