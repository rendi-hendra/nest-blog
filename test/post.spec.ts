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

  describe('GET /api/posts/author/:author', () => {
    it('should be get by author', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/posts/author/test')
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data[0].author).toBe('test');
    });
  });

  // UPDATE POST

  describe('PACTH /api/posts/current/:postId', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createUser();
      await testService.createPost();
    });

    it('should be rejected if request is invalid', async () => {
      const post = await testService.getPost();
      const response = await request(app.getHttpServer())
        .patch(`/api/posts/current/${post.id}`)
        .set('Authorization', 'test')
        .send({
          title: '',
          body: '',
          categoryId: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if post is not found', async () => {
      const post = await testService.getPost();
      const response = await request(app.getHttpServer())
        .patch(`/api/posts/current/${post.id + 1}`)
        .set('Authorization', 'test')
        .send({
          title: 'test post',
          body: 'test',
          categoryId: 1,
        });

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to update contact', async () => {
      const post = await testService.getPost();
      const response = await request(app.getHttpServer())
        .patch(`/api/posts/current/${post.id}`)
        .set('Authorization', 'test')
        .send({
          title: 'test updated',
          body: 'test',
          categoryId: 1,
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.title).toBe('test updated');
      expect(response.body.data.body).toBe('test');
      expect(response.body.data.categoryId).toBe(1);
    });
  });

  // DELETE POST
  describe('DELETE /api/posts/current/:postId', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createUser();
      await testService.createPost();
    });

    it('should be rejected if post is not found', async () => {
      const post = await testService.getPost();
      const response = await request(app.getHttpServer())
        .delete(`/api/posts/current/${post.id + 1}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to remove post', async () => {
      const post = await testService.getPost();
      const response = await request(app.getHttpServer())
        .delete(`/api/posts/current/${post.id}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);
    });
  });

  // SEARCH POST

  describe('GET /api/posts', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createUser();
      await testService.createPost();
    });

    it('should be able to search posts', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/posts`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should be able to search posts by title', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/posts`)
        .query({
          title: 'st',
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should be able to search posts by title not found', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/posts`)
        .query({
          title: 'wrong',
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
    });

    it('should be able to search posts by author', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/posts`)
        .query({
          author: 'es',
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should be able to search posts by author not found', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/posts`)
        .query({
          author: 'wrong',
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
    });

    it('should be able to search posts by category', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/posts`)
        .query({
          category: 'Komedi',
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should be able to search posts by category not found', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/posts`)
        .query({
          category: '88',
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
    });

    it('should be able to search posts with page', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/posts`)
        .query({
          size: 1,
          page: 1,
        })
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.paging.current_page).toBe(1);
      expect(response.body.paging.total_page).toBe(1);
      expect(response.body.paging.size).toBe(1);
    });
  });
});
