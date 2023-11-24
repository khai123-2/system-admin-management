import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { User } from './entities/user.entity';
import { Auth, CurrentUser } from 'src/decorators';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
}
