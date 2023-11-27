import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dtos/auth-login.dto';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  @ApiOperation({ summary: 'Login user' })
  async login(
    @Body() body: AuthLoginDto,
    @Res() res: Response,
  ): Promise<Response> {
    const accessToken = await this.authService.login(body);
    return res.status(HttpStatus.OK).send({ accessToken });
  }
}
