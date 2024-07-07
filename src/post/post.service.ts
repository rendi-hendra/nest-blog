import { Inject, Injectable } from '@nestjs/common';
import { ValidationService } from '../common/validation.service';
import { PrismaService } from '../common/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Post, User } from '@prisma/client';
import { CreatePostRequest, PostResponse } from 'src/model/post.model';
import { PostValidation } from './post.validation';

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

    const post = await this.prismaService.post.create({
      data: {
        ...createRequest,
        ...{ userId: user.id },
      },
    });

    return this.toPostResponse(post);
  }

  toPostResponse(post: Post): PostResponse {
    return {
      title: post.title,
      body: post.body,
      slug: post.slug,
      userId: post.userId,
      categoryId: post.categoryId,
      createdAt: post.createdAt,
      id: post.id,
    };
  }
}
