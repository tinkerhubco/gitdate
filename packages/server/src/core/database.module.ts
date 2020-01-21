import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UserRepository } from './repositories';
import { ConfigUtil } from '../utils';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: ConfigUtil.get('database.type'),
      host: ConfigUtil.get('database.host'),
      port: ConfigUtil.get('database.port'),
      username: ConfigUtil.get('database.username'),
      password: ConfigUtil.get('database.password'),
      database: ConfigUtil.get('database.database'),
      extra: {
        // https://stackoverflow.com/questions/30074492/what-is-the-difference-between-utf8mb4-and-utf8-charsets-in-mysql
        charset: ConfigUtil.get('database.charset'),
        // This is important to enable on MySQL especially to run properly the migrations (since it is multiple statements)
        multipleStatements: true // MySQL
      },
      entities: [__dirname + '/../shared/entities/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      synchronize: false,
      logging: false
    }),
    TypeOrmModule.forFeature([UserRepository])
  ],
  providers: []
})
export class DatabaseModule {}
