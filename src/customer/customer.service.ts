import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { Employee } from 'src/employee/entities/employee.entity';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { BaseService } from 'src/utils/base.service';

@Injectable()
export class CustomerService extends BaseService<Customer> {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {
    super(customerRepository, 'Customer not found');
  }

  async listCustomer() {
    return await this.getAll();
  }

  async getCustomerById(customerId: number) {
    return await this.getAndCheckExist({ id: customerId });
  }
  async listCustomersSameOffice(employee: Employee) {
    return this.getAll({
      saleEmployee: { officeCode: employee.officeCode },
    });
  }
  async listMyCustomers(employee: Employee) {
    const customers = await this.getAll({
      saleEmployee: { id: employee.id },
    });
    return customers;
  }

  async getMyCustomer(employee: Employee, customerId: number) {
    const customer = await this.getAndCheckExist({ id: customerId }, [
      'saleEmployee',
    ]);
    if (employee.id !== customer.saleEmployee.id) {
      throw new UnauthorizedException();
    }
    return customer;
  }
  async getCustomerSameOffice(employee: Employee, customerId: number) {
    const customer = await this.getAndCheckExist({ id: customerId }, [
      'saleEmployee',
    ]);
    if (employee.officeCode !== customer.saleEmployee.officeCode) {
      throw new UnauthorizedException();
    }
    return customer;
  }

  async createCustomer(employee: Employee, data: CreateCustomerDto) {
    const newCustomer = this.customerRepository.create(data);
    newCustomer.saleEmployee = employee;
    return await this.customerRepository.save(newCustomer);
  }

  async updateCustomer(customerId: number, data: UpdateCustomerDto) {
    const customer = await this.getAndCheckExist({ id: customerId });
    return await this.customerRepository.update(customer.id, data);
  }

  async updateCustomerSameOffice(
    employee: Employee,
    customerId: number,
    data: UpdateCustomerDto,
  ) {
    const customer = await this.getCustomerSameOffice(employee, customerId);
    return await this.customerRepository.update(customer.id, data);
  }

  async deleteCustomer(customerId: number) {
    const customer = await this.getAndCheckExist({ id: customerId });
    return await this.customerRepository.delete(customer.id);
  }

  async deleteCustomerSameOffice(employee: Employee, customerId: number) {
    const customer = await this.getCustomerSameOffice(employee, customerId);
    return await this.customerRepository.delete(customer.id);
  }
}
