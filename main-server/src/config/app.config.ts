import * as dotenv from 'dotenv';

/*
端口port的配置
*/
dotenv.config();
export const appConfig = {
  port: 30000,
  env: process.env.NODE_ENV || 'development',
};
