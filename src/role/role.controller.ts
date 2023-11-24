import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { RoleAclService } from './services/role-acl.service';
import { Auth, CurrentUser } from 'src/decorators';
import { User } from 'src/user/entities/user.entity';
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
  async createCustomer(
    @CurrentUser() user: User,
    @Body() body: CreateRoleDto,
    @Res() res: Response,
  ) {
    const role = await this.roleAclService.createRole(user, body);
    return res.status(HttpStatus.OK).send({ data: role });
  }
}
