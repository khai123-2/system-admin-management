import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PermissionModule } from 'src/permission/permission.module';
import { UserAclService } from './services/user-acl.service';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PermissionModule, RoleModule],
  controllers: [UserController],
  providers: [UserService, UserAclService],
  exports: [UserService],
})
export class UserModule {}
