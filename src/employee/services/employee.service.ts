import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { BaseService } from 'src/utils/base.service';
import { Employee } from '../entities/employee.entity';
import { UpdateEmployeeDto } from '../dtos/update-employee.dto';
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
  async getEmployeeById(employeeId: number): Promise<Employee> {
    return await this.getAndCheckExist({ id: employeeId });
  }

  async listEmployeesSameOffice(officeId: number): Promise<Employee[]> {
    return await this.getAll({ officeCode: officeId });
  }

  async listMyEmployees(userId: number): Promise<Employee[]> {
    return await this.getAll({ leader: { id: userId } });
  }

  async getEmployeeSameOffice(
    user: User,
    employeeId: number,
  ): Promise<Employee> {
    const employee = await this.getAndCheckExist({ id: employeeId });
    if (user.employee.officeCode !== employee.officeCode) {
      throw new UnauthorizedException();
    }
    return employee;
  }

  async updateEmployee(employeeId: number, data: UpdateEmployeeDto) {
    const employee = await this.getAndCheckExist({ id: employeeId });

    if (data.leaderId) {
      const leader = await this.getAndCheckExist({ id: data.leaderId });
      employee.leader = leader;
    }

    return await this.employeeRepository.save({ ...employee });
  }

  async deleteEmployee(employeeId: number): Promise<DeleteResult> {
    const employee = await this.getAndCheckExist({ id: employeeId });
    return await this.employeeRepository.delete(employee.id);
  }
}
