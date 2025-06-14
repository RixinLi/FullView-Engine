import { PASSWORD_SALT } from 'src/modules/auth/common/auth.constants';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

// 登录注册使用的加密函数：
export const hashSaltPassword = function (password: string, salt: string = PASSWORD_SALT): string {
  return crypto
    .createHash('md5')
    .update(password + salt)
    .digest('hex');
};

// uuid 生成器
export const generateUUID = function (): string {
  return uuidv4().replace(/-/g, '');
};
