import { Entity,Column, PrimaryColumn } from "typeorm";

@Entity('companies')
export class Company {

    @PrimaryColumn({ type: 'varchar', length: 255, comment: '公司id' })
    company_code: string; // 对应 `company_code`，作为主键

    @Column({ type: 'varchar', length: 255, nullable: true, comment: '公司名称' })
    company_name?: string;

    @Column({ type: 'tinyint', nullable: true, comment: '公司级别' })
    level?: number;

    @Column({ type: 'varchar', length: 255, nullable: true, comment: '公司所属国家' })
    country?: string;

    @Column({ type: 'varchar', length: 255, nullable: true, comment: '公司所属城市' })
    city?: string;

    @Column({ type: 'int', nullable: true, comment: '公司成立年份' })
    founded_year?: number;

    @Column({ type: 'bigint', nullable: true, comment: '公司年收入' })
    annual_revenue?: number;

    @Column({ type: 'int', nullable: true, comment: '公司员工数量' })
    employees?: number;
}
