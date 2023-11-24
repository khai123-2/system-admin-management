import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/utils/base.service';
import { Role } from '../entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { PermissionService } from 'src/permission/permission.service';

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
}
