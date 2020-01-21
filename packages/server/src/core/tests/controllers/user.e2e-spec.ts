import TestFactory, { TestingModuleMetadata } from '../test.factory';

describe('UserController', () => {
  let module: TestingModuleMetadata;

  beforeAll(async () => {
    module = await TestFactory.createTestModule();
  });

  afterAll(async () => {
    await module.cleanup();
  });

  describe('#get', () => {
    beforeEach(async () => {
      await module.repositories.userRepository.save({
        email: module.helpers.chance.email(),
        firstName: module.helpers.chance.first(),
        lastName: module.helpers.chance.last()
      });
    });
    describe('happy paths', () => {
      it('should get all users', async () => {
        const response = await module.server.get('/api/users').expect(200);
        const body = response.body;
        module.helpers.assert.notEqual(body.length, 0);
      });
    });
  });
});
