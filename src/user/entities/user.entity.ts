import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
} from 'typeorm';
import { UserStatus } from '../../constants';
import { BaseEntity } from '../../utils/base.entity';
import { Exclude } from 'class-transformer';
import { Role } from '../../role/entities/role.entity';
import { Employee } from 'src/employee/entities/employee.entity';
@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  @Exclude()
  password: string;

  @OneToOne(() => Employee, (employee) => employee.user, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  employee: Employee;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles: Role[];

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;
}
