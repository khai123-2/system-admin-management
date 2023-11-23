import { Injectable } from '@nestjs/common';
import { PermissionService } from 'src/permission/permission.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AclService {
  constructor(private readonly permissionService: PermissionService) {}

  async forActor(actor: User) {
    const permissions = await this.permissionService.listPermissionForUser(
      actor,
    );
    const actions = permissions.map((permission) => permission.actionName);
    return {
      canDoAction: (action: string): boolean => {
        return actions.includes(action);
      },
    };
  }
}
