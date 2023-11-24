import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AclService } from 'src/shared/services/acl.service';
import { User } from 'src/user/entities/user.entity';
import { RoleService } from './role.service';
import { RoleAction } from '../actions/role-action';
import { CreateRoleDto } from '../dtos/create-role.dto';

@Injectable()
export class RoleAclService {
  constructor(
    private readonly aclService: AclService,
    private readonly roleService: RoleService,
  ) {}

  async listRoles(actor: User) {
    const ability = await this.aclService.forActor(actor);
    if (!ability.canDoAction(RoleAction.List_Roles)) {
      throw new UnauthorizedException();
    }
    return await this.roleService.getAll();
  }

  async getRole(actor: User, roleId: number) {
    const ability = await this.aclService.forActor(actor);

    if (!ability.canDoAction(RoleAction.Get_Role)) {
      throw new UnauthorizedException();
    }

    return await this.roleService.getRole(roleId);
  }

  async createRole(actor: User, data: CreateRoleDto) {
    const ability = await this.aclService.forActor(actor);

    if (!ability.canDoAction(RoleAction.Create_Role)) {
      throw new UnauthorizedException('You do not have permission');
    }

    return await this.roleService.createRole(data);
  }

  // async updateCustomer(
  //   actor: User,
  //   customerId: number,
  //   data: UpdateCustomerDto,
  // ) {
  //   const ability = await this.aclService.forActor(actor);

  //   let result: UpdateResult;
  //   switch (true) {
  //     case ability.canDoAction(CustomerAction.Update_Customer):
  //       result = await this.customerService.updateCustomer(customerId, data);
  //       break;

  //     case ability.canDoAction(CustomerAction.Update_Customer_Same_Office):
  //       result = await this.customerService.updateCustomerSameOffice(
  //         actor.employee,
  //         customerId,
  //         data,
  //       );
  //       break;
  //     default:
  //       throw new UnauthorizedException();
  //   }
  //   return result;
  // }

  // async deleteCustomer(actor: User, customerId: number) {
  //   const ability = await this.aclService.forActor(actor);

  //   let result: DeleteResult;
  //   switch (true) {
  //     case ability.canDoAction(CustomerAction.Delete_Customer):
  //       result = await this.customerService.deleteCustomer(customerId);
  //       break;

  //     case ability.canDoAction(CustomerAction.Delete_Customer_Same_Office):
  //       result = await this.customerService.deleteCustomerSameOffice(
  //         actor.employee,
  //         customerId,
  //       );
  //       break;
  //     default:
  //       throw new UnauthorizedException();
  //   }
  //   return result;
  // }
}
