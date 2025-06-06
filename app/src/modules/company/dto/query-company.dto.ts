import { IsString, IsNumber, IsOptional } from 'class-validator';

export class QueryCompanyDto {

    @IsString()
    company_code?: string;

    @IsString()
    @IsOptional()
    company_name?: string;
}