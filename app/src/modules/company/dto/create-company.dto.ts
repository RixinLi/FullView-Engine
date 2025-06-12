import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCompanyDto {
  @IsString()
  company_code: string;

  @IsString()
  @IsOptional()
  company_name?: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value)) // 强制转换成数值
  level?: number;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value)) // 强制转换成数值
  founded_year?: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value)) // 强制转换成数值
  annual_revenue?: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value)) // 强制转换成数值
  employees?: number;
}
