import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async listPermissionForUser(user: User): Promise<Permission[]> {
    const roleIds = user.roles.map((role) => role.id);
    const permissions = await this.permissionRepository
      .createQueryBuilder('permission')
      .leftJoin('permission.roles', 'role')
      .leftJoin('permission.resource', 'resource')
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
