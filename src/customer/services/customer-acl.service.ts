import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AclService } from 'src/shared/services/acl.service';
import { User } from 'src/user/entities/user.entity';
import { CustomerService } from './customer.service';
import { Customer } from '../entities/customer.entity';
import { CustomerAction } from '../actions/customer-action';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { DeleteResult, UpdateResult } from 'typeorm';

@Injectable()
export class CustomerAclService {
  constructor(
    private readonly aclService: AclService,
    private readonly customerService: CustomerService,
  ) {}

  async listCustomers(actor: User) {
    const ability = await this.aclService.forActor(actor);
    let result: Customer[];
    switch (true) {
      case ability.canDoAction(CustomerAction.List_Customers):
        result = await this.customerService.listCustomer();
        break;

      case ability.canDoAction(CustomerAction.List_Customers_Same_Office):
        result = await this.customerService.listCustomersSameOffice(
          actor.employee,
        );
        break;

      case ability.canDoAction(CustomerAction.List_My_Customers):
        result = await this.customerService.listMyCustomers(actor.employee);
        break;
      default:
        throw new UnauthorizedException();
    }
    return result;
  }

  async getCustomer(actor: User, customerId: number) {
    const ability = await this.aclService.forActor(actor);
    let result: Customer;
    switch (true) {
      case ability.canDoAction(CustomerAction.Get_Customer):
        result = await this.customerService.getCustomerById(customerId);
        break;

      case ability.canDoAction(CustomerAction.Get_Customer_Same_Office):
        result = await this.customerService.getCustomerSameOffice(
          actor.employee,
          customerId,
        );
        break;

      case ability.canDoAction(CustomerAction.Get_My_Customer):
        result = await this.customerService.getMyCustomer(
          actor.employee,
          customerId,
        );
        break;
      default:
        throw new UnauthorizedException();
    }
    return result;
  }

  async createCustomer(actor: User, data: CreateCustomerDto) {
    const ability = await this.aclService.forActor(actor);

    if (!ability.canDoAction(CustomerAction.Create_Customer)) {
      throw new UnauthorizedException('You do not have permission');
    }

    return await this.customerService.createCustomer(actor.employee, data);
  }

  async updateCustomer(
    actor: User,
    customerId: number,
    data: UpdateCustomerDto,
  ) {
    const ability = await this.aclService.forActor(actor);

    let result: UpdateResult;
    switch (true) {
      case ability.canDoAction(CustomerAction.Update_Customer):
        result = await this.customerService.updateCustomer(customerId, data);
        break;

      case ability.canDoAction(CustomerAction.Update_Customer_Same_Office):
        result = await this.customerService.updateCustomerSameOffice(
          actor.employee,
          customerId,
          data,
        );
        break;
      default:
        throw new UnauthorizedException();
    }
    return result;
  }

  async deleteCustomer(actor: User, customerId: number) {
    const ability = await this.aclService.forActor(actor);

    let result: DeleteResult;
    switch (true) {
      case ability.canDoAction(CustomerAction.Delete_Customer):
        result = await this.customerService.deleteCustomer(customerId);
        break;

      case ability.canDoAction(CustomerAction.Delete_Customer_Same_Office):
        result = await this.customerService.deleteCustomerSameOffice(
          actor.employee,
          customerId,
        );
        break;
      default:
        throw new UnauthorizedException();
    }
    return result;
  }
}
