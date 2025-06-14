import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Inject,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInfo } from './dto/login-info.dto';
import { Result } from 'src/common/result';
import { RegisterInfo } from './dto/register-info.dto';
import { Public, Roles } from './common/auth.decorator';
import { RolesGuard } from './roles.guard';
import { Role } from './common/auth.constants';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('CALC_SERVICE') private calcClient: ClientProxy,
    @Inject('LOG_SERVIVE') private logClient: ClientProxy,
    private readonly authService: AuthService
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get()
  calc(@Query('num') str): Observable<number> {
    const numArr = str.split(',').map((item) => parseInt(item));
    this.logClient.emit('log', 'calc:' + numArr);
    return this.calcClient.send('sum', numArr);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: LoginInfo) {
    // console.log(body);
    const data = await this.authService.signIn(body.username, body.password);
    return Result.success(data, '200', '登录成功');
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() body: RegisterInfo) {
    // console.log(body);
    await this.authService.register(body.username, body.password, body.uuid);
    return Result.success({ username: body.username }, '200', '注册成功');
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Get('hello')
  hello(@Request() req) {
    return 'Hello, this is a public function without checking token';
  }
}
