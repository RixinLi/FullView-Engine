import { IsString, IsNumber, IsOptional } from 'class-validator';

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
}
