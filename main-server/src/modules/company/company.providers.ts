import { DataSource } from 'typeorm';
import { Company } from './company.entity';
import { Repository_Dependency_Constants } from 'src/common/constants';
import { Relationship } from './relationships.entity';

export const CompanyProviders = [
  // company主表
  {
    provide: Repository_Dependency_Constants.company,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Company),
    inject: [Repository_Dependency_Constants.database],
  },
  // company关系表
  {
    provide: Repository_Dependency_Constants.relationship,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Relationship),
    inject: [Repository_Dependency_Constants.database],
  },
];
