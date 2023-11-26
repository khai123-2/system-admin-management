import { Injectable } from '@nestjs/common';
import { RoleAction } from '../actions/role-action';
import { BaseAclService } from 'src/shared/services/acl.service';
import { PermissionService } from 'src/permission/permission.service';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleAclService extends BaseAclService<Role> {
  constructor(permission: PermissionService) {
    super(permission);
    this.canDo([
      RoleAction.List_Roles,
      RoleAction.Get_Role,
      RoleAction.Create_Role,
      RoleAction.Update_Role_Info,
      RoleAction.Delete_Role,
      RoleAction.Add_Permission_To_Role,
      RoleAction.Remove_Permission_From_Role,
    ]);
  }
}
