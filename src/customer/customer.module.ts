import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerService } from './services/customer.service';
import { CustomerAclService } from './services/customer-acl.service';
import { PermissionModule } from 'src/permission/permission.module';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), PermissionModule],
  controllers: [CustomerController],
  providers: [CustomerService, CustomerAclService],
})
export class CustomerModule {}
