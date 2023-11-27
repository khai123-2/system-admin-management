import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/utils/base.service';
import { Permission } from './entities/permission.entity';
// import { PermissionAclService } from './permission-acl.service';

@Injectable()
export class PermissionService extends BaseService<Permission> {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {
    super(permissionRepository);
  }

  async listPermissionForUser(user: User): Promise<Permission[]> {
    const roleIds = user.roles.map((role) => role.id);
    const permissions = await this.permissionRepository
      .createQueryBuilder('permission')
      .leftJoin('permission.roles', 'role')
      .where('role.id IN (:...roleIds)', { roleIds })
      .getMany();
    return permissions;
  }

  async listPermissionsFromIds(permissionIds: number[]) {
    const permissions = await this.permissionRepository
      .createQueryBuilder('permission')
      .where('permission.id IN (:...permissionIds)', { permissionIds })
      .getMany();

    return permissions;
  }
}
