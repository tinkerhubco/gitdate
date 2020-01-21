import { MigrationInterface, QueryRunner } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';

export class InitialSchema20190613163359 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const filePath = path.join(
      __dirname,
      'sqls/20190613163359-initial-schema.up.sql'
    );
    const sql = fs.readFileSync(filePath, { encoding: 'utf-8' });
    return queryRunner.query(sql);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const filePath = path.join(
      __dirname,
      'sqls/20190613163359-initial-schema.down.sql'
    );
    const sql = fs.readFileSync(filePath, { encoding: 'utf-8' });
    return queryRunner.query(sql);
  }
}
