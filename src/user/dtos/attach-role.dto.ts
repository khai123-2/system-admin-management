import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AttachRolesDto {
  @ApiProperty()
  @IsNotEmpty()
  roleIds: number[];
}
