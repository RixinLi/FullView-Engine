import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { USER_ROLE_ENUM } from 'src/common/enum/userEnum';

export class CreateUserDto {

    // uuid
    @IsString()
    id:string

    // username
    @IsString()
    username:string;

    // passwords
    @IsString()
    password:string;

    @IsString()
    name: string = USER_ROLE_ENUM.DEFAULT_USERNAME;
    
    @IsString()
    role: string = USER_ROLE_ENUM.USER;

}
