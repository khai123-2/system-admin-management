import { Controller, Get, Res } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Response } from 'express';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async getCustomer(@Res() res: Response) {
    const cus = await this.customerService.getCustomerById(5);
    return res.status(200).send({ data: cus });
  }
}
