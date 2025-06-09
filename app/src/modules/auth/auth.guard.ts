import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './common/constants';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './common/auth.decorator';


@Injectable()
export class AuthGuard implements CanActivate{

    constructor(private jwtService: JwtService, private reflector: Reflector){}


     async canActivate(context: ExecutionContext): Promise<boolean>{

        // 判断是否需要token验证身份才能通行
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
            ]);
            if (isPublic) {
            // 💡 See this condition
            return true;
        }

        // 处理token验证
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if(!token){
            throw new UnauthorizedException({message:"未找到token"});
        }

        try{
            const payload = await this.jwtService.verifyAsync(token,{
                secret: jwtConstants.secret
            });
            request['user'] = payload;
        }catch{
            throw new UnauthorizedException({message:"token校验失败"});
        };

        return true;
     }


     private extractTokenFromHeader(request: Request): string | undefined {
        const [type,token] = request.headers.authorization?.split(' ')??[];
        return type === 'Bearer' ? token : undefined;   
     }


};