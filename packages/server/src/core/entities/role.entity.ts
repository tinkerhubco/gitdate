import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

import { User } from './user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @ManyToMany(() => User, user => user.roles)
  public users: User[];
}
