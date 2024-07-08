import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { Auth } from '../common/auth.decorator';
import { User } from '@prisma/client';
import { CreatePostRequest, PostResponse } from '../model/post.model';
import { WebResponse } from '../model/web.model';

@Controller('/api/posts')
export class PostController {
  constructor(private postsService: PostService) {}

  @Post()
  @HttpCode(200)
  async create(
    @Auth() user: User,
    @Body() request: CreatePostRequest,
  ): Promise<WebResponse<PostResponse>> {
    const result = await this.postsService.create(user, request);
    return {
      data: result,
    };
  }

  @Get('/current')
  @HttpCode(200)
  async getCurrent(@Auth() user: User): Promise<WebResponse<PostResponse[]>> {
    const result = await this.postsService.get(user);
    return {
      data: result,
    };
  }

  @Get('/slug/:slug')
  @HttpCode(200)
  async getBySlug(
    @Auth() user: User,
    @Param('slug') slug: string,
  ): Promise<WebResponse<PostResponse>> {
    const result = await this.postsService.getBySlug(slug);
    return {
      data: result,
    };
  }
}
