import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../utils/base.entity';
import { Employee } from 'src/employee/entities/employee.entity';
@Entity()
export class Customer extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  phone: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'varchar', length: 255 })
  city: string;

  @Column({ type: 'varchar', length: 255 })
  country: string;

  @ManyToOne(() => Employee, (employee) => employee.customers)
  saleEmployee: Employee;
}
