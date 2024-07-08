import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Auth } from '../common/auth.decorator';
import { User } from '@prisma/client';
import {
  CreatePostRequest,
  PostResponse,
  SearchPostRequest,
  UpdatePostRequest,
} from '../model/post.model';
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

  @Get('/author/:author')
  @HttpCode(200)
  async getByAuthor(
    @Auth() user: User,
    @Param('author') author: string,
  ): Promise<WebResponse<PostResponse[]>> {
    const result = await this.postsService.getByAuthor(author);
    return {
      data: result,
    };
  }
  @Patch('/current/:postId')
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() request: UpdatePostRequest,
  ): Promise<WebResponse<PostResponse>> {
    request.id = postId;
    const result = await this.postsService.update(user, request);
    return {
      data: result,
    };
  }

  @Delete('/current/:postId')
  @HttpCode(200)
  async remove(
    @Auth() user: User,
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<WebResponse<boolean>> {
    await this.postsService.remove(user, postId);
    return {
      data: true,
    };
  }

  @Get()
  @HttpCode(200)
  async search(
    @Auth() user: User,
    @Query('title') title?: string,
    @Query('author') author?: string,
    @Query('category') category?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number,
  ): Promise<WebResponse<PostResponse[]>> {
    const request: SearchPostRequest = {
      title: title,
      author: author,
      category: category,
      page: page || 1,
      size: size || 10,
    };
    return this.postsService.search(user, request);
  }
}
