import * as dotenv from 'dotenv';

dotenv.config(); // 读取 .env 文件

export const typeormConfig = ({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'baidu-project',
});