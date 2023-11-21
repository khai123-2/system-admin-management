import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dtos/auth-login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  async login(
    @Body() body: AuthLoginDto,
    @Res() res: Response,
  ): Promise<Response> {
    const accessToken = await this.authService.login(body);
    return res.status(HttpStatus.OK).send({ accessToken });
  }
}
