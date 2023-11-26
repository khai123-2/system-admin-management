import { Employee } from 'src/employee/entities/employee.entity';
import { Injectable } from '@nestjs/common';
import { PermissionService } from 'src/permission/permission.service';
import { EmployeeAction } from '../actions/employee-action';
import { User } from 'src/user/entities/user.entity';
import { BaseAclService } from 'src/shared/services/acl.service';

@Injectable()
export class EmployeeAclService extends BaseAclService<Employee> {
  constructor(permissionService: PermissionService) {
    super(permissionService);
    this.canDo([
      EmployeeAction.List_Employees,
      EmployeeAction.List_Employees_Same_Office,
      EmployeeAction.List_My_Employees,
      EmployeeAction.Get_Employee,
      EmployeeAction.Create_Employee,
      EmployeeAction.Update_Employee,
      EmployeeAction.Delete_Employee,
    ]);
    this.canDo([EmployeeAction.Get_Employee_Same_Office], this.isSameOffice);
    this.canDo([EmployeeAction.Get_My_Employee], this.isMyEmployee);
  }

  isSameOffice(employee: Employee, user: User): boolean {
    return employee.officeCode === user.employee?.officeCode;
  }

  isMyEmployee(employee: Employee, user: User): boolean {
    return employee.leader?.id === user.employee?.id;
  }
}
