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
import { Auth, CurrentUser } from 'src/decorators';
import { User } from 'src/user/entities/user.entity';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { CustomerService } from './services/customer.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Customer')
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @Auth('Get all customers')
  async listCustomers(@CurrentUser() user: User, @Res() res: Response) {
    const employees = await this.customerService.listCustomers(user);
    return res.status(HttpStatus.OK).send({ data: employees });
  }

  @Get(':id')
  @Auth('Get customer by id')
  async getCustomerById(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const customer = await this.customerService.getCustomerById(user, id);
    return res.status(HttpStatus.OK).send({ data: customer });
  }

  @Post('create')
  @Auth('Create customer')
  async createCustomer(
    @CurrentUser() user: User,
    @Body() body: CreateCustomerDto,
    @Res() res: Response,
  ) {
    const employee = await this.customerService.createCustomer(user, body);
    return res.status(HttpStatus.OK).send({ data: employee });
  }

  @Patch(':id')
  @Auth('Update customer')
  async updateCustomer(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Body() body: UpdateCustomerDto,
    @Res() res: Response,
  ) {
    const result = await this.customerService.updateCustomer(user, id, body);

    if (result.affected === 0) {
      throw new BadRequestException();
    }
    return res.status(HttpStatus.OK).send({ message: 'success' });
  }

  @Delete(':id')
  @Auth('Delete customer')
  async deleteCustomer(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const result = await this.customerService.deleteCustomer(user, id);
    if (result.affected === 0) {
      throw new BadRequestException();
    }
    return res.status(HttpStatus.OK).send({ message: 'success' });
  }
}
