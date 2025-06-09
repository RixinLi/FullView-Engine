import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtSetting } from './common/constants';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

@Module({
  imports:[UserModule,
    JwtModule.register(jwtSetting),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {provide: APP_GUARD,
    useClass: AuthGuard, },
  ],
})
export class AuthModule {}