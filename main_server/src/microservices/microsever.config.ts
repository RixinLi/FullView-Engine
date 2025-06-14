import { Transport } from '@nestjs/microservices';

export const calc_microservice = {
  name: 'CALC_SERVICE',
  transport: Transport.TCP,
  options: {
    port: 8888,
  },
};
