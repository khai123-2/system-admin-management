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
import { Auth, CurrentUser } from 'src/decorators';
import { User } from 'src/user/entities/user.entity';
import { AttachPermissionDto } from './dtos/attach-permission.dto';
import { CreateRoleDto } from './dtos/create-role.dto';
import { RoleService } from './services/role.service';
import { UpdateRoleInfoDto } from './dtos/update-role-info.dto';
import { RemovePermissionDto } from './dtos/remove-permission.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Role')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @Auth('Get all roles')
  async listRoles(@CurrentUser() user: User, @Res() res: Response) {
    const roles = await this.roleService.listRoles(user);
    return res.status(HttpStatus.OK).send({ data: roles });
  }

  @Get(':id')
  @Auth('Get role by id')
  async getRoleById(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const role = await this.roleService.getRole(user, id);
    return res.status(HttpStatus.OK).send({ data: role });
  }

  @Post('create')
  @Auth('Create role')
  async createRole(
    @CurrentUser() user: User,
    @Body() body: CreateRoleDto,
    @Res() res: Response,
  ) {
    const employee = await this.roleService.createRole(user, body);
    return res.status(HttpStatus.OK).send({ data: employee });
  }

  @Patch(':id')
  @Auth('Update role')
  async UpdateRoleInfo(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Body() body: UpdateRoleInfoDto,
    @Res() res: Response,
  ) {
    const role = await this.roleService.updateRoleInfo(user, id, body);
    if (!role) {
      throw new BadRequestException();
    }
    return res.status(HttpStatus.OK).send({ message: 'success' });
  }

  @Patch(':id/add-permissions')
  @Auth('Attach permissions to role')
  async attachPermissionsToRole(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Body() body: AttachPermissionDto,
    @Res() res: Response,
  ) {
    const role = await this.roleService.attachPermissions(user, id, body);
    if (!role) {
      throw new BadRequestException();
    }
    return res.status(HttpStatus.OK).send({ message: 'success' });
  }

  @Patch(':id/remove-permissions')
  @Auth('Remove permissions from role')
  async removePermissionsFromRole(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Body() body: RemovePermissionDto,
    @Res() res: Response,
  ) {
    const role = await this.roleService.removePermissions(user, id, body);
    if (!role) {
      throw new BadRequestException();
    }
    return res.status(HttpStatus.OK).send({ message: 'success' });
  }

  @Delete(':id')
  @Auth('Delete role')
  async deleteRole(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const result = await this.roleService.deleteRole(user, id);
    if (result.affected === 0) {
      throw new BadRequestException();
    }
    return res.status(HttpStatus.OK).send({ message: 'success' });
  }
}
