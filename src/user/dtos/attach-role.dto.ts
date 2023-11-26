import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RemoveRolesDto {
  @ApiProperty()
  @IsNotEmpty()
  roleIds: number[];
}
