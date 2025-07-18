import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('relationships')
export class Relationship {
  @PrimaryColumn({ type: 'varchar', length: 255, comment: '公司id' })
  company_code: string; // 对应 `company_code`，作为主键

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '母公司id' })
  parent_company?: string;
}
