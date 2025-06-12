import { IsString, IsNumber, IsOptional } from 'class-validator';

export class LoginInfo {
  // username
  @IsString()
  username: string;

  // passwords
  @IsString()
  password: string;
}
