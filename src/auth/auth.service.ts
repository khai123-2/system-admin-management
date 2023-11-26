import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { comparePass } from 'src/utils/bcrypt';
import { AuthLoginDto } from './dtos/auth-login.dto';
import { ConfigService } from '@nestjs/config';
import { AllTypeConfig } from 'src/config/config.type';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AllTypeConfig>,
  ) {}
  async login(data: AuthLoginDto) {
    const user = await this.userService.getAndCheckExist({
      username: data.username,
    });
    const match = await comparePass(data.password, user.password);
    if (!match) {
      throw new BadRequestException('Invalid password');
    }
    const payload = {
      id: user.id,
    };

    const authConfig = this.configService.getOrThrow('auth', { infer: true });
    return await this.jwtService.signAsync(payload, {
      secret: authConfig.secret,
      expiresIn: authConfig.tokenExpires,
    });
  }
}
