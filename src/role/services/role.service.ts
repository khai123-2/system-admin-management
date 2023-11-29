import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BaseService } from 'src/utils/base.service';
import { Role } from '../entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { UpdateRoleInfoDto } from '../dtos/update-role-info.dto';
import { AttachPermissionDto } from '../dtos/attach-permission.dto';
import { User } from 'src/user/entities/user.entity';
import { RoleAclService } from './role-acl.service';
import { RoleAction } from '../actions/role-action';
import { RemovePermissionDto } from '../dtos/remove-permission.dto';
import { PermissionService } from 'src/permission/permission.service';

@Injectable()
export class RoleService extends BaseService<Role> {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private readonly roleAclService: RoleAclService,
    private readonly permissionService: PermissionService,
  ) {
    super(roleRepository, 'Role Not found');
  }
  async listRoles(user: User) {
    const ability = await this.roleAclService.forActor(user);
    if (!ability.canDoAction(RoleAction.List_Roles)) {
      throw new UnauthorizedException();
    }
    return await this.getAll();
  }

  async getRole(user: User, roleId: number) {
    const ability = await this.roleAclService.forActor(user);
    if (!ability.canDoAction(RoleAction.Get_Role)) {
      throw new UnauthorizedException();
    }
    return await this.getAndCheckExist({ id: roleId }, ['permissions']);
  }

  async createRole(user: User, data: CreateRoleDto) {
    const ability = await this.roleAclService.forActor(user);
    if (!ability.canDoAction(RoleAction.Create_Role)) {
      throw new UnauthorizedException();
    }
    const role = this.roleRepository.create(data);
    if (data.permissionIds && data.permissionIds.length > 0) {
      const permissions = await this.permissionService.listPermissionsFromIds(
        data.permissionIds,
      );
      role.permissions = permissions;
    }
    return await this.roleRepository.save(role);
  }

  async updateRoleInfo(user: User, roleId: number, data: UpdateRoleInfoDto) {
    const ability = await this.roleAclService.forActor(user);
    if (!ability.canDoAction(RoleAction.Update_Role_Info)) {
      throw new UnauthorizedException();
    }
    const role = await this.getAndCheckExist({ id: roleId });
    return await this.roleRepository.update(roleId, { ...role, ...data });
  }

  async attachPermissions(
    user: User,
    roleId: number,
    data: AttachPermissionDto,
  ) {
    const ability = await this.roleAclService.forActor(user);
    if (!ability.canDoAction(RoleAction.Add_Permission_To_Role)) {
      throw new UnauthorizedException();
    }
    const role = await this.getAndCheckExist({ id: roleId }, ['permissions']);
    if (data.permissionIds && data.permissionIds.length > 0) {
      const permissions = await this.permissionService.listPermissionsFromIds(
        data.permissionIds,
      );
      role.permissions.push(...permissions);
    }
    return await this.roleRepository.save(role);
  }

  async removePermissions(
    user: User,
    roleId: number,
    data: RemovePermissionDto,
  ) {
    const ability = await this.roleAclService.forActor(user);
    if (!ability.canDoAction(RoleAction.Remove_Permission_From_Role)) {
      throw new UnauthorizedException();
    }
    const role = await this.getAndCheckExist({ id: roleId }, ['permissions']);
    if (data.permissionIds && data.permissionIds.length > 0) {
      const permissionsRemoved =
        await this.permissionService.listPermissionsFromIds(data.permissionIds);

      const newPermissions = this.filterByIdIntersection(
        role.permissions,
        permissionsRemoved,
      );
      role.permissions = newPermissions;
    }
    return await this.roleRepository.save(role);
  }

  async deleteRole(user: User, roleId: number) {
    const ability = await this.roleAclService.forActor(user);
    if (!ability.canDoAction(RoleAction.Delete_Role)) {
      throw new UnauthorizedException();
    }
    const role = await this.getAndCheckExist({ id: roleId });
    return await this.roleRepository.delete(role.id);
  }

  async listRolesFromIds(roleIds: number[]) {
    const permissions = await this.roleRepository
      .createQueryBuilder('role')
      .where('role.id IN (:...roleIds)', { roleIds })
      .getMany();

    return permissions;
  }
}
