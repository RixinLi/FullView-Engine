import { DataSource } from 'typeorm';
import { Company } from './company.entity';
import { Repository_Dependency_Constants } from 'src/common/constants';

export const CompanyProviders = [
  {
    provide: Repository_Dependency_Constants.company,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Company),
    inject: [Repository_Dependency_Constants.database],
  },
];
