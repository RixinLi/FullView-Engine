import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { DatabaseModule } from '../database/database.module';
import { CompanyProviders } from './company.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [CompanyController],
  providers: [...CompanyProviders, CompanyService],
})
export class CompanyModule {}
