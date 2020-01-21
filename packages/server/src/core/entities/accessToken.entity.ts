import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class AccessToken {
  @PrimaryColumn()
  public id: string;

  @Column()
  public expiration: Date;

  @CreateDateColumn()
  public created: Date;

  @ManyToOne(() => User, user => user.accessTokens)
  @JoinColumn({ name: 'user_id' })
  public user: User;
}
