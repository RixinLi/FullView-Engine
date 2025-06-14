import { OmitType } from '@nestjs/mapped-types';
import { Exclude } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { USER_ROLE_ENUM } from 'src/common/enum/userEnum';
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
  name: string = USER_ROLE_ENUM.DEFAULT_USERNAME;

  @IsOptional()
  @IsString()
  role: string = USER_ROLE_ENUM.USER;
}
