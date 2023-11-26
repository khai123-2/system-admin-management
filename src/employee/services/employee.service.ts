import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { BaseService } from 'src/utils/base.service';
import { Employee } from '../entities/employee.entity';
import { UpdateEmployeeDto } from '../dtos/update-employee.dto';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { EmployeeAclService } from './employee-acl.service';
import { EmployeeAction } from '../actions/employee-action';
@Injectable()
export class EmployeeService extends BaseService<Employee> {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly employeeAclService: EmployeeAclService,
  ) {
    super(employeeRepository, 'Employee not found');
  }
  async listEmployees(user: User): Promise<Employee[]> {
    const ability = await this.employeeAclService.forActor(user);

    let employees: Employee[];
    switch (true) {
      case ability.canDoAction(EmployeeAction.List_Employees):
        employees = await this.getAll();
        break;

      case ability.canDoAction(EmployeeAction.List_Employees_Same_Office):
        employees = await this.getAll({
          officeCode: user.employee?.officeCode,
        });
        break;

      case ability.canDoAction(EmployeeAction.List_My_Employees):
        employees = await this.getAll({ leader: { id: user.employee?.id } });
        break;
      default:
        throw new UnauthorizedException();
    }
    return employees;
  }

  async getEmployeeById(user: User, employeeId: number): Promise<Employee> {
    const employee = await this.getAndCheckExist({ id: employeeId }, [
      'leader',
    ]);
    const ability = await this.employeeAclService.forActor(user);

    switch (true) {
      case ability.canDoAction(EmployeeAction.Get_Employee):
        return employee;

      case ability.canDoAction(
        EmployeeAction.Get_Employee_Same_Office,
        employee,
      ):
        return employee;

      case ability.canDoAction(EmployeeAction.Get_My_Employee, employee):
        return employee;

      default:
        throw new UnauthorizedException();
    }
  }

  async createEmployee(user: User, data: CreateEmployeeDto) {
    const ability = await this.employeeAclService.forActor(user);

    if (!ability.canDoAction(EmployeeAction.Create_Employee)) {
      throw new UnauthorizedException();
    }
    const checkEmailExist = await this.getOne({
      email: data.email,
    });

    if (checkEmailExist) {
      throw new BadRequestException('Email is already exist');
    }
    const employee = this.employeeRepository.create(data);

    if (data.leaderId) {
      const leader = await this.getAndCheckExist({ id: data.leaderId });
      employee.leader = leader;
    }

    return await this.employeeRepository.save(Employee.plainToClass(employee));
  }
  async updateEmployee(
    user: User,
    employeeId: number,
    data: UpdateEmployeeDto,
  ) {
    const ability = await this.employeeAclService.forActor(user);

    if (!ability.canDoAction(EmployeeAction.Update_Employee)) {
      throw new UnauthorizedException();
    }
    const employee = await this.getAndCheckExist({ id: employeeId });

    if (data.leaderId) {
      if (data.leaderId === employeeId) {
        throw new BadRequestException();
      }
      const leader = await this.getAndCheckExist({ id: data.leaderId });
      employee.leader = leader;
    }
    delete data.leaderId;
    return await this.employeeRepository.save({ ...employee, ...data });
  }

  async deleteEmployee(user: User, employeeId: number): Promise<DeleteResult> {
    const ability = await this.employeeAclService.forActor(user);

    if (!ability.canDoAction(EmployeeAction.Delete_Employee)) {
      throw new UnauthorizedException();
    }
    if (user.employee?.id === employeeId) {
      throw new UnauthorizedException();
    }
    const employee = await this.getAndCheckExist({ id: employeeId });
    return await this.employeeRepository.delete(employee.id);
  }
}
