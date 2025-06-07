import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import * as crypto from 'crypto';
import { PASSWORD_SALT } from "src/common/constants";

@Injectable()
export class AuthService{

    constructor(private readonly userService: UserService) {}

    // 登录注册使用的加密函数：
    private hashSaltPassword(password: string, salt: string = PASSWORD_SALT): string {
        return crypto.createHash('md5').update(password+salt).digest('hex');
    }

    // 登录
    async signIn(username:string, password:string):Promise<any|null>{
        const dbUser = await this.userService.findbyUsername(username);
        if(dbUser?.password != this.hashSaltPassword(password)){
            throw new UnauthorizedException();
        }
    }
}