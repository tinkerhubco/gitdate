import { Module } from '@nestjs/common';

import { DatabaseModule } from './database.module';

import { UserController } from './controllers';
import { UserService, TestService } from './services';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService, TestService]
})
export class CoreModule {}
