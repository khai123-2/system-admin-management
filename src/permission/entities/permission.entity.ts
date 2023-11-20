import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { Resource } from './resource.entity';
import { AccessLevel } from '../../constants/access-level';
@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  actionName: string;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @Column({ type: 'enum', enum: AccessLevel })
  accessLevel: AccessLevel;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];

  @ManyToOne(() => Resource, (resource) => resource.permissions)
  resource: Resource;
}
