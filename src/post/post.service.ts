import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ValidationService } from '../common/validation.service';
import { PrismaService } from '../common/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Category, Post, User } from '@prisma/client';
import {
  CreatePostRequest,
  PostResponse,
  SearchPostRequest,
  UpdatePostRequest,
} from 'src/model/post.model';
import { PostValidation } from './post.validation';
import slugify from 'slugify';
import * as moment from 'moment';
import { WebResponse } from '../model/web.model';

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
    const createdAt = moment().format('MMMM Do YYYY, HH:mm:ss');
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
      updateAt: post.updateAt,
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

  async update(user: User, request: UpdatePostRequest): Promise<PostResponse> {
    // eslint-disable-next-line prefer-const
    let updateRequest = this.validationService.validate(
      PostValidation.UPDATE,
      request,
    );

    let post = await this.prismaService.post.findFirst({
      where: {
        id: request.id,
        userId: user.id,
      },
      include: {
        user: true,
        category: true,
      },
    });

    if (!post) {
      throw new HttpException('Post is not found', 404);
    }

    if (request.categoryId) {
      const category = await this.prismaService.category.findFirst({
        where: {
          id: request.categoryId,
        },
      });

      if (!category) {
        throw new HttpException('CategoryId is not found', 404);
      }
    }

    if (request.title) {
      // Generate initial slug from title
      let slug = slugify(updateRequest.title, { lower: true });

      // Ensure slug is unique
      let counter = 1;
      let slugExists = await this.prismaService.post.findUnique({
        where: { slug },
      });

      while (slugExists) {
        slug = `${slugify(updateRequest.title, { lower: true })}-${counter}`;
        slugExists = await this.prismaService.post.findUnique({
          where: { slug },
        });
        counter++;
      }

      updateRequest.slug = slug;
    }

    moment.locale('id');
    const updateAt = moment().format('MMMM Do YYYY, HH:mm:ss');
    updateRequest.updateAt = updateAt;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    post = await this.prismaService.post.update({
      where: {
        id: post.id,
        userId: user.id,
      },
      include: {
        user: true,
        category: true,
      },
      data: updateRequest,
    });

    return this.toPostResponse(post);
  }

  async remove(user: User, postId: number): Promise<PostResponse> {
    const checkPost = await this.prismaService.post.findFirst({
      where: {
        id: postId,
        userId: user.id,
      },
    });

    if (!checkPost) {
      throw new HttpException('Post is not found', 404);
    }

    const post = await this.prismaService.post.delete({
      where: {
        id: postId,
        userId: user.id,
      },
      include: {
        user: true,
        category: true,
      },
    });

    return this.toPostResponse(post);
  }

  async search(
    user: User,
    request: SearchPostRequest,
  ): Promise<WebResponse<PostResponse[]>> {
    const searchRequest: SearchPostRequest = this.validationService.validate(
      PostValidation.SEARCH,
      request,
    );

    const filters = [];

    if (searchRequest.title) {
      // add title filter
      filters.push({
        title: {
          contains: searchRequest.title,
        },
      });
    }

    if (searchRequest.author) {
      // add author filter
      filters.push({
        user: {
          name: {
            contains: searchRequest.author,
          },
        },
      });
    }

    if (searchRequest.category) {
      // add category filter
      filters.push({
        category: {
          name: {
            contains: searchRequest.category,
          },
        },
      });
    }

    const skip = (searchRequest.page - 1) * searchRequest.size;

    const post = await this.prismaService.post.findMany({
      where: {
        AND: filters,
      },
      include: {
        user: true,
        category: true,
      },
      take: searchRequest.size,
      skip: skip,
    });

    const total = await this.prismaService.post.count({
      where: {
        AND: filters,
      },
    });

    return {
      data: post.map((post) => this.toPostResponse(post)),
      paging: {
        current_page: searchRequest.page,
        size: searchRequest.size,
        total_page: Math.ceil(total / searchRequest.size),
      },
    };
  }
}
