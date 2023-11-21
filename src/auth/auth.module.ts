import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [JwtModule.register({}), ConfigModule, PassportModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
