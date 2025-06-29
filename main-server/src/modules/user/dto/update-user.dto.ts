import { OmitType } from '@nestjs/mapped-types';
import { Exclude } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { USER_NAME_ENUM, USER_ROLE_ENUM } from 'src/common/enum/userEnum';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto {
  // uuid
  @IsString()
  id: string;

  @IsString()
  username: string;

  // passwords
  @IsOptional()
  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  status: string;
}
