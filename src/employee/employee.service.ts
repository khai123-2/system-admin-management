import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';
@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async getAllEmployees(
    fields: FindOptionsWhere<Employee> | FindOptionsWhere<Employee>[],
    relationOptions?: string[],
  ) {
    return await this.employeeRepository.find({
      where: fields,
      relations: relationOptions,
    });
  }

  async getEmployee(
    fields: FindOptionsWhere<Employee> | FindOptionsWhere<Employee>[],
    relationOptions?: string[],
  ) {
    return await this.employeeRepository.findOne({
      where: fields,
      relations: relationOptions,
    });
  }

  async getAllEmployeesSameOffice(officeId: number) {
    return await this.getAllEmployees({ officeCode: officeId });
  }

  async getAllMyEmployees(userId: number) {
    const employee = await this.getEmployee({ id: userId }, ['myEmployees']);
    return employee.myEmployees;
  }

  async getEmployeeSameOffice(user: User, employeeId: number) {
    const employee = await this.getEmployee({ id: employeeId });
    if (!employee) {
      throw new NotFoundException('employee not found');
    }

    if (user.employee.officeCode !== employee.officeCode) {
      throw new UnauthorizedException();
    }
    return employee;
  }

  async updateEmployee(employeeId: number, data: UpdateEmployeeDto) {
    const employee = await this.getEmployee({ id: employeeId });
    if (!employee) {
      throw new NotFoundException('employee not found');
    }

    if (data.leaderId) {
      const leader = await this.getEmployee({ id: data.leaderId });
      if (!leader) {
        throw new NotFoundException('Leader not found');
      }

      employee.leader = leader;
    }

    return await this.employeeRepository.save({ ...employee });
  }

  async deleteEmployee(employeeId: number) {
    const employee = await this.getEmployee({ id: employeeId });
    if (!employee) {
      throw new NotFoundException('employee not found');
    }

    return await this.employeeRepository.delete(employee.id);
  }
}
