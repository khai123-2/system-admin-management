import { Injectable } from '@nestjs/common';
import { PermissionService } from 'src/permission/permission.service';
import { User } from 'src/user/entities/user.entity';
import { BaseAclService } from 'src/shared/services/acl.service';
import { Customer } from '../entities/customer.entity';
import { CustomerAction } from '../actions/customer-action';

@Injectable()
export class CustomerAclService extends BaseAclService<Customer> {
  constructor(permissionService: PermissionService) {
    super(permissionService);
    this.canDo([
      CustomerAction.List_Customers,
      CustomerAction.List_Customers_Same_Office,
      CustomerAction.List_My_Customers,
      CustomerAction.Get_Customer,
      CustomerAction.Create_Customer,
      CustomerAction.Update_Customer,
      CustomerAction.Delete_Customer,
    ]);
    this.canDo(
      [
        CustomerAction.Get_Customer_Same_Office,
        CustomerAction.Update_Customer_Same_Office,
        CustomerAction.Delete_Customer_Same_Office,
      ],
      this.isSameOffice,
    );
    this.canDo([CustomerAction.Get_My_Customer], this.isMyCustomer);
  }

  isSameOffice(customer: Customer, user: User): boolean {
    return customer.saleEmployee?.officeCode === user.employee?.officeCode;
  }

  isMyCustomer(customer: Customer, user: User): boolean {
    return customer.saleEmployee?.id === user.employee?.id;
  }
}
