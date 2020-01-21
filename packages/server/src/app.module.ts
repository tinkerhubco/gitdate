import { Module } from '@nestjs/common';

import { CoreModule } from './core/core.module';
import { RolesGuard } from './core/guards/roles.guard';

@Module({
  imports: [CoreModule],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard
    }
  ]
})
export class AppModule {}
