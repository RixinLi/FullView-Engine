import { IsNotEmpty, IsSemVer, IsString } from 'class-validator';

export class downloadResquestDto {
  @IsNotEmpty()
  @IsString()
  filename: string;
}
