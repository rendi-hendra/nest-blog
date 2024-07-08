import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ValidationService } from '../common/validation.service';
import { PrismaService } from '../common/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Category, Post, User } from '@prisma/client';
import { CreatePostRequest, PostResponse } from 'src/model/post.model';
import { PostValidation } from './post.validation';
import slugify from 'slugify';
import * as moment from 'moment';

@Injectable()
export class PostService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async create(user: User, request: CreatePostRequest): Promise<PostResponse> {
    this.logger.debug(
      `PostService.create(${JSON.stringify(user)}, ${JSON.stringify(request)})`,
    );
    const createRequest: CreatePostRequest = this.validationService.validate(
      PostValidation.CREATE,
      request,
    );

    // Generate initial slug from title
    let slug = slugify(createRequest.title, { lower: true });

    // Ensure slug is unique
    let counter = 1;
    let slugExists = await this.prismaService.post.findUnique({
      where: { slug },
    });

    while (slugExists) {
      slug = `${slugify(createRequest.title, { lower: true })}-${counter}`;
      slugExists = await this.prismaService.post.findUnique({
        where: { slug },
      });
      counter++;
    }

    moment.locale('id');
    const createdAt = moment().format('MMMM Do YYYY, h:mm:ss');
    const post = await this.prismaService.post.create({
      data: {
        ...createRequest,
        slug,
        ...{ userId: user.id },
        createdAt,
      },
      include: {
        user: true,
        category: true,
      },
    });

    return this.toPostResponse(post);
  }

  toPostResponse(
    post: Post & { user: User; category: Category },
  ): PostResponse {
    return {
      id: post.id,
      title: post.title,
      body: post.body,
      slug: post.slug,
      userId: post.userId,
      author: post.user.name,
      categoryId: post.categoryId,
      category: post.category.name,
      createdAt: post.createdAt,
    };
  }

  async get(user: User): Promise<PostResponse[]> {
    const post = await this.prismaService.post.findMany({
      where: {
        userId: user.id,
      },
      include: {
        user: true,
        category: true,
      },
    });

    return post.map((post) => this.toPostResponse(post));
  }

  async getBySlug(slug: string): Promise<PostResponse> {
    const post = await this.prismaService.post.findUnique({
      where: { slug },
      include: {
        user: true,
        category: true,
      },
    });

    if (!post) {
      throw new HttpException('Post not found!', 404);
    }

    return this.toPostResponse(post);
  }

  async getByAuthor(author: string): Promise<PostResponse[]> {
    const post = await this.prismaService.post.findMany({
      where: {
        user: { name: author },
      },
      include: {
        user: true,
        category: true,
      },
    });

    return post.map((post) => this.toPostResponse(post));
  }
}
