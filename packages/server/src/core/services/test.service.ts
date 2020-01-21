import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class TestService {
  constructor(private readonly connection: Connection) {}

  public async reset() {
    await this.connection.dropDatabase();
    await this.connection.runMigrations();
  }
}
