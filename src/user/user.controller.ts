import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createUser(
    @Req() req: Request,
    @Body() body: CreateUserDto,
    @Res() res: Response,
  ) {
    const currentUser = req.user as User;
    const user = await this.userService.createUser(currentUser, body);
    return res.status(HttpStatus.OK).send({ data: user });
  }
}
