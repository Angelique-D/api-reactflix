import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  email: string;

  @Column()
  @ApiProperty()
  password: string;

  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty({ nullable: true })
  avatar: string;

  @Column()
  @ApiProperty({ default: false })
  isAdmin: boolean;

  @Column()
  @ApiProperty()
  createdAt: Date;

  @Column()
  @ApiProperty()
  updateAt: Date;
}
