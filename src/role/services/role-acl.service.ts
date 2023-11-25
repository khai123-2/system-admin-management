import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AclService } from 'src/shared/services/acl.service';
import { User } from 'src/user/entities/user.entity';
import { RoleService } from './role.service';
import { RoleAction } from '../actions/role-action';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { AttachPermissionDto } from '../dtos/attach-permission-dto';

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

  async attachPermissions(
    actor: User,
    roleId: number,
    data: AttachPermissionDto,
  ) {
    const ability = await this.aclService.forActor(actor);

    if (!ability.canDoAction(RoleAction.Add_Permission_To_Role)) {
      throw new UnauthorizedException();
    }

    return await this.roleService.attachPermissions(roleId, data);
  }

  async removePermissions(
    actor: User,
    roleId: number,
    data: AttachPermissionDto,
  ) {
    const ability = await this.aclService.forActor(actor);

    if (!ability.canDoAction(RoleAction.Remove_Permission_From_Role)) {
      throw new UnauthorizedException();
    }

    return await this.roleService.removePermissions(roleId, data);
  }

  async deleteRole(actor: User, roleId: number) {
    const ability = await this.aclService.forActor(actor);
    if (!ability.canDoAction(RoleAction.Delete_Role)) {
      throw new UnauthorizedException();
    }

    return await this.roleService.deleteRole(roleId);
  }
}
