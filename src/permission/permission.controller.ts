import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Response } from 'express';
import { Auth } from 'src/decorators';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Permission')
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @Auth('Get all permissions')
  async listPermissions(@Res() res: Response) {
    const permissions = await this.permissionService.getAll();
    return res.status(HttpStatus.OK).send({ data: permissions });
  }
}
