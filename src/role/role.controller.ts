import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { RoleAclService } from './services/role-acl.service';
import { Auth, CurrentUser } from 'src/decorators';
import { User } from 'src/user/entities/user.entity';
import { AttachPermissionDto } from './dtos/attach-permission-dto';
import { CreateRoleDto } from './dtos/create-role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleAclService: RoleAclService) {}
  @Get()
  @Auth()
  async listEmployees(@CurrentUser() user: User, @Res() res: Response) {
    const roles = await this.roleAclService.listRoles(user);
    return res.status(HttpStatus.OK).send({ data: roles });
  }

  @Get(':id')
  @Auth()
  async getRoleById(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const role = await this.roleAclService.getRole(user, id);
    return res.status(HttpStatus.OK).send({ data: role });
  }

  @Post()
  @Auth()
  async createRole(
    @CurrentUser() user: User,
    @Body() body: CreateRoleDto,
    @Res() res: Response,
  ) {
    const employee = await this.roleAclService.createRole(user, body);
    return res.status(HttpStatus.OK).send({ data: employee });
  }

  @Patch('add-permission/:id')
  @Auth()
  async attachPermissionsToRole(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Body() body: AttachPermissionDto,
    @Res() res: Response,
  ) {
    const role = await this.roleAclService.attachPermissions(user, id, body);
    if (!role) {
      throw new BadRequestException();
    }
    return res.status(HttpStatus.OK).send({ message: 'success' });
  }

  @Patch('remove-permission/:id')
  @Auth()
  async removePermissionsFromRole(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Body() body: AttachPermissionDto,
    @Res() res: Response,
  ) {
    const role = await this.roleAclService.removePermissions(user, id, body);
    if (!role) {
      throw new BadRequestException();
    }
    return res.status(HttpStatus.OK).send({ message: 'success' });
  }

  @Delete(':id')
  @Auth()
  async deleteRole(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const result = await this.roleAclService.deleteRole(user, id);
    if (result.affected === 0) {
      throw new BadRequestException();
    }
    return res.status(HttpStatus.OK).send({ message: 'success' });
  }
}
