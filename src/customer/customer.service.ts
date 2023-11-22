import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Employee } from 'src/employee/entities/employee.entity';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async getAllCustomers(
    fields: FindOptionsWhere<Customer> | FindOptionsWhere<Customer>[],
    relationOptions?: string[],
  ) {
    return await this.customerRepository.find({
      where: fields,
      relations: relationOptions,
    });
  }

  async getCustomer(
    fields: FindOptionsWhere<Customer> | FindOptionsWhere<Customer>[],
    relationOptions?: string[],
  ) {
    return await this.customerRepository.findOne({
      where: fields,
      relations: relationOptions,
    });
  }

  async listCustomersSameOffice(employee: Employee) {
    const customers = this.getAllCustomers({
      saleEmployee: { officeCode: employee.officeCode },
    });
    return customers;
  }
  async listMyCustomers(employee: Employee) {
    const customers = await this.getAllCustomers({
      saleEmployee: { id: employee.id },
    });
    return customers;
  }

  async getMyCustomer(employee: Employee, customerId: number) {
    const customer = await this.getCustomer({ id: customerId }, [
      'saleEmployee',
    ]);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    if (employee.id !== customer.saleEmployee.id) {
      throw new UnauthorizedException();
    }
    return customer;
  }
  async getCustomerSameOffice(employee: Employee, customerId: number) {
    const customer = await this.getCustomer({ id: customerId }, [
      'saleEmployee',
    ]);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
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
    const customer = await this.getCustomer({ id: customerId });
    if (!customer) {
      throw new NotFoundException('customer not found');
    }

    return await this.customerRepository.update(customerId, data);
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
    const customer = await this.getCustomer({ id: customerId });
    if (!customer) {
      throw new NotFoundException('customer not found');
    }

    return await this.customerRepository.delete(customerId);
  }

  async deleteCustomerSameOffice(employee: Employee, customerId: number) {
    const customer = await this.getCustomerSameOffice(employee, customerId);
    return await this.customerRepository.delete(customer.id);
  }
}
