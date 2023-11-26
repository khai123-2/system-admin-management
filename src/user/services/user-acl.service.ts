import { Injectable } from '@nestjs/common';
import { BaseAclService } from 'src/shared/services/acl.service';
import { PermissionService } from 'src/permission/permission.service';
import { UserAction } from '../actions/user-action';
import { User } from '../entities/user.entity';

@Injectable()
export class UserAclService extends BaseAclService<User> {
  constructor(permission: PermissionService) {
    super(permission);
    this.canDo([
      UserAction.List_Users,
      UserAction.Get_User,
      UserAction.Create_User,
      UserAction.Update_User,
      UserAction.Add_Role_To_User,
      UserAction.Remove_Role_From_User,
    ]);

    this.canDo(
      [UserAction.Get_My_User, UserAction.Update_My_User],
      this.isUserItSelf,
    );

    this.canDo([UserAction.Delete_User], this.isNotUserItSelf);
  }

  isUserItSelf(resource: User, user: User) {
    return resource.id === user.id;
  }

  isNotUserItSelf(resource: User, user: User) {
    return resource.id !== user.id;
  }
}
