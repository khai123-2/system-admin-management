import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './services/role.service';
import { RoleAclService } from './services/role-acl.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { SharedModule } from 'src/shared/shared.module';
import { PermissionModule } from 'src/permission/permission.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), SharedModule, PermissionModule],
  controllers: [RoleController],
  providers: [RoleService, RoleAclService],
})
export class RoleModule {}
