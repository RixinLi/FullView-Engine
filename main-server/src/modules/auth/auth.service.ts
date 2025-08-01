import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Result } from 'src/common/result';
import { USER_ROLE_ENUM, USER_STATUS_ENUM } from 'src/common/enum/userEnum';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { generateUUID, hashSaltPassword } from 'src/utils/userInfo.utils';
import { ResponseUserDto } from '../user/dto/response-user.dto';
import { plainToClass } from 'class-transformer';
import { RegisterInfo } from './dto/register-info.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  // 登录
  async signIn(username: string, password: string): Promise<Object> {
    const dbUser = await this.userService.findbyUsername(username);
    if (dbUser?.password != hashSaltPassword(password)) {
      throw new UnauthorizedException({
        message: '密码错误，注意密码是加盐的',
      });
    }

    // 验证正确后 准备返回JWT token
    const payload = {
      id: dbUser.id,
      username: dbUser.username,
      role: dbUser.role,
    };
    return {
      // user做好隔离
      user: plainToClass(ResponseUserDto, dbUser, { excludeExtraneousValues: true }),
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  // 注册
  async register(body: RegisterInfo): Promise<any | null> {
    const dbUser = await this.userService.findbyUsername(body.username);
    if (dbUser) {
      throw new HttpException(
        Result.error('用户已存在', HttpStatus.CONFLICT.toString()),
        HttpStatus.CONFLICT
      );
    }

    const user: CreateUserDto = {
      id: body.uuid || generateUUID(),
      username: body.username,
      password: hashSaltPassword(body.password),
      name: body.name,
      title: body.title,
      email: body.email,
      status: USER_STATUS_ENUM.PENDING,
      role: USER_ROLE_ENUM.USER,
    };

    const newUser = await this.userService.createOneUser(user);
    return newUser;
  }
}
