import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateRoleInfoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;
}
