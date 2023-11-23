import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { EmployeeAclService } from './services/employee-acl.service';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeAclService: EmployeeAclService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async listEmployees(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;
    const employees = await this.employeeAclService.listEmployees(user);
    return res.status(200).send({ data: employees });
  }
}
