import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './services/employee.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { EmployeeAclService } from './services/employee-acl.service';
import { PermissionModule } from 'src/permission/permission.module';

@Module({
  imports: [TypeOrmModule.forFeature([Employee]), PermissionModule],
  controllers: [EmployeeController],
  providers: [EmployeeService, EmployeeAclService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
