import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Permission } from './permission.entity';
@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  displayName: string;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @OneToMany(() => Permission, (permission) => permission.resource)
  permissions: Permission[];
}
