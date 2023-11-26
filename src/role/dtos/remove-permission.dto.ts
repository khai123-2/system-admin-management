import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RemovePermissionDto {
  @ApiProperty()
  @IsNotEmpty()
  permissionIds: number[];
}
