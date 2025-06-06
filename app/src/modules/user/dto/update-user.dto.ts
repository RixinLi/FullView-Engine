import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';
import { USER_ROLE_ENUM } from 'src/common/enum/userEnum';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    // uuid
    @IsString()
    id:string

    // username
    @IsString()
    @IsOptional()
    username:string;

    // passwords
    @IsOptional()
    @IsString()
    password:string;

    @IsOptional()
    @IsString()
    name: string = USER_ROLE_ENUM.DEFAULT_USERNAME;
    
    @IsOptional()
    @IsString()
    role: string = USER_ROLE_ENUM.USER;

}
