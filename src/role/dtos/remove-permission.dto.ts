import { PartialType } from '@nestjs/swagger';
import { AttachPermissionDto } from './attach-permission.dto';

export class RemovePermissionDto extends PartialType(AttachPermissionDto) {}
