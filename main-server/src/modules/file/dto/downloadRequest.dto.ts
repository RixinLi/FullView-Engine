import { IsNotEmpty, IsString } from 'class-validator';

export class downloadResquestDto {
  @IsNotEmpty()
  @IsString()
  filename: string;
}
