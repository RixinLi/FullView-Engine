import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtSetting } from './common/auth.constants';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { MicroserviceModule } from 'src/microservices/microsever.config';
import { InterceptorModule } from 'src/utils/interceptor/interceptor.module';

@Module({
  imports: [UserModule, JwtModule.register(jwtSetting), MicroserviceModule, InterceptorModule],
  controllers: [AuthController],
  providers: [AuthService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AuthModule {}
