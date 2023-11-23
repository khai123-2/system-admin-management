import { Controller, Get, Param, Res } from '@nestjs/common';
import { RoleService } from './role.service';
import { Response } from 'express';

@Controller('role')
export class RoleController {
  constructor(private readonly role: RoleService) {}

  @Get()
  async getCustomer(@Param('id') id: number, @Res() res: Response) {
    await this.role.test();
    return res.status(200).send({ data: 'ss' });
  }
}
