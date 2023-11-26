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
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { User } from './entities/user.entity';
import { Auth, CurrentUser } from 'src/decorators';
import { Response } from 'express';
import { UserService } from './services/user.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AttachRolesDto } from './dtos/remove-role';
import { RemoveRolesDto } from './dtos/attach-role.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Auth()
  async listUsers(@CurrentUser() user: User, @Res() res: Response) {
    const users = await this.userService.listUsers(user);
    return res.status(HttpStatus.OK).send({ data: users });
  }

  @Get(':id')
  @Auth()
  async getUserById(
    @CurrentUser() actor: User,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const user = await this.userService.getUser(actor, id);
    return res.status(HttpStatus.OK).send({ data: user });
  }
  @Post()
  @Auth()
  async createUser(
    @CurrentUser() currentUser: User,
    @Body() body: CreateUserDto,
    @Res() res: Response,
  ) {
    const user = await this.userService.createUser(currentUser, body);
    return res.status(HttpStatus.OK).send({ data: user });
  }

  @Patch(':id')
  @Auth()
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
  @Auth()
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

  @Patch('add-role/:id')
  @Auth()
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

  @Patch('remove-role/:id')
  @Auth()
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
