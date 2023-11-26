import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from 'src/utils/base.service';
import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { User } from 'src/user/entities/user.entity';
import { CustomerAclService } from './customer-acl.service';
import { CustomerAction } from '../actions/customer-action';

@Injectable()
export class CustomerService extends BaseService<Customer> {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly customerAclService: CustomerAclService,
  ) {
    super(customerRepository, 'Customer not found');
  }

  async listCustomers(user: User) {
    const ability = await this.customerAclService.forActor(user);
    let customers: Customer[];
    switch (true) {
      case ability.canDoAction(CustomerAction.List_Customers):
        customers = await this.getAll();
        break;

      case ability.canDoAction(CustomerAction.List_Customers_Same_Office):
        customers = await this.getAll({
          saleEmployee: { officeCode: user.employee?.officeCode },
        });
        break;

      case ability.canDoAction(CustomerAction.List_My_Customers):
        customers = await this.getAll({
          saleEmployee: { id: user.employee?.id },
        });
        break;
      default:
        throw new UnauthorizedException();
    }
    return customers;
  }

  async getCustomerById(user: User, customerId: number) {
    const customer = await this.getAndCheckExist({ id: customerId }, [
      'saleEmployee',
    ]);

    const ability = await this.customerAclService.forActor(user);

    switch (true) {
      case ability.canDoAction(CustomerAction.Get_Customer):
        return customer;

      case ability.canDoAction(
        CustomerAction.Get_Customer_Same_Office,
        customer,
      ):
        return customer;

      case ability.canDoAction(CustomerAction.Get_My_Customer, customer):
        return customer;

      default:
        throw new UnauthorizedException();
    }
  }

  async createCustomer(user: User, data: CreateCustomerDto) {
    const ability = await this.customerAclService.forActor(user);

    if (!ability.canDoAction(CustomerAction.Create_Customer)) {
      throw new UnauthorizedException();
    }
    const newCustomer = this.customerRepository.create(data);
    newCustomer.saleEmployee = user.employee;
    return await this.customerRepository.save(newCustomer);
  }

  async updateCustomer(
    user: User,
    customerId: number,
    data: UpdateCustomerDto,
  ) {
    const customer = await this.getAndCheckExist({ id: customerId }, [
      'saleEmployee',
    ]);

    const ability = await this.customerAclService.forActor(user);
    switch (true) {
      case ability.canDoAction(CustomerAction.Update_Customer):
        return await this.customerRepository.update(customer.id, data);

      case ability.canDoAction(
        CustomerAction.Update_Customer_Same_Office,
        customer,
      ):
        return await this.customerRepository.update(customer.id, data);

      default:
        throw new UnauthorizedException();
    }
  }

  async deleteCustomer(user: User, customerId: number) {
    const customer = await this.getAndCheckExist({ id: customerId }, [
      'saleEmployee',
    ]);

    const ability = await this.customerAclService.forActor(user);
    switch (true) {
      case ability.canDoAction(CustomerAction.Delete_Customer):
        return await this.customerRepository.delete(customer.id);

      case ability.canDoAction(
        CustomerAction.Delete_Customer_Same_Office,
        customer,
      ):
        return await this.customerRepository.delete(customer.id);

      default:
        throw new UnauthorizedException();
    }
  }
}
