import { Module } from '@nestjs/common';
import { PermissionModule } from 'src/permission/permission.module';
import { AclService } from './services/acl.service';

@Module({
  imports: [PermissionModule],
  providers: [AclService],
  exports: [AclService],
})
export class SharedModule {}
