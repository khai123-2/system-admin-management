import { AclRule, RuleCallback } from 'src/constants';
import { PermissionService } from 'src/permission/permission.service';
import { User } from 'src/user/entities/user.entity';

export class BaseAclService<Resource> {
  constructor(private readonly permissionService: PermissionService) {}

  protected aclRules: AclRule<Resource>[] = [];

  protected canDo(
    actions: string[],
    ruleCallback?: RuleCallback<Resource>,
  ): void {
    ruleCallback
      ? actions.forEach((action) =>
          this.aclRules.push({ action, ruleCallback }),
        )
      : actions.forEach((action) => this.aclRules.push({ action }));
  }

  async forActor(actor: User) {
    const permissions = await this.permissionService.listPermissionForUser(
      actor,
    );
    const actions = permissions.map((permission) => permission.actionName);
    return {
      canDoAction: (action: string, resource?: Resource) => {
        let canDoAction = false;

        const aclRules = this.aclRules.filter((rule) => {
          return actions.includes(rule.action);
        });
        aclRules.forEach((aclRule) => {
          if (canDoAction) return true;

          const hasActionPermission = aclRule.action === action;
          canDoAction =
            hasActionPermission &&
            (!aclRule.ruleCallback || aclRule.ruleCallback(resource, actor));
        });
        return canDoAction;
      },
    };
  }
}
