import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { USER_NAME_ENUM, USER_ROLE_ENUM, USER_STATUS_ENUM } from 'src/common/enum/userEnum';

export class CreateUserDto {
  // uuid
  @IsString()
  id: string;

  // username
  @IsString()
  username: string;

  // passwords
  @IsString()
  password: string;

  @IsString()
  name: string = USER_NAME_ENUM.DEFAULT_NAME;

  @IsString()
  role: string = USER_ROLE_ENUM.USER;

  @IsString()
  title: string;

  @IsString()
  email: string;

  @IsString()
  status: string = USER_STATUS_ENUM.PENDING;
}
