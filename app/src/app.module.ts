import { Module } from '@nestjs/common';
import { CompanyModule } from './modules/company/company.module';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CaslModule } from './modules/auth/casl/caslModule';


@Module({
  imports: [
    DatabaseModule,
    CompanyModule,
    UserModule,
    AuthModule,
    CaslModule
  ],
})
export class AppModule { }
