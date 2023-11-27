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
import { User } from './entities/user.entity';
import { Auth, CurrentUser } from 'src/decorators';
import { Response } from 'express';
import { UserService } from './services/user.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AttachRolesDto } from './dtos/attach-role.dto';
import { RemoveRolesDto } from './dtos/remove-role.dto';
import { CreateUserDto } from './dtos/create-user.dto';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Auth('Get all users')
  async listUsers(@CurrentUser() user: User, @Res() res: Response) {
    const users = await this.userService.listUsers(user);
    return res.status(HttpStatus.OK).send({ data: users });
  }

  @Get(':id')
  @Auth('Get user by id')
  async getUserById(
    @CurrentUser() actor: User,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const user = await this.userService.getUser(actor, id);
    return res.status(HttpStatus.OK).send({ data: user });
  }
  @Post('create')
  @Auth('Create user')
  async createUser(
    @CurrentUser() currentUser: User,
    @Body() body: CreateUserDto,
    @Res() res: Response,
  ) {
    const user = await this.userService.createUser(currentUser, body);
    return res.status(HttpStatus.OK).send({ data: user });
  }

  @Patch(':id')
  @Auth('Update user')
  async UpdateUser(
    @CurrentUser() actor: User,
    @Param('id') id: number,
    @Body() body: UpdateUserDto,
    @Res() res: Response,
  ) {
    const result = await this.userService.updateUser(actor, id, body);
    if (result.affected === 0) {
      throw new BadRequestException();
    }
    return res.status(HttpStatus.OK).send({ message: 'success' });
  }

  @Delete(':id')
  @Auth('Delete user')
  async deleteUser(
    @CurrentUser() actor: User,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const result = await this.userService.deleteUser(actor, id);
    if (result.affected === 0) {
      throw new BadRequestException();
    }
    return res.status(HttpStatus.OK).send({ message: 'success' });
  }

  @Patch(':id/add-roles')
  @Auth('Attach roles to user')
  async attachRolesToUser(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Body() body: AttachRolesDto,
    @Res() res: Response,
  ) {
    const role = await this.userService.attachRoles(user, id, body);
    if (!role) {
      throw new BadRequestException();
    }
    return res.status(HttpStatus.OK).send({ message: 'success' });
  }

  @Patch(':id/remove-roles')
  @Auth('Remove roles from user')
  async removeRolesFromUser(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Body() body: RemoveRolesDto,
    @Res() res: Response,
  ) {
    const role = await this.userService.removeRoles(user, id, body);
    if (!role) {
      throw new BadRequestException();
    }
    return res.status(HttpStatus.OK).send({ message: 'success' });
  }
}
