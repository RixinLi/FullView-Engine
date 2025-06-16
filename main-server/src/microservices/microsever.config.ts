import { ClientsModule, Transport } from '@nestjs/microservices';

export const MicroserviceModule = ClientsModule.register([
  {
    name: 'CALC_SERVICE',
    transport: Transport.TCP,
    options: {
      port: 30001,
    },
  },
  {
    name: 'LOG_SERVICE',
    transport: Transport.TCP,
    options: {
      port: 30002,
    },
  },
  {
    name: 'REDIS_SERVICE',
    transport: Transport.TCP,
    options: {
      port: 30003,
    },
  },
  {
    name: 'MATH_SERVICE',
    transport: Transport.REDIS,
    options: {
      host: 'localhost',
      port: 6379,
    },
  },
]);
