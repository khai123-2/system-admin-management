import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AclService } from 'src/shared/services/acl.service';
import { EmployeeService } from './employee.service';
import { User } from 'src/user/entities/user.entity';
import { EmployeeAction } from '../actions/employee-action';
import { Employee } from '../entities/employee.entity';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { UpdateEmployeeDto } from '../dtos/update-employee.dto';

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
        throw new UnauthorizedException('You do not have permission');
    }
    return result;
  }

  async getEmployee(actor: User, employeeId: number) {
    const ability = await this.aclService.forActor(actor);
    let result: Employee;
    switch (true) {
      case ability.canDoAction(EmployeeAction.Get_Employee):
        result = await this.employeeService.getEmployeeById(employeeId);
        break;

      case ability.canDoAction(EmployeeAction.Get_Employee_Same_Office):
        result = await this.employeeService.getEmployeeSameOffice(
          actor,
          employeeId,
        );
        break;

      case ability.canDoAction(EmployeeAction.Get_My_Employee):
        result = await this.employeeService.getMyEmployee(actor, employeeId);
        break;
      default:
        throw new UnauthorizedException();
    }
    return result;
  }

  async createEmployee(actor: User, data: CreateEmployeeDto) {
    const ability = await this.aclService.forActor(actor);

    if (!ability.canDoAction(EmployeeAction.Create_Employee)) {
      throw new UnauthorizedException();
    }

    return await this.employeeService.createEmployee(data);
  }

  async updateEmployee(
    actor: User,
    employeeId: number,
    data: UpdateEmployeeDto,
  ) {
    const ability = await this.aclService.forActor(actor);

    if (!ability.canDoAction(EmployeeAction.Create_Employee)) {
      throw new UnauthorizedException();
    }

    return await this.employeeService.updateEmployee(employeeId, data);
  }

  async deleteEmployee(actor: User, employeeId: number) {
    const ability = await this.aclService.forActor(actor);
    if (!ability.canDoAction(EmployeeAction.Delete_Employee)) {
      throw new UnauthorizedException();
    }

    return await this.employeeService.deleteEmployee(actor, employeeId);
  }
}
