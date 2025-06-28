import { OmitType } from '@nestjs/mapped-types';
import { Exclude } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { USER_NAME_ENUM, USER_ROLE_ENUM } from 'src/common/enum/userEnum';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends OmitType(CreateUserDto, ['username']) {
  // uuid
  @IsString()
  id: string;

  // passwords
  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  name: string = USER_NAME_ENUM.DEFAULT_NAME;

  @IsOptional()
  @IsString()
  role: string = USER_ROLE_ENUM.USER;
}
