import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { Repository_Dependency_Constants } from 'src/common/constants';

export const UserProviders = [
  {
    provide: Repository_Dependency_Constants.user,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [Repository_Dependency_Constants.database],
  },
];
