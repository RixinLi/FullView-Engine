import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '../database/database.module';
import { UserProviders } from './user.providers';
import { CaslModule } from '../auth/casl/caslModule';

@Module({
  imports:[DatabaseModule, CaslModule],
  controllers: [UserController],
  providers: [
    ...UserProviders,
    UserService],
  exports:[UserService]
})
export class UserModule {}
