import { IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class FoundedYearDto {
  @IsOptional()
  @IsNumber()
  start?: number;

  @IsOptional()
  @IsNumber()
  end?: number;
}

class AnnualRevenueDto {
  @IsOptional()
  @IsNumber()
  min?: number;

  @IsOptional()
  @IsNumber()
  max?: number;
}

class EmployeesDto {
  @IsOptional()
  @IsNumber()
  min?: number;

  @IsOptional()
  @IsNumber()
  max?: number;
}

class FilterDto {
  @IsArray()
  @IsOptional()
  level?: number[];

  @IsArray()
  @IsOptional()
  country?: string[];

  @IsArray()
  @IsOptional()
  city?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => FoundedYearDto)
  founded_year?: FoundedYearDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AnnualRevenueDto)
  annual_revenue?: AnnualRevenueDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => EmployeesDto)
  employees?: EmployeesDto;
}

export class FilterQueryCompanyDto {
  @IsArray()
  @IsOptional()
  dimension?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterDto)
  filter?: FilterDto;
}
