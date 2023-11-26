import { Module } from '@nestjs/common';
import { PermissionModule } from 'src/permission/permission.module';

@Module({
  imports: [PermissionModule],
})
export class SharedModule {}
