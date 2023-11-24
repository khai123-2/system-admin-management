import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { EmployeeAclService } from './services/employee-acl.service';
import { User } from 'src/user/entities/user.entity';
import { Auth, CurrentUser } from 'src/decorators';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeAclService: EmployeeAclService) {}

  @Get()
  @Auth()
  async listEmployees(@CurrentUser() user: User, @Res() res: Response) {
    const employees = await this.employeeAclService.listEmployees(user);
    return res.status(HttpStatus.OK).send({ data: employees });
  }

  @Get(':id')
  @Auth()
  async getEmployeeById(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const employee = await this.employeeAclService.getEmployee(user, id);
    return res.status(HttpStatus.OK).send({ data: employee });
  }

  @Post()
  @Auth()
  async createEmployee(
    @CurrentUser() user: User,
    @Body() body: CreateEmployeeDto,
    @Res() res: Response,
  ) {
    const employee = await this.employeeAclService.createEmployee(user, body);
    return res.status(HttpStatus.OK).send({ data: employee });
  }

  @Patch(':id')
  @Auth()
  async updateEmployee(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Body() body: UpdateEmployeeDto,
    @Res() res: Response,
  ) {
    const employee = await this.employeeAclService.updateEmployee(
      user,
      id,
      body,
    );
    return res.status(HttpStatus.OK).send({ data: employee });
  }

  @Delete(':id')
  @Auth()
  async deleteEmployee(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const result = await this.employeeAclService.deleteEmployee(user, id);
    if (result.affected === 0) {
      throw new BadRequestException();
    }
    return res.status(HttpStatus.OK).send({ message: 'success' });
  }
}
