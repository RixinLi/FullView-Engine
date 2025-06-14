import { ClientsModule, Transport } from '@nestjs/microservices';

export const MicroserviceModule = ClientsModule.register([
  {
    name: 'CALC_SERVICE',
    transport: Transport.TCP,
    options: {
      port: 3334,
    },
  },
  {
    name: 'LOG_SERVICE',
    transport: Transport.TCP,
    options: {
      port: 3335,
    },
  },
]);
