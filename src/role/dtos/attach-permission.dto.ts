import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AttachPermissionDto {
  @ApiProperty()
  @IsNotEmpty()
  permissionIds: number[];
}
