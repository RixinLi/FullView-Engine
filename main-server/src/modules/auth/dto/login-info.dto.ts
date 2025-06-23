import { IsString, IsNumber, IsOptional } from 'class-validator';
import { User } from 'src/modules/user/user.entity';

export class LoginRequestInfo {
  // username
  @IsString()
  username: string;

  // passwords
  @IsString()
  password: string;
}
