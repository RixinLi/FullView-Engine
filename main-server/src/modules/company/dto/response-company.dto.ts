import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

export class ResponseCompanyDto {
  @Expose()
  company_code: string;

  @Expose()
  company_name?: string;

  @Expose()
  level?: number;

  @Expose()
  country?: string;

  @Expose()
  city?: string;

  @Expose()
  founded_year?: number;
}
