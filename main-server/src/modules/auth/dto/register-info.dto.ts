import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { USER_NAME_ENUM, USER_ROLE_ENUM, USER_STATUS_ENUM } from 'src/common/enum/userEnum';

export class RegisterInfo {
  // username
  @IsString()
  username: string;

  // passwords
  @IsString()
  password: string;

  // uuid
  @IsString()
  @IsOptional()
  uuid: string;

  // name
  @IsString()
  name: string = USER_NAME_ENUM.DEFAULT_NAME;

  @IsString()
  title: string;

  @IsString()
  email: string;
}
