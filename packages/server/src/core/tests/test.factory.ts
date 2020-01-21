import { Test } from '@nestjs/testing';

import { Connection } from 'typeorm';

import assert = require('assert');
import * as Chance from 'chance';

import supertest = require('supertest');

import { CoreModule } from '../core.module';
import { TestService } from '../services';
import { UserRepository } from '../repositories';
import { DatabaseModule } from '../database.module';

import { ConfigUtil } from '../../utils';

import { configureApp } from '../../main';

const chance = new Chance();

const TestFactory = {
  createTestModule: async () => {
    // instantiate server/app/supertest/
    const module = await Test.createTestingModule({
      imports: [CoreModule],
      providers: []
    }).compile();
    const app = await module.createNestApplication();

    configureApp(app);

    const server = supertest(app.getHttpServer());

    // reset database
    const testService = app.select(CoreModule).get(TestService);
    await testService.reset();

    const databaseConnection = app.select(DatabaseModule).get(Connection);

    await app.listen(ConfigUtil.get('http.port'));

    return {
      repositories: {
        userRepository: databaseConnection.getCustomRepository(UserRepository)
      },
      utils: {
        ConfigUtil
      },
      services: {
        testService
      },
      helpers: {
        assert,
        chance
      },
      connection: databaseConnection,
      server,
      cleanup: async () => {
        await databaseConnection.close();
      }
    };
  }
};

// will return object type if it is not a promise -or- will return the type that the promise is wrapping
type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U // eslint-disable-line @typescript-eslint/no-explicit-any
  ? U
  : T extends Promise<infer U>
  ? U
  : T;

export type TestingModuleMetadata = Unpacked<
  Unpacked<typeof TestFactory.createTestModule>
>;
export default TestFactory;
