import { Module } from '@nestjs/common';
import { CompanyModule } from './modules/company/company.module';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CaslModule } from './modules/auth/casl/caslModule';
import { MicroserviceModule } from './microservices/microsever.config';
import { RedisCacheModule } from './utils/redis/redisCacheModule.module';
import { InterceptorModule } from './utils/interceptor/interceptor.module';

@Module({
  imports: [
    MicroserviceModule,
    DatabaseModule,
    CompanyModule,
    UserModule,
    AuthModule,
    CaslModule,
    RedisCacheModule,
    InterceptorModule,
  ],
})
export class AppModule {}
