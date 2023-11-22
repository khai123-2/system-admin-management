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
  forActor(actor: User) {
    return {
      canDoAction: async (action: any, resource?: any) => {
        const roleIds = actor.roles.map((role) => role.id);
        const permissions = await this.permissionRepository
          .createQueryBuilder('permission')
          .leftJoin('permission.roles', 'role')
          .leftJoin('permission.resource', 'resource')
          .where('role.id IN (:...roleIds)', { roleIds })
          .andWhere('permission.actionName = :action', { action })
          .getMany();

        if (permissions.length > 0) {
          return true;
        }
        return false;
      },
    };
  }
}
