import { createConnection } from 'typeorm';
import { kebabCase, titleCase } from 'voca';
import { format } from 'date-fns';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';

import * as commander from 'commander';
import { ConfigUtil } from '../utils';

const packageJSON = require('../../package.json');

// Move to `package.json` if needs to scale for migration options
const MIGRATION_SRC_DIR = 'src/migrations';
const sqlDirectoryName = 'sqls';

async function main() {
  const dbConnection = await createDatabaseConnection(ConfigUtil);

  commander
    .command('create')
    .description('Create migration. Ex: create <name-of-migration-file>')
    .action(async migrationName => {
      // No passed argument will give the `this` (object)
      // so make sure we check the migrationName as string
      if (typeof migrationName === 'string' && migrationName) {
        const timestamp = format(new Date(), 'YYYYMMDDHHmmss');
        const filenameKebabCase = kebabCase(timestamp + migrationName);
        const sqlFilename = filenameKebabCase;
        const migrationRunnerTemplate = getMigrationRunnerTemplate(
          migrationName,
          {
            sqlFilename,
            timestamp
          }
        );
        createMigrationRunnerFile(filenameKebabCase, migrationRunnerTemplate);
        createMigrationSQLFile(sqlFilename);
      } else {
        commander.outputHelp();
      }

      await dbConnection.close();
      process.exit();
    });

  commander
    .command('up')
    .description('Run migrations')
    .action(async () => {
      await dbConnection.runMigrations();
      await dbConnection.close();
    });

  commander
    .command('down')
    .description('Undo migrations')
    .action(async () => {
      await dbConnection.undoLastMigration();
      await dbConnection.close();
    });

  commander.version(packageJSON.version).parse(process.argv);

  // Show help if no command specified
  if (!commander.args.length) {
    commander.help();
  }
}

function createDatabaseConnection(configUtil: typeof ConfigUtil) {
  return createConnection({
    type: configUtil.get('database.type'),
    host: configUtil.get('database.host'),
    port: configUtil.get('database.port'),
    username: configUtil.get('database.username'),
    password: configUtil.get('database.password'),
    database: configUtil.get('database.database'),
    extra: {
      // https://stackoverflow.com/questions/30074492/what-is-the-difference-between-utf8mb4-and-utf8-charsets-in-mysql
      charset: configUtil.get('database.charset')
    },
    entities: [__dirname + '/../shared/entities/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*.js'],
    synchronize: false,
    logging: false
  });
}

function getMigrationRunnerTemplate(
  filename: string,
  options: {
    sqlFilename: string;
    timestamp: string;
  }
) {
  const { sqlFilename, timestamp } = options;
  const generateClassNameFromName = (name: string) =>
    titleCase(name + timestamp).replace(/[^a-zA-Z0-9]/g, '');

  const className = generateClassNameFromName(filename);
  return `
    import { MigrationInterface, QueryRunner } from 'typeorm';
    import * as path from 'path';
    import * as fs from 'fs';

    export class ${className} implements MigrationInterface {
      public async up(queryRunner: QueryRunner): Promise<any> {
        const filePath = path.join(__dirname, 'sqls/${sqlFilename}.up.sql');
        const sql = fs.readFileSync(filePath, { encoding: 'utf-8'});
        return queryRunner.query(sql);
      }

      public async down(queryRunner: QueryRunner): Promise<any> {
        const filePath = path.join(__dirname, 'sqls/${sqlFilename}.down.sql');
        const sql = fs.readFileSync(filePath, { encoding: 'utf-8'});
        return queryRunner.query(sql);
      }
    }
  `;
}

function createMigrationRunnerFile(
  filename: string,
  template: string,
  extension: string = '.ts'
) {
  const filePath = resolve(MIGRATION_SRC_DIR, filename) + extension;
  return writeFileSync(filePath, template);
}

function createMigrationSQLFile(filename: string) {
  const sqlDirectory = resolve(MIGRATION_SRC_DIR, sqlDirectoryName);
  const isDirectoryExisting = existsSync(sqlDirectory);

  if (!isDirectoryExisting) {
    mkdirSync(sqlDirectory);
  }

  const upSQLTemplate = '-- SQL statements for the UP migration';
  const downSQLTemplate = '-- SQL statements for the DOWN migration';

  const upSQLFilename = filename + '.up.sql';
  const downSQLFilename = filename + '.down.sql';

  const upSQLFilepath = resolve(sqlDirectory, upSQLFilename);
  const downSQLFilepath = resolve(sqlDirectory, downSQLFilename);

  writeFileSync(upSQLFilepath, upSQLTemplate);
  writeFileSync(downSQLFilepath, downSQLTemplate);

  console.log(upSQLFilepath);
  console.log(downSQLFilepath);
}

main();
