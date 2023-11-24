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
@Injectable()
export class EmployeeService extends BaseService<Employee> {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {
    super(employeeRepository, 'Employee not found');
  }
  async listEmployees(): Promise<Employee[]> {
    return await this.getAll();
  }

  async listEmployeesSameOffice(officeId: number): Promise<Employee[]> {
    return await this.getAll({ officeCode: officeId });
  }

  async listMyEmployees(userId: number): Promise<Employee[]> {
    return await this.getAll({ leader: { id: userId } });
  }

  async getEmployeeById(employeeId: number): Promise<Employee> {
    return await this.getAndCheckExist({ id: employeeId });
  }

  async getEmployeeSameOffice(
    user: User,
    employeeId: number,
  ): Promise<Employee> {
    const employee = await this.getAndCheckExist({ id: employeeId });
    if (user.employee?.officeCode !== employee.officeCode) {
      throw new UnauthorizedException();
    }
    return employee;
  }

  async getMyEmployee(user: User, employeeId: number) {
    const employee = await this.getAndCheckExist({ id: employeeId }, [
      'leader',
    ]);
    if (employee.leader?.id !== user.employee?.id) {
      throw new UnauthorizedException();
    }
    return employee;
  }

  async createEmployee(data: CreateEmployeeDto) {
    const checkEmailExist = await this.getAndCheckExist({ email: data.email });

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
  async updateEmployee(employeeId: number, data: UpdateEmployeeDto) {
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
    if (user.employee?.id === employeeId) {
      throw new UnauthorizedException();
    }
    const employee = await this.getAndCheckExist({ id: employeeId });
    return await this.employeeRepository.delete(employee.id);
  }
}
