import { Module } from '@nestjs/common';
import { CompanyModule } from './modules/company/company.module';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';


@Module({
  imports: [
    DatabaseModule,
    CompanyModule,
    UserModule
  ],
})
export class AppModule { }
