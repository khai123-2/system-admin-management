import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() body: CreateUserDto, @Res() res: Response) {
    const user = await this.userService.createUser(body);
    return res.status(HttpStatus.OK).send({ data: user });
  }
}
