import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../utils/base.entity';
import { Exclude } from 'class-transformer';
import { User } from '../../user/entities/user.entity';
import { Permission } from '../../permission/entities/permission.entity';
@Entity()
export class Role extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 500 })
  @Exclude()
  description: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable()
  permissions: Permission[];
}
