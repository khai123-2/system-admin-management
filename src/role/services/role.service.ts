import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/utils/base.service';
import { Role } from '../entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { PermissionService } from 'src/permission/permission.service';
import { UpdateRoleInfoDto } from '../dtos/update-role-info.dto';
import { AttachPermissionDto } from '../dtos/attach-permission-dto';

@Injectable()
export class RoleService extends BaseService<Role> {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private readonly permissionService: PermissionService,
  ) {
    super(roleRepository);
  }
  async listRoles() {
    return await this.getAll();
  }

  async getRole(roleId: number) {
    return await this.getAndCheckExist({ id: roleId }, ['permissions']);
  }

  async createRole(data: CreateRoleDto) {
    const role = this.roleRepository.create(data);
    if (data.permissionIds.length > 0) {
      const permissions = await this.permissionService.listPermissionsFromIds(
        data.permissionIds,
      );
      role.permissions = permissions;
    }
    return await this.roleRepository.save(role);
  }

  async updateRoleInfo(roleId: number, data: UpdateRoleInfoDto) {
    const role = await this.getAndCheckExist({ id: roleId });

    return await this.roleRepository.update(roleId, { ...role, ...data });
  }

  async attachPermissions(roleId: number, data: AttachPermissionDto) {
    const role = await this.getAndCheckExist({ id: roleId }, ['permissions']);

    if (data.permissionIds.length > 0) {
      const permissions = await this.permissionService.listPermissionsFromIds(
        data.permissionIds,
      );
      role.permissions.push(...permissions);
    }

    return await this.roleRepository.save(role);
  }

  async removePermissions(roleId: number, data: AttachPermissionDto) {
    const role = await this.getAndCheckExist({ id: roleId }, ['permissions']);

    if (data.permissionIds.length > 0) {
      const permissionsRemoved =
        await this.permissionService.listPermissionsFromIds(data.permissionIds);

      const newPermissions = this.getMissingObjects(
        role.permissions,
        permissionsRemoved,
      );

      role.permissions = newPermissions;
    }
    return await this.roleRepository.save(role);
  }

  async deleteRole(roleId: number) {
    const role = await this.getAndCheckExist({ id: roleId });

    return await this.roleRepository.delete(role.id);
  }
}
