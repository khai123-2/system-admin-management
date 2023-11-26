import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './services/role.service';
import { RoleAclService } from './services/role-acl.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { PermissionModule } from 'src/permission/permission.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), PermissionModule],
  controllers: [RoleController],
  providers: [RoleService, RoleAclService],
  exports: [RoleService],
})
export class RoleModule {}
