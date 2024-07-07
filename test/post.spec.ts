import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('UserController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('POST /api/posts', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/posts')
        .set('Authorization', 'test')
        .send({
          title: '',
          body: '',
          slug: '',
          categoryId: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to create post', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/posts')
        .set('Authorization', 'test')
        .send({
          title: 'hello world',
          body: 'test',
          categoryId: 1,
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.title).toBe('hello world');
      expect(response.body.data.body).toBe('test');
      expect(response.body.data.slug).toBe('hello-world');
      expect(response.body.data.categoryId).toBe(1);
    });
  });
});
