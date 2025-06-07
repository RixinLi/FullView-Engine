import { Body, Controller, Post, RequestMapping } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginInfo } from "./dto/login-info.dto";
import { Result } from "src/common/result";
import { RegisterInfo } from "./dto/register-info.dto";
import { randomUUID } from "crypto";



@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() body: LoginInfo) {
        // console.log(body);
        const data = await this.authService.signIn(body.username,body.password);
        return Result.success(data,"200","登录成功");
    }

    @Post('register')
    async register(@Body() body: RegisterInfo){
        // console.log(body);
        await this.authService.register(body.username,body.password,body.uuid);
        return Result.success({token:randomUUID()},"200","注册成功");
    }
}