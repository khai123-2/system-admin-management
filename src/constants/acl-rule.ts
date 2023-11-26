import { User } from 'src/user/entities/user.entity';

/**
 * Custom rule callback definition
 */
export type RuleCallback<Resource> = (
  resource: Resource,
  actor: User,
) => boolean;

/**
 * ACL rule format
 */
export type AclRule<Resource> = {
  action: string;
  ruleCallback?: RuleCallback<Resource>;
};
