import { PartialType } from '@nestjs/swagger';
import { AttachRolesDto } from './attach-role.dto';

export class RemoveRolesDto extends PartialType(AttachRolesDto) {}
