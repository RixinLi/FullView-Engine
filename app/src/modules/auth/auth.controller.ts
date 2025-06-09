import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginInfo } from "./dto/login-info.dto";
import { Result } from "src/common/result";
import { RegisterInfo } from "./dto/register-info.dto";
import { Public, Roles } from "./common/auth.decorator";
import { RolesGuard } from "./roles.guard";
import { Role } from "./common/auth.constants";



@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() body: LoginInfo) {
        // console.log(body);
        const data = await this.authService.signIn(body.username,body.password);
        return Result.success(data,"200","登录成功");
    }

    @Public()
    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    async register(@Body() body: RegisterInfo){
        // console.log(body);
        await this.authService.register(body.username,body.password,body.uuid);
        return Result.success({username:body.username},"200","注册成功");
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN,Role.USER)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }   

    @Public()
    @Get('hello')
    hello(@Request() req){
        return "Hello, this is a public function without checking token";
    }
}