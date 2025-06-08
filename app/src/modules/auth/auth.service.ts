import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { PASSWORD_SALT } from "./common/constants";
import { Result } from "src/common/result";
import { USER_ROLE_ENUM } from "src/common/enum/userEnum";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService{

    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    // 登录注册使用的加密函数：
    private hashSaltPassword(password: string, salt: string = PASSWORD_SALT): string {
        return crypto.createHash('md5').update(password+salt).digest('hex');
    }

    // uuid 生成器
    private generateUUID(): string{
        return uuidv4().replace(/-/g,'');
    }

    // 登录
    async signIn(username:string, password:string):Promise<{ access_token: string }>{
        const dbUser = await this.userService.findbyUsername(username);
        if(dbUser?.password != this.hashSaltPassword(password)){
            throw new UnauthorizedException();
        }

        // 验证正确后 准备返回JWT token
        const payload = {id: dbUser.id, username: dbUser.username};
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }


    // 注册
    async register(username:string, password:string, uuid?: string):Promise<any|null>{
        const dbUser = await this.userService.findbyUsername(username);
        if(dbUser){
            throw new HttpException(Result.error('用户已存在', HttpStatus.CONFLICT.toString()), HttpStatus.CONFLICT);
        }

        const user:CreateUserDto = {
            id: uuid || this.generateUUID(),
            username: username,
            password: this.hashSaltPassword(password),
            name: username,
            role: USER_ROLE_ENUM.USER
        }

        const newUser = await this.userService.createOneUser(user);
        return newUser;
    }

}