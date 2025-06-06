import { DataSource } from 'typeorm';
import { typeormConfig } from 'src/config/typeorm.config';
import { Repository_Dependency_Constants } from 'src/common/constants';

export const databaseProviders = [
  {
    provide: Repository_Dependency_Constants.database,
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: typeormConfig.host||'localhost',
        port: typeormConfig.port||3306,
        username: typeormConfig.username||'root',
        password: typeormConfig.password||'root',
        database: typeormConfig.database||'baidu-project',
        entities: [
            __dirname + '/../**/*.entity{.ts,.js}',
        ],
        synchronize: false,
      });
      return dataSource.initialize();
    },
  },
];
