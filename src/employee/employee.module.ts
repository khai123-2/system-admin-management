import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './services/employee.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { SharedModule } from 'src/shared/shared.module';
import { EmployeeAclService } from './services/employee-acl.service';

@Module({
  imports: [TypeOrmModule.forFeature([Employee]), SharedModule],
  controllers: [EmployeeController],
  providers: [EmployeeService, EmployeeAclService],
})
export class EmployeeModule {}
