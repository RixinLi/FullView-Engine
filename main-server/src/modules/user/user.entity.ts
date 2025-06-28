import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryColumn({
    type: 'varchar',
    length: 255,
    comment: '用户唯一标识符',
    update: false,
  })
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '账户',
    update: false,
  })
  username?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '密码' })
  password?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '用户名' })
  name?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '用户角色属性',
  })
  role?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '用户头像minio文件路径',
  })
  avatar?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '用户的标题/职级',
  })
  title?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '用户的邮箱',
  })
  email?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '用户状态',
  })
  status?: string;
}
