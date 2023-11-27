import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from '../../utils/base.entity';
import { Customer } from '../../customer/entities/customer.entity';
import { User } from '../../user/entities/user.entity';
@Entity()
export class Employee extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'integer' })
  officeCode: number;

  @OneToOne(() => User, (user) => user.employee)
  user: User;

  @ManyToOne(() => Employee, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({
    name: 'reportTo',
  })
  leader: Employee;

  @OneToMany(() => Employee, (employee) => employee.leader, {
    nullable: true,
  })
  myEmployees: Employee[];

  @OneToMany(() => Customer, (customer) => customer.saleEmployee)
  customers: Customer[];
}
