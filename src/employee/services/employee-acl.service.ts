import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AclService } from 'src/shared/services/acl.service';
import { EmployeeService } from './employee.service';
import { User } from 'src/user/entities/user.entity';
import { EmployeeAction } from '../actions/employee-action';
import { Employee } from '../entities/employee.entity';

@Injectable()
export class EmployeeAclService {
  constructor(
    private readonly aclService: AclService,
    private readonly employeeService: EmployeeService,
  ) {}

  async listEmployees(actor: User) {
    const ability = await this.aclService.forActor(actor);
    let result: Employee[];
    switch (true) {
      case ability.canDoAction(EmployeeAction.List_Employees):
        result = await this.employeeService.listEmployees();
        break;

      case ability.canDoAction(EmployeeAction.List_Employees_Same_Office):
        result = await this.employeeService.listEmployeesSameOffice(
          actor.employee?.officeCode,
        );
        break;

      case ability.canDoAction(EmployeeAction.List_My_Employees):
        result = await this.employeeService.listMyEmployees(actor.id);
        break;
      default:
        throw new UnauthorizedException();
    }
    return result;
  }
}
