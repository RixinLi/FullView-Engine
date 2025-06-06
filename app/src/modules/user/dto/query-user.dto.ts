import { IsString, IsNumber, IsOptional } from 'class-validator';

export class QueryUserDto {

    // uuid
    @IsString()
    @IsOptional()
    id:string

    // username
    @IsString()
    @IsOptional()
    username:string;

}